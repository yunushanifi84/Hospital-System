-- MySQL init script for Hospital DB
-- This file is executed automatically by the mysql container on first startup

CREATE DATABASE IF NOT EXISTS Hospital;
USE Hospital;

-- Tables
CREATE TABLE IF NOT EXISTS Persons (
    personID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Patients (
    patientID INT PRIMARY KEY AUTO_INCREMENT,
    personID INT,
    birthDate DATE NOT NULL,
    gender ENUM('man', 'woman') NOT NULL,
    phoneNumber VARCHAR(15),
    address TEXT,
    FOREIGN KEY (personID) REFERENCES Persons(personID)
);

CREATE TABLE IF NOT EXISTS Doctors (
    doctorID INT PRIMARY KEY AUTO_INCREMENT,
    personID INT,
    specialization VARCHAR(100),
    hospital VARCHAR(100),
    FOREIGN KEY (personID) REFERENCES Persons(personID)
);

CREATE TABLE IF NOT EXISTS Managers (
    managerID INT PRIMARY KEY AUTO_INCREMENT,
    personID INT,
    FOREIGN KEY (personID) REFERENCES Persons(personID)
);

CREATE TABLE IF NOT EXISTS Appointments (
    appointmentID INT PRIMARY KEY AUTO_INCREMENT,
    patientID INT,
    doctorID INT,
    appointmentDateTime DATETIME NOT NULL,
    FOREIGN KEY (patientID) REFERENCES Patients(patientID),
    FOREIGN KEY (doctorID) REFERENCES Doctors(doctorID)
);

CREATE TABLE IF NOT EXISTS MedicalReports (
    reportID INT PRIMARY KEY AUTO_INCREMENT,
    patientID INT,
    doctorID INT,
    reportDate DATE NOT NULL,
    reportContent JSON DEFAULT NULL,
    reportUrl VARCHAR(255),
    FOREIGN KEY (patientID) REFERENCES Patients(patientID),
    FOREIGN KEY (doctorID) REFERENCES Doctors(doctorID)
);

-- Seed admin user (keeps admin login behavior in code)
INSERT INTO Persons (name, surname, password)
SELECT 'nom', 'nom', 'nom'
WHERE NOT EXISTS (
  SELECT 1 FROM Persons WHERE name = 'nom' AND surname = 'nom'
);

INSERT INTO Managers (personID)
SELECT personID FROM Persons WHERE name = 'nom' AND surname = 'nom'
  AND NOT EXISTS (
    SELECT 1 FROM Managers m
    JOIN Persons p ON p.personID = m.personID
    WHERE p.name='nom' AND p.surname='nom'
  );

-- Triggers
DROP TRIGGER IF EXISTS before_delete_patient;
DROP TRIGGER IF EXISTS before_delete_doctor;

DELIMITER //
CREATE TRIGGER before_delete_patient
BEFORE DELETE ON Patients
FOR EACH ROW
BEGIN
    DECLARE appointment_count INT;
    SELECT COUNT(*) INTO appointment_count FROM Appointments WHERE patientID = OLD.patientID;
    IF appointment_count > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Bu hastanın aktif bir randevusu bulunmakta, silme işlemi engellendi.';
    ELSE
        DELETE FROM Persons WHERE personID = OLD.personID;
    END IF;
END //

CREATE TRIGGER before_delete_doctor
BEFORE DELETE ON Doctors
FOR EACH ROW
BEGIN
    DECLARE appointment_count INT;
    SELECT COUNT(*) INTO appointment_count FROM Appointments WHERE doctorID = OLD.doctorID;
    IF appointment_count > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Bu doktorun hala randevuları bulunmaktadır. Doktor silinemez.';
    ELSE
        DELETE FROM Persons WHERE personID = OLD.personID;
    END IF;
END //
DELIMITER ;

-- Allow root remote access inside docker network
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'rootpassword';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- Default users
-- Admin (plaintext password per current admin login check)
INSERT INTO Persons (name, surname, password)
SELECT 'admin','admin','admin'
WHERE NOT EXISTS (SELECT 1 FROM Persons WHERE name='admin');

INSERT INTO Managers (personID)
SELECT personID FROM Persons WHERE name='admin'
AND NOT EXISTS (
  SELECT 1 FROM Managers m JOIN Persons p ON p.personID=m.personID WHERE p.name='admin'
);

-- Patient: Raul / raul (bcrypt hashed)
INSERT INTO Persons (name, surname, password)
SELECT 'Raul','Doe','$2b$10$zMrtIalmbThw6D/HSN4HpuJAHBFsbnjxKLhARrr9/r2mKnmJjF3oK'
WHERE NOT EXISTS (SELECT 1 FROM Persons WHERE name='Raul' AND surname='Doe');

INSERT INTO Patients (personID, birthDate, gender, phoneNumber, address)
SELECT personID, '1990-01-01', 'man', NULL, NULL FROM Persons WHERE name='Raul' AND surname='Doe'
AND NOT EXISTS (
  SELECT 1 FROM Patients pt JOIN Persons p ON pt.personID=p.personID WHERE p.name='Raul' AND p.surname='Doe'
);

-- Doctor: Sally / sally (bcrypt hashed)
INSERT INTO Persons (name, surname, password)
SELECT 'Sally','Smith','$2b$10$uFXrFfh099ZHZfvsMfSXgOyAYmn0aEwVQGPQJN3wN17UUM6Gb4.Ti'
WHERE NOT EXISTS (SELECT 1 FROM Persons WHERE name='Sally' AND surname='Smith');

INSERT INTO Doctors (personID, specialization, hospital)
SELECT personID, 'general', 'General Hospital' FROM Persons WHERE name='Sally' AND surname='Smith'
AND NOT EXISTS (
  SELECT 1 FROM Doctors d JOIN Persons p ON d.personID=p.personID WHERE p.name='Sally' AND p.surname='Smith'
);


