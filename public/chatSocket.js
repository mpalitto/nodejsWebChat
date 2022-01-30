/**
 * Javascript handling the WebSocket client code and chat/userlist display
 * Created by Karl Brown ( TheKarlBrown ) on 6/25/15.
 */
var connection;
function onEntry(sex, name){
    // Create a new connection
    connection = new WebSocket("ws://"+location.host);
    // set onopen WebSocket action to send the login name to the Server
    console.log("newUser "+sex+"::"+name);
    connection.onopen = function (e){ connection.send("newUser::"+sex+"::"+name); };

    // Determine the type of Server message and alter the display accordingly
    connection.onmessage = function(e){
        //alert(e.data.substring(0,9));
        if (e.data.substring(0,10).localeCompare("userList::")===0){
            var UL = document.getElementById("userList")
            var newUL = e.data.substring(10);
            //alert(newUL);
            UL.innerHTML = '<font size="+2" style="display:inline-block">User List: </font>' + newUL;
        } else if (e.data.substring(0,8).localeCompare("rmUser::")===0){
            var MSG=document.getElementById("chatBox");
            var msg = "<div style='background-color:orange;display:inline-block;box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);border-radius: 5px'>" + e.data.substring(8) + " si e' DISCONNESSO</div>";
            MSG.innerHTML = MSG.innerHTML + msg + "<br>";
            overflowFix();
        } else if (e.data.substring(0,9).localeCompare("newUser::")===0){
            var MSG=document.getElementById("chatBox");
            var msg = "<div style='background-color:orange;display:inline-block;box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);border-radius: 5px'>" + e.data.substring(14) + " e' ENTRATO</div>";
            MSG.innerHTML = MSG.innerHTML + msg + "<br>";
            overflowFix();
        }else { //it must be a new message
            var MSG=document.getElementById("chatBox");
            MSG.innerHTML = MSG.innerHTML + e.data.substring(8) + "<br>";
            overflowFix();
        }
    };
}

// Send a WebSocket message to the server upon form entry and clear the form
function onSendMessage(sex, name){
  var msg = document.getElementById("usermsg").value;
      if(msg == "") alert("assicurati di inserire il testo da inviare");
      else {
        if(sex == "lui")
          msg = "newMsg::" + name + ": <div style='background-color:lightblue;display:inline-block;box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);border-radius: 5px'>" + document.getElementById("usermsg").value + "</div>";
	else
          msg = "newMsg::" + name + ": <div style='background-color:pink;display:inline-block;box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);border-radius: 5px'>" + document.getElementById("usermsg").value + "</div>";
        //alert(msg);
        connection.send(msg);
        document.getElementById("usermsg").value="";
      }
}

// Automatically indent the Chat Window
function overflowFix(){
    var element = document.getElementById("chatBox");
    element.scrollTop = element.scrollHeight;
}
