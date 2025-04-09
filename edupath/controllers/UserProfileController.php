<?php
require_once __DIR__ . '/../models/UserProfile.php';

class UserProfileController
{
	private $userProfile;
	private $conn;

	public function __construct()
	{
		// Instantiate the UserProfile model
		$this->userProfile = new UserProfile();
	}

	// View the profile of the logged-in user
	public function viewProfile($userId)
	{
		// Fetch the user's profile from the database
		return $this->userProfile->getProfile($userId);
	}

	// Update the profile of the logged-in user
	public function updateProfile($userId, $name, $fieldOfInterestId, $educationLevelId)
{
	$query = "UPDATE user_profiles 
	          SET name = :name, field_id = :field_id, education_id = :education_id
	          WHERE id = :user_id";

	$stmt = $this->conn->prepare($query);
	$stmt->bindParam(':name', $name);
	$stmt->bindParam(':field_id', $fieldOfInterestId, PDO::PARAM_INT);
	$stmt->bindParam(':education_id', $educationLevelId, PDO::PARAM_INT);
	$stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);

	return $stmt->execute();
}


	// Fetch fields of interest for the form selection
	public function getFieldsOfInterest()
	{
		return $this->userProfile->getFieldsOfInterest();
	}
}
