import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isByPassAuthRoute = createRouteMatcher(['/sign-in', '/sign-up', '/api/user-settings(.*)'])
const isRequiredAuthRoute = createRouteMatcher(['/(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth()

  if (isByPassAuthRoute(req)) {
    return NextResponse.next()
  }

  // require auth X-> redirect to sign-in page
  if (!userId && isRequiredAuthRoute(req)) {
    redirectToSignIn()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
