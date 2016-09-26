import initCallee from './callee'

window.addEventListener('load', function () {
    var received = document.getElementById('received')
    initCallee(function (message) {
        var newText = document.createTextNode(message)
        received.appendChild(newText)
    })

    document.getElementById('send').onclick = function () {
        var message = document.getElementById('message').value
        window.channel.send(message)
    }
}, false)
