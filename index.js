const express = require('express')
const app = express()

const mongoose = require('mongoose')
const router = require('./routes')
const { APP_PORT, DB_URL } = require('./config')

const cors = require('cors')
const cookieParser = require('cookie-parser')
const ACTIONS = require('./actions')

//#region Socket 
const server = require('http').createServer(app)

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})
//#endregion 

app.use(cookieParser())
const corsOption = {
    credentials: true,
    origin: ['http://localhost:3000']
}


//Frontend cross platform access
// app.use(cors())
app.use(cors(corsOption))

//Access the image 
app.use('/storage', express.static('storage'))


//📌Note: By default JSON in Express JS --==> ❎disable 
app.use(express.json({ limit: "5mb" })) //✅ Enable


//#region 🔗DB Connection 
mongoose.connect(DB_URL)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', () => {
    console.log('DB connected...')
})
//#endregion


//Router setup
app.use('/api', router)

const port = APP_PORT || 6000

//#region Socket Logic

const socketUserMapping = {

}

io.on('connection', (socket) => {
    console.log('new connection', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
        socketUserMapping[socket.id] = user;

        // new Map
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

        clients.forEach((clientId) => {
            io.to(clientId).emit(ACTIONS.ADD_PEER, {
                peerId: socket.id,
                createOffer: false,
                user,
            });

            socket.emit(ACTIONS.ADD_PEER, {
                peerId: clientId,
                createOffer: true,
                user: socketUserMapping[clientId],
            });
        });

        socket.join(roomId);
    });

    // Handle relay Ice
    socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
        io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
            peerId: socket.id,
            icecandidate,
        });
    });

    // Handle relay sdp ( session description )
    socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
        io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
            peerId: socket.id,
            sessionDescription,
        });
    });

    // Leaving the room

    const leaveRoom = ({ roomId }) => {
        const { rooms } = socket;

        Array.from(rooms).forEach((roomId) => {
            const clients = Array.from(
                io.sockets.adapter.rooms.get(roomId) || []
            );

            clients.forEach((clientId) => {
                io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
                    peerId: socket.id,
                    userId: socketUserMapping[socket.id]?.id,
                });

                socket.emit(ACTIONS.REMOVE_PEER, {
                    peerId: clientId,
                    userId: socketUserMapping[clientId]?.id,
                });
            });

            socket.leave(roomId);
        });

        delete socketUserMapping[socket.id];
    };
    socket.on(ACTIONS.LEAVE, leaveRoom);
    socket.on('disconnecting', leaveRoom);
});


//#endregion
server.listen(port, () => console.log(`Listining on port ${port}`))