import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axiosInstance from '../axiosInstance';
import axios from 'axios';
import { goFileUploadFolderId } from '../../config.json';

function AddMedicalReportModal({ modalfunc, patient }) {
    const [doctorId, setDoctorId] = useState(userType === 'doctor' ? personID : '');
    const [patientId, setPatientId] = useState(userType === 'patient' ? personID : '');
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [uploadedFileUrl, setUploadedFileUrl] = useState();
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        console.log("patient", patient)
        if (patient) {
            setPatientId(patient.personId);
        }
        if (userType !== 'doctor') {
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
        }

        if (userType !== 'doctor' && userType !== 'patient') {
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
        }
    }, [userType]);

    const doctorOptions = doctors.map((doctor) => ({
        value: doctor.personID,
        label: doctor.name,
    }));

    const patientOptions = patients.map((patient) => ({
        value: patient.personID,
        label: patient.name,
    }));

    const handlePatientChange = (selectedOption) => {
        setPatientId(selectedOption.value);
    };

    const handleDoctorChange = (selectedOption) => {
        setDoctorId(selectedOption.value);
    };

    const uploadFileToGoFile = (item) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", item);
        formData.append("folderId", goFileUploadFolderId);

        axios.post('https://store10.gofile.io/contents/uploadfile', formData, {
            headers: {
                'Authorization': 'Bearer KOHEmxwonfmF3LtUJigY9aiePLis53jw',
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                const { fileId, fileName } = response.data.data;
                setUploadedFileUrl(`https://store5.gofile.io/download/web/${fileId}/thumb_${fileName}`);
                setUploading(false);
            })
            .catch(error => {
                console.error(error);
                setUploading(false);
            });
    }

    let count = 0;

    const handleAddReport = () => {

        if (!uploadedFileUrl) {
            count++;
            if (count === 1) {
                alert("Invalid input type");
                modalfunc();
            }
            return;
        }

        const axiosData = {
            'patientID': parseInt(patientId),
            'doctorID': parseInt(doctorId),
            'reportUrl': uploadedFileUrl
        }
        console.log(axiosData)
        axiosInstance.post('/addMedicalReport', axiosData).then(res => {
            if (res.data.status) {
                alert("Medical Report successfully added.");
                modalfunc();
            }
        }).catch(err => {
            console.log(err);
            alert(err);
            modalfunc();
        });
    }

    return (
        <div className="modal">
            <div className="modal-overlay" onClick={modalfunc}></div>
            <div className="modal-content">
                <button className="close-modal" onClick={modalfunc}>✖</button>
                <h2>Add Medical Report</h2>

                {userType !== 'doctor' && (
                    <div>
                        <label htmlFor="doctorId">Select Doctor:</label>
                        <Select
                            id="doctorId"
                            options={doctorOptions}
                            onChange={handleDoctorChange}
                            placeholder="Select a doctor"
                        />
                    </div>
                )}

                {userType !== 'doctor' && userType !== 'patient' && (
                    <div>
                        <label htmlFor="patientId">Select Patient:</label>
                        <Select
                            id="patientId"
                            options={patientOptions}
                            onChange={handlePatientChange}
                            placeholder="Select a patient"
                        />
                    </div>
                )}

                <label htmlFor="img">Image:</label>
                <input
                    type="file"
                    id="img"
                    accept="image/*"
                    onChange={(e) => {
                        uploadFileToGoFile(e.target.files[0]);
                    }}
                />
                <button
                    className="login-button"
                    onClick={handleAddReport}
                    disabled={uploading}
                    style={{ backgroundColor: uploading ? 'red' : 'initial' }}
                >
                    {uploading ? 'Uploading...' : 'Add'}
                </button>
            </div>
        </div>
    );
}

export default AddMedicalReportModal;
