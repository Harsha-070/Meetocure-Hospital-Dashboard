import React, { useEffect, useState } from 'react';
import { MOCK_RECENT_ACTIVITY, MOCK_TODAYS_APPOINTMENTS, MOCK_PATIENTS, MOCK_DOCTORS } from '../constants';
import { RecentActivity, WeeklyAppointment } from '../types';
import { AppointmentIcon, DoctorIcon, PatientIcon, ReportIcon } from './icons/Icons';
import { Header } from './Header';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/80 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        {icon}
    </div>
    <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const ActivityIcon: React.FC<{icon: RecentActivity['icon']}> = ({icon}) => {
    const baseClass = "w-10 h-10 rounded-full flex items-center justify-center";
    switch(icon) {
        case 'check':
            return <div className={`${baseClass} bg-green-100 text-green-600`}><AppointmentIcon className="w-5 h-5" /></div>;
        case 'user':
            return <div className={`${baseClass} bg-cyan-100 text-cyan-600`}><PatientIcon className="w-5 h-5" /></div>;
        case 'calendar':
            return <div className={`${baseClass} bg-purple-100 text-purple-600`}><DoctorIcon className="w-5 h-5" /></div>;
        default: return null;
    }
}

const RecentActivityFeed: React.FC = () => (
    <div>
        {MOCK_RECENT_ACTIVITY.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-4">
                    <ActivityIcon icon={activity.icon} />
                    <p className="text-gray-800 text-sm">{activity.description}</p>
                </div>
                <p className="text-sm text-gray-500 shrink-0 ml-4">{activity.timestamp}</p>
            </div>
        ))}
    </div>
);

const WeeklyAppointmentsChart: React.FC<{ data: WeeklyAppointment[] }> = ({ data }) => {
    const [hoveredBar, setHoveredBar] = useState<string | null>(null);
    const maxCount = Math.max(...data.map(d => d.count), 40); // Ensure a decent scale

    return (
        <div className="h-48 relative">
            {/* Grid lines */}
            <div className="absolute top-0 left-0 w-full h-[calc(100%-1.5rem)] grid grid-rows-4">
                 <div className="border-b border-dashed border-gray-200"></div>
                 <div className="border-b border-dashed border-gray-200"></div>
                 <div className="border-b border-dashed border-gray-200"></div>
                 <div className="border-b border-dashed border-gray-200"></div>
            </div>

            {/* Bars and Labels */}
            <div className="h-full w-full flex justify-between items-end space-x-2">
                {data.map(item => (
                    <div 
                        key={item.day} 
                        className="flex-1 flex flex-col items-center justify-end h-full cursor-pointer group pt-8"
                        onMouseEnter={() => setHoveredBar(item.day)}
                        onMouseLeave={() => setHoveredBar(null)}
                    >
                        <div className="relative w-full h-full flex items-end justify-center">
                            {/* Tooltip */}
                            <div className={`absolute -top-7 bg-[#062e3e] text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg z-20 transition-opacity duration-200 ${hoveredBar === item.day ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                {item.count}
                            </div>
                            {/* Bar */}
                            <div 
                                className="w-3/4 bg-cyan-500 rounded-t-md transition-all duration-300 ease-out" 
                                style={{ 
                                    height: `${(item.count / maxCount) * 100}%`,
                                    backgroundColor: hoveredBar === item.day ? '#0891b2' : '#06b6d4'
                                }}
                            />
                        </div>
                        <span className="text-xs text-gray-500 mt-2 h-4">{item.day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const Dashboard: React.FC = () => {
    const [weeklyData, setWeeklyData] = useState<WeeklyAppointment[]>([]);
    
    // Stats are now derived from mock data for accuracy
    const stats = {
        appointments: MOCK_TODAYS_APPOINTMENTS.length,
        newPatients: MOCK_PATIENTS.length, // Assuming all are "new" for this demo
        doctorsOnDuty: MOCK_DOCTORS.filter(d => d.available).length,
        labReports: 12, // Still mock as there's no data source
    };

    useEffect(() => {
        const generateRandomData = () => {
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            return days.map(day => ({
                day,
                count: Math.floor(Math.random() * 40) + 5 
            }));
        };
        setWeeklyData(generateRandomData());
    }, []);

  return (
    <>
      <Header title="Dashboard" />
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard title="Appointments Today" value={stats.appointments.toString()} icon={<AppointmentIcon className="w-6 h-6 text-cyan-600" />} color="bg-cyan-100" />
          <StatCard title="Total Patients" value={stats.newPatients.toString()} icon={<PatientIcon className="w-6 h-6 text-green-600" />} color="bg-green-100" />
          <StatCard title="Doctors on Duty" value={stats.doctorsOnDuty.toString()} icon={<DoctorIcon className="w-6 h-6 text-amber-600" />} color="bg-amber-100" />
          <StatCard title="Pending Reports" value={stats.labReports.toString()} icon={<ReportIcon className="w-6 h-6 text-purple-600" />} color="bg-purple-100" />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/80">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Appointments This Week</h3>
            <WeeklyAppointmentsChart data={weeklyData} />
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/80">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
            <RecentActivityFeed />
        </div>
      </div>
    </>
  );
};