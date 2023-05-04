const express=require("express");
const {Server}=require("socket.io");
const http=require("http");
const cors=require("cors")
require("dotenv").config();
const jwt=require("jsonwebtoken");
const {connection}=require("./config/db");
const { userRoute } = require("./routes/userRoute");
const {formateMessage}=require("./utils/message");
const {userJoin,getUser}=require("./utils/user");

const app=express();
app.use(cors());
app.use(express.json());

const httpServer=http.createServer(app);
app.use("/user",userRoute)
const io=new Server(httpServer);
let boat_name="Chat App Team"
io.on("connection",(socket)=>{
    console.log("Client is connected!")
    
    socket.on("joinChat",(msg)=>{
        let decode=jwt.verify(msg,process.env.key);
        if(decode){
            let username=decode.name;
            const user=userJoin(username,socket.id,"group");
            socket.join(user.room);
            socket.emit("message",formateMessage(boat_name,"Welcome to chat app"))
            socket.broadcast.to(user.room).emit("message",formateMessage(username,`Has join the chat room`))
        }
        
    })
    socket.on("chatMessage",(msg)=>{
        const user=getUser(socket.id);
        io.to(user.room).emit("message",formateMessage(user.name,msg));
    })

    socket.on("disconnect",()=>{
        console.log("user disconnected")
    })
})
httpServer.listen(process.env.port,async()=>{
    try {
        await connection
       console.log("connected to DB");
       console.log(`Server is running at port ${process.env.port}`) 
    } catch (error) {
        console.log("error in connecting to DB");
        console.log(error);
    }
})

