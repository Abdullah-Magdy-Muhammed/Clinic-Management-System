const jwt = require("jsonwebtoken");

exports.login= (request, response, next) => {
  console.log("kda kda ht7sl");
  // console.log(request);
  // console.log(request.get("authorization").split(" ")[1]);
  try {
    let token = request.get("authorization").split(" ")[1];
    let decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    request.id=decodedToken.id;
    request.role = decodedToken.role;
    console.log(decodedToken.role);
  } catch (error) {
    error.status = 403;
    error.message = "Not Authorized";
    next(error);
  }
  next();
};

