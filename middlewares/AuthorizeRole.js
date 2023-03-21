 const { request, response } = require("express");


  module.exports.checkWithRole= (...allowed) => {
  return (request, response, next) => {
    let userRole = request.role;
    console.log("khod t3ala");
    console.log(request.role);
    let getAllowedRoles = [...allowed];

    const isvalid = getAllowedRoles.includes(userRole);
    if (!isvalid) return response.status(401).json({ message: "Not Authorized" });
    else next();
  };
};


module.exports.checkWithId = (request, response, next) => {
  
  if (request.id == request.params.id)
    next()
  else {
    let error = new Error("Not Authorized");
    error.status = 403;
    next(error)
  }
}