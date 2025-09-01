import React, { useEffect, useState } from 'react';
import { MOCK_RECENT_ACTIVITY, MOCK_TODAYS_APPOINTMENTS, MOCK_PATIENTS, MOCK_DOCTORS } from '../constants';
import { RecentActivity, WeeklyAppointment, TodaysAppointment, AppointmentStatus } from '../types';
import { AppointmentIcon, DoctorIcon, PatientIcon, ReportIcon, UserCircleIcon, ArrowUpIcon, ArrowDownIcon } from './icons/Icons';
import { Header } from './Header';

// Redesigned StatCard with trend
const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; trend: number; }> = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/80">
    <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="text-gray-400">{icon}</div>
    </div>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    <div className={`flex items-center text-xs mt-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {trend >= 0 ? <ArrowUpIcon className="w-3 h-3 mr-1" /> : <ArrowDownIcon className="w-3 h-3 mr-1" />}
        <span>{Math.abs(trend)}% vs last week</span>
    </div>
  </div>
);

const ActivityIcon: React.FC<{icon: RecentActivity['icon']}> = ({icon}) => {
    const baseClass = "w-9 h-9 rounded-lg flex items-center justify-center";
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
    <div className="space-y-4">
        {MOCK_RECENT_ACTIVITY.map((activity, index) => (
            <div key={activity.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                    <ActivityIcon icon={activity.icon} />
                    {index < MOCK_RECENT_ACTIVITY.length - 1 && <div className="w-px flex-grow bg-gray-200 my-1"></div>}
                </div>
                <div>
                    <p className="text-gray-800 text-sm leading-tight">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.timestamp}</p>
                </div>
            </div>
        ))}
    </div>
);

// New component for Area Chart
const WeeklyAppointmentsChart: React.FC<{ data: WeeklyAppointment[] }> = ({ data }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const maxCount = Math.max(...data.map(d => d.count), 0) * 1.2; // Add some padding
    
    const svgWidth = 300;
    const svgHeight = 120;
    const padding = { top: 10, bottom: 20, left: 0, right: 0 };

    const getX = (index: number) => padding.left + (index / (data.length - 1)) * (svgWidth - padding.left - padding.right);
    const getY = (count: number) => (svgHeight - padding.bottom) - ((count / maxCount) * (svgHeight - padding.top - padding.bottom));

    const pathData = data.map((point, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(point.count)}`).join(' ');
    
    const areaPathData = `${pathData} V ${svgHeight - padding.bottom} H ${padding.left} Z`;

    return (
        <div className="relative">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={areaPathData} fill="url(#areaGradient)" />
                <path d={pathData} fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                 {data.map((item, i) => (
                    <g 
                        key={item.day}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <circle cx={getX(i)} cy={getY(item.count)} r="8" fill="transparent" />
                        <circle 
                            cx={getX(i)} cy={getY(item.count)} 
                            r={hoveredIndex === i ? 5 : 0} 
                            fill="#062e3e" 
                            className="transition-all"
                        />
                    </g>
                ))}
            </svg>
            <div className="flex justify-between mt-1">
                {data.map((item, i) => (
                    <div key={item.day} className="text-center text-xs text-gray-500 w-full">
                        <p className={`font-bold transition-colors ${hoveredIndex === i ? 'text-[#062e3e]' : 'text-gray-800'}`}>{item.count}</p>
                        <p className="mt-0.5">{item.day}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const statusStyles: { [key in AppointmentStatus]: { text: string; bg: string; } } = {
  [AppointmentStatus.Confirmed]: { text: 'text-green-800', bg: 'bg-green-100' },
  [AppointmentStatus.CheckedIn]: { text: 'text-blue-800', bg: 'bg-blue-100' },
  [AppointmentStatus.Completed]: { text: 'text-gray-800', bg: 'bg-gray-200' },
  [AppointmentStatus.Cancelled]: { text: 'text-red-800', bg: 'bg-red-100' },
  [AppointmentStatus.Rescheduled]: { text: 'text-yellow-800', bg: 'bg-yellow-100' },
};


const TodaysSchedule: React.FC<{appointments: TodaysAppointment[]}> = ({appointments}) => {
    return (
        <div className="space-y-4">
            {appointments.slice(0, 4).map(app => {
                 const statusStyle = statusStyles[app.status];
                return (
                    <div key={app.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50/80 transition-colors">
                        <div className="w-16 text-center">
                            <p className="font-bold text-[#062e3e] text-lg">{app.time.split(' ')[0]}</p>
                            <p className="text-xs text-gray-500">{app.time.split(' ')[1]}</p>
                        </div>
                         <div className="w-1.5 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <UserCircleIcon className="w-10 h-10 text-gray-400 shrink-0" />
                                <div>
                                    <p className="font-semibold text-gray-800">{app.patient.name}</p>
                                    <p className="text-sm text-gray-500">with {app.doctor.name}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                                {app.status}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export const Dashboard: React.FC = () => {
    const [weeklyData, setWeeklyData] = useState<WeeklyAppointment[]>([]);
    
    const stats = {
        appointments: MOCK_TODAYS_APPOINTMENTS.length,
        totalPatients: MOCK_PATIENTS.length,
        doctorsOnDuty: MOCK_DOCTORS.filter(d => d.available).length,
        pendingReports: 12, // Still mock as there's no data source
    };
    
    const trends = {
        appointments: 5,
        patients: -2,
        doctors: 0,
        reports: 10,
    };

    useEffect(() => {
        const generateRandomData = () => {
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            return days.map(day => ({
                day,
                count: Math.floor(Math.random() * 25) + 5 
            }));
        };
        setWeeklyData(generateRandomData());
    }, []);

  return (
    <>
      <Header title="Dashboard Overview" />
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content: Left/Center Column */}
            <div className="lg:col-span-2 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <StatCard title="Appointments Today" value={stats.appointments.toString()} icon={<AppointmentIcon className="w-5 h-5" />} trend={trends.appointments} />
                    <StatCard title="Total Patients" value={stats.totalPatients.toString()} icon={<PatientIcon className="w-5 h-5" />} trend={trends.patients} />
                    <StatCard title="Doctors on Duty" value={stats.doctorsOnDuty.toString()} icon={<DoctorIcon className="w-5 h-5" />} trend={trends.doctors} />
                    <StatCard title="Pending Reports" value={stats.pendingReports.toString()} icon={<ReportIcon className="w-5 h-5" />} trend={trends.reports} />
                </div>
                
                {/* Today's Schedule Card */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/80">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Schedule</h3>
                    <TodaysSchedule appointments={MOCK_TODAYS_APPOINTMENTS} />
                </div>
            </div>

            {/* Right Sidebar Column */}
            <div className="lg:col-span-1 space-y-8">
                 <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/80">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Appointments This Week</h3>
                    <WeeklyAppointmentsChart data={weeklyData} />
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/80">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                    <RecentActivityFeed />
                </div>
            </div>
        </div>
      </div>
    </>
  );
};