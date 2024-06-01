import React, { useEffect } from 'react';
import '../css/NavBar.css';
import { useNavigate, useLocation } from 'react-router-dom';

function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    useEffect(() => {
        let path = location.pathname;
        switch (userType) {
            case 'admin':
                if (!path.startsWith('/admin'))
                    navigate('/admin')
                break;
            case 'patient':
                if (!path.startsWith('/patient'))
                    navigate('/patient');
                break;
            case 'doctor':
                if (!path.startsWith('/doctor'))
                    navigate('/doctor');
                break;

            default:
                break;
        }
    }, [])


    return (
        <nav className="navbar">
            {currentPath !== '/' && (
                <div className="navbar-container">
                    <img src="../../../src/assets/heart-attack.png" width="60" height="60" className='navbar-logo' onClick={() => (navigate('/'))} />
                    <ul className="navbar-menu">
                        {currentPath.startsWith('/admin') && (
                            <>
                                <li className="navbar-item">
                                    <a onClick={() => (navigate('/admin'))} className="navbar-link">Dashboard</a>
                                </li>
                                <li className="navbar-item">
                                    <a onClick={() => (navigate('/admin/patients'))} className="navbar-link">Patients</a>
                                </li>
                                <li className="navbar-item">
                                    <a onClick={() => (navigate('/admin/doctors'))} className="navbar-link">Doctors</a>
                                </li>
                                <li className="navbar-item">
                                    <a onClick={() => (navigate('/admin/appointments'))} className="navbar-link">Appointments</a>
                                </li>
                                <li className="navbar-item">
                                    <a onClick={() => (navigate('/admin/medical_reports'))} className="navbar-link">Medical Reports</a>
                                </li>
                                <li className="navbar-item">
                                    <a onClick={() => {

                                        navigate('/');
                                    }} className="navbar-link">Logout</a>
                                </li>
                            </>
                        )}

                        {currentPath.startsWith('/patient') && (
                            <>
                                <li className="navbar-item">
                                    <a onClick={() => (navigate('/patient'))} className="navbar-link">Dashboard</a>
                                </li>
                                <li className="navbar-item">
                                    <a onClick={() => (navigate('/patient/appointments'))} className="navbar-link">Appointments</a>
                                </li>
                                <li className="navbar-item">
                                    <a onClick={() => (navigate('/patient/medical_reports'))} className="navbar-link">Medical Reports</a>
                                </li>
                                <li className="navbar-item">
                                    <a onClick={() => {

                                        navigate('/');
                                    }} className="navbar-link">Logout</a>
                                </li>
                            </>
                        )}
                        {/* Doktor  */}
                        {currentPath.startsWith('/doctor') && (
                            <>
                                <li className="navbar-item">
                                    <a onClick={() => (navigate('/doctor'))} className="navbar-link">Dashboard</a>
                                </li>
                                <li className="navbar-item">
                                    <a onClick={() => (navigate('/doctor/appointments'))} className="navbar-link">Appointments</a>
                                </li>
                                <li className="navbar-item">
                                    <a onClick={() => (navigate('/doctor/myPatients'))} className="navbar-link">Medical Reports</a>
                                </li>
                                <li className="navbar-item">
                                    <a onClick={() => {

                                        navigate('/');
                                    }} className="navbar-link">Logout</a>
                                </li>
                            </>
                        )}


                    </ul>
                </div>
            )}

        </nav>
    );
}

export default NavBar;

