const express = require('express');
const issuesController=require('../controllers/issuesController')
const notificationController=require('../controllers/notificationController')
const appConfig=require('../config/appConfig')
const auth=require('../middlewares/auth')
const multer=require('../middlewares/multer')


let setRouter = (app)=> {

let baseUrl=appConfig.apiVersion+'/issues'
app.get(baseUrl+'/all',auth.isAuthorized,issuesController.getAllIssues);
//in postman specify the same name as screenshot
app.post(baseUrl+'/create',auth.isAuthorized, multer.upload.single('screenshot'),issuesController.createIssue)
app.get(baseUrl+'/view/:issueId',auth.isAuthorized,issuesController.getSingleIssue);
app.put(baseUrl+'/edit/:issueId',auth.isAuthorized,multer.upload.single('screenshot'),issuesController.editIssue);
app.post(baseUrl+'/delete/:issueId',auth.isAuthorized,issuesController.deleteIssue)
app.get(baseUrl+'/search/:description',auth.isAuthorized,issuesController.searchIssue)
app.post(baseUrl+'/addComment/:issueId',auth.isAuthorized,issuesController.addIssueComment)
app.post(baseUrl+'/addAssignee/:issueId',auth.isAuthorized,issuesController.addIssueAssignee)
app.post(baseUrl+'/addWatcher/:issueId',auth.isAuthorized,issuesController.addIssueWatcher)
app.get(baseUrl+'/notifications/:userId',auth.isAuthorized,notificationController.getNotification)
}

module.exports={
    setRouter:setRouter
}