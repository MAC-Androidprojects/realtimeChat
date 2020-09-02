const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema({
    username : {
        required:true,
        type:String
    },
    message : {  
        required:true,
        type:String  
    },
    time : {
        type:Date,
        required:true
    }
})
module.exports = mongoose.model('Chat' , chatSchema)