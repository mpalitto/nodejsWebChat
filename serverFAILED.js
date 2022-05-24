const Fs = require('fs');
const Https = require('https');
const WebSocketServer = require('ws').Server;
const ejs = require('ejs');


    
// //HTTP server
const express = require('express');
// const PORT = process.env.PORT || 80;

// //servi i file statici nella cartella 'public' (https://expressjs.com/en/starter/static-files.html)
const app = express();
// const server = app.use(express.static('public'))
// .listen(PORT, () => console.log(`Listening on ${PORT}`));

// //gestisci pagine dinamiche con ejs (https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application)
app.use(express.static('public'));
app.set('view engine', 'ejs')
app.get('/ChatClient', function(req, res) {
  console.log("userName: "+req.query.name+" sex: "+req.query.sex);
  res.render('ChatClient',{sex: req.query.sex, name: req.query.name});
});

const options = {
  key: Fs.readFileSync('key.pem', 'utf8'),
  cert: Fs.readFileSync('cert.pem', 'utf8')
}

const httpsServer = Https.createServer(options, app);
httpsServer.listen(80);

const wss = new WebSocketServer({
  server: httpsServer
});

// httpsServer.on('request', (req, res) => {
//   res.writeHead(200);
//   res.end('hello HTTPS world\n');
// });


// //Websocket Server
// const { Server } = require('ws');

// const wss = new Server({ server });
// //const wss = new WebSocket.Server({ port: PORT })

wss.on('connection', (ws) => {
  // console.log('clients:');
  // console.dir(wss.clients);
  // console.log('WS:');
  // console.dir(ws);

  ws.on('close', function close() {
    //console.log('disconnected');
    wss.clients.forEach(function each(client) {
      client.send("rmUser::"+ws.name);
  });
});

  ws.on('message', (message) => {
    //console.log(`Received message => ${message}`);

    if(message.substring(0,9) == "newUser::") { //nuovo utente entra nella chat aggiorna la lista degli utenti
      ws.name = message.substring(14); //aggiungi
      ws.sex  = message.substring(9,12);
      //console.log(ws.name+' '+ws.sex);
      //send updated user list to each user
      message = "userList::";
      wss.clients.forEach(function each(client) {
        message += '<div style="display:inline-block"><img src="/img_'+client.sex+'.png" alt="Avatar" height="30" width="30">'+client.name+'</div>'
      });
    } 
    wss.clients.forEach(function each(client) {
        client.send(message);
    });
  })
})
