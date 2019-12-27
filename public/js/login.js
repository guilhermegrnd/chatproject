const login = (e)=> {
  if(e.keyCode == 13) {
    e.preventDefault()
    loginPost()
  }
}

const serialize = function (form) {
	return Array.from(new FormData(form)
		.entries())
		.reduce(function (response, current) {
			response[current[0]] = current[1];
			return response
		}, {})
};

const loginPost = () => {
  let form = document.getElementById('login-form')

	let data = serialize(form)
	data = JSON.stringify(data)
  
  let url = form.attributes.action.value
  //POST
  fetch(url,
  {
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		method: "POST",
		body: data
  })
  .then(function(res){
		return res.json(); // call the json method on the response to get JSON
	})
	.then(function (json) {
		document.getElementById('responseLogin').innerHTML = json.message
		if(json.status == "success") {
			window.location =  window.location.origin+"/body";
		} 
			
	})
}
/*
const serialize = (form) => {
	let field,l,s = [];

	if (typeof form == 'object' && form.nodeName == "FORM") {
		let len = form.elements.length;

		for (let i = 0; i < len; i++) {
			field = form.elements[i];
			if (field.name && !field.disabled && field.type != 'button' && field.type != 'file' && field.type != 'hidden' && field.type != 'reset' && field.type != 'submit') {
				if (field.type == 'select-multiple') {
					l = form.elements[i].options.length;

					for (let j = 0; j < l; j++) {
						if (field.options[j].selected) {
							s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
						}
					}
				}
				else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
					s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
				}
			}
		}
	}
	return s.join('&').replace(/%20/g, '+');
};
*/
const accountPost = () => {
	let form = document.getElementById('account-form')

	let data = serialize(form)
	data = JSON.stringify(data)
  
  let url = form.attributes.action.value
  //POST
  fetch(url,
  {
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		method: "POST",
		body: data
  })
  .then(function(res){
		console.log(res)
		return res.json(); // call the json method on the response to get JSON
	})
	.then(function (json) {
		console.log(json)
		document.getElementById('responseLogin').innerHTML = json.message
		accountShow();
	})
}
const accountShow = () => {
	if(document.getElementById("account-form").style.display == "none") {
		document.getElementById("login-form").style.display = "none"
		document.getElementById("account-form").style.display = "block"
		document.getElementById("account-show").innerHTML = "Voltar"
	} else {
		document.getElementById("login-form").style.display = "block"
		document.getElementById("account-form").style.display = "none"
		document.getElementById("account-show").innerHTML = "Criar conta"
	}	
}