export default class customError extends Error{
    constructor(message,statusCode=500){
        super(message)
        this.name=this.constructor.name
        this.statuscode=statusCode
        Error.captureStackTrace(this,this.constructor)
    }
}
