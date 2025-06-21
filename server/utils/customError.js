export default class customError extends Error{
    constructor(message,statuscode=500){
        super(message)
        this.name=this.constructor.name
        this.statuscode=statuscode
        Error.captureStackTrace(this,this.constructor)
    }
}