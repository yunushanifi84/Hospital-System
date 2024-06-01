import React, { useEffect, useState } from 'react';
import '../css/LoginContainer.css';
import { host, port } from '../../config.json';
import { useNavigate } from 'react-router-dom';

function LoginContainer() {
    const [active, setActive] = useState('patient');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const updateActive = (index) => {
        setActive(index);
    };


    const loginCheck = () => {
        console.log("click")
        const paramaters = {
            "userType": active,
            "username": name,
            "password": password
        }


    };

    return (
        <div className='loginDiv'>
            <div className='button-container'>
                <button className={`login-type-selector ${active === 'patient' ? 'active' : ''}`} onClick={() => updateActive('patient')}>Patient</button>
                <button className={`login-type-selector ${active === 'doctor' ? 'active' : ''}`} onClick={() => updateActive('doctor')}>Doctor</button>
                <button className={`login-type-selector ${active === 'admin' ? 'active' : ''}`} onClick={() => updateActive('admin')}>Admin</button>
            </div>
            <input className='login-input' type="text" placeholder='Name' onChange={(e) => setName(e.target.value)} />
            <input className='login-input' type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
            <button className='login-button' onClick={loginCheck}>Click</button>
        </div>
    );
}

export default LoginContainer;