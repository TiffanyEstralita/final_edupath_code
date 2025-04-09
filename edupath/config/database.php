<?php
class Database
{
    private $host = 'localhost';
    private $db_name = 'edupath';
    private $username = 'root';
    private $password = 'root';
    private $conn;

    public function getConnection()
    {
        if ($this->conn === null) {
            try {
                $this->conn = new PDO(
                    "mysql:host={$this->host};dbname={$this->db_name};charset=utf8mb4",
                    $this->username,
                    $this->password
                );
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            } catch (PDOException $exception) {
                die("Database connection error: " . $exception->getMessage());
            }
        }

        return $this->conn;
    }
}
