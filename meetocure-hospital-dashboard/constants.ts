import { Patient, AppointmentStatus, TodaysAppointment, Doctor, RecentActivity, WeeklyAppointment, MonthlyAppointmentTrend, Appointment } from './types';

const doctorAbouts = [
    "A dedicated and patient-focused cardiologist with over 15 years of experience in diagnosing and treating a wide range of cardiovascular conditions. Committed to providing the highest quality of care.",
    "Specializes in the diagnosis and treatment of neurological disorders. Dr. Harris is known for his compassionate approach and his commitment to cutting-edge research in neurology.",
    "A friendly and experienced pediatrician who is passionate about children's health. Dr. Clark provides comprehensive care for infants, children, and adolescents.",
    "A leading orthopedic surgeon with expertise in sports medicine and joint replacement surgery. Dr. Walker helps patients regain mobility and return to their active lifestyles.",
    "An expert in medical and cosmetic dermatology. Dr. Adams provides personalized treatment plans for various skin conditions, from acne to skin cancer.",
    "A compassionate oncologist with a focus on providing comprehensive cancer care and supporting patients through their treatment journey.",
];


export const MOCK_DOCTORS: Doctor[] = [
    { id: 'doc1', name: 'Dr. Emily Carter', specialty: 'Cardiologist', available: true, appointmentsCount: Math.floor(Math.random() * 50) + 50, rating: +(Math.random() * (5 - 4.5) + 4.5).toFixed(1), reviews: Math.floor(Math.random() * 100) + 150, experience: Math.floor(Math.random() * 10) + 10, workingHours: 'Mon - Fri, 9 AM - 5 PM', about: doctorAbouts[0] },
    { id: 'doc2', name: 'Dr. Daniel Harris', specialty: 'Neurologist', available: false, appointmentsCount: Math.floor(Math.random() * 50) + 50, rating: +(Math.random() * (5 - 4.5) + 4.5).toFixed(1), reviews: Math.floor(Math.random() * 100) + 150, experience: Math.floor(Math.random() * 10) + 10, workingHours: 'Tue - Sat, 10 AM - 6 PM', about: doctorAbouts[1] },
    { id: 'doc3', name: 'Dr. Olivia Clark', specialty: 'Pediatrician', available: true, appointmentsCount: Math.floor(Math.random() * 50) + 50, rating: +(Math.random() * (5 - 4.5) + 4.5).toFixed(1), reviews: Math.floor(Math.random() * 100) + 150, experience: Math.floor(Math.random() * 10) + 10, workingHours: 'Mon, Tue, Thu, 8 AM - 4 PM', about: doctorAbouts[2] },
    { id: 'doc4', name: 'Dr. Ethan Walker', specialty: 'Orthopedic Surgeon', available: true, appointmentsCount: Math.floor(Math.random() * 50) + 50, rating: +(Math.random() * (5 - 4.5) + 4.5).toFixed(1), reviews: Math.floor(Math.random() * 100) + 150, experience: Math.floor(Math.random() * 10) + 10, workingHours: 'Mon - Fri, 9 AM - 5 PM', about: doctorAbouts[3] },
    { id: 'doc5', name: 'Dr. Chloe Adams', specialty: 'Dermatologist', available: true, appointmentsCount: Math.floor(Math.random() * 50) + 50, rating: +(Math.random() * (5 - 4.5) + 4.5).toFixed(1), reviews: Math.floor(Math.random() * 100) + 150, experience: Math.floor(Math.random() * 10) + 10, workingHours: 'Wed - Sun, 9 AM - 3 PM', about: doctorAbouts[4] },
    { id: 'doc6', name: 'Dr. David Roberts', specialty: 'Oncologist', available: false, appointmentsCount: Math.floor(Math.random() * 50) + 50, rating: +(Math.random() * (5 - 4.5) + 4.5).toFixed(1), reviews: Math.floor(Math.random() * 100) + 150, experience: Math.floor(Math.random() * 10) + 10, workingHours: 'Mon - Thu, 8 AM - 4 PM', about: doctorAbouts[5] },
];

const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const appointmentDetailsSamples = [
    'Follow-up consultation regarding recent test results.',
    'Annual physical check-up.',
    'Initial consultation for persistent headache.',
    'Prescription refill and status check.',
    'Post-operative follow-up.',
    'Routine skin screening.',
    'Allergy testing session.',
    'Patient cancelled due to a scheduling conflict.',
    'Patient requested to reschedule for next week.',
];

