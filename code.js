const urlBase = 'http://contactman4331.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
        userId = 0;
        firstName = "";
        lastName = "";

        let login = document.getElementById("loginName").value;
        let password = document.getElementById("loginPassword").value;
//      var hash = md5( password );

        document.getElementById("loginResult").innerHTML = "";

        let tmp = {login:login,password:password};
//      var tmp = {login:login,password:hash};
        let jsonPayload = JSON.stringify( tmp );

        let url = urlBase + '/Login.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                xhr.onreadystatechange = function()
                {
                        if (this.readyState == 4 && this.status == 200)
                        {
                                let jsonObject = JSON.parse( xhr.responseText );
                                userId = jsonObject.id;

                                if( userId < 1 )
                                {
                                        document.getElementById("loginResult").innerHTML = "Invalid user/password entered";
                                        return;
                                }

                                firstName = jsonObject.firstName;
                                lastName = jsonObject.lastName;

                                saveCookie();

                                window.location.href = "menu.html";
                        }
                };
                xhr.send(jsonPayload);
        }
        catch(err)
        {
                document.getElementById("loginResult").innerHTML = err.message;
        }

}

function displayAll()
{

        document.getElementById("tableResult").innerHTML = userId;
        let tmp = {UserId:userId};

        let jsonPayload = JSON.stringify( tmp );
        let url = urlBase + '/DisplayContacts.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                xhr.onreadystatechange = function()
                {
                        if (this.readyState == 4 && this.status == 200)
                        {
                                let jsonObject = JSON.parse( xhr.responseText );
                                                                var mydata = JSON.stringify(jsonObject);
                                                                // document.getElementById("tableResult").innerHTML = mydata;
                                                                if(jsonObject == null)
                                {
                                        document.getElementById("tableResult").innerHTML = "No contacts returned";
                                        return;
                                }
                                else
                                {
                                        document.getElementById("tableResult").innerHTML = jsonObject.length + " contacts matching your search.";
                                }
                                                                $('#table').bootstrapTable('load', jsonObject);


                        }
                };
                xhr.send(jsonPayload);
        }
        catch(err)
        {
                document.getElementById("displayContactsResult").innerHTML = err.message;
        }
}

function saveCookie()
{
        let minutes = 20;
        let date = new Date();
        date.setTime(date.getTime()+(minutes*60*1000));
        document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
        userId = -1;
        let data = document.cookie;
        let splits = data.split(",");
        for(var i = 0; i < splits.length; i++)
        {
                let thisOne = splits[i].trim();
                let tokens = thisOne.split("=");
                if( tokens[0] == "firstName" )
                {
                        firstName = tokens[1];
                }
                else if( tokens[0] == "lastName" )
                {
                        lastName = tokens[1];
                }
                else if( tokens[0] == "userId" )
                {
                        userId = parseInt( tokens[1].trim() );
                }
        }

        if( userId < 0 )
        {
                window.location.href = "index.html";
        }
        else
        {
                //document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
        }
}

function doLogout()
{
        userId = 0;
        firstName = "";
        lastName = "";
        document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "index.html";
}

function add()
{
        readCookie();

        let firstName = document.getElementById("firstName").value;
        let lastName = document.getElementById("lastName").value;
        let email = document.getElementById("email").value;
        let phone = document.getElementById("phoneNumber").value;

        document.getElementById("addContactResult").innerHTML = "";

        let temp = {UserId:userId,FirstName:firstName,LastName:lastName,Email:email,Phone:phone};
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

function doSearch()
{
        let srch = document.getElementById("searchText").value;
        readCookie();
        console.log(userId);

        document.getElementById("searchResults").innerHTML = "";


        let temp = {UserId:userId,search:srch};
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
                                let jsonObject = JSON.parse( xhr.responseText );
                                var mydata = JSON.stringify(jsonObject);
                                // document.getElementById("tableResult").innerHTML = mydata;
                                if(jsonObject == null)
                                {
                                        document.getElementById("searchResults").innerHTML = "No contacts returned";
                                        return;
                                }
                                else
                                {
                                        document.getElementById("searchResults").innerHTML = jsonObject.length + " contacts matching your search.";
                                }
                                $('#table').bootstrapTable('load', jsonObject);

                        }
                };
                xhr.send(jsonPayload);
        }
        catch(err)
        {
                document.getElementById("searchResults").innerHTML = err.message;
        }
}

function edit()
{
        readCookie();

        let selectedObject = $("#table").bootstrapTable('getSelections');
	let jsonString = JSON.stringify(selectedObject);
	jsonString = jsonString.replace('[{','{');
	jsonString = jsonString.replace('}]','}');
		// document.getElementById("tableResult").innerHTML = jsonString;
		
	selectedObject = JSON.parse(jsonString);
	let id = selectedObject.ID;
        let firstName = selectedObject.FirstName;
        let lastName = selectedObject.LastName
        let email = selectedObject.Email
        let phone = selectedObject.Phone

        document.getElementById("updateContactResult").innerHTML = "";

        let temp = {ID:id,UserId:userId,FirstName:firstName,LastName:lastName,Phone:phone,Email:email};
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
                                //let jsonObject = JSON.parse(xhr.responseText);
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

function doDelete()
{
        let selectedObject = $("#table").bootstrapTable('getSelections');
		let jsonString = JSON.stringify(selectedObject);
		jsonString = jsonString.replace('[{','{');
		jsonString = jsonString.replace('}]','}');
		// document.getElementById("tableResult").innerHTML = jsonString;
		
		selectedObject = JSON.parse(jsonString);
		let id = selectedObject.ID;
		// document.getElementById("tableResult").innerHTML = id;
		
		let temp = {ID:id,UserId:userId};
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
                                //let jsonObject = JSON.parse( xhr.responseText );
								document.getElementById("searchResults").innerHTML = "Contact deleted from list";
								$('#table').bootstrapTable('load', jsonObject);
								displayAll();
                        }
                };
                xhr.send(jsonPayload);
        }
        catch(err)
        {
                document.getElementById("searchResults").innerHTML = err.message
        }
}

function populateEditModal()
{
let selectedObject = $("#table").bootstrapTable('getSelections');
        let jsonString = JSON.stringify(selectedObject);
        jsonString = jsonString.replace('[{','{');
        jsonString = jsonString.replace('}]','}');
let obj = JSON.parse(jsonString);

let First = obj.FirstName;
let Last = obj.LastName;
let Email = obj.Email;
let Phone = obj.Phone;
let id = obj.ID;
};