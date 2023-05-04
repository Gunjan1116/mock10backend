const {Usermodel}=require("../models/userModel");

const users=[];

function userJoin(name,id,room){
  let  user={
        name,
        id,
        room
    }
    users.push(user);
    return user;
}
function getUser(id){
    return users.find(el=>el.id==id);
}
module.exports={
    userJoin,
    getUser
}