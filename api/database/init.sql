CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_pt VARCHAR(255),
    game ENUM('magic', 'pokemon', 'yugioh') NOT NULL,
    edition_id VARCHAR(50) NOT NULL,
    image_url TEXT,
    rarity VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed a default admin user
-- Password is 'admin123'
INSERT INTO users (username, password_hash) 
VALUES ('admin', '$2y$10$m0vs7cpHi6lcS9.1ot6oOuds2sNTas3DU0rKXasP1/9f/RXW0PsWi')
ON DUPLICATE KEY UPDATE username=username;
