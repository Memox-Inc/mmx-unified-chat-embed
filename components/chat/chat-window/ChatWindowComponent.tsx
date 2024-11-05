//imports
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { X, SendHorizontal, RefreshCcw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from '@/components/ui/button';

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
};

type Message = {
    sessionId: string;
    id: number;
    content: string;
    sender: 'user' | 'other' | 'ai';
    timestamp?: string;
    image?: string;
};

//animation props

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
};


const messages_test: Message[] = [
    { sessionId: "test", id: 1, content: "Hello", sender: 'user', timestamp: "19:32", image: "/img/test.jpg" },
];

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
    closeChat,
}: Props) => {
    // State Management
    const [currentMessage, setCurrentMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>(messages_test);
    // State for the selected image
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    // Send Message function
    const sendMessage = (messageContent: string) => {
        if (messageContent.trim() === '') return; // Prevent sending empty messages
        setMessages([
            ...messages,
            { sessionId: "test", id: messages.length + 1, content: messageContent, sender: 'user' },
        ]);
        setCurrentMessage('');
    };

    //Reset the chat window
    const resetChat = () => {
        setMessages([]);
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
                        <Card>

                            <CardContent className='flex items-end'>
                                <div className='mt-6 h-24 w-24 bg-red-400 '>
                                    <img src="/img/product.jpg" alt="image" className='w-full h-full '></img>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='font-semibold text-lg'>
                                        SmartWatch BS 2000
                                    </div>
                                    <div className='text-slate-600'>
                                        Smartwach with all the features you need

                                    </div>
                                    <div className='font-semibold'>
                                        4,3/5 stars
                                    </div>
                                </div>
                            </CardContent>
                            <Separator className='my-4' />
                            <CardFooter>
                                <div className='w-full flex justify-between'>
                                    <div className='font-semibold '>
                                        300$
                                    </div>
                                    <div>
                                        <Button variant={"default"} >
                                            Buy now
                                            </Button>

                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                        {messages.map((message) => (
                            <div className='flex-col'>
                                <div className='flex space-x-2'>
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col space-y-2'>

                                        <div
                                            key={message.id}
                                            className={`${message.sender === 'user'
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
                    </CardContent>
                    <Separator className='mt-4' />

                    <CardFooter className='p-4 flex flex-col'>
                        <div className='w-full mb-4'>
                            <Carousel
                                className='p-0'
                                opts={{
                                    align: 'start',
                                    loop: true,
                                    dragFree: true,
                                }}
                            >
                                <CarouselContent>
                                    <CarouselItem className="basis-1/2">
                                        <button
                                            onClick={() => sendMessage("How much is a 20ft container?")}
                                        >
                                            <Badge className='p-4 text-sm font-thin'>
                                                How much is a 20ft container?
                                            </Badge>
                                        </button>
                                    </CarouselItem>
                                    <CarouselItem className="basis-1/2">
                                        <button
                                            onClick={() => sendMessage("What are your delivery options?")}
                                        >
                                            <Badge className='p-4 text-sm font-thin'>
                                                What are your delivery options?
                                            </Badge>
                                        </button>
                                    </CarouselItem>
                                    <CarouselItem className="basis-1/2">
                                        <button
                                            onClick={() => sendMessage("Can I track my order?")}
                                        >
                                            <Badge className='p-4 text-sm font-thin'>
                                                Can I track my order?
                                            </Badge>
                                        </button>
                                    </CarouselItem>
                                </CarouselContent>
                            </Carousel>
                        </div>
                        <div className='w-full'>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    sendMessage(currentMessage);
                                }}
                                className='grid grid-cols-9 w-full justify-between space-x-4 items-center'
                            >
                                <Input
                                    className='col-span-8'
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    value={currentMessage}
                                />
                                <button type="submit" className='col-span-1'>
                                    <SendHorizontal />
                                </button>
                            </form>
                        </div>
                    </CardFooter>
                </Card>

            </div>
            {chatOpen && (
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

            )}


        </div>
    );
};

export default ChatWindowComponent;
