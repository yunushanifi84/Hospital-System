import React, { useState, useEffect } from 'react';
import '../css/AddAppointmentModal.css';
import axiosInstance from '../axiosInstance';
import Select from 'react-select';

function AddAppointmentModal({ modalfunc }) {
    const [appointmentDateTime, setAppointmentDateTime] = useState('');
    const [doctorPersonID, setDoctorPersonId] = useState(personID);
    const [patientPersonID, setPatientPersonId] = useState(personID);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [image, setimage] = useState();
    const [spec, setSpec] = useState([]);
    const [doctorInfoForSpec, setDoctorInfoForSpec] = useState([]);
    const [selectedSpec, setSelectedSpec] = useState();
    const [specDoctorOptions, setSpecDoctorOptions] = useState([]);
    const [selectedSpecDoctor, setSelectedSpecDoctor] = useState(null);



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

    useEffect(() => {
        axiosInstance.get(`/getSpec`)
            .then(res => {
                if (res.data.result) {

                    setSpec(res.data.result);
                } else {
                    alert("An error occurred while fetching specs.");
                }
            })
            .catch(err => {
                console.error("Error fetching specs:", err);
                alert("An error occurred while fetching specs.");
            });



    }, [selectedSpec])
    useEffect(() => {
        if (selectedSpec) {
            axiosInstance.post(`/getDoctorInfoForSpec`, { 'selectedSpec': selectedSpec })
                .then(res => {
                    if (res.data.result) {
                        console.log(res.data.result)
                        const newSpecDoctorOptions = res.data.result.map((specDoctor) => ({
                            value: specDoctor.personID,
                            label: specDoctor.name
                        }));
                        setSpecDoctorOptions(newSpecDoctorOptions);
                        setDoctorInfoForSpec(res.data.result);
                    } else {
                        alert("An error occurred while fetching specs.");
                    }
                })
                .catch(err => {
                    console.error("Error fetching specs:", err);
                    alert("An error occurred while fetching specs.");
                });
        }

    }, [selectedSpec])

    const handleAddAppointment = () => {

        if (!appointmentDateTime || !doctorPersonID || (!patientPersonID && userType != 'patient')) {
            console.log(appointmentDateTime, doctorPersonID, patientPersonID, userType);
            alert("Please fill in all fields.");
            return;
        }

        const newAppointment = {
            date: appointmentDateTime,
            doctorPersonID: doctorPersonID,
            patientPersonID: patientPersonID
        };

        axiosInstance.post(`/addAppointment`, newAppointment)
            .then(res => {
                if (res.data.status === "ok") {
                    alert("Appointment added successfully.");
                    modalfunc();
                } else {
                    alert("An error occurred while adding the appointment.");
                }
            })
            .catch(err => {
                console.error("Error adding appointment:", err);
                alert("An error occurred while adding the appointment.");
            });
    };

    const handleDateTimeChange = (e) => {

        const selectedDateTime = new Date(e.target.value);

        const formattedDateTime = selectedDateTime.toISOString().slice(0, 16);

        setAppointmentDateTime(formattedDateTime);
    };
    const handleDoctorChange = (selectedOption) => {
        setDoctorPersonId(selectedOption.value);
    };

    const doctorOptions = doctors.map((doctor) => ({
        value: doctor.doctorPersonID,
        label: doctor.name,
    }));
    const handlePatientChange = (selectedOption) => {

        setPatientPersonId(selectedOption.value);



    };
    const patientOptions = patients.map((patient) => ({
        value: patient.personID,
        label: patient.name,

    }));
    const handleSpecChange = (selectedOption) => {
        setSelectedSpec(selectedOption.value);

    }
    const specOptions = spec.map((spec) => ({
        value: spec.specialization,
        label: spec.specialization
    }));
    const handleSpecDoctorsChange = (selectedOption) => {
        setSelectedSpec(selectedOption.value);
        setDoctorPersonId(selectedOption.value);

    }


    return (
        <div className="modal">
            <div className="overlay" onClick={() => modalfunc()}></div>
            <div className="modal-content">
                <button className="close-modal" onClick={() => modalfunc()}>&times;</button>
                <h2>Add Appointment</h2>


                {userType != 'patient' ?
                    <div>
                        <label htmlFor="personId">Select Patient:</label>
                        <Select
                            id="personId"
                            options={patientOptions}
                            onChange={handlePatientChange}
                            placeholder="Select a patient"
                        />
                        {userType != 'doctor' ?
                            <div>
                                <label htmlFor="specialization">Specialization:</label>
                                <Select
                                    id="spec"
                                    options={specOptions}
                                    onChange={handleSpecChange}
                                    placeholder="Select a specialization"
                                />
                                <div>
                                    <label htmlFor="doctorId">Select Doctor:</label>
                                    <Select
                                        id="doctorId"
                                        options={specDoctorOptions}
                                        onChange={handleSpecDoctorsChange}

                                        placeholder="Select a doctor"

                                    />
                                </div>
                            </div>
                            : <div />
                        }
                    </div>

                    :
                    <div>
                        <label htmlFor="specialization">Specialization:</label>
                        <Select
                            id="spec"
                            options={specOptions}
                            onChange={handleSpecChange}
                            placeholder="Select a specialization"
                        />
                        <div>
                            <label htmlFor="doctorId">Select Doctor:</label>
                            <Select
                                id="doctorId"
                                options={specDoctorOptions}
                                onChange={handleSpecDoctorsChange}

                                placeholder="Select a doctor"

                            />
                        </div>
                    </div>
                }



                <label htmlFor="appointmentDateTime">Appointment Date & Time:</label>
                <input
                    type="datetime-local"
                    id="appointmentDateTime"
                    value={appointmentDateTime}
                    onChange={handleDateTimeChange}
                />


                <button className="login-button" onClick={handleAddAppointment}>Add</button>
            </div>
        </div>
    );
}

export default AddAppointmentModal;
