const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncError");
const jwt = require("jsonWebToken");
//const catchAsyncErrors = require("./catchAsyncError");
const User = require("../model/user");


exports.isAuthenticated = catchAsyncErrors(async(req,res,next) =>{
    const{token} = req.cookies;


if(!token){
    return next(new ErrorHandler("please login to  continues", 401));
}
const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)

req.user = await User.findById(decoded.id);


next();
})