import React, { useState, useEffect } from 'react'
import PatientDashboard from './Patient/PatientDashboard';
import PatientAppointments from './Patient/PatientAppointments';
import PatientMedicalReports from './Patient/PatientMedicalReports';
import { useLocation, useNavigate } from 'react-router-dom';



function Patient() {
    const navigate = useNavigate();
    const location = useLocation();
    const [element, setElement] = useState((<PatientDashboard />));

    //kullanıcı filtresi
    useEffect(() => {
        const user = localStorage.getItem('user');
        const userType = localStorage.getItem('userType');
        if (userType != 'patient') navigate('/error');
        switch (location.pathname) {
            case '/patient':

                setElement(<PatientDashboard />);
                break;
            case '/patient/appointments':

                setElement(<PatientAppointments />);

                break;
            case '/patient/medical_reports':

                setElement(<PatientMedicalReports />);

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

export default Patient