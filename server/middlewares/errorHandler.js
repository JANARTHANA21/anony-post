const errorHandler=(err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||'Something went wrong';
    if (statusCode===404) return res.status(400).render('404',{message,statusCode})
    res.status(statusCode).json({msg:message})
}
export default errorHandler;