import { authMiddleware } from "@clerk/nextjs";
import { analytics } from "./utils/analytics";

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ["/"],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: ["/no-auth-in-this-route"],

  afterAuth(auth, req, evt) {
    if (req.nextUrl.pathname === "/") {
      try {
        analytics.track("pageview", {
          page: "/",
          country: req.geo?.country,
        });
      } catch (error) {
        console.error(error);
      }
    }
  },
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
