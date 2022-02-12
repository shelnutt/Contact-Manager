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

function search()
{
        let srch = document.getElementById("searchText").value;
        readCookie();
        console.log(userId);

       // document.getElementById("searchResults").innerHTML = "";


        let temp = {search:srch,UserId:userId};
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
                               // document.getElementById("searchResults").innerHTML = "";
                                let jsonObject = JSON.parse(xhr.responseText);

                                const contactTable = document.getElementById("table");
                                contactTable.innerHTML = "";

                                if(jsonObject.results == null)
                                {
                                        document.getElementById("searchResults").innerHTML = "No contacts returned";
                                        return;
                                }
                                else
                                {
                                        document.getElementById("searchResults").innerHTML = jsonObject.results.length + "contacts matching your search.";
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
                                                if (confirm('Are you sure you would like to remove this contact?'))
                                                {
                                                        doDelete(jsonObject.results[i].ID);
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
                document.getElementById("searchResults").innerHTML = err.message;
        }
}

function edit()
{
        readCookie();

        let firstName = document.getElementById("firstName").value;
        let lastName = document.getElementById("lastName").value;
        let email = document.getElementById("email").value;
        let phone = document.getElementById("phone").value;
        let id = document.getElementById("ID").value;

        document.getElementById("updateContactResult").innerHTML = "";

        let temp = {ID:id};
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

function doDelete(id)
{
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
                                search();
                                document.getElementById("searchResults").innerHTML = "";
                        }
                };
                xhr.send(jsonPayload);
        }
        catch(err)
        {
                document.getElementById("searchResults").innerHTML = err.message
        }
}