const express = require('express');
const mongoose=require('mongoose')
const shortId=require('shortid')

const IssueModel=mongoose.model('Issue')
const response=require('../libs/responseLib')
const time=require('../libs/timeLib')
const check=require('../libs/checkLib')
const logger=require('../libs/loggerLib')


let createIssue = (req, res) => {

   let issueCreationFunction = () => {
       return new Promise((resolve, reject) => {
           console.log(req.body)
           if (check.isEmpty(req.body.title) || check.isEmpty(req.body.description) || check.isEmpty(req.body.status) || check.isEmpty(req.body.reporter)||check.isEmpty(req.file.path)) {

               console.log("403, forbidden request");
               let apiResponse = response.generate(true, 'required parameters are missing', 403, null)
               reject(apiResponse)
           } else {

            console.log(req.file);

            issueId=shortId.generate();
            let reporter= (req.body.reporter != undefined && req.body.reporter != null && req.body.reporter != '') ? req.body.reporter.split(',') : []
            let assignee= (req.body.assignee != undefined && req.body.assignee != null && req.body.assignee != '') ? req.body.assignee.split(',') : []
            
            
            let newIssue=new IssueModel({
             
             issueId:issueId,
              title:req.body.title,
              description:req.body.description,
              status:req.body.status,
              reporter:reporter,
              assignee:assignee,
              uploads:req.file.path,
              reportedOn:time.now()
            })
           
            
             newIssue.save((err, result) => {
                    if (err) {
                        console.log('Error Occured.')
                        logger.error(`Error Occured : ${err}`, 'Database', 10)
                        let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                        reject(apiResponse)
                    } else {
                        console.log('Success in blog creation')
                        resolve(result)
                    }
                }) // end new issue save
            }
        }) // end new issue promise
    } // end create issue function
   // making promise call.
  issueCreationFunction()
       .then((result) => {
           let apiResponse = response.generate(false, 'Issue Created successfully', 200, result)
           res.send(apiResponse)
       })
       .catch((error) => {
           console.log(error)
           res.send(error)
       })
      }//end of create issue function


   
let getAllIssues=(req,res)=>{

   let getAllIssueFunction = () =>{
      return new Promise((resolve, reject) => {
         IssueModel.find()
         .select('-__v -_id ')
         .lean()
         .exec((err,result)=>{
            if(err){
               console.log(err);
               logger.error(err.message,'issueController:getAllIssues',10)
               let apiResponse=response.generate(true,'Failed to find an issue',500,null)
               reject(apiResponse)

            }else if(check.isEmpty(result)){
               logger.info('No Issues Found','issueController:getAllIssues')
               let apiResponse=response.generate(true,'No issues found',404,null)
               reject(apiResponse)

            }else {
               logger.info('All issues found','issueController:getAllIssues',5)
               let apiResponse=response.generate(false,'All issues found',200,result)
               resolve(result)
            }
         })

         })//End of promise

}//end of getAllIssueFunction

getAllIssueFunction()
.then((result) => {
   let apiResponse = response.generate(false, 'All Issues Listed', 200, result)
   res.send(apiResponse)
 })
 .catch((error) => {
   res.send(error)
 })



} //end of getAllIssues

let getSingleIssue=(req,res)=>{

   let getSingleIssueFunction = () =>{
      return new Promise((resolve, reject) => {
         IssueModel.findOne({'issueId':req.params.issueId},(err,result)=>{
            if(err){
      
               console.log(err);
               logger.error(`error occured:${err}`,'database',10)
               let apiResponse=response.generate(true,'Failed to find the issue',500,null)
               reject(apiResponse)
      
            }else if(check.isEmpty(result)){
      
               let apiResponse=response.generate(true,'The issue not  found',404,null)
               reject(apiResponse)
      
            }else {
               let apiResponse=response.generate(false,'The issue is  found',200,result)
               resolve(result)
            }
         })//end of finding issuemodel
         })//End of promise
      }//end of getSingleIssueFunction
         getSingleIssueFunction()
         .then((result) => {
            let apiResponse = response.generate(false, 'The issue details found', 200, result)
            res.send(apiResponse)
          })
          .catch((error) => {
            res.send(error)
          })                   
}//end of getSingleIssue

let editIssue=(req,res)=>{

let editIssueFunction=() => {
   return new Promise((resolve,reject)=>{
      let options=req.body;
      options.uploads = req.file.path
      console.log(options);
   
      IssueModel.update({'issueId':req.params.issueId},options,{multi:true}).exec((err,result)=>{
   
         if(err){
            console.log(err);
            let apiResponse=response.generate(true,'Failed to edit the issue',500,null)
         reject(apiResponse);
         }else {
              
            let apiResponse=response.generate(false,'Issue edited successfully',200,result)
         resolve(result)
         }
   })//end of issuemodel.update
   
   })//end of promise
}//end of editIssueFunction

editIssueFunction()
.then((result) => {
   let apiResponse = response.generate(false, 'The issue edited successfully', 200, result)
   res.send(apiResponse)
 })
 .catch((error) => {
   res.send(error)
 })                
   
}//end of editIssue

