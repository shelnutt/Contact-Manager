<?php
	$inData = getRequestInfo();

	$userId = $inData["userId"];
	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$Email = $inData["Email"];
	$Phone = $inData["Phone"];
	$today = date("Y-m-d H:i:s"); 
	$DateCreated = $today;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); //does this need to change based on logged in user?
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (UserId,FirstName,LastName,Email,Phone,DateCreated) VALUES(?,?,?,?,?,?)");
		$stmt->bind_param("ssssss", $userId, $FirstName, $LastName, $Email, $Phone, $DateCreated);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
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
	
?>
