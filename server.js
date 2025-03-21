const express = require('express')
const app = express()
const http = require('http').createServer(app)
require('dotenv').config()
const log = require('./logFile')
const getTranslate = require('./aiAgent')
const io = require('socket.io')(http)
const { lookup } = require('dns')
const { error } = require('console')
const PORT = process.env.PORT || 3000
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Translating and sending the messages
function sendMessage(msg,log){
    let index = log.findIndex(user => user.id == msg.id)
    log.forEach(user => { 
        if(user.id == msg.id){
            return;
        }
        getTranslate(user.lang,msg.message).then((result) => {
            msg.message=result
            
            io.to(user.id).emit('message', msg)  
        }); 
     });   
    }    

// Socket Connections established
io.on('connection', (socket) => {
    console.log('Connected! waiting for registration')
    
    // registering the user's id and language etc
    socket.on('register',((register)=>{
        log.push(register)
        console.log('register ho gaya',log);
        
    }))   
    
    // Receiving data  
    socket.on('message', (msg) => {
        // function that translate and send messages to user
        sendMessage(msg,log)   
    })

    // disconnection
    socket.on('disconnect',()=>{
        console.log(`Id number ${socket.id} got Disconnected...`)
        let index = log.findIndex(user=> user.id ==socket.id)
        if(index != -1) log.splice(index,1)
            console.log("know the present users are :",log)
    })

})  


http.listen(PORT, () => { 
    console.log(`Listening on port ${PORT}`)
})


 