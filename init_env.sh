#!/usr/bin/env bash
FILENAME="app/client/env.js"

[[ $NODE_ENV = development ]] && IP="localhost" || a="webrtc-simple-chat.herokuapp.com"

touch $FILENAME

echo "module.exports = {websocketURL: 'ws://$IP:$PORT/', enableDebug: true}" > $FILENAME
