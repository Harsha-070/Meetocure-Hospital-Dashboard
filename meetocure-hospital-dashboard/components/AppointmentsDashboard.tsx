import React, { useState, useMemo } from 'react';
import { MOCK_TODAYS_APPOINTMENTS } from '../constants';
import { AppointmentStatus, TodaysAppointment, PatientStub } from '../types';
import { Header } from './Header';
import { UserCircleIcon } from './icons/Icons';

interface AppointmentsDashboardProps {
  onNavigateToPatient: (patient: PatientStub) => void;
}

const statusStyles: { [key in AppointmentStatus]: { text: string; bg: string; } } = {
  [AppointmentStatus.Confirmed]: { text: 'text-green-800', bg: 'bg-green-100' },
  [AppointmentStatus.CheckedIn]: { text: 'text-blue-800', bg: 'bg-blue-100' },
  [AppointmentStatus.Completed]: { text: 'text-gray-800', bg: 'bg-gray-200' },
  [AppointmentStatus.Cancelled]: { text: 'text-red-800', bg: 'bg-red-100' },
  [AppointmentStatus.Rescheduled]: { text: 'text-yellow-800', bg: 'bg-yellow-100' },
};

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/80">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-4xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);


const AppointmentRow: React.FC<{ 
    appointment: TodaysAppointment; 
    onCheckIn: (id: string) => void;
    onViewDetails: (patient: PatientStub) => void;
}> = ({ appointment, onCheckIn, onViewDetails }) => {
    const statusStyle = statusStyles[appointment.status];
    return (
        <div className="grid grid-cols-5 items-center py-4 px-2 border-b border-gray-200/80 last:border-b-0 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4 col-span-1">
                <UserCircleIcon className="w-10 h-10 text-gray-400" />
                <span className="font-medium text-gray-800">{appointment.patient.name}</span>
            </div>
            <div className="text-gray-600">{appointment.doctor.name}</div>
            <div className="text-gray-600">{appointment.time}</div>
            <div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                    {appointment.status}
                </span>
            </div>
            <div>
                {appointment.status === AppointmentStatus.Confirmed && (
                    <button 
                        onClick={() => onCheckIn(appointment.id)}
                        className="bg-[#062e3e] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#04222f] transition-all duration-200 transform hover:scale-[1.02]"
                    >
                        Check-in
                    </button>
                )}
                {appointment.status !== AppointmentStatus.Confirmed && (
                    <button 
                        onClick={() => onViewDetails(appointment.patient)}
                        className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                    >
                        View Details
                    </button>
                )}
            </div>
        </div>
    );
};


export const AppointmentsDashboard: React.FC<AppointmentsDashboardProps> = ({ onNavigateToPatient }) => {
  const [appointments, setAppointments] = useState<TodaysAppointment[]>(MOCK_TODAYS_APPOINTMENTS);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCheckIn = (appointmentId: string) => {
    setAppointments(currentAppointments => 
      currentAppointments.map(app => 
        app.id === appointmentId ? { ...app, status: AppointmentStatus.CheckedIn } : app
      )
    );
  };

  const filteredAppointments = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return appointments;
    return appointments.filter(app => 
        app.patient.name.toLowerCase().includes(query) ||
        app.doctor.name.toLowerCase().includes(query)
    );
  }, [appointments, searchQuery]);
    
  // Dynamic stats based on the current state of appointments
  const totalAppointments = appointments.length;
  const checkedInCount = appointments.filter(a => a.status === AppointmentStatus.CheckedIn).length;
  const pendingCount = appointments.filter(a => a.status === AppointmentStatus.Confirmed).length;

  return (
    <>
      <Header 
        title="Appointments" 
        searchPlaceholder="Search patient, doctor..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-gray-200/80">
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Today's Appointments</h2>
          </div>
          <div>
              <div className="grid grid-cols-5 py-2 px-2 text-sm font-semibold text-gray-500 border-b-2 border-gray-200">
                  <span>Patient</span>
                  <span>Doctor</span>
                  <span>Time</span>
                  <span>Status</span>
                  <span>Action</span>
              </div>
              <div>
                  {filteredAppointments.map(app => (
                      <AppointmentRow 
                          key={app.id} 
                          appointment={app} 
                          onCheckIn={handleCheckIn}
                          onViewDetails={onNavigateToPatient}
                      />
                  ))}
              </div>
          </div>
        </div>
        <div className="space-y-8">
          <StatCard title="Total Appointments" value={totalAppointments} />
          <StatCard title="Checked-in" value={checkedInCount} />
          <StatCard title="Pending" value={pendingCount} />
        </div>
      </div>
    </>
  );
};