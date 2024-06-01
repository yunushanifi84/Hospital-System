import React, { useEffect, useState } from 'react';
import Dashboard from '../../Components/Dashboard';
import AddAppointmentModal from '../../Components/AddAppointmentModal';
import { MdDelete } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import EditAppointmentModal from "../../Components/EditAppointmentModal";

function AdminAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [addModalState, setAddModalState] = useState(false);
    const [editModalState, setEditModalState] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState();
    const [effect, updateEffect] = useState(false);

    useEffect(() => {

    }, [addModalState, effect, editModalState]);

    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id));
    };

    const toggleAddModalState = () => {
        setAddModalState(!addModalState);
    };

    const toggleEditModalState = () => {
        setEditModalState(!editModalState);
    };

    const handleDelete = (id) => {
    };

    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentItems = appointments.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(appointments.length / itemsPerPage);

    return (
        <Dashboard>
            <div className="container">
                <h2>Appointments</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Doctor</th>
                            <th>Patient</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(appointment => (
                            <tr key={appointment.appointmentID}>
                                <td>{appointment.doctorName} {appointment.doctorSurname}</td>
                                <td>{appointment.patientName} {appointment.patientSurname}</td>
                                <td>{new Date(appointment.appointmentDateTime).toLocaleDateString()}</td>
                                <td>
                                    <AiOutlineEdit className='icon' onClick={() => {
                                        const tempAppointment = {
                                            id: appointment.appointmentID,
                                            doctorId: appointment.doctorID,
                                            patientId: appointment.patientID,
                                            appointmentDateTime: appointment.appointmentDateTime,
                                        };
                                        setSelectedAppointment(tempAppointment);
                                        toggleEditModalState();
                                    }} />
                                    <MdDelete className='icon' onClick={() => handleDelete(appointment.appointmentID)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button key={index + 1} id={index + 1} onClick={handleClick}>
                            {index + 1}
                        </button>
                    ))}
                </div>
                <button onClick={toggleAddModalState}>Add Appointment</button>
                {addModalState && <AddAppointmentModal modalfunc={toggleAddModalState} />}
                {editModalState && selectedAppointment && (
                    <EditAppointmentModal
                        appointment={selectedAppointment}
                        modalfunc={toggleEditModalState}
                    />
                )}
            </div>
        </Dashboard>
    );
}

export default AdminAppointments;
