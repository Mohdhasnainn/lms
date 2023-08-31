import jwt from "jsonwebtoken";
const JWT_SECRET = "Thisisasecretkey";

const verifyToken = (req, res, next) => {
  const token = req.header("token");
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user.user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};


const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};


const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

function localVariables(req, res, next){
  req.app.locals = {
      OTP : null,
      resetSession : false
  }
  next()
}

export { verifyToken, verifyTokenAndAdmin, localVariables, verifyTokenAndAuthorization };

