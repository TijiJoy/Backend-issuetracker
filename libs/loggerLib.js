const logger=require('pino')()
const moment=require('moment')

let captureError =(errorMessage,errorOrigin,errorLevel)=>{
    let currentTime=moment()
    let errorResponse={
        timeStamp:currentTime,
        errorMessage:errorMessage,
        errorOrigin:errorOrigin,
        errorLevel:errorLevel
    }
    logger.error(errorResponse)
    return errorResponse
}//end of captureError

let captureInformation=(message,origin,importance)=>{
    let currentTime=moment()
    let infoMessage={
        timeStamp:currentTime,
        message:message,
        origin:origin,
        level:importance
    }

    logger.info(infoMessage)
    return infoMessage
}//end of captureInfromation

module.exports={
    error:captureError,
    info:captureInformation
}