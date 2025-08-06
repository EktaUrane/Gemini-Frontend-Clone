import React, { useState, useMemo } from 'react';
import { useChatroomStore } from '../store/chatroomStore';
import { useAuthStore } from '../store/authStore';
import { useHistory } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdAdd, MdSearch, MdLogout } from 'react-icons/md';
import { useDebounce } from '../hooks/useDebounce';

const DashboardPage: React.FC = () => {
  const { chatrooms, createChatroom, deleteChatroom } = useChatroomStore();
  const logout = useAuthStore((state) => state.logout);
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newChatroomName, setNewChatroomName] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredChatrooms = useMemo(() => {
    if (!debouncedSearchTerm) {
      return chatrooms;
    }
    return chatrooms.filter((room) =>
      room.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [chatrooms, debouncedSearchTerm]);

  const handleCreateChatroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChatroomName.trim()) {
      createChatroom(newChatroomName.trim());
      toast.success(`Chatroom "${newChatroomName.trim()}" created!`);
      setNewChatroomName('');
      setIsCreating(false);
    } else {
      toast.error('Chatroom name cannot be empty.');
    }
  };

  const handleDeleteChatroom = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteChatroom(id);
      toast.success(`Chatroom "${name}" deleted!`);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    history.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Your Chatrooms
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-md transition-colors duration-200"
          >
            <MdLogout className="mr-2" /> Logout
          </button>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search chatrooms by title..."
              className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 bg-transparent text-gray-900 dark:text-gray-100 outline-none transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-md shadow-md transition-colors duration-200"
          >
            <MdAdd className="mr-2" /> Create New Chatroom
          </button>
        </div>

        {isCreating && (
          <form onSubmit={handleCreateChatroom} className="mb-6 flex gap-4">
            <input
              type="text"
              placeholder="Enter new chatroom name"
              value={newChatroomName}
              onChange={(e) => setNewChatroomName(e.target.value)}
              className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 bg-transparent text-gray-900 dark:text-gray-100 outline-none"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md shadow-md transition-colors duration-200"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-5 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-md shadow-md transition-colors duration-200"
            >
              Cancel
            </button>
          </form>
        )}

        {filteredChatrooms.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10">
            No chatrooms found. {searchTerm && 'Try a different search term or'} Create a new one!
          </p>
        ) : (
          <ul className="space-y-4">
            {filteredChatrooms.map((room) => (
              <li
                key={room.id}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
              >
                <div
                  onClick={() => history.push(`/chatroom/${room.id}`)}
                  className="flex-grow flex flex-col"
                >
                  <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {room.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Created: {new Date(room.createdAt).toLocaleDateString()}
                    {room.lastMessageAt && ` | Last Message: ${new Date(room.lastMessageAt).toLocaleTimeString()}`}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteChatroom(room.id, room.name)}
                  className="ml-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors duration-200"
                  aria-label={`Delete chatroom ${room.name}`}
                >
                  <MdAdd className="transform rotate-45" size={20} /> {/* Using MdAdd and rotating for a delete icon */}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;