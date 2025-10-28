

const isUserValid = (req,res,next)=>{
    const token ="abc"

    try {
        if(token=="abc"){
            next()
        }else{
            res.status(401).send("unauthorized")
        }
    } catch (error) {
        res.status(500).send("something went wrong")
    }

}

module.exports = {isUserValid}
