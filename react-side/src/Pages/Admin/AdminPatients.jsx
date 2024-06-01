import React, { useState, useEffect } from 'react';
import Dashboard from '../../Components/Dashboard';
import "../../css/AdminPatients.css";
import AddPatientModal from '../../Components/AddPatientModal';
import axiosInstance from '../../axiosInstance'
import EditPatientModal from '../../Components/EditPatientModal';

// Icon imports
import { MdDelete } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";

function AdminPatients() {
    const [patients, setPatients] = useState([]);
    const [modalState, setModalState] = useState(false);
    const [editModalState, setEditModalState] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedPatient, setSelectedPatient] = useState();
    const [effect, updateEffect] = useState(false);

    useEffect(() => {
        axiosInstance.get(`/getPatients`)
            .then(res => {
                setPatients(res.data.result);
            })
            .catch(err => console.log(err))
    }, [modalState, editModalState, effect])

    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentItems = patients.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(patients.length / itemsPerPage);

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
        axiosInstance.post(`/deletePatient`, { id: id })
            .then(res => {
                if (res.data.result && res.data.result.affectedRows > 0) {
                    alert('Kişi Başarıyla silindi.');
                    updateEffect(!effect);
                } else if (res.data.message) {
                    alert(res.data.message.sqlMessage)
                }
            })
    };

    return (
        <Dashboard>
            <div className="container">
                <h2>Patients</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Person ID</th>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Phone Number</th>
                            <th>Birthdate</th>
                            <th>Gender</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(hasta => (
                            <tr key={hasta.personID}>
                                <td>{hasta.personID}</td>
                                <td>{hasta.name}</td>
                                <td>{hasta.surname}</td>
                                <td>{hasta.phoneNumber}</td>
                                <td>{new Date(hasta.birthDate).toLocaleDateString()}</td>
                                <td>{hasta.gender}</td>
                                <td>{hasta.address}</td>
                                <td className='iconstab'>
                                    <AiOutlineEdit className='icon' onClick={() => {
                                        const pati = {
                                            id: hasta.personID,
                                            name: hasta.name,
                                            surname: hasta.surname,
                                            password: hasta.password,
                                            phoneNumber: hasta.phoneNumber,
                                            birthDate: new Date(new Date(hasta.birthDate).getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0],
                                            gender: hasta.gender,
                                            address: hasta.address
                                        };
                                        setSelectedPatient(pati);
                                        toggleEditModalState();
                                    }} />
                                    <MdDelete className='icon' onClick={() => handleDelete(hasta.patientID)} />
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
                <button onClick={toggleModalState}>Add Patient</button>
                {modalState && <AddPatientModal modalfunc={toggleModalState} />}
                {editModalState && <EditPatientModal modalfunc={toggleEditModalState} patient={selectedPatient} />}
            </div>
        </Dashboard>
    );
}

export default AdminPatients;
