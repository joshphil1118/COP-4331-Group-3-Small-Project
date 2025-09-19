const urlBase = 'http://cop433103.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin(event)
{

	if(event) event.preventDefault();

	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
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
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
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
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doRegister(event){
	
	if(event) event.preventDefault();

	userId = 0;

	let firstName = document.getElementById("registerFirstName").value;
    let lastName = document.getElementById("registerLastName").value;
	let login = document.getElementById("registerLogin").value;
	let password = document.getElementById("registerPassword").value;

	document.getElementById("registerResult").innerHTML = "";

	let tmp = {
		firstName: firstName,
		lastName: lastName, 
		login: login,
		password: password
	};

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try {

		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );

				if( jsonObject.error){

					document.getElementById("registerResult").innerHTML = "Registration failed: " + jsonObject.error;
					return;
				}

				userId = jsonObject.id;
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				if(userId > 0 ) {

					saveCookie();

					document.getElementById("registerResult").innerHTML = "Registration success: Login you in";

					//redirect to login page after a delay
              		setTimeout(function() {
                    	window.location.href = "contacts.html";
                	}, 2000);

				}

				else {

					document.getElementById("registerResult").innerHTML = "Registration failed: " + jsonObject.error;
				}

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
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

function changeTab(event, tabName) {
  // Get all elements with class="tabcontent" and hide them
  const tabs = document.querySelectorAll(".tabContent");
  tabs.forEach(element => {
    element.style.display = "none";
  });

  // // Get all elements with class="tablinks" and remove the class "active"
  const tablinks = document.querySelectorAll(".tablinks");
  tablinks.forEach(element => {
    element.className = element.className.replace(" activeTab", "");
  });

  // // Show the current tab, and add an "activeTab" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.className += " activeTab";
} 

function addContact()
{
	let newFirstName = document.getElementById("firstName").value;
	let newLastName = document.getElementById("lastName").value;
	let newPhoneNumber = document.getElementById("phoneNumber").value;
	let newEmail = document.getElementById("email").value;
	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {
		firstName:newFirstName,
		lastName:newLastName,
		phone:newPhoneNumber,
		email:newEmail,
		userId:userId
	};

	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

function searchContact()
{
	let srch = document.getElementById("searchText").value;
	// const name = content.value.toUpperCase().split(' ');
	// firstName = name[0]
	// lastName = name[name.length-1]

	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactsList = ""

	let tmp = {
		search:srch,
		userId:userId
	};

	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			document.getElementById("contactsFields").innerHTML = "";
			if (this.readyState == 4 && this.status == 200) 
			{
				// document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					jsonResults = jsonObject.results[i];
					contactsList += "<tr>"
					contactsList += "<td>" + jsonObject.results[i].FirstName + "</td>";
					contactsList += "<td>" + jsonObject.results[i].LastName + "</td>";
					contactsList += "<td>" + jsonObject.results[i].Phone + "</td>";
					contactsList += "<td>" + jsonObject.results[i].Email + "</td>";

					contactsList += "</tr>"
				}
				
				document.getElementById("contactsFields").innerHTML = contactsList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}