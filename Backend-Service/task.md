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