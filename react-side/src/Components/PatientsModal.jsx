import React, { useEffect, useState } from 'react';
import { BiShow } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import '../css/PatientsModal.css';
import AddMedicalReportModal from './AddMedicalReportModal';
import ViewReportModal from './ViewReportModal';



function PatientsModal({ modalfunc, patient }) {

    console.log(patient)
    const patientId = patient.patientID;
    const [medicalReports, setMedicalReports] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [addModalState, setAddModalState] = useState(false);
    const [viewReportState, setViewReportState] = useState(false);
    const [selectedReport, setSelectedReport] = useState();
    const [effect, setEffect] = useState(false);

    useEffect(() => {




    }, [addModalState, effect]);

    const toggleAddModalState = () => {
        console.log(
            "test"
        )
        setAddModalState(!addModalState);
    };
    const toggleViewReportState = () => {
        setViewReportState(!viewReportState)
    }

    const handleDelete = (id) => {

    }

    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentItems = medicalReports.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(medicalReports.length / itemsPerPage);

    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id));
    };
    console.log(doctorId)

    return (
        <div className="modal">
            <div className="modal-overlay" onClick={modalfunc}></div>
            <div className="modal-content">
                <button className="close-modal" onClick={modalfunc}>✖</button>
                <table style={{ marginTop: '60px' }}>
                    <thead>
                        <tr>
                            <th>Report ID</th>
                            <th>Doctor Name</th>
                            <th>Report URL</th>
                            <th>Creation Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(report => (
                            report.doctorID == doctorId && (
                                <tr key={report.reportID}>
                                    <td>{report.reportID}</td>
                                    <td>{report.name + " " + report.surname}</td>
                                    <td>
                                        <div>{report.reportURL}</div>
                                    </td>
                                    <td>{new Date(report.reportDate).toLocaleDateString()}</td>
                                    <td>
                                        <BiShow className='icon' onClick={() => {
                                            const tempReport = {
                                                reportID: report.reportID,
                                                reportDoctorName: report.doctorName + " " + report.doctorSurname,
                                                reportUrl: report.reportURL,
                                                reportDate: new Date(report.reportDate).toLocaleDateString()
                                            }
                                            setSelectedReport(tempReport);
                                            toggleViewReportState();
                                        }} />
                                        <MdDelete className='icon' onClick={() => { handleDelete(report.reportID) }} />
                                    </td>
                                </tr>
                            )
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
                <button onClick={toggleAddModalState}>Add Report</button>
                {addModalState && <AddMedicalReportModal modalfunc={toggleAddModalState} patient={patient} />}
                {viewReportState && <ViewReportModal modalfunc={toggleViewReportState} report={selectedReport} />}
            </div>
        </div>

    );
}

export default PatientsModal;
