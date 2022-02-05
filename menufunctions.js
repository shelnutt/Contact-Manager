const urlBase = "http://contactman4331.xyz/LAMPAPI";
const extension = "php";

let userId = 0;

function add()
{
	let UserId = 0;
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let email = document.getElementById("email").value;
	let phone = document.getElementById("phoneNumber").value;

	document.getElementById("addContactResult").innerHTML = "";

	let temp = {userId:UserId,FirstName:firstName,LastName:lastName,Email:email,Phone:phone};
	let jsonPayload = JSON.stringify(temp);

	let url = urlBase + "/AddContact." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if(this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);
				UserId = jsonObject.id;
				window.location.href = "menu.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("addContactResult").innerHTML = err.message;
	}
}