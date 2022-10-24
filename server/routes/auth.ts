import express from "express";
import { auth, requiresAuth } from "express-openid-connect";

const router = express.Router();

if (
  process.env.AUTH0_SECRET &&
  process.env.AUTH0_BASE_URL &&
  process.env.AUTH0_CLIENT_ID &&
  process.env.AUTH0_ISSUER_BASE_URL
) {
  router.use(
    auth({
      authRequired: false,
      auth0Logout: true,
      secret: process.env.AUTH0_SECRET,
      baseURL: process.env.AUTH0_BASE_URL,
      clientID: process.env.AUTH0_CLIENT_ID,
      issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    })
  );

  router.get("/logout", (_, res) => {
    res.oidc.logout({ returnTo: "/" });
  });

  router.all(
    "*",
    requiresAuth(
      (req) =>
        !req.oidc.isAuthenticated() &&
        !["/api", "/logout"].some((path) => req.path.startsWith(path))
    )
  );
}

export default router;
