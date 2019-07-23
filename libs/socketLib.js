const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const tokenLib = require("./tokenLib.js");
const NotificationModel = mongoose.model('Notification')


let setServer = (server) => {

    let io = socketio.listen(server);

    let myIo = io.of('/')

    myIo.on('connection', (socket) => {

        console.log("on connection--emitting verify user");

        socket.emit("verifyUser", "");

        // code to verify the user and make him online

        socket.on('set-user', (authToken) => {

            console.log("set-user called")
            tokenLib.verifyClaimWithoutSecret(authToken, (err, user) => {
                if (err) {
                    socket.emit('auth-error', { status: 500, error: 'Please provide correct auth token' })
                }
                else {

                    console.log("user is verified..setting details");
                    let currentUser = user.data;
                    // setting socket user id 
                    socket.userId = currentUser.userId
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    let key = currentUser.userId
                    let value = fullName

                    let setUserOnline = redisLib.setANewOnlineUserInHash("onlineUsers", key, value, (err, result) => {
                        if (err) {
                            console.log(`some error occurred`)
                        } else {
                            // getting online users list.

                            redisLib.getAllUsersInAHash('onlineUsers', (err, result) => {
                                console.log(`--- inside getAllUsersInAHas function ---`)
                                if (err) {
                                    console.log(err)
                                } else {

                                    console.log(`${fullName} is online`);
                                    // setting room name
                                    socket.room = 'edChat'
                                    // joining chat-group room.
                                    socket.join(socket.room)
                                    socket.to(socket.room).broadcast.emit('online-user-list', result);


                                }
                            })
                        }
                    })



                    // let userObj = {userId:currentUser.userId,fullName:fullName}
                    // allOnlineUsers.push(userObj)
                    // console.log(allOnlineUsers)




                }


            })

        }) // end of listening set-user event


        socket.on('disconnect', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel

            console.log("user is disconnected");
            // console.log(socket.connectorName);
            console.log(socket.userId);


            // var removeIndex = allOnlineUsers.map(function (user) { return user.userId; }).indexOf(socket.userId);
            // allOnlineUsers.splice(removeIndex, 1)
            // console.log(allOnlineUsers)
            
            if (socket.userId) {
                redisLib.deleteUserFromHash('onlineUsers', socket.userId)
                redisLib.getAllUsersInAHash('onlineUsers', (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.leave(socket.room)
                        socket.to(socket.room).broadcast.emit('online-user-list', result);


                    }
                })
            }

}) // end of on disconnect



        //on notify event
        socket.on('notification', (data) => {

            data['notificationId'] = shortid.generate()

            // event to save chat.
            setTimeout(function () {
                eventEmitter.emit('save-notify', data);

            }, 2000)
            myIo.emit(data.receiverId, data)

        });//end of notify evnent




        // //on task event
        // socket.on('task-notify', (data) => {

        //     data['notifyId'] = shortid.generate()
        //     // event to save chat.
        //     setTimeout(function () {
        //         eventEmitter.emit('save-notify', data);

        //     }, 2000)

        //     socket.room = 'edChat'
        //     // joining chat-group room.
        //     socket.join(socket.room)
        //     socket.to(socket.room).broadcast.emit('task-changes', data)

        // })


    });//end of task event

}


// database operations are kept outside of socket.io code.

// saving Notifys to database.
eventEmitter.on('save-notify', (data) => {

    // let today = Date.now();

    let newNotify = new NotificationModel({

        notifyId: data.notifyId,
        senderName: data.senderName,
        senderId: data.senderId,
        receiverName: data.receiverName || '',
        receiverId: data.receiverId || '',
        issueId: data.issueId,
        message: data.message,
        createdOn: data.createdOn

    });

    newNotify.save((err, result) => {
        if (err) {
            console.log(`error occurred: ${err}`);
        }
        else if (result == undefined || result == null || result == "") {
            console.log("Notify Is Not Saved.");
        }
        else {
            console.log("Notify Saved.");
        }
    });

}); // end of saving chat.



module.exports = {
    setServer: setServer
}