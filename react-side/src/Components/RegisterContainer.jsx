import React, { useState } from 'react'
import '../css/RegisterContainer.css'
import { host, port } from '../../config.json';
import axios from 'axios';



function RegisterContainer() {
    const [name, setName] = useState('');
    const [surName, setSurName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');



    const CreateAnAccount = () => {
        axios.post(`${host}:${port}/registerPatient`, {
            name: name,
            birthDate: birthDate,
            surName: surName,
            password: password,
            gender: gender,
            phoneNumber: phoneNumber,
            address: address
        }).then(res => {
            if (res.data.status == "ok") {
                alert("Registarion status succsess");
            }
        })
    };

    return (
        <div className='loginDiv'>
            <div className='button-container'>
                <button className={`login-type-selector ${'active'}`}>Patient</button>

            </div>
            <input className='login-input' type="text" placeholder='Name' onChange={(e) => (setName(e.target.value))} />
            <input className='login-input' type="text" placeholder='SurName' onChange={(e) => (setSurName(e.target.value))} />
            <input className='login-input' type="password" placeholder='Password' onChange={(e) => (setPassword(e.target.value))} />
            <input className='login-input' type="date" placeholder='Birthdate' onChange={(e) => (setBirthDate(e.target.value))} />
            <select className='login-input' onChange={(value) => (setGender(value.target.value))}>
                <option value="">Select Gender</option>
                <option value="woman">Woman</option>
                <option value="man">Man</option>
            </select>
            <input className='login-input' type="tel" placeholder='Phone Number' onChange={(e) => (setPhoneNumber(e.target.value))} />
            <input className='login-input' type="text" placeholder='Address' onChange={(e) => (setAddress(e.target.value))} />

            <button className='login-button' onClick={CreateAnAccount}>Click</button>
        </div>
    );
}

export default RegisterContainer