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

API Update the user with email ID