let deleteIssue=(req,res)=>{

   let deleteIssueFunction=()=>{
      return new Promise((resolve,reject)=>{

         IssueModel.remove({'issueId':req.params.issueId},(err,result)=>{
            if(err){
               let apiResponse=response.generate(true,'Failed to delete the issue',500,null)
               reject(apiResponse);
            }else if(check.isEmpty(result)) {
                     console.log('No issues found')
                     let apiResponse=response.generate(true,'No issues deleted',404,null)
                     reject(apiResponse);
                 } else {
                  let apiResponse=response.generate(false,'Issue deleted successfully',200,result)
                 resolve(result)
                 }
         })//end of issuemodel.delete
      })//end of promise
   }//end of deleteIssueFunction
      deleteIssueFunction()
      .then((result) => {
         let apiResponse = response.generate(false, 'The issue deleted successfully', 200, result)
         res.send(apiResponse)
       })
       .catch((error) => {
         res.send(error)
       })                
   }//end of deleteIssue

  


let searchIssue = (req, res) => {

   let searchIssueFunction=()=>{

      return new Promise((resolve,reject)=>{

         IssueModel.count().exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'IssueController: getAllIssue', 10)
                let apiResponse = response.generate(true, 'Failed To Find Issue Details', 500, null)
                reject(apiResponse);
            } else {
                let count = result
                let text = req.params.description
                regex = new RegExp(text);
     
                IssueModel.find({$or: [{ "description": { $regex: regex, $options: 'i'}},  {"title": { $regex: regex, $options: 'i'}}, {"status": { $regex: regex, $options: 'i'}} ]})
                    .select(' -__v -_id')
                    .lean()
                    .exec((err, result) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'IssueController: getAllIssues', 10)
                            let apiResponse = response.generate(true, 'Failed To Find Issue Details', 500, null)
                            reject(apiResponse);
                        } else if (check.isEmpty(result)) {
                            logger.info('No Issue Found', 'IssueController: getAllIssues')
                            let apiResponse = response.generate(true, 'No Issue Found', 404, null)
                            reject(apiResponse);
                        } else {
                            let apiResponse = response.generate(false, 'All Issues Found', 200, result);
                            apiResponse.count = count
                            resolve(result)
                        }
                    })
            }
        })//end of issueModel.find
      })//end of promise
   }//end of searchIssueFunction
  searchIssueFunction()
  .then((result) => {
   let apiResponse = response.generate(false, 'The issue found successfully', 200, result)
   res.send(apiResponse)
 })
 .catch((error) => {
   res.send(error)
 })                


}//end of search issue
let addIssueComment = (req, res) => {

   addIssueCommentFunction=()=>{
      return new Promise((resolve,reject)=>{
         let options = { $push: { comments: req.body.comments } }
         IssueModel.update({ 'issueId': req.params.issueId }, options).exec((err, result) => {
             if (err) {
                 console.log(err)
                 logger.error(err.message, 'issueController: Database error', 10)
                 let apiResponse = response.generate(true, 'Failed To Posted comment', 500, null)
                 reject(apiResponse);
             } else {
                 let apiResponse = response.generate(false, 'Successfully Posted comment', 200, null)
                 resolve(result)
             }
         });// end issue model update
      
      })//end of promise
   }//end of addIssueCommentFunction

   addIssueCommentFunction()
   .then((result) => {
      let apiResponse = response.generate(false, 'posted comment successfully', 200, result)
      res.send(apiResponse)
    })
    .catch((error) => {
      res.send(error)
    })                
}//end of addIssueComment

let addIssueAssignee = (req, res) => {
   addIssueAssigneeFunction=()=>{
      return new Promise((resolve,reject)=>{
  let options = { $set: { assignee: req.body.assignee } }
   IssueModel.update({ 'issueId': req.params.issueId }, options).exec((err, result) => {
      if (err) {
          console.log(err)
          logger.error(err.message, 'issueController: Database error', 10)
          let apiResponse = response.generate(true, 'Failed to add Assignee', 500, null)
          reject(apiResponse);
      } else {
          let apiResponse = response.generate(false, 'Successfully Added Assignee', 200, null)
          resolve(result)
      }
  });// end issue model update
})//end of promise
   }//end of addIssueAssigneeFunction

addIssueAssigneeFunction()
.then((result) => {
   let apiResponse = response.generate(false, 'Added Assignee successfully', 200, result)
   res.send(apiResponse)
 })
 .catch((error) => {
   res.send(error)
 })            


}//end of addIssueAssignee

let addIssueWatcher = (req, res) => {
   addIssueWatcherFunction=()=>{
      return new Promise((resolve,reject)=>{
  let options = { $push: { watcher: req.body.watcher } }
   IssueModel.update({ 'issueId': req.params.issueId }, options).exec((err, result) => {
      if (err) {
          console.log(err)
          logger.error(err.message, 'issueController: Database error', 10)
          let apiResponse = response.generate(true, 'Failed to add Watcher', 500, null)
          reject(apiResponse);
      } else {
          let apiResponse = response.generate(false, 'Successfully Added Watcher', 200, null)
         resolve(result)
      }
  });// end issue model update
})//end of promise
   }//end of addIssueWatcherFunction

addIssueWatcherFunction()
.then((result) => {
   let apiResponse = response.generate(false, 'Added Watcher successfully', 200, result)
   res.send(apiResponse)
 })
 .catch((error) => {
   res.send(error)
 })            

 

}//end of addIssueWatcher

   module.exports = {

     getAllIssues:getAllIssues,
     getSingleIssue:getSingleIssue,
     createIssue:createIssue,
     editIssue:editIssue,
     deleteIssue:deleteIssue,
     searchIssue:searchIssue,
     addIssueComment:addIssueComment,
     addIssueAssignee:addIssueAssignee,
     addIssueWatcher:addIssueWatcher
     

}
