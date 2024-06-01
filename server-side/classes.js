class PatientClass {

  constructor(connection, name, surname, password, birthDate, gender, phoneNumber, address) {
    this.connection = connection;
    this.name = name;
    this.surname = surname;
    this.password = password;
    this.birthDate = birthDate;
    this.gender = gender;
    this.phoneNumber = phoneNumber;
    this.address = address;

  }


  addToDatabase() {
    const sql = `INSERT INTO Persons (name, surname, password) VALUES ('${this.name}', '${this.surname}', '${this.password}')`;
    this.connection.query(sql, (err, result) => {
      if (err) {
        console.error("Error adding person:", err);
        throw err;
      }
      const personID = result.insertId;
      const patientSql = `INSERT INTO Patients (personID, birthDate, gender, phoneNumber, address) VALUES (${personID}, '${this.birthDate}', '${this.gender}', '${this.phoneNumber}', '${this.address}')`;
      this.connection.query(patientSql, (err, result) => {
        if (err) {
          throw err;
        }
      });
    });
  }
  updateInDatabase(personID) {
    const updatePersonSql = `UPDATE Persons SET name='${this.name}', surname='${this.surname}', password='${this.password}' WHERE personID=${personID}`;
    this.connection.query(updatePersonSql, (err, result) => {
      if (err) {
        console.error("Error updating person:", err);
        throw err;
      }
      const updatePatientSql = `UPDATE Patients SET birthDate='${this.birthDate}', gender='${this.gender}', phoneNumber='${this.phoneNumber}', address='${this.address}' WHERE personID=${personID}`;
      this.connection.query(updatePatientSql, (err, result) => {
        if (err) {
          console.error("Error updating patient:", err);
          throw err;
        }

      });
    });
  }
  static getMyAppointments(connection, id, res) {
    this.connection = connection;
    const sql = `SELECT
    a.appointmentID,
    d.specialization AS doctorSpecialization,
    p.name AS doctorName,
    a.appointmentDateTime
FROM 
    Appointments a
JOIN 
    Doctors d ON a.doctorID = d.doctorID
JOIN 
    Persons p ON d.personID = p.personID
JOIN
    Patients pt ON a.patientID = pt.patientID
WHERE
    pt.personID = ${id};
`
    this.connection.query(sql, (err, result) => {
      if (err) {

        throw err;
      }
      else res.status(200).json({ result: result });


    });

  }

}

class DoctorClass {
  constructor(connection, name, surname, password, specialization, hospital) {
    this.connection = connection;
    this.name = name;
    this.surname = surname;
    this.password = password;
    this.specialization = specialization;
    this.hospital = hospital;
  }
  addToDatabase() {
    const sql = `INSERT INTO Persons (name, surname, password) VALUES ('${this.name}', '${this.surname}', '${this.password}')`;
    this.connection.query(sql, (err, result) => {
      if (err) {
        console.error("Error adding person:", err);
        throw err;
      }
      const personID = result.insertId;
      const doctorSql = `INSERT INTO Doctors (personID, specialization, hospital) VALUES (${personID}, '${this.specialization}', '${this.hospital}')`;
      this.connection.query(doctorSql, (err, result) => {
        if (err) {
          console.error("Error adding doctor:", err);
          throw err;
        }
      });
    });
  }
  updateInDatabase(personID) {
    const updatePersonSql = `UPDATE Persons SET name='${this.name}', surname='${this.surname}', password='${this.password}' WHERE personID=${personID}`;
    this.connection.query(updatePersonSql, (err, result) => {
      if (err) {
        console.error("Error updating person:", err);
        throw err;
      }
      const updateDoctorSql = `UPDATE Doctors SET specialization='${this.specialization}', hospital='${this.hospital}' WHERE personID=${personID}`;
      this.connection.query(updateDoctorSql, (err, result) => {
        if (err) {
          console.error("Error updating doctor:", err);
          throw err;
        }
        console.log("Doctor updated successfully!");
      });
    });
  }
  static getMyAppointments(connection, id, res) {
    const sql = `
    SELECT
        a.appointmentID,
        p_patient.name AS patientName,
        a.appointmentDateTime
    FROM 
        Appointments a
    JOIN 
        Doctors d ON a.doctorID = d.doctorID
    JOIN 
        Patients pt ON a.patientID = pt.patientID
    JOIN 
        Persons p_patient ON pt.personID = p_patient.personID
    WHERE
        d.personID = ${id};
    `;



    connection.query(sql, (err, result) => {
      if (err) {
        console.log("Error get appoinmetnt", err);
        throw err;
      }
      else res.status(200).json({ result: result });


    });

  }

}

