const mongoose=require("mongoose");

const messageSchema=mongoose.Schema({
    name:String,
    text:String,
    time:String
})

const Messagemodel=mongoose.model("message",messageSchema);

module.exports={
    Messagemodel
}