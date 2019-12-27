let chatUser = null;
let myId = document.getElementById("my_id").innerHTML;
let myName = document.getElementById("my_name").innerHTML;
const socket = io(window.location.origin,{query:{name:myName,id:myId}});
socket.on('chatmessage',(data)=>{
  let myId = document.getElementById("my_id").innerHTML;
  if(data.toId == myId) {
    if(data.fromId == chatUser) {
      let date = new Date()
      let hour = date.getHours()
      hour = hour < 10 ? "0"+hour : hour;
      let min = date.getMinutes()
      min = min < 10 ? "0"+min : min;
      let time = hour+":"+min
      messageBox(true,'',data.message,time)
    } else {
      //POR ALERTA
      document.getElementById("alert_"+data.fromId).style.display = "block"
    }
  }
});
socket.on('userlogged',(data)=>{
  getUsersConnected()
});
(()=>{
  
})()
const getUsersConnected = () => {
	try {
		let data = {} 
		data = JSON.stringify(data)
		let url = window.location.origin+'/chat/getusers'
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
			//console.log(res)
			return res.json(); // call the json method on the response to get JSON
		})
		.then(function (json) {
			let myId = document.getElementById("my_id").innerHTML;
			if(json.length > 0) {
				json.forEach((value, index)=> {
				  if(value.userId != myId) {
				  	userBox(value)
				  }
				});
			}
		})
	} catch(err) {
		console.log(err.message)
	}		
}
function userBox(props) {
	try	{
		if(!document.getElementById('user_'+props.userId)){
			let image = 'img/default-profile-icon.jpg';
			let status = ''
			if(props.status == 'offline') status = 'offline'
			let li = ''
			li += '<li class="contactbox" id="user_'+props.userId+'" onclick="javascript:openChat(\''+props.userId+'\',\''+props.socketId+'\',\''+props.userName+'\',\''+image+'\')">'
				li += '<div class="d-flex">'
					li += '<div class="img_cont">'
						li += '<img src="'+image+'" class="user_img">'
						li += '<span class="online_icon '+status+'"></span>'
					li += '</div>'
					li += '<div class="user_info">'
						li += '<span>'+props.userName+'</span>'
						li += '<p>ID: '+props.userId+'</p>'
					li += '</div>'
					li += '<div id="alert_'+props.userId+'" style="display:none;height: 15px;width: 15px;box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);transform: scale(1);animation: pulse 2s infinite;background-color:red;border-radius:50%;"></div>'
				li += '</div>'
			li += '</li>'
			let element = document.getElementById("users-connected")
			element.innerHTML += li
		}
	} catch(err) {
		console.log(err.message)
	}
}
function openChat(userId,userSocketId,userName,userImage) {
	try	{
		chatUser = userId;
		document.getElementById("chat-room").style.display = "block"
		document.getElementById("user_id").innerHTML = userId
		document.getElementById("user_name").innerHTML = userName
		document.getElementById("user_socketid").innerHTML = userSocketId
		document.getElementById("user_image").src = userImage
		document.getElementById("alert_"+userId).style.display = "none"
		document.getElementById("chat-message-list").innerHTML = '<ul class="msg_card_body" id="chat-user-'+userId+'"></ul>'
		document.getElementById("message-sent").disabled = false
		document.getElementById("message-sent").value = ""
		document.getElementById("message-sent").focus()

		let props = {userId:userId}
		loadMessages(props)
	} catch(err) {
		console.log(err.message)
	}
}
function loadMessages(props)
{
	try	{
		let myId = document.getElementById("my_id").innerHTML;
		userId = props.userId

		data = {
			fromId : myId,
			toId : userId
		};
		data = JSON.stringify(data)

		let url = window.location.origin+'/chat/getmessages'
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
			if(json.status == "success") {
				for (let i = json.data.length - 1; i >= 0; i--) {
					let row = json.data[i]
					let incoming = false
					if(row.toId == myId) incoming = true
					let image = ''
					let message = row.message
					let time = row.time
					messageBox(incoming,image,message,time)
				}
			}
		})
	} catch(err) {
		console.log(err.message)
	}
}
function messageBox(incoming,image,message,time) {
  try {
	  let li = '';
	  if(incoming) {
	    li += '<div class="msg_box_left">';
	      li += '<div class="msg_container">';
	        li += message;
	        li += '<span class="msg_time">'+time+'</span>';
	      li += '</div>';
	    li += '</div>';
	  }
	  else
	  {
	    li += '<div class="msg_box_right">';
	      li += '<div class="msg_container_send">';
	        li += message;
	        li += '<span class="msg_time_send">'+time+'</span>';
	      li += '</div>';
	    li += '</div>';
	  }
	  let userId = document.getElementById("user_id").innerHTML
	  let element = document.getElementById("chat-user-"+userId)
	  element.innerHTML += li

		element.scrollTop = element.scrollHeight;
  } catch(err) {
		console.log(err.message)
	}
}
function eventMessage(e,message) {
	try {
	  if (e.keyCode == 13) {
			sendMessage(message)	    
	  }
	} catch(err) {
		console.log(err.message)
	}
}
function sendMessage(message) {
	try {
		if (message != '') {
			let date = new Date()
	    let hour = date.getHours()
	    hour = hour < 10 ? "0"+hour : hour;
	    let min = date.getMinutes()
	    min = min < 10 ? "0"+min : min;
	    let time = hour+":"+min
	    messageBox(false,"",message,time)

	    let userId = document.getElementById("user_id").innerHTML
	    let userName = document.getElementById("user_name").innerHTML
	    let userSocketId = document.getElementById("user_socketid").innerHTML
	    let chatId = "chat-user-"+userId

	    let data = {
	      chatId : chatId,
	      userId : userId,
	      socketId : userSocketId,
	      time : time,
	      message : message
	    };
	    socket.emit('chatmessage',data)

	    document.getElementById("message-sent").value = ""
	    document.getElementById("message-sent").focus()
		}
	} catch(err) {
		console.log(err.message)
	}
}
function closeChat() {
	try {
	  document.getElementById("chat-message-list").innerHTML = ''
	  document.getElementById("chat-room").style.display = 'none'
	  chatUser = null
	} catch(err) {
		console.log(err.message)
	}
}