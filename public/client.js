const socket = io()
let name=document.querySelector('#name');
let language= document.querySelector('#language');
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
let opacity = document.querySelectorAll(".opacity")
let form = document.querySelector('.form')
let register;

// connetion 
socket.on('connect', () => {
    console.log('connected with id :',socket.id);
    
})
document.querySelector(".form").addEventListener("submit", function(event) {
    event.preventDefault()
  register ={
        name:name.value,
        id:socket.id,
        lang:language.value
    }
    // registering the data
    socket.emit('register',register)

   // intial styles
    form.style.display ="none";
    opacity.forEach(user=> user.style.opacity ="1")
    
});



textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {

        sendMessage(e.target.value,register.name,register.lang,register.id)
    }
})

function sendMessage(message,name,language,id) {

    let msg = {
        user: name,
        message: message.trim(),
        lang:language,
        id:id
       
    }
    
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    socket.emit('message', msg)

} 

function appendMessage(msg, type) {

    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}

// Recieve messages 
socket.on('message', (msg) => {
    console.log('baadd wala',msg);
    
    
    appendMessage(msg, 'incoming')
    scrollToBottom()
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}






