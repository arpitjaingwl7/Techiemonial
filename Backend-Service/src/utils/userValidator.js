const validator = require("validator")

const userValidator = (req) => {


    const { email, password, firstName, lastName } = req.body;

    if (!validator.isEmail(email)) {
        throw new Error("Invalid email")
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error("Enter Strong password")
    }

    if (firstName.length < 4 || lastName.length < 3) {
        throw new Error("Enter correct name")
    }


}


const profileUpdateValidator = (req) => {

    const isEditAllowed = ["firstName", "LastName", "age", "designation", "gender", "photoUrl", "about", "skills"]
    
    Object.keys(req.body).forEach((key)=>{
        console.log("error is thorwn for key")
        if(!isEditAllowed.includes(key)){
            throw new Error("Editing "+key+" is not allowed")
        }
    })



}

module.exports = {
    userValidator,
    profileUpdateValidator
}