const generateRandomAppointments = (doctors: Doctor[]): Appointment[] => {
    const appointments: Appointment[] = [];
    const numAppointments = Math.floor(Math.random() * 4) + 1; // 1 to 4 appointments

    for (let i = 0; i < numAppointments; i++) {
        const doctor = doctors[Math.floor(Math.random() * doctors.length)];
        const date = randomDate(new Date(2022, 0, 1), new Date());
        const time = `${String(Math.floor(Math.random() * 8) + 9).padStart(2, '0')}:${String(Math.floor(Math.random() * 4) * 15).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`;
        const statuses = [AppointmentStatus.Completed, AppointmentStatus.Cancelled, AppointmentStatus.Confirmed];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const details = appointmentDetailsSamples[Math.floor(Math.random() * appointmentDetailsSamples.length)];
        
        appointments.push({
            id: `apt-${Math.random().toString(36).substring(7)}`,
            doctor: { name: doctor.name, specialty: doctor.specialty },
            date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            time,
            status,
            details,
        });
    }
    return appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};


const basePatients: Omit<Patient, 'appointments'>[] = [
  { id: 'p1', name: 'Sophia Bennett', patientId: 'MTC-11223', email: 'sophia.b@email.com', phone: '+1 345 555 0101' },
  { id: 'p2', name: 'Liam Rivera', patientId: 'MTC-11224', email: 'liam.r@email.com', phone: '+1 345 555 0102' },
  { id: 'p3', name: 'Ava Patel', patientId: 'MTC-11225', email: 'ava.p@email.com', phone: '+1 345 555 0103' },
  { id: 'p4', name: 'Noah Thompson', patientId: 'MTC-11226', email: 'noah.t@email.com', phone: '+1 345 555 0104' },
  { id: 'p5', name: 'Isabella Kim', patientId: 'MTC-11227', email: 'isabella.k@email.com', phone: '+1 345 555 0105' },
  { id: 'p6', name: 'Mason Hughes', patientId: 'MTC-11228', email: 'mason.h@email.com', phone: '+1 345 555 0106' },
];

export const MOCK_PATIENTS: Patient[] = basePatients.map(patient => ({
    ...patient,
    appointments: generateRandomAppointments(MOCK_DOCTORS),
}));

export const MOCK_TODAYS_APPOINTMENTS: TodaysAppointment[] = [
  { id: 't-apt1', patient: { id: 'p1', name: 'Sophia Bennett' }, doctor: { name: 'Dr. Emily Carter' }, time: '09:00 AM', status: AppointmentStatus.Confirmed },
  { id: 't-apt2', patient: { id: 'p2', name: 'Liam Rivera' }, doctor: { name: 'Dr. Daniel Harris' }, time: '09:30 AM', status: AppointmentStatus.CheckedIn },
  { id: 't-apt3', patient: { id: 'p3', name: 'Ava Patel' }, doctor: { name: 'Dr. Olivia Clark' }, time: '10:00 AM', status: AppointmentStatus.Confirmed },
  { id: 't-apt4', patient: { id: 'p4', name: 'Noah Thompson' }, doctor: { name: 'Dr. Ethan Walker' }, time: '10:15 AM', status: AppointmentStatus.Cancelled },
  { id: 't-apt5', patient: { id: 'p5', name: 'Isabella Kim' }, doctor: { name: 'Dr. Emily Carter' }, time: '11:00 AM', status: AppointmentStatus.Completed },
];

export const MOCK_RECENT_ACTIVITY: RecentActivity[] = [
    { id: 'act1', description: 'Appointment confirmed for Sophia Bennett with Dr. Carter.', timestamp: '10m ago', icon: 'check' },
    { id: 'act2', description: 'New patient registered: Liam Rivera.', timestamp: '45m ago', icon: 'user' },
    { id: 'act3', description: 'Dr. Harris updated his schedule for next week.', timestamp: '1h ago', icon: 'calendar' },
];

export const MOCK_APPOINTMENT_TRENDS_DATA: MonthlyAppointmentTrend[] = [
    { month: 'Jan', count: 120 }, { month: 'Feb', count: 135 }, { month: 'Mar', count: 150 },
    { month: 'Apr', count: 145 }, { month: 'May', count: 160 }, { month: 'Jun', count: 175 },
    { month: 'Jul', count: 180 }, { month: 'Aug', count: 190 }, { month: 'Sep', count: 185 },
    { month: 'Oct', count: 200 }, { month: 'Nov', count: 210 }, { month: 'Dec', count: 220 },
];