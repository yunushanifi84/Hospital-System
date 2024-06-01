import React, { useState } from 'react';
import { host, port } from '../../config.json';
import '../css/AddDoctorModal.css';
import axiosInstance from '../axiosInstance'
function AddDoctorModal({ modalfunc }) {
    const [name, setName] = useState('');
    const [surName, setSurName] = useState('');
    const [password, setPassword] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [hospital, setHospital] = useState('');

    const addDoctor = () => {
        axiosInstance.post(`/addDoctor`, {
            name: name,
            surName: surName,
            password: password,
            specialization: specialization,
            hospital: hospital
        }).then(res => {
            if (res.data.status === "ok") {
                alert("Doctor successfully added.");
                modalfunc();
            }
        });
    };

    return (
        <div className="modal">
            <div className="overlay" onClick={() => modalfunc()}></div>
            <div className="modal-content">
                <button className="close-modal" onClick={modalfunc}>X</button>
                <h2>Add Doctor</h2>
                <div className="form-group">
                    <label>Name:</label>
                    <input className='login-input' type="text" placeholder='Name' onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Surname:</label>
                    <input className='login-input' type="text" placeholder='SurName' onChange={(e) => setSurName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input className='login-input' type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Specialization:</label>
                    <input className='login-input' type="text" placeholder='Specialization' onChange={(e) => setSpecialization(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Hospital:</label>
                    <input className='login-input' type="text" placeholder='Hospital' onChange={(e) => setHospital(e.target.value)} />
                </div>
                <button className='login-button' onClick={addDoctor}>Add Doctor</button>
            </div>
        </div>
    );
}

export default AddDoctorModal;
