import React, { useState, useMemo } from 'react';
import { MOCK_DOCTORS } from '../constants';
import { Doctor } from '../types';
import { Header } from './Header';
import { StarIcon, UserCircleIcon } from './icons/Icons';

const DoctorDetailModal: React.FC<{ doctor: Doctor; onClose: () => void }> = ({ doctor, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto transform animate-slide-up"
                onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                           <UserCircleIcon className="w-28 h-28 text-gray-300" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-bold text-gray-800">{doctor.name}</h2>
                                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
                            </div>
                            <p className="text-gray-500 text-lg mt-1">{doctor.specialty}</p>
                             <span className={`mt-3 inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                                doctor.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {doctor.available ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 divide-x divide-gray-200 text-center bg-gray-50/50">
                    <div className="p-4">
                        <p className="font-semibold text-gray-800 flex items-center justify-center gap-1.5">
                           <StarIcon className="w-5 h-5 text-amber-400" /> {doctor.rating?.toFixed(1)}
                        </p>
                        <p className="text-sm text-gray-500">Rating ({doctor.reviews} reviews)</p>
                    </div>
                    <div className="p-4">
                        <p className="font-semibold text-gray-800">{doctor.experience} Years</p>
                        <p className="text-sm text-gray-500">Experience</p>
                    </div>
                    <div className="p-4">
                        <p className="font-semibold text-gray-800">{doctor.appointmentsCount}</p>
                        <p className="text-sm text-gray-500">Cases Handled</p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 space-y-6 max-h-[50vh] overflow-y-auto">
                    <div>
                        <h4 className="font-bold text-gray-800 text-lg mb-2">About</h4>
                        <p className="text-gray-600 leading-relaxed">{doctor.about}</p>
                    </div>
                     <div>
                        <h4 className="font-bold text-gray-800 text-lg mb-2">Working Hours</h4>
                        <p className="text-gray-600">{doctor.workingHours}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 text-right rounded-b-2xl border-t border-gray-200">
                     <button 
                        onClick={onClose}
                        className="bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};


const DoctorCard: React.FC<{ doctor: Doctor, onViewProfile: (doctor: Doctor) => void }> = ({ doctor, onViewProfile }) => (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200/80 overflow-hidden flex flex-col items-center p-6 relative transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        <span className={`absolute top-3 right-3 px-2 py-0.5 text-xs font-semibold rounded-full ${
            doctor.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
            {doctor.available ? 'Available' : 'Unavailable'}
        </span>
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <UserCircleIcon className="w-24 h-24 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">{doctor.name}</h3>
        <p className="text-gray-500 text-sm mb-4">{doctor.specialty}</p>
        <div className="flex gap-2 w-full mt-auto">
            <button 
                onClick={() => onViewProfile(doctor)}
                className="w-full bg-[#062e3e] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#04222f] transition-colors duration-200 text-sm">
                View Profile
            </button>
        </div>
    </div>
);


export const DoctorManagement: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    const filteredDoctors = useMemo(() => {
        const query = searchQuery.toLowerCase();
        if (!query) return MOCK_DOCTORS;
        return MOCK_DOCTORS.filter(doc => 
            doc.name.toLowerCase().includes(query) ||
            doc.specialty.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    return (
        <>
            <Header 
                title="Doctor Management" 
                searchPlaceholder="Search doctors by name, specialty..."
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
            />
            <div className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredDoctors.map(doctor => (
                        <DoctorCard key={doctor.id} doctor={doctor} onViewProfile={setSelectedDoctor} />
                    ))}
                </div>
            </div>
            {selectedDoctor && (
                <DoctorDetailModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
            )}
        </>
    );
};