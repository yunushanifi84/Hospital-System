
import Dashboard from '../../Components/Dashboard'
import React, { useState, useEffect } from 'react';
import { AiOutlineEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import "../../css/AdminMedicalReports.css";
import axiosInstance from '../../axiosInstance';

//icons
import { BiShow } from "react-icons/bi";
import ViewReportModal from '../../Components/ViewReportModal';
import AddMedicalReportModal from '../../Components/AddMedicalReportModal';
import EditMedicalReportModal from '../../Components/EditMedicalReportModal';

function AdminMedicalReports() {
    const [medicalReports, setMedicalReports] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [viewReportModalState, setViewReportModalState] = useState(false);
    const [addReportModalState, setAddReportModalState] = useState(false);
    const [effect, updateEffect] = useState(false);
    const [editModalState, setEditModalState] = useState(false);
    const [selectedReport, setSelectedReport] = useState();



    useEffect(() => {

        axiosInstance.post('/getMedicalReports')
            .then((res) => {
                console.log(res)
                setMedicalReports(res.data.result);
            })
            .catch(err => console.log(err))
    }, [ViewReportModal, addReportModalState, effect, editModalState])

    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentItems = medicalReports.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(medicalReports.length / itemsPerPage);

    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id));
    };
    const toggleViewReportState = () => {
        setViewReportModalState(!viewReportModalState);
    }
    const toggleAddReportState = () => {
        setAddReportModalState(!addReportModalState);
    }
    const toggleEditModalState = () => {
        setEditModalState(!editModalState);
    };

    const handleDelete = (id) => {
        axiosInstance.post(`/deleteMedicalReport`, { id: id })
            .then(res => {
                if (res.data.result && res.data.result.affectedRows > 0) {
                    alert('Rapor başarıyla silindi.');
                    updateEffect(!effect);
                } else if (res.data.message) {
                    alert(res.data.message.sqlMessage)
                }
            })

    }



    return (
        <Dashboard>
            <div className="container">
                <h2>Medical Reports</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Report ID</th>
                            <th>Patient Name</th>
                            <th>Doctor Name</th>
                            <th>Report URL</th>
                            <th>Creation Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(report => (
                            <tr key={report.reportID}>
                                <td>{report.reportID}</td>
                                <td>{report.patientName + " " + report.patientSurname}</td>
                                <td>{report.doctorName + " " + report.doctorSurname}</td>
                                <td>
                                    <div>{report.reportUrl}</div>
                                    <BiShow className='icon' onClick={() => {
                                        const tempReport = {
                                            reportID: report.reportID,
                                            reportPatientName: report.patientName + " " + report.patientSurname,
                                            reportDoctorName: report.doctorName + " " + report.doctorSurname,
                                            reportUrl: report.reportUrl,
                                            reportDate: new Date(report.reportDate).toLocaleDateString()


                                        }
                                        setSelectedReport(tempReport);
                                        toggleViewReportState()
                                    }} />
                                </td>
                                <td>{new Date(report.reportDate).toLocaleDateString()}</td>
                                <td>
                                    <AiOutlineEdit className='icon' onClick={() => {
                                        const tempReport = {
                                            reportID: report.reportID,
                                            reportPatientName: report.patientName + " " + report.patientSurname,
                                            reportDoctorName: report.doctorName + " " + report.doctorSurname,
                                            reportUrl: report.reportUrl,
                                            reportDate: new Date(report.reportDate).toLocaleDateString()


                                        }
                                        setSelectedReport(tempReport);
                                        toggleEditModalState();
                                    }}

                                    />
                                    <MdDelete className='icon' onClick={() => { handleDelete(report.reportID) }} />
                                </td>
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
                <button onClick={toggleAddReportState}>Add Medical Report</button>
                {viewReportModalState && <ViewReportModal modalfunc={toggleViewReportState} report={selectedReport} />}
                {addReportModalState && <AddMedicalReportModal modalfunc={toggleAddReportState} />}
                {editModalState && <EditMedicalReportModal modalfunc={toggleEditModalState} report={selectedReport} />}
            </div>



        </Dashboard>
    )
}

export default AdminMedicalReports
