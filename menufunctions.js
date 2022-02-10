const urlBase = "http://contactman4331.xyz/LAMPAPI";
const extension = "php";

let userId = 0;

function add()
{
	readCookie();

	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let email = document.getElementById("email").value;
	let phone = document.getElementById("phoneNumber").value;

	document.getElementById("addContactResult").innerHTML = "";

	let temp = {FirstName:firstName,LastName:lastName,Email:email,Phone:phone,userId:userId};
	let jsonPayload = JSON.stringify(temp);

	let url = urlBase + '/AddContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if(this.readyState == 4 && this.status == 200)
			{
				document.getElementById("addContactResult").innerHTML = "Contact has been added";
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

function search()
{
	let srch = document.getElementById("searchText").value;
	readCookie();
	console.log(userId);
	document.getElementById("contactSearchResult").innerHTML = "";


	let temp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify(temp);

	let url = urlBase + '/SearchContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if(this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactSearchResult").innerHTML = "";
				let jsonObject = JSON.parse(xhr.responseText);

				const contactTable = document.getElementById("contactTable");
				contactTable.innerHTML = "";
				
				if(jsonObject.results == null)
				{
					document.getElementById("contactSearchResult").innerHTML = "No contacts returned";
					return;
				}
				else
				{
					document.getElementById("contactSearchResult").innerHTML = jsonObject.results.length + "contacts matching your search.";
				}

				for(let i=0; i<jsonObject.results.length; i++)
				{
					const item = document.createElement("tr");
					const fnameCOL = document.createElement("td");
					const lnameCOL = document.createElement("td");
					const phoneCOL = document.createElement("td");
					const emailCOL = document.createElement("td");
					const editCOL = document.createElement("td");
					const delCOL = document.createElement("td");

					fnameCOL.innerHTML = jsonObject.results[i].FirstName;
					lnameCOL.innerHTML = jsonObject.results[i].LastName;
					phoneCOL.innerHTML = jsonObject.results[i].Phone;
					emailCOL.innerHTML = jsonObject.results[i].Email;

					item.appendChild(fnameCOL);
					item.appendChild(lnameCOL);
					item.appendChild(phoneCOL);
					item.appendChild(emailCOL);

					const edit = document.createElement("a");
					edit.innerHTML = "Edit";
					edit.classList.add("btn");
					edit.classList.add("btn-primary");
					//edit.classList.add("mt-3");
					edit.setAttribute("name", jsonObject.results[i].ID)

					edit.addEventListener('click', function() {
						var params = new URLSearchParams();
  						params.append("contact", JSON.stringify(jsonObject.results[i]));

						window.location.href = "editContact.html" + params.toString();
					});

					editCOL.appendChild(edit);
					item.appendChild(editCOL);

					const del = document.createElement("a");
					del.innerHTML = "Delete";
					del.classList.add("btn");
					del.classList.add("btn-outline-danger");
					//del.classList.add("mt-3");
					del.setAttribute("name", jsonObject.results[i].ID)

					del.addEventListener('click', function() {
						if (confirm('Are you sure you would like to remove this contact? It can not be undone.'))
						{
							delete(jsonObject.results[i].ID);
						}
					});

					delCOL.appendChild(del);
					item.appendChild(delCOL);

					contactsTable.appendChild(item);
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

function edit()
{
	readCookie();

	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let email = document.getElementById("email").value;
	let phone = document.getElementById("phone").value;
	let id = document.getElementById("contactId").value;

	document.getElementById("updateContactResult").innerHTML = "";

	let temp = {FirstName:firstName,LastName:lastName,Email:email,Phone:phone,userId:userId,ID:id};
	let jsonPayload = JSON.stringify(temp);

	let url = urlBase + '/UpdateContact.' + extension;

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
				document.getElementById("updateContactResult").innerHTML = "Contact has been updated";
				window.location.href = "menu.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("updateContactResult").innerHTML = err.message;
	}	
}

function delete(id)
{
	let temp = {ID:id};
	let jsonPayload = JSON.stringify(temp);

	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if(this.readyState == 4 && this.status == 200)
			{
				search();
				document.getElementById("contactSearchResult").innerHTML = "";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message
	}
}