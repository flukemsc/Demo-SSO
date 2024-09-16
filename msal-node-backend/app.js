// Import the required libraries
const express = require("express");
const passport = require("passport");
const morgan = require("morgan");
// Import the passport Azure AD library
const BearerStrategy = require("passport-azure-ad").BearerStrategy;

// Set the Azure AD B2C options
const options = {
  identityMetadata: `https://login.microsoftonline.com/2ac7cab9-b269-480e-84ed-2ee3b14d3045/v2.0/.well-known/openid-configuration`,
  clientID: "568810be-3d32-4d95-8236-04ec52c9baac",
  isB2C: false,
  issuer:
    "https://login.microsoftonline.com/2ac7cab9-b269-480e-84ed-2ee3b14d3045/v2.0",
  validateIssuer: true,
  loggingLevel: "info",
  passReqToCallback: false,
};

// Instantiate the passport Azure AD library with the Azure AD B2C options
const bearerStrategy = new BearerStrategy(options, (token, done) => {
  // Send user info using the second argument
  done(null, {}, token);
});

// Use the required libraries
const app = express();
app.use(morgan("dev"));

app.use(passport.initialize());

passport.use(bearerStrategy);

//enable CORS (for testing only -remove in production/deployment)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.get("/public", (req, res) => res.send({ date: new Date() }));
app.get(
  "/hello",
  passport.authenticate("oauth-bearer", { session: false }),
  (req, res) => {
    console.log("Validated claims: ", req.authInfo);

    // Service relies on the name claim.
    const roles = req.authInfo["roles"];
    if (roles && roles.includes("Admin")) {
      res.status(200).json({ name: req.authInfo["name"], role: "Admin" });
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  }
);
const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log("Listening on port " + port);
});
