import React, {useState, useCallback} from 'react';
import { ArrowUpIcon, ArrowDownIcon, ExportIcon } from './icons/Icons';
import { MOCK_DOCTORS, MOCK_APPOINTMENT_TRENDS_DATA } from '../constants';
import { Header } from './Header';

const ReportStatCard: React.FC<{ title: string; value: string; trend: number; }> = ({ title, value, trend }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/80">
        <p className="text-sm text-gray-500">{title}</p>
        <div className="flex items-baseline gap-4 mt-2">
            <p className="text-4xl font-bold text-gray-800">{value}</p>
            <div className={`flex items-center text-sm font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                <span>{Math.abs(trend)}%</span>
            </div>
        </div>
    </div>
);

const AppointmentTrendsChart = () => {
    const data = MOCK_APPOINTMENT_TRENDS_DATA;
    const width = 500;
    const height = 150;
    const padding = 10;
    
    const maxCount = Math.max(...data.map(d => d.count));
    const minCount = 0;

    const getX = (index: number) => (index / (data.length - 1)) * width;
    const getY = (count: number) => height - padding - ((count - minCount) / (maxCount - minCount)) * (height - padding * 2);

    const pathData = data
        .map((point, i) => {
            const x = getX(i);
            const y = getY(point.count);
            return (i === 0 ? 'M' : 'L') + `${x} ${y}`;
        })
        .join(' ');

    return (
        <div className="h-64 relative">
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                <path d={pathData} fill="none" stroke="#062e3e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between text-xs text-gray-500 px-2">
                {data.map(d => <span key={d.month}>{d.month}</span>)}
            </div>
        </div>
    );
};

const PatientDemographics = () => {
    const demographicsData = [
        { label: '0-18 yrs', percentage: 25, color: 'bg-[#062e3e]' },
        { label: '19-35 yrs', percentage: 40, color: 'bg-teal-500' },
        { label: '36-55 yrs', percentage: 20, color: 'bg-sky-500' },
        { label: '56+ yrs', percentage: 15, color: 'bg-purple-500' },
    ];

    return (
        <div className="h-full flex flex-col space-y-4">
             <div>
                <h4 className="text-base font-semibold text-gray-600 mb-2">Age Distribution</h4>
                <div className="w-full bg-gray-200 rounded-full h-4 flex overflow-hidden">
                    {demographicsData.map(item => (
                        <div key={item.label} className={item.color + " h-4"} style={{ width: `${item.percentage}%` }}></div>
                    ))}
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2">
                {demographicsData.map(item => (
                    <div key={item.label} className="flex items-center">
                        <span className={`w-3 h-3 rounded-full ${item.color} mr-3`}></span>
                        <div className="flex justify-between items-baseline w-full">
                            <span className="text-sm text-gray-600">{item.label}</span>
                            <span className="font-bold text-gray-800 text-base">{item.percentage}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const DoctorPerformance = () => {
    const doctors = MOCK_DOCTORS.slice(0, 5).sort((a,b) => (b.appointmentsCount || 0) - (a.appointmentsCount || 0));
    const maxAppointments = Math.max(...doctors.map(d => d.appointmentsCount || 0));

    return (
        <div className="space-y-4">
            {doctors.map(doctor => (
                <div key={doctor.id} className="flex items-center gap-4">
                    <span className="w-1/3 text-gray-700 truncate">{doctor.name}</span>
                    <div className="w-2/3 flex items-center gap-2">
                        <div className="flex-grow bg-gray-200 rounded-full h-3">
                            <div className="bg-[#062e3e] h-3 rounded-full" style={{ width: `${((doctor.appointmentsCount || 0) / maxAppointments) * 100}%` }}></div>
                        </div>
                        <span className="font-semibold text-gray-800 w-8 text-right">{doctor.appointmentsCount}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

const generateRandomStats = () => ({
    totalAppointments: (Math.floor(Math.random() * 500) + 1000).toLocaleString(),
    patientSatisfaction: `${Math.floor(Math.random() * 10) + 88}%`,
    doctorUtilization: `${Math.floor(Math.random() * 15) + 80}%`,
    trends: {
        appointments: Math.floor(Math.random() * 20) - 5,
        satisfaction: Math.floor(Math.random() * 10) - 5,
        utilization: Math.floor(Math.random() * 10) - 2,
    }
});


export const Reports: React.FC = () => {
    const [reportStats, setReportStats] = useState(generateRandomStats());

    const handleFilterChange = useCallback(() => {
        // In a real app, you'd fetch data. Here, we just regenerate random stats for demo.
        setReportStats(generateRandomStats());
    }, []);

    const handleExport = () => {
        alert("Exporting report... (This is a demo feature)");
    };

    return (
        <>
            <Header title="Reports" />
            <div className="p-8 space-y-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Hospital Performance</h1>
                        <p className="text-gray-500 mt-1">Analyze key metrics and trends.</p>
                    </div>
                    <button 
                        onClick={handleExport}
                        className="bg-[#062e3e] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#04222f] transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
                    >
                        <ExportIcon className="w-5 h-5" />
                        <span>Export Report</span>
                    </button>
                </div>
                
                <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200/80 flex items-center gap-4">
                    <label htmlFor="date-range" className="font-semibold text-gray-700">Date Range:</label>
                    <select
                        id="date-range"
                        onChange={handleFilterChange}
                        className="w-48 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#062e3e]"
                    >
                        <option>Last 30 Days</option>
                        <option>Last 3 Months</option>
                        <option>Last 6 Months</option>
                        <option>This Year</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ReportStatCard title="Total Appointments" value={reportStats.totalAppointments} trend={reportStats.trends.appointments} />
                    <ReportStatCard title="Patient Satisfaction" value={reportStats.patientSatisfaction} trend={reportStats.trends.satisfaction} />
                    <ReportStatCard title="Doctor Utilization" value={reportStats.doctorUtilization} trend={reportStats.trends.utilization} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/80">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex justify-between">
                            Appointment Trends
                            <span className={`text-sm font-semibold ${reportStats.trends.appointments >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {reportStats.trends.appointments >= 0 ? '+' : ''}{reportStats.trends.appointments}%
                            </span>
                        </h3>
                        <p className="text-sm text-gray-500 mb-4 -mt-3">Last 12 Months</p>
                        <AppointmentTrendsChart />
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/80">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Patient Demographics</h3>
                        <PatientDemographics />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/80">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Doctor Performance</h3>
                    <DoctorPerformance />
                </div>
            </div>
        </>
    );
};