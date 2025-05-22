/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
//imports
import { FormEvent, useEffect, useRef, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { RefreshCcw, SendHorizontal, X } from 'lucide-react';
import Image from 'next/image';
import { generateSecureWsParams } from '@/utils/wsAuth';

//Props
type Props = {
    chatOpen: boolean;
    closeChat: () => void;
    userMessageColor: string;
    aiMessageColor: string;
    userTextColor?: string;
    aiTextColor?: string;
    companyColor?: string;
    companyName?: string;
    chatTitleTextColor?: string;
    orgId?:string
};

type Message = {
    id: string; // Use a string ID for uniqueness
    sessionId: string;
    content: string;
    sender?: 'prospect' | 'sales_rep' | 'ai';
    sender_type?: 'prospect' | 'sales_rep' | 'ai';
    created_at?: string;
    image?: string;
};

//Component
const ChatWindowComponent = ({
    companyName,
    chatTitleTextColor,
    companyColor,
    userMessageColor,
    aiMessageColor,
    chatOpen,
    aiTextColor,
    userTextColor,
    orgId,
    closeChat,
}: Props) => {
    // State Management
    const [currentMessage, setCurrentMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [show, setShow] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLInputElement>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const isWebSocketConnected = useRef(false);  // Track WebSocket connection status





    // State for the selected image
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    useEffect(() => {
        if (!isWebSocketConnected.current && show) {
            const chatID = uuidv4()
            const org_id = orgId!
            const { hashed_org_id, hash } = generateSecureWsParams(org_id);

            const ws = new WebSocket(`${process.env.NEXT_PUBLIC_SOCKET_URL}${chatID}/?org_id=${hashed_org_id}&org=${hash}`)
            socketRef.current = ws;
            isWebSocketConnected.current = true; // Set to true to prevent future connections
            ws.onopen = () => {
                console.log('Websocket Connectin Open....')
            }
            ws.onmessage = (event) => {
                const msgData = JSON.parse(event.data)
                if (msgData?.type === "broadcast_message" || msgData?.message_type === "unread_message") return

                if (msgData.sender_type === 'ai' || msgData.sender === 'ai') {
                    setMessages((prevMessages) => {
                        const lastMessage = prevMessages[prevMessages?.length - 1];

                        // If the last message is from the AI, append the new chunk to it
                        if (lastMessage && (lastMessage.sender_type === 'ai' || lastMessage.sender === 'ai')) {
                            const updatedMessages = [
                                ...prevMessages.slice(0, -1), // Keep all messages except the last one
                                {
                                    ...lastMessage,
                                    content: lastMessage.content + msgData.content, // Append the new chunk
                                },
                            ];

                            // Scroll to bottom after updating the message
                            setTimeout(scrollToBottom, 0);
                            return updatedMessages;
                        } else {
                            // If the last message is not from the AI, add the new message
                            const updatedMessages = [...prevMessages, msgData];
                            setTimeout(scrollToBottom, 0);
                            return updatedMessages;
                        }
                    });
                } else {
                    // For non-AI messages, append the message as usual
                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages, msgData];
                        setTimeout(scrollToBottom, 0);
                        return updatedMessages;
                    });
                }


                // setMessages((prevMessages) => [...prevMessages, msgData]);
            }
            ws.onclose = () => {
                console.error('Websocket Connection closed unexpectedly....')
            }
        }
        return () => {
            socketRef.current?.close();
            socketRef.current = null;  // Reset the socket reference       
            isWebSocketConnected.current = false; // Reset flag on cleanup

        };

    }, [show])

    useEffect(() => {
        scrollToBottom();
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    //Reset the chat window
    const resetChat = () => {
        setMessages([]);
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        socketRef.current?.send(JSON.stringify({
            'message': currentMessage,
            'message_type': "text"
        }))
        setCurrentMessage('');
        
    }

    return (
        <div>
            <div
                className={`
        transition-transform duration-300
        transform
        ${chatOpen ? 'translate-y-0' : 'translate-y-[110%]'}                
        fixed                 
        bg-white 
        w-full
        h-screen
        lg:right-5 
        lg:bottom-5 
        lg:w-3/12
        lg:h-5/6
        z-50
      `}
            >
                <Card className="h-full flex flex-col">
                    <CardHeader className={`${companyColor} rounded-t-lg p-8`}>
                        <CardTitle>
                            <div className={` ${chatTitleTextColor} flex justify-between items-center`}>
                                <div>
                                    {companyName}
                                </div>

                                <div className='flex space-x-4'>
                                    <button onClick={resetChat}>
                                        <RefreshCcw />
                                    </button>
                                    <button onClick={closeChat}>
                                        <X />
                                    </button>
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <Separator className='mb-4' />
                    <CardContent className="flex flex-grow overflow-auto scrollbar-hide p-4 space-y-4 flex-col scroll-smooth">
                        {
                            !show ?
                                <>
                                    <div className='flex items-center gap-6'>
                                        <label className='w-[27%]'>Full Name:</label>
                                        <Input
                                            className='w-[60%]'
                                            // onChange={(e) => setCurrentMessage(e.target.value)}
                                            placeholder='Full name'
                                            value={currentMessage}
                                        />
                                    </div>
                                    <div className='flex items-center gap-6'>
                                        <label className='w-[27%]'>Email:</label>
                                        <Input
                                            className='w-[60%]'
                                            // onChange={(e) => setCurrentMessage(e.target.value)}
                                            placeholder='Email'
                                            value={currentMessage}
                                        />
                                    </div>
                                    <div className='flex items-center gap-6'>
                                        <label className='w-[27%]'>Phone Number:</label>
                                        <Input
                                            className='w-[60%]'
                                            // onChange={(e) => setCurrentMessage(e.target.value)}
                                            placeholder='Phone number'
                                            value={currentMessage}
                                        />
                                    </div>

                                </>

                                : <>

                                    <div className='flex-col'>
                                        <div className='flex space-x-2'>
                                            <Avatar>
                                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <div className='flex flex-col space-y-2'>

                                                <div
                                                    className={`self-start p-2 rounded-lg max-w-xs`}
                                                >
                                                    <div className='flex flex-col space-y-4'>
                                                        <div>
                                                            Hello, How can I assist you today?
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                    {messages.map((message) => (
                                        <div className='flex-col' key={message.id}>
                                            <div className={`flex space-x-2 ${message.sender_type === 'prospect' ? 'flex-row-reverse justify-start gap-2' : ''}`}>
                                                <Avatar>
                                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                                    <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                                <div className='flex flex-col space-y-2'>

                                                    <div
                                                        key={message.id}
                                                        className={`${message.sender_type === 'prospect' || message.sender === 'prospect'
                                                            ? `${userMessageColor} ${userTextColor} self-end`
                                                            : `${aiMessageColor} ${aiTextColor} self-start`
                                                            } p-2 rounded-lg max-w-xs`}
                                                    >
                                                        <div className='flex flex-col space-y-4'>
                                                            {message.image && (
                                                                <div>
                                                                    <Image
                                                                        src={message.image || "/default-image.jpg"}
                                                                        alt="image"
                                                                        width={200}
                                                                        height={100}
                                                                        onClick={() => message.image && setSelectedImage(message.image)}
                                                                        className="cursor-pointer"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div>
                                                                {message.content}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='self-start'>
                                                        <p className='text-sm text-gray-400'>19:32</p>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </>

                        }
                    </CardContent>

                    <Separator className='mt-4' />

                    <CardFooter className='p-4 flex flex-col'>
                        <div className='w-full'>

                            {
                                !show ?
                                    <button className='bg-primary text-white w-full rounded-[7px] py-2' onClick={() => setShow(!show)}>Start Chat</button>
                                    :
                                    <form
                                        onSubmit={(e) => handleSubmit(e)}
                                        className='grid grid-cols-9 w-full justify-between space-x-4 items-center'
                                    >
                                        <Input
                                            className='col-span-8'
                                            onChange={(e) => setCurrentMessage(e.target.value)}
                                            placeholder='Type your message...'
                                            value={currentMessage}
                                        />
                                        <button type="submit" className='col-span-1'>
                                            <SendHorizontal />
                                        </button>
                                    </form>

                            }

                        </div>
                    </CardFooter>
                </Card>

            </div>
            {/* {chatOpen && (
                <AnimatePresence>
                    {selectedImage && (
                        <>
                            <motion.div
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                                variants={backdropVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                onClick={() => setSelectedImage(null)}
                            >
                                <motion.div
                                    className="relative"
                                    variants={modalVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        className="absolute top-0 right-0 m-4 text-white"
                                    >
                                        <X />
                                    </button>
                                    <Image
                                        src={selectedImage}
                                        alt="Full-size image"
                                        width={800}
                                        height={600}
                                        className="max-w-full max-h-screen"
                                    />
                                </motion.div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

            )} */}


        </div>
    );
};

export default ChatWindowComponent;
