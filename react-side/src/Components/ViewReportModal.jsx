import React, { useState } from 'react'
import { FadeLoader } from 'react-spinners';

function ViewReportModal({ modalfunc, report }) {
    const [loading, setloading] = useState(true);
    const { reportUrl } = report
    console.log(reportUrl)


    return (
        <div className="modal">
            <div className="modal-overlay" onClick={modalfunc}></div>
            <div className="modal-content">
                <button className="close-modal" onClick={modalfunc}>✖</button>
                <img src={reportUrl} alt="ss" onLoad={() => (setloading(false))} />
                {loading && <FadeLoader color="#36d7b7" />}



            </div>
        </div>
    );
}

export default ViewReportModal