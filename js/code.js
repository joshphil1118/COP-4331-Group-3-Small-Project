const urlBase = 'http://cop433103.com/LAMPAPI';
const extension = 'php';
const root = document.documentElement;

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
	let button = document.getElementById("addContactButton")
	let newFirstName = document.getElementById("firstName").value;
	let newLastName = document.getElementById("lastName").value;
	let newPhone = document.getElementById("phone").value;
	let newEmail = document.getElementById("email").value;
	
	if(!validPhone(newPhone)) {
		button.innerText = "Invalid Phone";
		setTimeout(() => {
						button.innerText = "Add Contact";
					}, "2000");
		return;
	}

	if(!validEmail(newEmail)) {
		button.innerText = "Invalid Email";
		setTimeout(() => {
						button.innerText = "Add Contact";
					}, "2000");
		return;
	}
	
	let tmp = {
		firstName:newFirstName,
		lastName:newLastName,
		phone:newPhone,
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
					button.innerText = "Contact Added";

					setTimeout(() => {
						button.innerText = "Add Contact";
					}, "2000");

					["firstName", "lastName", "phone", "email"].forEach(function(element) {
						document.getElementById(element).value = "";
					});
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			button.innerText = err.message;
		}
		
}

function searchContact()
{
	let srch = document.getElementById("searchText").value;
	// const name = content.value.toUpperCase().split(' ');
	// firstName = name[0]
	// lastName = name[name.length-1]
	
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
				let jsonObject = JSON.parse( xhr.responseText );
				if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					jsonResults = jsonObject.results[i];
					contactsList += "<tr id=\"entry" + i + "\">";

					contactsList +=	"<td id=\"entryButtons" + i + "\" class=\"contactSettings\">"
					contactsList += "<button id=\"entryDelete\"" + i + " type=\"button\" class=\"edit_buttons left_button\" onclick=\"deleteContact(" + i + ");\"><i class=\"fa-solid fa-user-minus\"></i></button>";
					contactsList += "<button type=\"button\" id=\"entryEdit\"" + i + " class=\"edit_buttons\" onclick=\"startEditContact(" + i + ");\"><i class=\"fa-solid fa-user-gear\"></i></button></td>";

					contactsList += "<td id=\"editButtons" + i + "\" class=\"contactSettings\" style=\"display: none\">"
					contactsList += "<button type=\"button\" id=\"entryAccept\"" + i + " class=\"edit_buttons left_button\" onclick=\"acceptEditContact(" + i + ");\"><i class=\"fa-solid fa-check\"></i></button>";
					contactsList += "<button type=\"button\" id=\"entryCancel\"" + i + " class=\"edit_buttons\" onclick=\"cancelEditContact(" + i + ");\"><i class=\"fa-solid fa-x\"></i></button></td>";


					contactsList += "<td>" + "<span id=\"entryFirstName" + i + "\">" + jsonObject.results[i].FirstName + "</span>";
					contactsList += "<input + id=\"entryFirstNameEdit" + i + "\" type=\"text\" style=\"display: none\" class=\"contact_inputs\" placeholder=\"First Name\">" + "</td>";

					contactsList += "<td>" + "<span id=\"entryLastName" + i + "\">" + jsonObject.results[i].LastName + "</span>";
					contactsList += "<input id=\"entryLastNameEdit" + i + "\" type=\"text\" style=\"display: none\" class=\"contact_inputs\" placeholder=\"Last Name\">" + "</td>";

					contactsList += "<td>" + "<span id=\"entryPhone" + i + "\">" + jsonObject.results[i].Phone + "</span>";
					contactsList += "<input id=\"entryPhoneEdit" + i + "\" type=\"text\" style=\"display: none\" class=\"phone_field contact_inputs\" placeholder=\"Phone Name\" onkeydown=\"disallowNonNumericInput\" onkeyup=\"tableFortmatToPhone(" + i + ");\">" + "</td>";

					contactsList += "<td>" + "<span id=\"entryEmail" + i + "\">" + jsonObject.results[i].Email + "</span>";
					contactsList += "<input id=\"entryEmailEdit" + i + "\" type=\"text\" style=\"display: none\" class=\"contact_inputs\" placeholder=\"Email Name\">" + "</td>";

					contactsList += "</tr>"
				}
				
				document.getElementById("contactsFields").innerHTML = contactsList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log(err.message);
	}
	
}

function deleteContact(i) {
	let firstName = document.getElementById("entryFirstName" + i).innerText
	let lastName = document.getElementById("entryLastName" + i).innerText

	let tmp = {
		firstName:firstName,
		lastName:lastName,
		userId:userId
	};

	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/DeleteContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				// document.getElementById("contactEditResult").innerHTML = "Contact has been added";
				console.log("Contact Deleted")
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		// document.getElementById("contactEditResult").innerHTML = err.message;
		console.log(err.message)
	}

	document.getElementById("entry" + i).remove();
}

function startEditContact(i) {
	document.getElementById("entryButtons" + i).style.display = "none";
	document.getElementById("editButtons" + i).style.display = "block";

	let fields = ["entryFirstName", "entryLastName", "entryEmail", "entryPhone"];

	fields.forEach(function(field) {
		fieldContent = document.getElementById(field + i).innerText;

		document.getElementById(field + "Edit" + i).value = fieldContent;

		document.getElementById(field + i).style.display = "none";
		document.getElementById(field + "Edit" + i).style.display = "block";
	});
	
}

