const mongoose = require('mongoose');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib')

const NotificationModel = mongoose.model('Notification');

// getting Notification by user id
let getNotificationById = (req, res) => {

    getNotificationFunction=()=>{
        return new Promise((resolve,reject)=>{
            NotificationModel.find({ 'receiverId': req.params.userId })
            .select('-__v -_id')
            .limit(10)
            .sort({createdOn: -1})
            .lean()
            .exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'NotificationController: getNotificationById', 10)
                    let apiResponse = response.generate(true, 'Failed To Find Notification Details', 500, null)
                    reject(apiResponse);
                } else if (check.isEmpty(result)) {
                    logger.info('No Notifications Found', 'NotificationController: getNotificationById')
                    let apiResponse = response.generate(true, 'No Notifications Found', 404, null)
                    reject(apiResponse);
                } else {
                    let apiResponse = response.generate(false, 'Notification details found', 200, result)
                   resolve(result)
                }
            })//end of notification model.find
        })//end of promise
    }//end of getNotifiactionFunction

        getNotificationFunction()
        .then((result) => {
            let apiResponse = response.generate(false, 'Notification details found', 200, result)
            res.send(apiResponse)
          })
          .catch((error) => {
            res.send(error)
          })         
        
    

    


}


module.exports = {

getNotification:getNotificationById

}