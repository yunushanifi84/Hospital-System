import React, { useState, useEffect } from 'react';
import Dashboard from '../../Components/Dashboard';
import "../../css/AdminPatients.css";

import AddAppointmentModal from '../../Components/AddAppointmentModal';
import { MdDelete } from "react-icons/md";


function PatientAppoinments() {
    const [addAppointmentModalState, setAddAppoinmentModalState] = useState(false);
    const [myAppointments, setMyAppointments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [effect, setEffect] = useState(false);

    useEffect(() => {


    }, [addAppointmentModalState, effect])

    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentItems = myAppointments.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(myAppointments.length / itemsPerPage);

    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id));
    };

    const toggleAddAppoinmentModal = () => {
        setAddAppoinmentModalState(!addAppointmentModalState);
    }

    const handleDelete = (id) => {

    };

    return (
        <Dashboard>
            <div className="container">
                <h2>Randevularım</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Appointment ID</th>
                            <th>Patient Id</th>
                            <th>Appointment Date</th>
                            <th>Actions</th>

                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(appointment => (
                            <tr key={appointment.appointmentID}>
                                <td>{appointment.appointmentID}</td>
                                <td>{appointment.patientName}</td>
                                <td>{new Date(appointment.appointmentDateTime).toLocaleString()}</td>
                                <td>
                                    <MdDelete className='icon' onClick={() => {
                                        handleDelete(appointment.appointmentID);

                                    }} />
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    {Array(totalPages).fill().map((_, index) => (
                        <button key={index + 1} id={index + 1} onClick={handleClick}>
                            {index + 1}
                        </button>
                    ))}
                </div>
                <div>
                    <button className='addButton' onClick={toggleAddAppoinmentModal}>New Appoinment</button>

                </div>

                {addAppointmentModalState && <AddAppointmentModal modalfunc={toggleAddAppoinmentModal} />}

            </div>
        </Dashboard>
    );
}

export default PatientAppoinments;
