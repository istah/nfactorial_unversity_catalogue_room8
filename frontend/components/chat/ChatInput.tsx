'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const submitMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Напишите ваш вопрос..."
        disabled={disabled}
        rows={1}
        className="
          flex-1 px-4 py-3 border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          resize-none disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-all duration-200 text-black placeholder:text-gray-500
        "
      />
      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={disabled || !message.trim()}
        className="self-end"
      >
        Отправить
      </Button>
    </form>
  );
};
