const mysql = require('mysql2');

// Veritabanına bağlan
const connection = mysql.createConnection({
    host: "sql.velnom.xyz",
    user: "root",
    password: "1436XYzt+++",
    database: "Hospital"
});

// Bağlantıyı doğrula
connection.connect((err) => {
    if (err) {
        console.error('Veritabanına bağlanılamadı:', err.stack);
        return;
    }
    console.log('Veritabanına başarıyla bağlanıldı.');
});

// SQL tablolarını oluştur
const createTables = () => {
    const sqlCommands = [

        `CREATE TABLE IF NOT EXISTS Persons (
            personID INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(50) NOT NULL,
            surname VARCHAR(50) NOT NULL,
            password VARCHAR(255) NOT NULL
        );`,

        `CREATE TABLE IF NOT EXISTS Patients (
            patientID INT PRIMARY KEY AUTO_INCREMENT,
            personID INT,
            birthDate DATE NOT NULL,
            gender ENUM('man', 'woman') NOT NULL,
            phoneNumber VARCHAR(15),
            address TEXT,
            FOREIGN KEY (personID) REFERENCES Persons(personID)
        );`,

        `CREATE TABLE IF NOT EXISTS Doctors (
            doctorID INT PRIMARY KEY AUTO_INCREMENT,
            personID INT,
            specialization VARCHAR(100),
            hospital VARCHAR(100),
            FOREIGN KEY (personID) REFERENCES Persons(personID)
        );`,

        `CREATE TABLE IF NOT EXISTS Managers (
            managerID INT PRIMARY KEY AUTO_INCREMENT,
            personID INT,
            FOREIGN KEY (personID) REFERENCES Persons(personID)
        );`,
        `INSERT INTO Persons (name, surname, password) VALUES ('nom', 'nom', 'nom');`,
        `INSERT INTO Managers (personID) SELECT personID FROM Persons WHERE name = 'nom' AND surname = 'nom';`,

        `CREATE TABLE IF NOT EXISTS Appointments (
            appointmentID INT PRIMARY KEY AUTO_INCREMENT,
            patientID INT,
            doctorID INT,
            appointmentDateTime DATETIME NOT NULL,
            FOREIGN KEY (patientID) REFERENCES Patients(patientID),
            FOREIGN KEY (doctorID) REFERENCES Doctors(doctorID)
        );`,

        `CREATE TABLE IF NOT EXISTS MedicalReports (
            reportID INT PRIMARY KEY AUTO_INCREMENT,
            patientID INT,
            doctorID INT, 
            reportDate DATE NOT NULL,
            reportContent JSON DEFAULT NULL,
            reportURL VARCHAR(255),
            FOREIGN KEY (patientID) REFERENCES Patients(patientID),
            FOREIGN KEY (doctorID) REFERENCES Doctors(doctorID)
        );`
    ];


    sqlCommands.forEach((sql, index) => {
        connection.query(sql, (err) => {
            if (err) {
                console.error(`Tablo oluşturulurken hata oluştu (SQL Komutu #${index + 1}):`, err);
            } else {
                console.log(`Tablo başarıyla oluşturuldu (SQL Komutu #${index + 1}).`);
            }
        });
    });

}
// Tabloları oluştur
createTables();

const createTrigger = () => {
    const sqlTriggerCommands = [
        `
        CREATE TRIGGER before_delete_patient
        BEFORE DELETE ON Patients
        FOR EACH ROW
        BEGIN
            DECLARE appointment_count INT;
        
            SELECT COUNT(*) INTO appointment_count
            FROM Appointments
            WHERE patientID = OLD.patientID;
        
            IF appointment_count > 0 THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Bu hastanın aktif bir randevusu bulunmakta, silme işlemi engellendi.';
            ELSE
                DELETE FROM Persons
                WHERE personID = OLD.personID;
            END IF;
        END  ;`,
        `CREATE TRIGGER before_delete_doctor
        BEFORE DELETE ON Doctors
        FOR EACH ROW
        BEGIN
            DECLARE appointment_count INT;

            SELECT COUNT(*) INTO appointment_count
            FROM Appointments
            WHERE doctorID = OLD.doctorID;
            
            IF appointment_count > 0 THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Bu doktorun hala randevuları bulunmaktadır. Doktor silinemez.';
            ELSE
    
                DELETE FROM Persons
                WHERE personID = OLD.personID;
            END IF;
        END;`

    ];
    sqlTriggerCommands.forEach((sql, index) => {
        connection.query(sql, (err) => {
            if (err) {
                console.error(`Tablo oluşturulurken hata oluştu (SQL Komutu #${index + 1}):`, err);
            } else {
                console.log(`Tablo başarıyla oluşturuldu (SQL Komutu #${index + 1}).`);
            }
        });
    });
}
createTrigger();

// Bağlantıyı kapat
connection.end((err) => {
    if (err) {
        console.error('Bağlantı kapatılamadı:', err);
    } else {
        console.log('Veritabanı bağlantısı kapatıldı.');
    }
});
