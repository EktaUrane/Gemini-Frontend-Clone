import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatroomStore } from '../store/chatroomStore';
import { useMessageStore, Message } from '../store/messageStore';
import { MdArrowBack, MdSend, MdImage, MdContentCopy } from 'react-icons/md';
import toast from 'react-hot-toast';
import { shallow } from 'zustand/shallow';

const MESSAGES_PER_PAGE = 20;
const AI_TYPING_DELAY = 1000;
const AI_REPLY_DELAY = 2000;
const AI_THROTTLE_TIME = 5000; 

const ChatroomPage: React.FC = () => {
  const { id: chatroomId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const chatroom = useChatroomStore((state) =>
    state.chatrooms.find((room) => room.id === chatroomId)
  );
  const updateChatroomLastMessageTime = useChatroomStore((state) => state.updateChatroomLastMessageTime);


  const allMessages = useMessageStore(
    (state) => state.messages[chatroomId || ''] || [],
    shallow 
  );
  const addMessage = useMessageStore((state) => state.addMessage);
  const ensureChatroomMessages = useMessageStore((state) => state.ensureChatroomMessages);

  useEffect(() => {
    if (chatroomId) {
      ensureChatroomMessages(chatroomId);
    }
  }, [chatroomId, ensureChatroomMessages]);

  const [messageInput, setMessageInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [aiLastReplyTime, setAiLastReplyTime] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

   // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!chatroomId) {
        setVisibleMessages([]);
        setHasMoreMessages(false);
        return;
    }


    const messagesToLoad = page * MESSAGES_PER_PAGE;
    const newVisibleMessages = allMessages.slice(
        Math.max(0, allMessages.length - messagesToLoad)
    );

    if (newVisibleMessages.length !== visibleMessages.length ||
        newVisibleMessages.some((msg, i) => msg !== visibleMessages[i])) {
        setVisibleMessages(newVisibleMessages);
    }

    setHasMoreMessages(messagesToLoad < allMessages.length);
  }, [allMessages, page, chatroomId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [visibleMessages]);

  // Infinite scroll (reverse)
  const lastMessageRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMoreMessages) {
        setPage((prevPage) => prevPage + 1);
      }
    }, { threshold: 0.1 });

    if (node) observer.current.observe(node);
  }, [hasMoreMessages]);


  const simulateAIResponse = useCallback(async () => {
    if (!chatroomId) return;

    const now = Date.now();
    if (now - aiLastReplyTime < AI_THROTTLE_TIME) {
      const timeToWait = AI_THROTTLE_TIME - (now - aiLastReplyTime);
      await new Promise(resolve => setTimeout(resolve, timeToWait));
    }

    setIsAITyping(true);
    await new Promise((resolve) => setTimeout(resolve, AI_TYPING_DELAY));

    const aiReplies = [
      "I'm here to help! What's on your mind?",
      "That's an interesting point. Can you tell me more?",
      "I'm still learning, but I'll do my best to assist you.",
      "How can I make your day better?",
      "I understand. Let's explore that further.",
      "I'm processing that. One moment...",
      "Thank you for sharing that with me.",
      "Is there anything else I can assist you with?",
    ];
    const randomReply = aiReplies[Math.floor(Math.random() * aiReplies.length)];

    await new Promise((resolve) => setTimeout(resolve, AI_REPLY_DELAY));

    addMessage(chatroomId, 'ai', { text: randomReply });
    updateChatroomLastMessageTime(chatroomId);
    setIsAITyping(false);
    setAiLastReplyTime(Date.now());
  }, [chatroomId, addMessage, updateChatroomLastMessageTime, aiLastReplyTime]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = messageInput.trim();
    if (!text && !selectedImage) return;

    if (chatroomId) {
      addMessage(chatroomId, 'user', { text: text || undefined, imageUrl: selectedImage });
      updateChatroomLastMessageTime(chatroomId);
      toast.success('Message sent!', { id: 'message-sent' }); // Added toast
      setMessageInput('');
      setSelectedImage(null);

      simulateAIResponse();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Message copied to clipboard!');
  };

  if (!chatroom) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 dark:text-gray-400">
        Chatroom not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center p-4 bg-white dark:bg-gray-800 shadow-md">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Back to dashboard"
        >
          <MdArrowBack size={24} className="text-gray-700 dark:text-gray-200" />
        </button>
        <h2 className="flex-grow text-xl font-semibold text-center text-gray-900 dark:text-gray-100">
          {chatroom.name}
        </h2>
        <div className="w-10"></div>
      </div>

      {/* Chat Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-grow p-4 overflow-y-auto custom-scrollbar"
      >
        {hasMoreMessages && (
          <div ref={lastMessageRef} className="text-center py-2 text-gray-500 dark:text-gray-400 text-sm">
            Loading older messages...
          </div>
        )}
        {visibleMessages.map((msg, index) => (
          <div
            key={msg.id}
            className={`flex mb-4 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`relative max-w-[70%] p-3 rounded-lg shadow-md group ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
              }`}
            >
              {msg.imageUrl && (
                <img src={msg.imageUrl} alt="Uploaded" className="max-w-full h-auto rounded-md mb-2" />
              )}
              {msg.text && <p className="break-words">{msg.text}</p>}
              <span
                className={`block text-xs mt-1 ${
                  msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <button
                onClick={() => handleCopyToClipboard(msg.text || msg.imageUrl || '')}
                className="absolute right-2 top-2 p-1 bg-gray-600 bg-opacity-70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Copy message"
              >
                <MdContentCopy size={16} />
              </button>
            </div>
          </div>
        ))}
        {isAITyping && (
          <div className="flex justify-start mb-4">
            <div className="max-w-[70%] p-3 rounded-lg shadow-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none">
              <p className="animate-pulse">Gemini is typing...</p>
            </div>
          </div>
        )}
        {visibleMessages.length === 0 && allMessages.length > 0 && (
          <div className="space-y-4">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-3/4"></div>
            <div className="h-16 bg-blue-500 rounded-lg animate-pulse w-2/3 ml-auto"></div>
          </div>
        )}
      </div>

      {/* Message Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-800 shadow-lg flex items-center">
        <label htmlFor="image-upload" className="cursor-pointer p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200" aria-label="Upload image">
          <MdImage size={24} className="text-gray-600 dark:text-gray-300" />
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
        {selectedImage && (
          <div className="relative mr-2">
            <img src={selectedImage} alt="Preview" className="w-12 h-12 object-cover rounded-md" />
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              X
            </button>
          </div>
        )}
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Message Gemini..."
          className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 bg-transparent text-gray-900 dark:text-gray-100 outline-none transition-all duration-200 mr-2"
          aria-label="Message input"
        />
        <button
          type="submit"
          className="p-3 bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-full shadow-md transition-colors duration-200"
          aria-label="Send message"
        >
          <MdSend size={24} />
        </button>
      </form>
    </div>
  );
};

export default ChatroomPage;