-initialize git 
-gitignore
-create a remote repo and push code
-create express server
-playing with the request handler
-Dyanamic route handler
-query parameters and params
-regex routes -> ?, + , (), * , /a/, /.*$fly/
-push code to local branch and merge


-what is middleware ?why do we need it ??


- how express js basically handles request behind the scene



- difference between app.use and app.all

-write a dummy auth for users route except user login


-write a dummy auth middleware for admin  
-Error Hander using app.use towards the end



29oct2025
Create MongoDB cluster
create database
connect application with DB
create config folder
    -create database file for connection
    -install mongoose 
call connectDb function and connect db before starting the service

create a user Schema and model
create  Post /sighnup API to add data to DB
-push some documents using API Calls
Allways add try Catch while dealing with DB


30 oct 2025

JS object vs JSON (difference)

Add the express.json middleware to your app

Make your signup API dynamic to recive data from the end user

User.findOne with duplucate email ids, which object returned - 1st object that we created with same email id will be return 

API- Get user by email 

API- Feed API GET /feed get all the users from the database

API Get user by ID 

Create a delete user API

Difference between PATCH and PUT

API- Update a user

** Explore the Mongoose Documention for Model methods

What are options in a Model.findOneAndUpdate method, explore more about it

API Update the user with email 


4/nov/2025
Video-8

-explore schema types options from the documentation
-add required , unique , lowercase , min , minlength , trim , default
-add default
-create a custom validation function for gender
-improve the DB schema- Put all appropriate validations on each field in Schema
- add timestamps to the userSchema
- Add api level validation on patch request and sighnup post api
-Data Sanitization-Add Api validation for each fields in schema
-**NOT DONE max 20skills can be add for user
-**NOT DONE email id can  not be update
- Install validator 
Use validator function for passwords ,email , photourl  and explore validator library function

--Never trust req.body/badie

5/nov/2025
Video -9
Encryption Password

Validate data in signup api
Install bcrypt
Create a password using bcrypt.hash
Save the user with password hash
Create login api
Compare password and trow errors if email or password is invalid 


6/nov/2025
Video - 10
JWT  - authentication and cookies

10/nov/2025
Video - 10
JWT  - authentication and cookies


- Install cookie parser
- just send a dummy cookie to user
- create GET/profile API and check if you get the cookie back
- install jsonwebtoken
- In login API , After email and password validation create a jwt token and send it to user
- read the cookies inside your profile API and find the logged in user
- userAuth Middleware
- add the userAuth middleware in profile API and send a new sendConnectionRequest Api
- set the expiry of JWT tokena and cookies to 7 days
- create userSchema method to getJWT()
- create userSChema method to comparePassword(passwordInput)



11 Nov 2025
Video-11 Building more APIs

-Explore Tinder API
-create a list of all api you can think of in tinder 
-group multiple routes under respective routers 
-Read documentation for express.router
-create routes folder for managing auth, profile, request routers

-create authRouter , profileRouter , requestRouter
-import these routers in app.js
-create post/logout api
-create Patch /profile/edit
-create Patch /profile/password api ->(forgot pass api)
-make sure you validatte all data in every post /patch api
-add OTP functionality in signup and forget password



13 Nov 2025
Logical DB Query and compound indexes

