'use client';
import React from 'react'
import { MessageCircle } from 'lucide-react';



type Props = {
    position: string,
    bottomMargin: string,
    onClick: () => void
}


const ChatButtonComponent = ({position, bottomMargin, onClick}: Props) => {
    // Get the corresponding Tailwind class for the bottom margin
   

    return (
        <>
            <button
                onClick={onClick}
                className={`fixed 
                    ${position} 
                    ${bottomMargin}
                    rounded-full bg-black w-24 h-24 flex justify-center items-center hover:bg-gray-800 transition-all duration-300`}
                >
                <MessageCircle size={36} color='white' />
            </button>
        </>
    )
}

export default ChatButtonComponent