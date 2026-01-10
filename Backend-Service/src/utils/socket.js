


const { Server } = require("socket.io");
const { Chat } = require("../models/chat.js");
const initializeSocket = (server) => {
 
    const io=new Server(server, {
        cors:{
            origin:"http://localhost:5173", }})



    io.on("connection",(socket)=>{
                console.log("New client connected",socket.id);



                // event  
                socket.on("joinChat",({userId,targetUserId})=>{
                    const room = [userId, targetUserId].sort().join("_");

                    
                    socket.join(room);


                })

                socket.on("sendMesage",async({firstName,userId,targetUserId,newMessage})=>{
                  
                    // save message to database


                  try{

                    let chat=await Chat.findOne({
                        participants:{$all:[userId,targetUserId]}
                    })
                     if(!chat){

                        chat=new Chat({
                            participants:[userId,targetUserId],
                            messages:[]
                        })


                     }
                        chat.messages.push({
                            firstName,
                            senderId:userId,
                            text:newMessage
                        })
                        await chat.save();
                      

                  }
                    catch(err){     

                        console.error("Error in sendMessage event:", err);
                    }

                    
                    // console.log(firstName)
                    const roomId = [userId, targetUserId].sort().join("_");
                   console.log("Message received on server:",firstName+": "+ newMessage);
                    io.to(roomId).emit("receive_message",{
                        firstName,
                        userId,
                        targetUserId,
                        newMessage
                    });
                })
                socket.on("disconnect",()=>{
                    console.log("Client disconnected",socket.id);
                })             
     })

}
module.exports={initializeSocket};