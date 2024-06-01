
const express = require('express');
const cors = require('cors');
const { host, database, password, user, port, secretKey } = require('./config.json')
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRaunds = 10;

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: host,
    database: database,
    password: password,
    user: user
});


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

connection.connect((err) => {
    if (err) {
        console.log("Veritabanına bağlanılamadı.");
        return;
    }
    console.log("Veritabanına bağlanıldı.");

})




app.post('/addPatient', authenticateToken, async (req, res) => {
    const { name, surName, password, birthDate, gender, phoneNumber, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRaunds)
    const patient = new PatientClass(connection, name, surName, hashedPassword, birthDate, gender, phoneNumber, address);
    patient.addToDatabase();
    res.status(200).json({ status: "ok" });

});
app.post('/registerPatient', async (req, res) => {
    const { name, surName, password, birthDate, gender, phoneNumber, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRaunds)
    const patient = new PatientClass(connection, name, surName, hashedPassword, birthDate, gender, phoneNumber, address);
    patient.addToDatabase();
    res.status(200).json({ status: "ok" });

});




app.post('/addDoctor', authenticateToken, async (req, res) => {
    const { name, surName, password, specialization, hospital } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRaunds)
    const doctor = new DoctorClass(connection, name, surName, hashedPassword, specialization, hospital);
    doctor.addToDatabase();
    res.status(200).json({ status: "ok" });
});


app.post('/addAppointment', authenticateToken, (req, res) => {
    const { patientPersonID, doctorPersonID, date } = req.body;
    const appointment = new AppointmentClass(connection, patientPersonID, doctorPersonID, date);
    appointment.addToDatabase();
    res.status(200).json({ status: "ok" });
});


app.post('/addMedicalReport', authenticateToken, (req, res) => {
    console.log("medical body", req.body)
    const { patientID, doctorID, reportUrl } = req.body;
    const reportDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const content = {};
    const reportContent = JSON.stringify(content);

    const medicalReport = new MedicalReportClass(connection, patientID, doctorID, reportUrl, reportDate, reportContent);
    medicalReport.addToDatabase();
    res.status(200).json({ status: 'ok' });
});
app.post('/editMedicalReport', authenticateToken, (req, res) => {
    const { id, reportUrl } = req.body;
    const reportDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const query = 'UPDATE MedicalReports SET reportUrl = ?, reportDate = ? WHERE reportID = ?';

    connection.query(query, [reportUrl, reportDate, id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'Database error' });
        } else {
            res.status(200).json({ status: 'ok' });
        }
    });
});


