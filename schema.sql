CREATE DATABASE IF NOT EXISTS umuriroreport
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE umuriroreport;

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(30),
  password VARCHAR(255) NOT NULL,
  role ENUM('user','technician','admin') NOT NULL DEFAULT 'user',
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fault_categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS fault_reports (
  fault_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  address VARCHAR(255),
  photo VARCHAR(255),
  status ENUM('Pending','In Progress','Resolved') NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES fault_categories(category_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS fault_assignments (
  assignment_id INT AUTO_INCREMENT PRIMARY KEY,
  fault_id INT NOT NULL,
  technician_id INT NOT NULL,
  assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  remarks VARCHAR(255),
  FOREIGN KEY (fault_id) REFERENCES fault_reports(fault_id) ON DELETE CASCADE,
  FOREIGN KEY (technician_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fault_updates (
  update_id INT AUTO_INCREMENT PRIMARY KEY,
  fault_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('Pending','In Progress','Resolved') NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fault_id) REFERENCES fault_reports(fault_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message VARCHAR(255) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

INSERT IGNORE INTO fault_categories (name) VALUES
('Power outage'), ('Broken electricity pole'), ('Damaged cable'),
('Transformer problem'), ('Fallen electrical wire'),
('Low voltage'), ('Sparking electrical equipment'), ('Other');

-- Demo password hashes generated for the demo passwords in README.
INSERT IGNORE INTO users (full_name,email,phone,password,role,address) VALUES
('System Administrator','admin@umuriro.rw','0780000000',
'$2b$10$V8n3nQ5V8mH5oJ6e9XQv0OqJ1Yv8tQfR1yqvZ4f7c7q1n7Qqz7d5W','admin','Kigali'),
('Electricity Technician','tech@umuriro.rw','0780000001',
'$2b$10$QeQ4QJx4M8zY0h5H4Hj2wO8uQj0fK2Xv7u7mG5yP6V0qZ7s8t1e9W','technician','Kigali');
