const UserRouter=require("express").Router();
const { generateToken } = require("../jwt");
const { UserModel }=require("../model/UserModel");
const bcrypt = require('bcrypt'); 


//signup API
UserRouter.post("/signup", async (req, res) => {
    if (!req.body.email) {
        return res.status(400).json({
            message: "Email is missing",
            success: "false"
        })
    }
    const matchingUser = await UserModel.findOne({ email: req.body.email })
    if (matchingUser) {
        return res.status(500).json({
            message: "ACCount already exists",
            success: "false"
        })
    }

    /* const newItem=new UserModel(req.body);
   const result=await newItem.save(); */
    const { firstName, lastName, email, password } = req.body;
    const hashpassword = await bcrypt.hash(password, 10);
    const newItem = new UserModel({ firstName: firstName, lastName: lastName, email, password: hashpassword })
    const result = await newItem.save();
    if (result && result._id) {
        return res.status(201).json({
            message: "Account created successfully",
            data: result,
            success: "true"
        })
    } else {
        return res.status(500).json({
            message: "Internal server error",
            success: "false"
        })
    }

})

//Login API
UserRouter.post("/signin", async (req, res) => {
    const EMAIL = req.body.email;
    const PASSWORD = req.body.password;
    console.log(PASSWORD)
    if (!EMAIL || !PASSWORD) {
        return res.status(500).json({
            message: "Account not exists",
            success: "false"
        })
    }
    try{
        const matchinguser = await UserModel.findOne({ email: EMAIL })
         console.log(matchinguser.email)
        if(!matchinguser){
         return res.status(404).json({
             message: "Valid User Not Found",
             success: false
         });
        }
     
         // Compare the entered password with the stored hashed password
         const isPasswordValid = bcrypt.compareSync(PASSWORD, matchinguser.password);
         console.log(isPasswordValid)
     
         if (!isPasswordValid) {
             return res.status(401).json({
                 message: "Invalid credentials",
                 success: false
             });
         }
     
         return res.status(200).json({
             message: "Sign in successful",
             success: true,
             token: generateToken({ userId: matchinguser._id })
         });
    }catch (error) {
        console.error("Error during signin:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
})
/* UserRouter.post("/signin", async (req, res) => {
    const EMAIL = req.body.email;
    const PASSWORD = req.body.password;
    console.log(EMAIL)
    if (!EMAIL && !PASSWORD) {
        return res.status(500).json({
            message: "Account not exists",
            success: "false"
        })
    }
    const matchinguser = await UserModel.findOne({ email: EMAIL })
    console.log(matchinguser)
    if (matchinguser && matchinguser._id) {
        if (PASSWORD === matchinguser.password) {
            return res.status(200).json({
                message: "sign in successful",
                success: "true",
                token: generateToken({ userId: matchinguser._id }, undefined, "1h")
            })
        } else {
            return res.status(500).json({
                message: "Bad credentials",
                success: "false"

            })
        }
    } else {
        return res.status(500).json({
            message: "Email is not valid",
            success: "false"

        })
    }

}) */
module.exports= UserRouter;
