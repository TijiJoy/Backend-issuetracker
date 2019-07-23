const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync('./screenshot/')) {
        fs.mkdirSync('./screenshot/');
      }
      cb(null, './screenshot/');
    },
    filename: (req, file, cb) => {
      console.log(file);
      var filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, 'image-' + Date.now() +file.originalname);
    }
});

const fileFilter = (req,res,cb)=>{
//to reject a file
if(file.mimetype==='image/jpeg'||file.mimetype==='image/png'){
  cb(null,true)
}else{
  cb(null.false);
}


}
const upload=multer({
  storage:storage,
  //limits:{
  //fileSize:1024*1024*5
//},
//fileFilter:fileFilter
});

module.exports = {
     upload:upload                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
}
