<?php
require_once __DIR__ . '/../config/Database.php';

class UserProfile
{
    private $conn;
    private $table = 'user_profiles';
    private $fieldsTable = 'fields_of_interest';
    private $educationLevelsTable = 'education_level';

    public function __construct()
    {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    // Fetch user profile with field name and education level
    public function getProfile($userId)
    {
        $query = "SELECT u.id AS user_id, u.name, u.email,
                        u.field_id, u.education_id,
                        f.field_name, e.education_level
                FROM " . $this->table . " u
                LEFT JOIN " . $this->fieldsTable . " f ON u.field_id = f.id
                LEFT JOIN " . $this->educationLevelsTable . " e ON u.education_id = e.id
                WHERE u.id = :user_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return $stmt->fetch(PDO::FETCH_ASSOC) ?: false;
        }
        return false;
    }


    // Get all fields of interest (for dropdown)
    public function getFieldsOfInterest()
    {
        $query = "SELECT id, field_name FROM " . $this->fieldsTable;
        $stmt = $this->conn->prepare($query);

        if ($stmt->execute()) {
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        }
        return [];
    }

    // Get all education levels (for dropdown)
    public function getEducationLevels()
    {
        $query = "SELECT id, education_level FROM " . $this->educationLevelsTable;
        $stmt = $this->conn->prepare($query);

        if ($stmt->execute()) {
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        }
        return [];
    }

    // Update user profile with field of interest and education level only (no name or career aspiration)
    public function updateProfile($userId, $name, $fieldOfInterestId, $educationLevelId)
    {
        $query = "UPDATE " . $this->table . " 
                SET name = :name, field_id = :field_id, education_id = :education_id 
                WHERE id = :user_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':field_id', $fieldOfInterestId, PDO::PARAM_INT);
        $stmt->bindParam(':education_id', $educationLevelId, PDO::PARAM_INT);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);

        return $stmt->execute();
    }


}