#Connection Request
Create a connection request Model
       -fromUserId{
      type: mongoose.Schema.Types.ObjectId
        Ref????

//create connectionrequest api
// finding object with or condition from mongodb

existingRequest= await ConnectionRequest.findOne({
$or[{fromUserId,toUserId},
{fromUserId:toUserId,toUserId:fromUserId}]
})

// handle all the edge cases for connection request
->cant send connection req to self
-> cant send 2nd time connection req
->receiver cant again send connection req
->status of connection req should be either ignored or intersed
-> we cant use arrow functions for schema methods and schema pre function
-> Use schema pre Function and always call next in the end of pre function in schema
->>> connectionRequest.pre(“save”,function(next){
Const conReq=this;
if(conReq.fromUser.equals(conReq.toUser)){
 Throw new Error(“can not send connection request to yourself”)
}
})


## indexing in database
If u are making any field unique
It will automatically make the field index
So for making a field indexed you can either write 
Unique: true or index:true

-Create connection req Schema
-Send connection Req Api
-Proper validation
-Think about all the corner cases
-Read about $or query and $and query
-schema.pre(“save”) function
-always think about all corner cases

#compound indexing
Read article about compound indexing



Read more about indexes in mongodb
Why do we need index in db
What is the advantage and disadvantages of indexes
Read the article about compound indexes of mongodb



Nov -14
Video-13
Ref Poppulate Diving into APIs


#Review Connection->Accepting and rejecting connection Api
/request/review/:status/:connectionId

////checks ->
    Validate status
    toUser of  connectionId must be the same logined user
    Status of request must be interested

Write code with proper validation for Post- /request/review/:status/:requestId


-Write  Api for userRouter
-Write Api get user/request/recieved with all the checks

### Use of ref in Schema
### populate

Const connectionRequest=await ConnectionRequest({toUserId:req.user._id,status:”interested”}).populate(“fromUserid”,[firstName,lastName])


-write api to get connection-> get  /user/connection

Const user_safe = “firstName lastName age gender about designation”

Const connections= await  ConnectionRequest.find({
$or:[{
     toUserId:loggedInUserId,
     status:”accepted”
},{

    fromUserId:loggedInUserId,
    status:”accepted”

}]

}).populate({“fromUserId”,user_safe}).populate({“toUserId”,user_safe})

Const data = connections.map((row) => {

if(loggedInUser._Id.equals(fromUserId){
            return toUserId
}
	return row.fromUserId

})








Day 14 Nov 25

Building feed Api / Pagination

userRoute.get(“/feed”) building this api 


User should not see card of all the profile who already accepted/ignored/rejected connection request
User should not see card of himself 

Approach

Get -> /user/feed

loggedInUser

connctionRequest.find({
	
$or:[

{
	fromUserId : loggedInUser._id

},

{
	toUserId : loggedInUser._id

}
]


})



connectionRequest.map((cr)=>{
set.add(cr.fromUserId)
set.add(cr.toUserId)
)


User.find({})



first we will find all the connection request which we have sent or recieved then will use a set to get all the user with whom we have a connection then we will filter out all these users from all user to get our feed users

.select("fromUserID, toUSerID")  it is used to get particular entity from the data

.populate("fromUserID, “fristName”")
.populate("toUserID, “firstName”")


const hideUserFromFeed = new Set()
connectionreq.forEach((req)=>{
hideUserFromFeed.add(req.fromUserID.toString())
hideUserFromFeed.add(req.toUserID.toString())

consoel.log(hideUserFromFeed)
res.send(connectionReq)
})

Const user = await user.find({
	
$and:[

	{	_id:{$nin: Array.from(hideUserFromFeed)}   },
//here we are not including user which have connections with loggedInUser


	{_id:{$ne: loggedInUser._id}   }

]
}).select(safe_user_data)



Homework ➕

logic for get/feed api
explore the $nin $and $ne and other queries operators


Pagination concept::

page:1 && limit:10 and .skip(0).limit(10)

skip(5) means skips five entries
limit(10) means it will give only 10 enteries

To know about page no : skip +1 to limit*page -> means 1 to 10

For page 2 && limit:30 -> skip(30).limit(30) means 31 to 60

const page = parseInt(req.query.page) || 1
const limit = parseInt(req.query.limit) || 10

skip = (page-1)*limit  => this is a formula for skipping the pages


Validate the limits and 
Limit = limit>50?50:limit







11 DEC 2025


//Steps to start with razorpay

Signup up on razorpay complete kyc 
Create a UI for payment page
Creating an api for creating an order in backend 
Add it my key in environment
Initialize razorpay in utils
Creating order in razorPay
Create a schema and model
Save the order in payment collection
Make the api dynamic 
Setup razorpay webhook on your live api