class AppointmentClass {
  constructor(connection, patientPersonID, doctorPersonID, date) {
    this.connection = connection;
    this.patientPersonID = patientPersonID;
    this.doctorPersonID = doctorPersonID;
    this.date = date;
  }
  addToDatabase() {
    const sql = `INSERT INTO Appointments (patientID, doctorID, appointmentDateTime)
    VALUES (
        (SELECT patientID FROM Patients WHERE personID = ${this.patientPersonID}),
        (SELECT doctorID FROM Doctors WHERE personID = ${this.doctorPersonID}),
        '${this.date}'
    );
    `;
    this.connection.query(sql, (err, result) => {
      if (err) throw err;
      console.log("Appointment eklendi!");
    });
  }
  updateInDatabase(appointmentID) {

    const updateSql = `UPDATE Appointments SET patientID = ${this.patientID}, doctorID = ${this.doctorID}, appointmentDateTime = '${this.date}' WHERE appointmentID = ${appointmentID} `;
    this.connection.query(updateSql, (err, result) => {
      if (err) throw err;
      console.log("Appointment updated successfully!");
    });

  }
}

class MedicalReportClass {
  constructor(connection, patientID, doctorID, reportUrl, reportDate, content) {
    this.connection = connection;
    this.patientID = patientID;
    this.doctorID = doctorID;
    this.reportDate = reportDate;
    this.content = content;
    this.reportUrl = reportUrl;
  }
  addToDatabase() {
    const sql = `
        INSERT INTO MedicalReports(patientID, doctorID, reportUrl, reportDate, reportContent) 
        VALUES (
            (SELECT patientID FROM Patients WHERE personID = ${this.patientID}),
            (SELECT doctorID FROM Doctors WHERE personID = ${this.doctorID}),
            '${this.reportUrl}', 
            '${this.reportDate}', 
            '${this.content}'
        )
    `;
    this.connection.query(sql, (err, result) => {
      if (err) console.log(err);
      console.log("MedicalReport eklendi!");
    });
  }
}


class Manager {
  static deletePatient(connection, id, res) { //patient id yollanacak
    const sql = `DELETE FROM patients WHERE patientID = ${id} `

    connection.query(sql, (err, result) => {
      if (err) {
        res.status(200).json({ message: err });
      }
      else res.status(200).json({ result: result });
    });
  }
  static deleteDoctor(connection, id, res) { //doctor id yollanacak
    // Önce Persons tablosundan ilgili kişiyi sileceğiz
    const sql = `DELETE FROM Doctors WHERE doctorID = ${id} `

    connection.query(sql, (err, result) => {
      if (err) {
        res.status(200).json({ message: err });
      }
      else res.status(200).json({ result: result });
    });
  }
  static deleteAppointment(connection, id, res) { //appointment id yollanacak
    const sql = `DELETE FROM Appointments WHERE appointmentID = ${id} `

    connection.query(sql, (err, result) => {
      if (err) {
        res.status(200).json({ message: err });
      }
      else res.status(200).json({ result: result });
    });
  }
  static deleteMedicalReport(connection, id, res) {
    const sql = `DELETE FROM MedicalReports WHERE reportID = ${id} `
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(200).json({ message: err });

      }
      else res.status(200).json({ result: result });
    });


  }


}

module.exports = { PatientClass, DoctorClass, AppointmentClass, MedicalReportClass, Manager };
