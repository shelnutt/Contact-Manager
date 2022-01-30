const urlBase = "http://contactman4331.xyz/LAMPAPI";
const extension = "php";


function register()
{
	
	let fName = document.getElementById("firstName").value;
	let lName = document.getElementById("lastName").value;
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;

	document.getElementById("loginResult").innerHTML = "";

	let temp = {FirstName:fName,LastName:lName,Login:login,Password:password};
	let jsonPayload = JSON.stringify(temp);

	let url = urlBase + "/Register." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}