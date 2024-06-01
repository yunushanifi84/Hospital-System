import Dashboard from '../../Components/Dashboard';
import React, { useState, useEffect } from 'react';
//import "../../css/DoctorPatients.css";
import axiosInstance from '../../axiosInstance';

//icons
import { BiShow } from "react-icons/bi";
import { IoIosDocument } from "react-icons/io";
import ViewReportModal from '../../Components/ViewReportModal';
import AddMedicalReportModal from '../../Components/AddMedicalReportModal';
import PatientsModal from '../../Components/PatientsModal';

function DoctorPatients() {
    const [medicalReports, setMedicalReports] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [viewReportModalState, setViewReportModalState] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState();
    const [addModalState, setAddModalState] = useState(false);
    const [doctorReportsModalState, setDoctorReportsModalState] = useState(false);

    useEffect(() => {

        axiosInstance.post('/getMyPatients', { 'id': personID })
            .then((res) => {
                console.log(res.data)
                if (res.data.result.length > 0)
                    setMedicalReports(res.data.result);
                console.log(medicalReports)
            })
            .catch(err => console.log(err));
    }, [addModalState]);

    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentItems = medicalReports.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(medicalReports.length / itemsPerPage);

    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id));
    };

    const toggleViewReportState = () => {
        setViewReportModalState(!viewReportModalState);
    };
    const toggleAddModalState = () => {
        setAddModalState(!addModalState);
    };
    const toggleDoctorReportsModalState = () => {
        setDoctorReportsModalState(!doctorReportsModalState);
    }

    return (
        <Dashboard>
            <div className="container">
                <h2>Medical Reports</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Patient Id</th>
                            <th>Patient Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(report => (
                            <tr key={report.patientID}>
                                <td>{report.patientID}</td>
                                <td>{report.name + " " + report.surname}</td>
                                <td className='icon' onClick={() => {
                                    setSelectedPatient(report);
                                    toggleDoctorReportsModalState();

                                }}><IoIosDocument /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div>
                    {Array(totalPages).fill().map((_, index) => (
                        <button key={index + 1} id={index + 1} onClick={handleClick}>
                            {index + 1}
                        </button>
                    ))}
                </div>
                {doctorReportsModalState && <PatientsModal modalfunc={toggleDoctorReportsModalState} patient={selectedPatient} />}
            </div>
        </Dashboard>
    )
}

export default DoctorPatients;
