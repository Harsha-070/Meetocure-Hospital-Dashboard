import React, { useState, useEffect } from 'react';
import { MOCK_PATIENTS } from '../constants';
import { Patient, Appointment, PatientStub } from '../types';
import { AppointmentHistoryItem } from './AppointmentHistoryItem';
import { Header } from './Header';
import { UserCircleIcon } from './icons/Icons';

const AppointmentDetailModal: React.FC<{ appointment: Appointment; onClose: () => void }> = ({ appointment, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center border-b pb-3 mb-4 border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">Appointment Details</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-500">Doctor</p>
                    <p className="font-semibold text-gray-800">{appointment.doctor.name} ({appointment.doctor.specialty})</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-semibold text-gray-800">{appointment.date} at {appointment.time}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-semibold text-gray-800">{appointment.status}</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">{appointment.details || 'No additional details available.'}</p>
                </div>
            </div>
             <div className="mt-6 text-right">
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

const PatientRow: React.FC<{patient: Patient, onView: (patient: Patient) => void}> = ({ patient, onView }) => (
    <div onClick={() => onView(patient)} className="grid grid-cols-5 items-center py-4 px-2 border-b border-gray-200/80 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="flex items-center gap-4 col-span-2">
            <UserCircleIcon className="w-10 h-10 text-gray-400" />
            <span className="font-medium text-gray-800">{patient.name}</span>
        </div>
        <div className="text-gray-600">{patient.patientId}</div>
        <div className="text-gray-600">{patient.email}</div>
        <div className="text-gray-600">{patient.phone}</div>
    </div>
);

interface PatientSearchProps {
    initialSearchTarget: PatientStub | null;
    onExitPatientView: () => void;
    getPageTitle: (hasSelectedPatient: boolean) => string;
}

export const PatientSearch: React.FC<PatientSearchProps> = ({ initialSearchTarget, onExitPatientView, getPageTitle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [viewMode, setViewMode] = useState<'detail' | 'list'>('list');

  useEffect(() => {
    if (initialSearchTarget) {
      const patientToView = MOCK_PATIENTS.find(p => p.id === initialSearchTarget.id);
      if (patientToView) {
        setSelectedPatient(patientToView);
        setViewMode('detail');
      }
    } else {
        setViewMode('list');
    }
  }, [initialSearchTarget]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    if (!query) {
      setFilteredPatients(MOCK_PATIENTS);
    } else {
      setFilteredPatients(
        MOCK_PATIENTS.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.patientId.toLowerCase().includes(query) ||
          p.phone.includes(query)
        )
      );
    }
  }, [searchQuery, MOCK_PATIENTS]);
  
  const handleViewAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedPatient(null);
    onExitPatientView();
  }
  
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setViewMode('detail');
  }

  const searchPlaceholder = viewMode === 'list' ? 'Search by Patient Name, ID, or Phone...' : undefined;
  
  if (viewMode === 'detail' && selectedPatient) {
    return (
        <>
            <Header title={getPageTitle(true)} />
            <div className="p-8 space-y-6">
                <button 
                    onClick={handleBackToList}
                    className="text-[#062e3e] font-semibold hover:underline flex items-center gap-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Back to patient list
                </button>
                <div className="bg-white p-6 rounded-2xl shadow-md space-y-6 border border-gray-200/80">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                           <UserCircleIcon className="w-24 h-24 text-gray-300" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{selectedPatient.name}</h2>
                            <p className="text-gray-500 mt-1">
                                Patient ID: {selectedPatient.patientId}
                            </p>
                            <p className="text-gray-500">
                                {selectedPatient.email} | {selectedPatient.phone}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Appointment History</h3>
                        <div className="space-y-3">
                            {selectedPatient.appointments.length > 0 ? selectedPatient.appointments.map(app => (
                                <AppointmentHistoryItem key={app.id} appointment={app} onViewDetails={handleViewAppointmentDetails}/>
                            )) : <p className="text-gray-500 p-4 text-center">No appointment history found for this patient.</p>}
                        </div>
                    </div>
                </div>
                {selectedAppointment && (
                    <AppointmentDetailModal 
                        appointment={selectedAppointment} 
                        onClose={() => setSelectedAppointment(null)} 
                    />
                )}
            </div>
        </>
    );
  }

  return (
    <>
        <Header 
            title={getPageTitle(false)} 
            searchPlaceholder={searchPlaceholder}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
        />
        <div className="p-8">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/80">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Patient Directory</h2>
                <div>
                    <div className="grid grid-cols-5 py-2 px-2 text-sm font-semibold text-gray-500 border-b-2 border-gray-200">
                        <span className="col-span-2">Name</span>
                        <span>Patient ID</span>
                        <span>Email</span>
                        <span>Phone Number</span>
                    </div>
                    <div>
                        {filteredPatients.map(patient => (
                            <PatientRow key={patient.id} patient={patient} onView={handleSelectPatient} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};