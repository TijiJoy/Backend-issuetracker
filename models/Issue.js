const mongoose=require('mongoose');
const Schema=mongoose.Schema;
let issueSchema=new Schema({


issueId:{
     type:String,
     unique:true
},
title:{
    type:String,
    default:''
},
description:{
    type:String,
    default:''
},
status:{
    type:String,
    default:''
},
reporter: [],
assignee:[],
watcher:[],
uploads:[],
comments:[],
reportedOn :{
    type:Date,
    default:''
  },
  modifiedOn:{
    type:Date,
    default:''
  }
})

mongoose.model('Issue',issueSchema)