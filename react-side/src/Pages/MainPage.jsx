import React, { useState } from 'react'
import '../css/MainPage.css'
import { useNavigate } from 'react-router-dom'
import LoginContainer from '../Components/LoginContainer';
import RegisterContainer from '../Components/RegisterContainer';

function MainPage() {
    const navigate = useNavigate();
    const [selectedInputType, setSelectedInputType] = useState('login')
    return (
        <div className='MainPage'>
            <div className="content">
                <img src="src/assets/heart-attack.png" width="100" height="100" alt="Image is not found" />
            </div>
            <div className="MainPage-desc">
                <p>Hospital</p>
            </div>
            {selectedInputType == 'login' ? < LoginContainer /> : <RegisterContainer />}
            {selectedInputType != 'register' ? <p onClick={() => (setSelectedInputType('register'))} className='registerText'>Create An Account</p> : <p onClick={() => (setSelectedInputType('login'))} className='registerText'>Login</p>}



        </div>
    )
}

export default MainPage