'use client';

import React, { useState, useEffect } from 'react';
import { Message } from '@/types/chat';
import { ChatWindow, ChatInput } from '@/components/chat';
import { chatService } from '@/services/chat';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Add welcome message on mount
    const welcomeMessage: Message = {
      id: '0',
      role: 'assistant',
      content:
        'Привет! Я AI-ассистент платформы университетов. Я помогу тебе найти идеальный университет, ответить на вопросы о требованиях для поступления и помочь с выбором специальности. Что тебя интересует?',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Build chat history from previous messages (exclude welcome message)
      const chatHistory = messages
        .filter((msg) => msg.id !== '0')
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      // Call the real backend API
      const responseText = await chatService.sendMessage(content, chatHistory);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Show error message to user
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Извините, произошла ошибка при обработке запроса. Пожалуйста, попробуйте еще раз.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">AI-ассистент</h1>
          <p className="text-gray-600">Задай вопрос об университетах и требованиях для поступления</p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Messages */}
          <ChatWindow messages={messages} loading={loading} />

          {/* Input */}
          <div className="border-t border-gray-100 p-4">
            <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>AI-ассистент использует данные из базы университетов для точных ответов</p>
        </div>
      </div>
    </div>
  );
}
