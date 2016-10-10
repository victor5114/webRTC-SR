#!/usr/bin/env bash
FILENAME="app/client/env.js"

[[ $NODE_ENV = development ]] && IP="localhost" || IP="webrtc-simple-chat.herokuapp.com"

touch $FILENAME

echo "module.exports = {websocketURL: 'wss://$IP:$PORT/', enableDebug: true}" > $FILENAME
