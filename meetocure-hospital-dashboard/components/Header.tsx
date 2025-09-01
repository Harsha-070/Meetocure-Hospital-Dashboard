import React from 'react';
import { NotificationIcon, SearchIcon, UserCircleIcon } from './icons/Icons';

interface HeaderProps {
  title: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ title, searchPlaceholder, searchValue, onSearchChange }) => {
  return (
    <header className="bg-white p-4 flex justify-between items-center z-10 border-b border-gray-200/80">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap-6">
        {searchPlaceholder && (
          <div className="relative w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#062e3e]"
            />
          </div>
        )}
        <div className="relative">
          <button className="hover:bg-gray-100 p-2 rounded-full transition-colors">
            <NotificationIcon className="w-6 h-6 text-gray-500" />
          </button>
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
        <UserCircleIcon className="w-10 h-10 text-gray-400" />
      </div>
    </header>
  );
};