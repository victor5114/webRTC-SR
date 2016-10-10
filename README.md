[![Build Status](https://travis-ci.com/victor5114/webRTC-SR.svg?token=RHiLFghDsxncnKfiWtQ8&branch=master)](https://travis-ci.com/victor5114/webRTC-SR)

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)


# WebRTC simple chat

This is a simple Peer-to-peer chat application using WebRTC. I made an extensive use of WebSocket for the signaling protocol of WebRTC but also to allow peers to trade relevant information regarding available PeerIDs and Peers connected in the application.
It's my first project with WebRTC and I must say it's such a promising piece of technologies ! I plan to maintain this application in order to catch up with future improvement and release of WebRTC API. I hope you'll enjoy it

## Tech stack
* Node.js
* WebSocket
* WebRTC
* React
* Webpack
* Gulp

## Install and Setup
### Prerequisite
I assume you already have a node.js environment set up locally. I personally use [NVM](https://github.com/creationix/nvm) to make sure I can switch easily
from one Node environment to another.

### Environment
#### Development
The application has been built under Node `v4.3` + NPM `v3.10.2`

1. Pull the repository.
2. Run `npm install`. This will install the development dependencies.
3. Client/Server
4. - Server : Run `npm run dev-server`. You can find client scripts in the `app/client` folder
   - Client : Run `npm run dev-client`. (In this case, you need to run the server as we are using cross app communication via Websocket). You can find server scripts in the `app/server` folder
5. A webpack server with hot reloading will start on [http://127.0.0.1:8888/webpack-dev-server/](http://127.0.0.1:8888/webpack-dev-server/)
6. Start developing both on client or server

> Starting several browsers with chrome/firebug console opened is highly recommended.

#### Build
Ideally, we would have to deploy artefact of the application (client/server) on the production server (I'll try to add an automatic deployment pipelin later on). For this reason you need to run `npm run build` that will build static files to serve by server (no proxy) and compile babel files to proper ES6 version supported by node V4.3 at least.

#### Testing

For now, only server environment is ready for tests. I'll try add client side testing environment. Probably use of JSDOM and Protractor for that matter

1. Run `npm run test`. This will start server tests with gulp

## Deployment
This is a task in TODO list. However we can check that files generated locally has been correclty bundled.
After running the build command, you can run `npm run start` that will start the server and serve the `app/client-dist` folder where client files now remain. Then go on [http://localhost:8089](http://localhost:8089) and see if the application loads nominally

## Implementation & Technical choices

1. Server : I added flag property to the exchanged message in order to benefit of already existing signaling socket to pass some extra information.  Also the data can be whether broadcast or simply sent back like a classic request/response. Nothing too fancy basically.
2. Client : The application logic is much more sophisticated though harder to get used to. However I've tried to wrap the different pieces of logic related to the WebSocket/WebRTC connections into different files so it can be better unit tested later on. I kept the caller/callee files that are responsible of triggering peers connection.

### Peer connection
This is how peer connection is made along the application lifecycle

1. When a 1st user load the application, he's been asked to enter a pseudo which will be used as unique PeerID across the app. User cannot choose a pseudo that is already taken by other peer.
2. After validation, the user enters the main interface. If peers are already connected to the app, their peerID will appear on the left side list otherwise. Under the hood a connection will be opened straight away by using Caller method, even if user didn't require any connection with peers. As all messages have been exchanged by Websocket, this process should be pretty quick (depending on network). Then at the end, the Callee method will be called in order to expose the user to future connection with new incomers. Each connection will end up by peers receiving channel that is safely stored to be reused later on.
3. Now that all connection are done with all peers, the user can decide to chat with someone by clicking on the pencil button. Then it will simply open a chat window in which users will be able to send the data across the channel that has been opened and stored in the previous step

## To go further

1. Problems of this architecture : Each client needs to open and maintain a connection with each peer he wants to connect to. In our case it automatically connects with all peers when application starts. If we get "N" Peers connected, we need to open "N - 1" new connection/channel for a new peer joining the chat application.
2. Solution: Even if stream between peers supports high-bandwidth data, connecting with all peers at once could be simply resolved by only connecting with peers we want to chat with. As we didn't implemented any broadcast message system, we can just connect one peer by one peer. It would slow down a bit the connection process but it would dramatically reduce number of simultaneous connection on the signaling server.


## Todos

 - Hanldle continuous delivery by adding script to update client/server environment
 - Write more tests
 - Fix UI bugs (ChatWindow scroll, responsivness)
 - Fix bugs on peers disconnection on the client side
