const { decodeToken } = require("../jwt-utils");

const adminStrategy = (authData) => {
  const { roles } = authData;
  return roles && roles === "admin";
};

const customerStrategy = (authData) => {
  const isAdmin = adminStrategy(authData);
  if (isAdmin) return true;
  const { roles } = authData;
  return roles && roles === "customer";
};

const authStrategies = {
  admin: adminStrategy,
  customer: customerStrategy,
};

function authorize(requiredRoles = ["customer"]) {
  function authorizeMiddleware(req, res, next) {
    try {
      const encoded = req.get("Authorization");
      const decoded = decodeToken(encoded);
      if (!decoded || !decoded.roles) {
        return res.status(401).json({
          errorMessage: "You don't have permission to access this resource",
        });
      }

      for (const role of requiredRoles) {
        if (authStrategies[role](decoded)) {
          req.account = decoded;
          return next();
        }
      }

      return res.status(401).json({
        errorMessage: "You don't have permission to access this resource",
      });
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        errorMessage: "You don't have permission to access this resource",
        action: "login",
      });
    }
  }
  return authorizeMiddleware;
}

module.exports = authorize;
