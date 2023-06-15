const CustomError = require('./../Utils/CustomError')



const devError = (res,error)=>{
    res.status(error.statusCode).json({
        status:error.statusCode,
        message:error.message,
        stackTrace:error.stack,
        error:error
    }) 
}


//error of  invalid id, etc
const castErrorHandler = (err)=>{
    const msg = `invalid value  for field ${err.path} : ${err.value}`;
  return new CustomError(msg,400);

}

//error of  duplicate movie name, etc
const duplicateErrorHandler = (err)=>{
    const msg = `there is already a movie with ${err.keyValue.name} : ${err.value}`;
  return new CustomError(msg,400);

}

const prodError = (res,error)=>{
    if(error.isOperational){
        res.status(error.statusCode).json({
            status:error.statusCode,
            message:error.message
        }) 
    }else{

        res.status(500).json({
            status:'error',
            message:"something went wrong! please try again later."
        })        
    }
 
}

module.exports = (error,req,res,next)=>{
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    
    if(process.env.NODE_ENV == "developement"){
        // console.log(req)
        devError(res,error);
    }else if(process.env.NODE_ENV == "production"){
        
        if(error.name == "CastErrpr"){
            error = castErrorHandler(error)
        }

        if(error.code == 11000){
            error = duplicateErrorHandler(error)
        }
        prodError(res,error);
    }

}