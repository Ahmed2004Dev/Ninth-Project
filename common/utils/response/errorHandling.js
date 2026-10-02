
// Handling Error
   export const golbalErrorHandling = ((error, req, res, next) => {
        const status = error?.cause?.status ?? 500;
        return res.status(status).json({ massage: error.massage || "Somthing went error", stack: error.stack })
    })
 
    export const ErrorEcxeption = ({message="Fail" , status=400 , extra=undefined})=>{
        throw new Error(message , {cause:{status , extra}})
    }