function cancelEditContact(i) {
	document.getElementById("entryButtons" + i).style.display = "block";
	document.getElementById("editButtons" + i).style.display = "none";

	let fields = ["entryFirstName", "entryLastName", "entryEmail", "entryPhone"];
	fields.forEach(function(field) {
		document.getElementById(field + i).style.display = "block";
		document.getElementById(field + "Edit" + i).style.display = "none";
	});
}

function acceptEditContact(i) {
	let newFirstName = document.getElementById("entryFirstName" + "Edit" + i).value;
	let newLastName = document.getElementById("entryLastName" + "Edit" + i).value;
	let newPhone = document.getElementById("entryPhone" + "Edit" + i).value;
	let newEmail = document.getElementById("entryEmail" + "Edit" + i).value;

	let originalFirstName = document.getElementById("entryFirstName" + i).innerText;
	let originalLastName = document.getElementById("entryLastName" + i).innerText;

	if(!validPhone(newPhone)) {
		console.log("Invalid Phone");
		return;
	}

	if(!validEmail(newEmail)) {
		console.log("Invalid Email");
		return;
	}

	let tmp = {
		firstName:originalFirstName,
		lastName:originalLastName,
		newFirstName:newFirstName,
		newLastName:newLastName,
		phone:newPhone,
		email:newEmail,
		userId:userId
	};

	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/EditContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				// document.getElementById("contactEditResult").innerHTML = "Contact has been added";
				console.log("Contact Edited")
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		// document.getElementById("contactEditResult").innerHTML = err.message;
		console.log(err.message)
	}

	document.getElementById("entryFirstName" + i).innerText = newFirstName;
	document.getElementById("entryLastName" + i).innerText = newLastName;
	document.getElementById("entryPhone" + i).innerText = newPhone;
	document.getElementById("entryEmail" + i).innerText = newEmail;

	let fields = ["entryFirstName", "entryLastName", "entryEmail", "entryPhone"];
	fields.forEach(function(field) {
		document.getElementById(field + i).style.display = "block";
		document.getElementById(field + "Edit" + i).style.display = "none";
	});

	document.getElementById("entryButtons" + i).style.display = "block";
	document.getElementById("editButtons" + i).style.display = "none";
}


function tableFortmatToPhone(i) {
	const field = document.getElementById("entryPhone" + "Edit" + i);
	const digits = field.value.replace(/\D/g,'').substring(0,10);
	// const digits = field.value.match(/\d$/g).substring(0,10);
    const areaCode = digits.substring(0,3);
    const prefix = digits.substring(3,6);
    const suffix = digits.substring(6,10);

    if(digits.length > 6) {field.value = `(${areaCode}) ${prefix}-${suffix}`;}
    else if(digits.length > 3) {field.value = `(${areaCode}) ${prefix}`;}
    else if(digits.length > 0) {field.value = `(${areaCode}`;}
}




window.addEventListener('load', () => {
    const phoneInput = document.querySelectorAll('.phone_field');
	phoneInput.forEach(function(element) {
		element.addEventListener('keydown', disallowNonNumericInput);
		element.addEventListener('keyup', formatToPhone);
	})
});

const disallowNonNumericInput = (evt) => {
    if (evt.ctrlKey) { return; }
    if (evt.key.length > 1) { return; }
    if (/[0-9.]/.test(evt.key)) { return; }
    evt.preventDefault();
}

const formatToPhone = (evt) => {
    const digits = evt.target.value.replace(/\D/g,'').substring(0,10);
    const areaCode = digits.substring(0,3);
    const prefix = digits.substring(3,6);
    const suffix = digits.substring(6,10);

    if(digits.length > 6) {evt.target.value = `(${areaCode}) ${prefix}-${suffix}`;}
    else if(digits.length > 3) {evt.target.value = `(${areaCode}) ${prefix}`;}
    else if(digits.length > 0) {evt.target.value = `(${areaCode}`;}

	validatePhone()
};

function validatePhone() {
	const phoneField = document.getElementById("phone");
	const phone = phoneField.value;
	// const regex = /^(\+0?1\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
	// var valid = regex.test(phone);
	
	const wrongColor = getComputedStyle(root).getPropertyValue('--wrong-color');
	const correctColor = getComputedStyle(root).getPropertyValue('--correct-color');
	
	if (validPhone(phone)) {
		console.log("PHONE VALID");
		phoneField.style.borderColor = correctColor;
	}else{
		console.log("PHONE NOT VALID");
		phoneField.style.borderColor = wrongColor;
	}
}


function validateEmail() {
	const emailField = document.getElementById("email");
	const email = emailField.value;
	// const regex = /\S+@\S+\.\S+/;
	// var valid = regex.test(email);
	
	const wrongColor = getComputedStyle(root).getPropertyValue('--wrong-color');
	const correctColor = getComputedStyle(root).getPropertyValue('--correct-color');
	
	if (validEmail(email)) {
		console.log("EMAIL VALID");
		emailField.style.borderColor = correctColor;
	}else{
		console.log("EMAIL NOT VALID");
		emailField.style.borderColor = wrongColor;
	}
}

function validPhone(phone) {
	const regex = /^(\+0?1\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
	var valid = regex.test(phone);
	return valid;
}


function validEmail(email) {
	const regex = /\S+@\S+\.\S+/;
	var valid = regex.test(email);
	return valid;
}