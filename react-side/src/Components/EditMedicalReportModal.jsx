import React, { useState } from 'react';
import { goFileUploadFolderId } from '../../config.json'
import { FadeLoader } from 'react-spinners'

function EditMedicalReportModal({ report, modalfunc }) {
    const [loading, setloading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadedFileUrl, setUploadedFileUrl] = useState();





    const uploadFileToGoFile = (item) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", item);
        formData.append("folderId", goFileUploadFolderId);

    }


    const handleEditReport = () => {
    };

    return (
        <div className="modal">
            <div className="overlay" onClick={() => modalfunc()}></div>
            <div className="modal-content">
                <span className="close" onClick={modalfunc}>×</span>
                <h2>Edit Report Information - ID: {report.id}</h2>

                <div className="form-group">
                    <label>Patient Name:</label>
                    <span>{report.reportPatientName}</span>
                </div>
                <div className="form-group">
                    <label>Doctor Name:</label>
                    <span>{report.reportDoctorName}</span>
                </div>
                <div className="form-group">
                    <label>Creation Date:</label>
                    <span>{report.reportDate}</span>
                </div>
                <div className="form-group">
                    <label>Report Url:</label>
                    <img src={report.reportUrl} alt='Not Found' onLoad={() => (setloading(false))} onError={() => (setloading(false))} />
                    {loading && <FadeLoader color="#36d7b7" />}
                    <input
                        type="file"
                        id="img"
                        accept="image/*"
                        onChange={(e) => {
                            uploadFileToGoFile(e.target.files[0]);
                        }}
                    />

                </div>




                <button
                    className="submit-button"
                    onClick={handleEditReport}
                    disabled={uploading} // Disable button while uploading
                >
                    {uploading ? 'Uploading...' : 'Add'}
                </button>
            </div>
        </div>
    );
}

export default EditMedicalReportModal;
