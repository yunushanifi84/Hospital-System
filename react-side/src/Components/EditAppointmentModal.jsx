import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import Select from 'react-select';
import '../css/EditAppointmentModal.css';

function EditAppointmentModal({ appointment, modalfunc }) {
    const [editedAppointment, setEditedAppointment] = useState(appointment);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        axiosInstance.get(`/getDoctors`)
            .then(res => {
                if (res.data.result) {
                    setDoctors(res.data.result);
                } else {
                    alert("An error occurred while fetching doctors.");
                }
            })
            .catch(err => {
                console.error("Error fetching doctors:", err);
                alert("An error occurred while fetching doctors.");
            });

        axiosInstance.get(`/getPatients`)
            .then(res => {
                if (res.data.result) {
                    setPatients(res.data.result);
                } else {
                    alert("An error occurred while fetching patients.");
                }
            })
            .catch(err => {
                console.error("Error fetching patients:", err);
                alert("An error occurred while fetching patients.");
            });

    }, []);



    const handleSubmit = () => {
        console.log(editedAppointment);
        axiosInstance.post('/editAppointment', { editedAppointment }).then(() => {
            alert('Informations succsessfully updated.');
            modalfunc();
        });
    };
    const handleDateTimeChange = (e) => {
        const selectedDateTime = new Date(e.target.value);
        const formattedDateTime = selectedDateTime.toISOString().slice(0, 19).replace('T', ' ');

        setEditedAppointment(prevState => ({
            ...prevState,
            appointmentDateTime: formattedDateTime
        }));
        console.log(formattedDateTime);
    };

    const handleDoctorChange = (selectedOption) => {
        const { value } = selectedOption;
        setEditedAppointment(prevState => ({
            ...prevState,
            doctorId: value
        }));

    };

    const handlePatientChange = (selectedOption) => {
        const { value } = selectedOption;
        setEditedAppointment(prevState => ({
            ...prevState,
            patientId: value
        }));
    };

    const doctorOptions = doctors.map(doctor => ({
        value: doctor.doctorID,
        label: doctor.name
    }));

    const patientOptions = patients.map(patient => ({
        value: patient.patientID,
        label: patient.name
    }));

    return (
        <div className="modal">
            <div className="overlay" onClick={modalfunc}></div>
            <div className="modal-content">
                <span className="close" onClick={modalfunc}>×</span>
                <h2>Edit Appointment Information - ID: {editedAppointment.id}</h2>
                <label htmlFor="appointmentDateTime">Appointment Date & Time:</label>
                <input
                    type="datetime-local"
                    id="appointmentDateTime"
                    name="date"
                    value={editedAppointment.appointmentDateTime}
                    onChange={handleDateTimeChange}
                />

                <label htmlFor="doctorId">Select Doctor:</label>
                <Select
                    id="doctorId"
                    name='doctorId'
                    options={doctorOptions}
                    onChange={handleDoctorChange}
                    placeholder="Select a doctor"
                    value={doctorOptions.find(option => option.value === doctorId)}
                />

                <label htmlFor="patientId">Select Patient:</label>
                <Select
                    id="patientId"
                    name='patientId'
                    options={patientOptions}
                    onChange={handlePatientChange}
                    placeholder="Select a patient"
                    value={patientOptions.find(option => option.value === patientId)}
                />

                <button className="submit-button" onClick={handleSubmit}>Update</button>
            </div>
        </div>
    );
}

export default EditAppointmentModal;
