const mongoose = require('mongoose')

const Schema = mongoose.Schema

let notificationSchema = new Schema({

  notificationId: { type: String, unique: true, required: true },
  issueId: { type: String, default: '' },
  message: { type: String, default: '' },
  senderName: { type: String, default: '' },
  senderId: { type: String, default: '' },
  receiverName: { type: String, default: '' },
  receiverId: { type: String, default: '' },
  viewed: { type: Boolean, default: false },
  createdOn: { type: Date, default: Date.now }

})

mongoose.model('Notification', notificationSchema)