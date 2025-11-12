#DevTinder APIs


## authRouter

- Post /signup
- Post /login
- post /logout


## profileRouter

-get /profile/view
-patch /profile/edit
-patch /profile/password


## connectionRequestRouter
-post /request/send/accept/:userId
-post /requesr/send/ignored/:userId
-post /request/review/accept/:requestId
-post /request/review/decline/:requestId
-get /request/recieved


## userRouter

-get /user/connections
-get /user/requests
-get /user/feed ->get all the users

