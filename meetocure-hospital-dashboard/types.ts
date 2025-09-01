export enum AppointmentStatus {
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
  Rescheduled = 'Rescheduled',
  CheckedIn = 'Checked-in',
  Completed = 'Completed',
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
  appointmentsCount?: number;
  rating?: number;
  reviews?: number;
  experience?: number; // in years
  workingHours?: string;
  about?: string;
}

export interface PatientStub {
  id: string;
  name: string;
}

export interface TodaysAppointment {
  id: string;
  patient: PatientStub;
  doctor: Pick<Doctor, 'name'>;
  time: string;
  status: AppointmentStatus;
}


export interface Appointment {
  id: string;
  doctor: { name: string, specialty: string };
  date: string;
  time: string;
  status: AppointmentStatus;
  details?: string;
}

export interface Patient {
  id: string;
  name: string;
  patientId: string;
  email: string;
  phone: string;
  appointments: Appointment[];
}

export interface RecentActivity {
    id: string;
    description: string;
    timestamp: string;
    icon: 'check' | 'user' | 'calendar';
}

export interface WeeklyAppointment {
    day: string;
    count: number;
}

export interface MonthlyAppointmentTrend {
    month: string;
    count: number;
}