CREATE TABLE workers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(255),
  username VARCHAR(255),
  contactNumber VARCHAR(50),
  email VARCHAR(255) UNIQUE,
  idNumber VARCHAR(20),
  permanentAddress TEXT,
  currentAddress TEXT,
  workExperience TEXT,
  password VARCHAR(255),
  bankAccountNumber VARCHAR(50),
  bankName VARCHAR(100),
  bankBranch VARCHAR(100),
  idFrontImage VARCHAR(255),
  idBackImage VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    vacancies INT(11) NOT NULL,
    time_range VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    location VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    basic_salary DECIMAL(10,2) NOT NULL,
    ot_salary DECIMAL(10,2) DEFAULT 0.00,
    requirements TEXT COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    job_date DATE NOT NULL,
    pickup_location VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    contact_info VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    email VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    employee_id INT(11) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Index and Foreign Key
    INDEX (employee_id),
    CONSTRAINT fk_employee_id FOREIGN KEY (employee_id) REFERENCES employers(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE employers (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    name VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    address TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
    email VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    contact VARCHAR(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    company_icon VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    password VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reset_otp VARCHAR(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    otp_expiry DATETIME DEFAULT NULL,
    reset_token VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    token_expiry DATETIME DEFAULT NULL,

    -- Add index for email (to speed up login/reset lookup)
    INDEX (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS job_applications (
    id INT(11) NOT NULL AUTO_INCREMENT,
    job_id INT(11) NOT NULL,
    worker_id_number VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX (job_id),
    INDEX (worker_id_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS worker_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    worker_id INT NOT NULL,
    rated_by VARCHAR(255), -- Can be employer name or ID
    rating INT CHECK (rating BETWEEN 1 AND 5),
    feedback_text TEXT,
    job_title VARCHAR(255),
    company_name VARCHAR(255),
    duration VARCHAR(100),
    description TEXT,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
);



