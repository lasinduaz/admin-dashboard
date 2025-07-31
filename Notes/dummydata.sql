employers
INSERT INTO employers (company_name, name, address, email, contact, company_icon, password)
VALUES 
('SwiftLogistics Sdn Bhd', 'Ahmad Azlan', 'Lot 12, Jalan Meru, Klang, Selangor', 'ahmad@swiftlogistics.my', '012-3456789', 'swift_logo.png', 'hashed_password1'),
('MegaManufacture Sdn Bhd', 'Lim Wei Han', 'Jalan Teknologi, Kota Damansara, Selangor', 'lim@megamanu.my', '013-4567890', 'mega_logo.png', 'hashed_password2');

workers
INSERT INTO workers (
  fullName, username, contactNumber, email, idNumber, permanentAddress, 
  currentAddress, workExperience, password, bankAccountNumber, bankName, 
  bankBranch, idFrontImage, idBackImage
)
VALUES 
('Siti Nurhaliza', 'sitinur', '017-1234567', 'siti@example.com', '900101-14-5678',
 'Kampung Baru, KL', 'Setapak, KL', '2 years as Warehouse Assistant',
 'hashed_pw1', '1234567890', 'Maybank', 'KL Main', 'id_siti_front.jpg', 'id_siti_back.jpg'),

('Ali Rahman', 'ali_r', '019-8765432', 'ali@example.com', '910202-10-4321',
 'Batu Pahat, Johor', 'Cheras, KL', '1 year in packaging industry',
 'hashed_pw2', '0987654321', 'CIMB', 'Johor Branch', 'id_ali_front.jpg', 'id_ali_back.jpg');


jobs 
INSERT INTO jobs (
    job_title, vacancies, time_range, location, basic_salary, ot_salary,
    requirements, job_date, pickup_location, contact_info, email, employee_id
)
VALUES
('Warehouse Assistant', 10, '08:00 - 17:00', 'Klang, Selangor', 1500.00, 8.00,
 'Must be able to lift heavy items. Basic Malay/English required.', '2025-08-05',
 'KTM Klang', '012-3456789', 'ahmad@swiftlogistics.my', 1),

('Packing Operator', 5, '09:00 - 18:00', 'Shah Alam', 1600.00, 9.00,
 'Detail-oriented. Fast learner. Preferably with experience.', '2025-08-10',
 'Komuter Shah Alam', '013-4567890', 'lim@megamanu.my', 2);

job_applications 
INSERT INTO job_applications (job_id, worker_id_number)
VALUES
(1, '900101-14-5678'),
(2, '910202-10-4321');

worker_reviews
INSERT INTO worker_reviews (
    worker_id, rated_by, rating, feedback_text, job_title, company_name, duration, description
)
VALUES
(6, 'SwiftLogistics Sdn Bhd', 5, 'Very reliable and punctual. Will hire again.',
 'Warehouse Assistant', 'SwiftLogistics Sdn Bhd', '1 month', 'Daily warehouse duties'),

(7, 'MegaManufacture Sdn Bhd', 4, 'Performed well but needs more training on equipment.',
 'Packing Operator', 'MegaManufacture Sdn Bhd', '2 weeks', 'Assisted in packing and labeling');
