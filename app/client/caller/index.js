import initCaller from './caller'

window.addEventListener('load', function () {
    var received = document.getElementById('received')

    initCaller((message) => {
        var newText = document.createTextNode(message)
        received.appendChild(newText)
    })

    document.getElementById('send').onclick = function () {
        var message = document.getElementById('message').value
        window.channel.send(message)
    }

    document.getElementById('start').onclick = function () {
        window.startCommunication(2)
    }
}, false)
