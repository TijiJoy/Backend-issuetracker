let appConfig={};
let nodeMailer = {};
appConfig.port = 3000;
appConfig.allowedCorsOrigin="*";
appConfig.env="dev";
appConfig.db={
uri:'mongodb://127.0.0.1:27017/issueTrackerDB'
}
appConfig.apiVersion="/api/v1"
nodeMailer.email="";
nodeMailer.password = "";
module.exports={

    port:appConfig.port,
    allowedCorsOrigin:appConfig.allowedCorsOrigin,
    env:appConfig.env,
    db:appConfig.db,
    apiVersion:appConfig.apiVersion,
    email: nodeMailer.email,
    password: nodeMailer.password
}//end module exports