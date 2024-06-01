import React from 'react'
import '../css/Dashboard.css'

function Dashboard({ children }) {

    return (
        <div className='dashboard'>
            {children}
        </div>
    )
}

export default Dashboard