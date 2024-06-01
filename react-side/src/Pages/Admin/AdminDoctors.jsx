import React, { useEffect, useState } from 'react';
import Dashboard from '../../Components/Dashboard';
import AddPatientModal from '../../Components/AddPatientModal';
import AddDoctorModal from '../../Components/AddDoctorModal';
import { host, port } from '../../../config.json';
import '../../css/AdminDoctors.css';
// Icon imports
import { MdDelete } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import axiosInstance from '../../axiosInstance';
import EditDoctorModal from '../../Components/EditDoctorModal';

function AdminDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [modalState, setModalState] = useState(false);
    const [editModalState, setEditModalState] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedDoctor, setSelectedDoctor] = useState();
    const [effect, updateEffect] = useState(false);

    useEffect(() => {
        axiosInstance.get('/getDoctors')
            .then(res => {
                setDoctors(res.data.result);
            })
            .catch(err => {
                console.log(err);
            });
    }, [modalState, editModalState, effect]);

    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentItems = doctors.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(doctors.length / itemsPerPage);

    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id));
    };

    const toggleModalState = () => {
        setModalState(!modalState);
    };

    const toggleEditModalState = () => {
        setEditModalState(!editModalState);
    };

    const handleDelete = (id) => {
        axiosInstance.post(`/deleteDoctor`, { id: id })
            .then(res => {
                if (res.data.result && res.data.result.affectedRows > 0) {
                    alert('Doctor successfully deleted.');
                    updateEffect(!effect);
                } else if (res.data.message) {
                    alert(res.data.message.sqlMessage);
                }
            })
    };

    return (
        <Dashboard>
            <div className="container">
                <h2>Doctors</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Specialization</th>
                            <th>Hospital</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(doctor => (
                            <tr key={doctor.personID}>
                                <td>{doctor.name}</td>
                                <td>{doctor.surname}</td>
                                <td>{doctor.specialization}</td>
                                <td>{doctor.hospital}</td>
                                <td>
                                    <AiOutlineEdit className='icon' onClick={() => {
                                        const tempDoc = {
                                            id: doctor.personID,
                                            name: doctor.name,
                                            surname: doctor.surname,
                                            password: doctor.password,
                                            specialization: doctor.specialization,
                                            hospital: doctor.hospital
                                        };
                                        setSelectedDoctor(tempDoc);
                                        toggleEditModalState();
                                    }} />
                                    <MdDelete className='icon' onClick={() => { handleDelete(doctor.doctorID) }} />
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
                <button onClick={toggleModalState}>Add Doctor</button>
                {modalState && <AddDoctorModal modalfunc={toggleModalState} />}
                {editModalState && <EditDoctorModal modalfunc={toggleEditModalState} doctor={selectedDoctor} />}
            </div>
        </Dashboard>
    );
}

export default AdminDoctors;
