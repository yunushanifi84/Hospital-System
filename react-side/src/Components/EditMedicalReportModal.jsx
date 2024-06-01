import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { goFileUploadFolderId } from '../../config.json'
import axios from 'axios';
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


    const handleEditReport = () => {
        const axiosData = {
            'id': report.reportID,
            'reportUrl': uploadedFileUrl
        }
        axiosInstance.post('/editMedicalReport', axiosData).then(res => {
            if (res.data.status) {
                alert("succsessfully updated");
                modalfunc();
            }
        }).catch(err => {
            alert("An error occured please try again later");
            modalfunc();
        })
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
