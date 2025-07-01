import { SignIn } from "@clerk/nextjs";

/**
 * Sign In Page
 * Renders the Clerk SignIn component for user authentication.
 */
export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignIn />
    </div>
  );
}