app.post('/checkLogin', (req, res) => {
    const { username, password, userType } = req.body;

    if (userType === 'patient') {
        connection.query('SELECT * FROM persons p JOIN patients pt ON p.personID = pt.personID WHERE p.name = ?', [username], async (err, results) => {
            if (results?.length > 0) {
                const user = results[0];
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    const token = jwt.sign({ userID: user.personID, userType: 'patient' }, secretKey, { expiresIn: '1h' });
                    const personID = user.personID;
                    res.status(200).json({ personID, token });
                } else {
                    res.status(401).json({ message: 'Invalid credentials' });
                }
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    } else if (userType === 'doctor') {
        connection.query('SELECT * FROM persons p JOIN doctors d ON p.personID = d.personID WHERE p.name = ?', [username], async (err, results) => {
            if (results?.length > 0) {
                console.log(results)
                const user = results[0];
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    const token = jwt.sign({ userID: user.personID, userType: 'doctor' }, secretKey, { expiresIn: '1h' });
                    const personID = user.personID;
                    const specId = user.doctorID;
                    res.status(200).json({ personID, token, specId });
                } else {
                    res.status(401).json({ message: 'Invalid credentials' });
                }
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    } else if (userType === 'admin') {
        connection.query('SELECT * FROM persons p JOIN managers m ON p.personID = m.personID WHERE p.name = ? AND p.password = ?', [username, password], (err, results) => {
            if (results?.length > 0) {
                const user = results[0];
                const token = jwt.sign({ userID: user.personID, userType: 'admin' }, secretKey, { expiresIn: '1h' });
                res.status(200).json({ user, token });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    }
});




app.post('/editPatient', authenticateToken, (req, res) => {
    const pt = req.body.editedPatient;
    const { id, name, surname, password, birthDate, gender, phoneNumber, address } = pt;
    const patient = new PatientClass(connection, name, surname, password, birthDate, gender, phoneNumber, address);
    patient.updateInDatabase(id);
    res.status(200).json({ status: "ok" });
});
app.post('/editDoctor', authenticateToken, (req, res) => {
    const dr = req.body.editedDoctor;
    const { id, name, surname, password, specialization, hospital } = dr;
    const doctor = new DoctorClass(connection, name, surname, password, specialization, hospital);
    doctor.updateInDatabase(id);
    res.status(200).json({ status: "ok" });

});
app.post('/editAppointment', authenticateToken, (req, res) => {
    const { id, patientId, doctorId, appointmentDateTime } = req.body.editedAppointment;

    const appointment = new AppointmentClass(connection, patientId, doctorId, appointmentDateTime);
    appointment.updateInDatabase(id);
    res.status(200).json({ status: "ok" });
});
app.post('/deletePatient', authenticateToken, (req, res) => {
    const id = req.body.id;
    Manager.deletePatient(connection, id, res);

});
app.post('/deleteDoctor', authenticateToken, (req, res) => {
    const id = req.body.id;

    Manager.deleteDoctor(connection, id, res);
});

app.post('/deleteAppointment', authenticateToken, (req, res) => {
    const id = req.body.id;
    Manager.deleteAppointment(connection, id, res);
});
app.post('/deleteMedicalReport', authenticateToken, (req, res) => {
    const id = req.body.id;
    Manager.deleteMedicalReport(connection, id, res);

});

app.get('/getPatients', authenticateToken, (req, res) => {
    const query = `
        SELECT Patients.*, Persons.name, Persons.surname, Persons.password
        FROM Patients
        INNER JOIN Persons ON Patients.personID = Persons.personID
    `;
    connection.query(query, (err, results) => {
        res.status(200).json({ result: results });
    })
})
app.get('/getDoctors', authenticateToken, (req, res) => {
    const query = `
        SELECT Doctors.*, Persons.name, Persons.surname, Persons.password
        FROM Doctors
        INNER JOIN Persons ON Doctors.personID = Persons.personID
    `;
    connection.query(query, (err, results) => {
        res.status(200).json({ result: results });
    })
})
app.get('/getAppointments', authenticateToken, (req, res) => {
    const query = `
        SELECT 
            Persons.name AS patientName, 
            Persons.surname AS patientSurname, 
            DoctorPerson.name AS doctorName, 
            DoctorPerson.surname AS doctorSurname, 
            Appointments.appointmentDateTime,
            Appointments.appointmentID
        FROM Appointments
        INNER JOIN Patients ON Appointments.patientID = Patients.patientID
        INNER JOIN Persons ON Patients.personID = Persons.personID
        INNER JOIN Doctors ON Appointments.doctorID = Doctors.doctorID
        INNER JOIN Persons AS DoctorPerson ON Doctors.personID = DoctorPerson.personID
    `;
    connection.query(query, (err, results) => {
        res.status(200).json({ result: results });
    })
})
app.post('/getMedicalReports', authenticateToken, (req, res) => {
    const query = `
        SELECT 
            Persons.name AS patientName, 
            Persons.surname AS patientSurname, 
            DoctorPerson.name AS doctorName, 
            DoctorPerson.surname AS doctorSurname, 
            MedicalReports.reportUrl,
            MedicalReports.reportID,
            MedicalReports.reportDate
        FROM MedicalReports
        INNER JOIN Patients ON MedicalReports.patientID = Patients.patientID
        INNER JOIN Persons ON Patients.personID = Persons.personID
        INNER JOIN Doctors ON MedicalReports.doctorID = Doctors.doctorID
        INNER JOIN Persons AS DoctorPerson ON Doctors.personID = DoctorPerson.personID
    `;
    connection.query(query, (err, results) => {
        res.status(200).json({ result: results });
    })
})

app.post('/getMyAppointments', authenticateToken, (req, res) => {

    const { userType, id } = req.body;
    if (userType == 'patient') PatientClass.getMyAppointments(connection, id, res);
    else if (userType == 'doctor') DoctorClass.getMyAppointments(connection, id, res);

})
app.post('/getMyPatients', authenticateToken, (req, res) => {
    const { id } = req.body

    const query = `SELECT DISTINCT
    Patients.patientID,
    Persons.name,
    Persons.surname,
    Persons.personId,
    Patients.birthDate,
    Patients.gender,
    Patients.phoneNumber,
    Patients.address
FROM MedicalReports
INNER JOIN Patients ON MedicalReports.patientID = Patients.patientID
INNER JOIN Persons ON Patients.personID = Persons.personID
WHERE MedicalReports.doctorID = (
    SELECT Doctors.doctorID
    FROM Doctors
    WHERE Doctors.personID =${id}
);`
    connection.query(query, (err, results) => {
        res.status(200).json({ result: results });

    })
})

app.get('/getSpec', authenticateToken, (req, res) => {
    const query = `
        SELECT distinct specialization FROM doctors;
    `;

    connection.query(query, (err, results) => {
        res.status(200).json({ result: results });
    })
})
app.post('/getDoctorInfoForSpec', authenticateToken, (req, res) => {
    console.log(req.body)
    const { selectedSpec } = req.body;
    const query = `
    SELECT d.doctorID, p.personID,p.name , p.surname
    FROM Doctors d 
    JOIN Persons p ON d.personID = p.personID 
    WHERE specialization='${selectedSpec}';
    `;
    connection.query(query, (err, results) => {
        console.log("query")
        console.log(results)
        res.status(200).json({ result: results });
    })
})

app.post('/getPatientMedicalReports', authenticateToken, (req, res) => {
    console.log(req.body)
    const patientId = req.body.id;;
    let queryString = `personID = ${patientId}`
    if (!patientId) {
        selectedId = req.body.patientId;
        queryString = `patientID = ${selectedId}`
        if (!selectedId) return res.status(400).send({ error: 'Missing patient id' });
    }

    const query = `
    SELECT MedicalReports.*, Persons.name, Persons.surname
    FROM MedicalReports 
    INNER JOIN Patients ON MedicalReports.patientID = Patients.patientID 
    INNER JOIN Doctors ON MedicalReports.doctorID = Doctors.doctorID
    INNER JOIN Persons ON Doctors.personID = Persons.personID
    WHERE Patients.${queryString};
`;

    connection.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'Database error' });
        } else {
            console.log(results)
            res.status(200).json({ 'results': results });
        }
    });
});

app.get('/checkToken', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token expired' });
        res.status(200).json({ message: 'Token valid' });
    });
});


app.post('/deletePatient'), authenticateToken, (req, res) => {
    const id = 2;
    Manager.deletePatient(connection, id)
}


app.listen(port, () => {
    console.log("htpps Server Started in port:" + port);
});