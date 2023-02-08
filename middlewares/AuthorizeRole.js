 const { request, response } = require("express");
// const verifyusers = (...allowed) => {
  module.exports= (...allowed) => {
  return (request, response, next) => {
    console.log(request.id);
    let userRole = request.role;
    let getAllowedRoles = [...allowed];

    const isvalid = getAllowedRoles.includes(userRole);
    if (!isvalid) return response.status(401).json({ message: "Not Authorized" });
    else next();
  };
};

module.exports.checkWithId=(request,response,next)=>{
  console.log(request);
  if(request.id==request.params.id)
  next()
    else
    {
        let error=new Error("Not Authorized");
        error.status=403;
        next(error)
    }
  }
