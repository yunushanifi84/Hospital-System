import React, { useState, useEffect } from 'react'
import DoctorDashboard from './Doctor/DoctorDashboard';
import DoctorAppointments from './Doctor/DoctorAppointments';
import { useLocation, useNavigate } from 'react-router-dom';
import DoctorPatients from './Doctor/DoctorPatients';

function Doctor() {
    const navigation = useNavigate();
    const location = useLocation();
    const [element, setElement] = useState((<DoctorDashboard />));

    //kullanıcı filtresi
    useEffect(() => {

        if (userType != 'doctor') navigation('/error');

        switch (location.pathname) {
            case '/doctor':
                setElement(<DoctorDashboard />);
                break;
            case '/doctor/appointments':

                setElement(<DoctorAppointments />);

                break;
            case '/doctor/myPatients':
                setElement(<DoctorPatients />)
        }
    }, [location.pathname, navigation])

    return (
        <div>
            {element}

        </div>
    )
}

export default Doctor