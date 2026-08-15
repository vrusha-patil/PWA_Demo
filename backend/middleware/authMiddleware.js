const jwt =require("jsonwebtoken");

const authenticateToken =(req,res,next)=>{
    try{
        const authHeader =req.headers.authorization;

        if(!authHeader)
        {
            return res.status(401).json({
                message :"You are not registered , please login first...."
            });
        }

        const parts = authHeader.split(" ");

        if(parts.length !==2 || parts[0] !== "Bearer")
        {
            return res.status(401).json({
                message:"Invalid Authorization....."
            });
        }

        const token =parts[1];
        const decoded =jwt.verify(token,process.env.JWT_SECRET);

        req.user=decoded;

        next();


    }
    catch(error)
    {
        console.error("Authentication error:",error.message);

        return res.status(401).json({
            message:"Invalid token...."
        });
    }
};

module.exports = authenticateToken;