import { UnauthenticatedError } from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthenticatedError("authentication invalid");
  }

  try {
    console.log(verifyJWT(token));
    const { userId, role } = verifyJWT(token);
    req.user = { userId, role };
    next();
  } catch (err) {
    throw new UnauthenticatedError("authentication invalid");
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    console.log(roles);
    if (!roles.includes(req.user.role)) {
      throw new UnauthenticatedError("unauthorize to access this route");
    }
    next();
  };
};
