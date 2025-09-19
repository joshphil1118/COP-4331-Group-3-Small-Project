<?php

    $inData = getRequestInfo();

    $firstName = $inData["FirstName"];
    $lastName = $inData["LastName"];
    $userId = $inData["UserId"];
    $newPhone = $inData["Phone"];
    $newEmail = $inData["Email"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("UPDATE Contacts SET Phone = ?, Email = ? WHERE FirstName = ? AND LastName = ? AND UserId = ?");
        $stmt->bind_param("ssssi", $newPhone, $newEmail, $firstName, $lastName, $userId);
        $stmt->execute();

        if ($stmt->affected_rows > 0) 
        {
            returnWithInfo("Contact updated successfully.");
        } 
        else 
        {
            returnWithError("No contact found.");
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($msg)
    {
        $retValue = '{"success":"' . $msg . '"}';
        sendResultInfoAsJson($retValue);
    }
?>
