
<?php

	$inData = getRequestInfo();
	
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phone = $inData["phone"];
	$email = $inData["email"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (FirstName,LastName, Phone, Email, UserId) VALUES(?,?,?,?, ?)");
		$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);		
		
		if ($stmt->execute())
		{
			// Success response
			returnWithInfo("Contact added successfully.");
		}
		else
		{
			// Error response
			returnWithError("Unable to add contact.");
		}
		$stmt->close();
		$conn->close();
	}
	
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	function returnWithInfo($msg)
   	{
        	$retValue = '{"success":"' . $msg . '"}';
       		sendResultInfoAsJson($retValue);
    	}
?>
