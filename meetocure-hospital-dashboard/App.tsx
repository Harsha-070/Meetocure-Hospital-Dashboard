import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PatientSearch } from './components/PatientSearch';
import { Dashboard } from './components/Dashboard';
import { AppointmentsDashboard } from './components/AppointmentsDashboard';
import { DoctorManagement } from './components/DoctorManagement';
import { Reports } from './components/Reports';
import { PatientStub } from './types';
import { LoginPage } from './components/LoginPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('Dashboard');
  const [searchTarget, setSearchTarget] = useState<PatientStub | null>(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const getPageTitle = (hasSelectedPatient: boolean) => {
    if (activePage === 'Patients') {
        return hasSelectedPatient ? 'Patient Details' : 'Patients';
    }
    if (activePage === 'Appointments') return 'Appointments';
    if (activePage === 'Doctors') return 'Doctor Management';
    return activePage;
  }

  const getSearchPlaceholder = () => {
    if (activePage === 'Appointments') return 'Search patient, doctor...';
    if (activePage === 'Doctors') return 'Search doctors...';
    if (activePage === 'Patients') return 'Search by Patient Name, ID, or Phone...';
    return undefined;
  }

  const handleNavigateToPatient = (patient: PatientStub) => {
    setSearchTarget(patient);
    setActivePage('Patients');
  };
  
  const handleClearSearchTarget = () => {
    setSearchTarget(null);
  }

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Appointments':
        return <AppointmentsDashboard onNavigateToPatient={handleNavigateToPatient} />;
      case 'Doctors':
        return <DoctorManagement />;
      case 'Patients':
        return <PatientSearch 
                    initialSearchTarget={searchTarget} 
                    onExitPatientView={handleClearSearchTarget}
                    getPageTitle={getPageTitle}
                />;
      case 'Reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* The Header is now rendered inside each page component to allow for dynamic titles */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;