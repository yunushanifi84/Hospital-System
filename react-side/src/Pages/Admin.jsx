import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import AdminDashboard from './Admin/AdminDashboard'
import NotFound from './NotFound'
import AdminPatients from './Admin/AdminPatients';
import AdminDoctors from './Admin/AdminDoctors';
import AdminAppointments from './Admin/AdminAppointments';
import AdminMedicalReports from './Admin/AdminMedicalReports';

function Admin() {
    const navigate = useNavigate();
    const location = useLocation();
    const [element, setElement] = useState((<AdminDashboard />));

    //kullanıcı filtresi
    useEffect(() => {
        const userType = localStorage.getItem('userType');

        if (userType !== 'admin') {
            navigate('/error'); // Doğru yönlendirme fonksiyonunu kullanmalısınız.
        }

        switch (location.pathname) {
            case '/admin':
                setElement(<AdminDashboard />)
                break;
            case '/admin/patients':
                console.log("patients");
                setElement(<AdminPatients />);
                break;
            case '/admin/doctors':
                console.log("doctors");
                setElement(<AdminDoctors />);

                break;
            case '/admin/appointments':
                console.log("appointments");
                setElement(<AdminAppointments />);
                break;
            case '/admin/medical_reports':
                console.log("medical_Reports");
                setElement(<AdminMedicalReports />);
                break;
            default:
                break;
        }
    }, [location.pathname, navigate]);
    return (
        <div>
            {element}

        </div>
    )
}

export default Admin