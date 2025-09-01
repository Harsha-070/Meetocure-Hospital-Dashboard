import React, { useState } from 'react';
import { MeetoCureLogoIcon, EmailIcon, LockIcon } from './icons/Icons';

interface LoginPageProps {
    onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            onLogin();
            setIsLoading(false);
        }, 1500);
    };

    const inputClasses = "block w-full rounded-lg border border-gray-300 bg-white py-3 pr-3 pl-10 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#062e3e] focus:ring-1 focus:ring-[#062e3e] sm:text-sm transition-colors";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <MeetoCureLogoIcon className="w-24 h-24 text-[#062e3e] mx-auto" />
                    <h1 className="mt-4 text-3xl font-bold text-[#062e3e] tracking-tight">
                        Welcome Back!
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Sign in to continue to your dashboard.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200/80">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <EmailIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={inputClasses}
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative mt-1">
                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete={'current-password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={inputClasses}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#062e3e] hover:bg-[#04222f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#062e3e] disabled:opacity-75 transition-colors"
                        >
                            {isLoading ? 'Processing...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
