<?php

namespace App\Config;

use PDO;
use PDOException;

class Database
{
    private string $host;
    private string $db_name;
    private string $username;
    private string $password;
    private PDO|null $conn;

    public function __construct()
    {
        $this->host = getenv('DB_HOST') ?: 'db';
        $this->db_name = getenv('DB_NAME') ?: 'admin_portal';
        $this->username = getenv('DB_USER') ?: 'user';
        $this->password = getenv('DB_PASS') ?: 'password';
    }

    public function getConnection()
    {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Força o fuso horário correto na sessão do banco
            $dbTimezone = getenv('DB_TIMEZONE') ?: '-03:00';
            $this->conn->exec("SET time_zone = '{$dbTimezone}'");
        } catch (PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
