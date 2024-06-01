import React, { useState } from 'react';

import '../css/EditDoctorModal.css';

function EditDoctorModal({ doctor, modalfunc }) {
    const [editedDoctor, setEditedDoctor] = useState(doctor);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedDoctor(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = () => {

    };

    return (
        <div className="modal">
            <div className="overlay" onClick={() => modalfunc()}></div>
            <div className="modal-content">
                <span className="close" onClick={modalfunc}>×</span>
                <h2>Edit Doctor Information - ID: {editedDoctor.id}</h2>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={editedDoctor.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Surname:</label>
                    <input type="text" name="surname" value={editedDoctor.surname} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" value={editedDoctor.password} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Specialization:</label>
                    <input type="text" name="specialization" value={editedDoctor.specialization} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Hospital:</label>
                    <input type="text" name="hospital" value={editedDoctor.hospital} onChange={handleChange} />
                </div>
                <button className="submit-button" onClick={handleSubmit}>Update</button>
            </div>
        </div>
    );
}

export default EditDoctorModal;
