


const { Server } = require("socket.io");
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

                socket.on("sendMesage",({firstName,userId,targetUserId,newMessage})=>{
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