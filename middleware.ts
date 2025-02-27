import { authMiddleware, clerkMiddleware } from "@clerk/nextjs/server";



export default authMiddleware({
  publicRoutes:["/", "/api/webhooks/stripe"],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};