<?php

    $inData = getRequestInfo();

    $oldFirstName = $inData["firstName"];
    $oldLastName  = $inData["lastName"];
    $newFirstName = $inData["newFirstName"];
    $newLastName  = $inData["newLastName"];
    $phone        = $inData["phone"];
    $email        = $inData["email"];
    $userId       = $inData["userId"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $check = $conn->prepare("SELECT ID FROM Contacts WHERE FirstName = ? AND LastName = ? AND UserID = ?");
        $check->bind_param("ssi", $oldFirstName, $oldLastName, $userId);
        $check->execute();
        $result = $check->get_result();

        if ($result->num_rows == 0)
        {
            returnWithError("No matching contact found with given first and last name");
        }
        else
        {
            $stmt = $conn->prepare("UPDATE Contacts 
                                    SET FirstName = ?, LastName = ?, Phone = ?, Email = ?
                                    WHERE FirstName = ? AND LastName = ? AND UserID = ?");
            $stmt->bind_param("ssssssi", 
                $newFirstName, 
                $newLastName, 
                $phone, 
                $email, 
                $oldFirstName, 
                $oldLastName, 
                $userId
            );

            if ($stmt->execute() && $stmt->affected_rows > 0)
            {
                returnWithInfo("Contact updated successfully");
            }
            else
            {
                returnWithError("Update failed or no changes were made");
            }

            $stmt->close();
        }

        $check->close();
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
