"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Message } from '@/types/chat';
import { ChatMessage } from './ChatMessage';

interface ChatWindowProps {
  messages: Message[];
  loading?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, loading = false }) => {
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    setShouldAutoScroll(distanceFromBottom < 40);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    container.addEventListener('scroll', handleScroll);
    // initialize state on mount
    handleScroll();
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (shouldAutoScroll) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldAutoScroll]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-white rounded-lg p-4 space-y-4"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">Начните разговор</p>
            <p className="text-sm">Задайте вопрос об университетах или требованиях для поступления</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <div ref={endRef} />
    </div>
  );
};
