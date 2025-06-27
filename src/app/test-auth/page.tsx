/**
 * Authentication Test Page
 *
 * Simple page to test if Clerk authentication is working properly.
 */

"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function TestAuthPage() {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Authentication Test
        </h1>
        <p className="text-gray-600">
          Test if Clerk authentication is working properly.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Signed In:</span>
            <span
              className={`rounded px-2 py-1 text-sm ${
                isSignedIn
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isSignedIn ? "Yes" : "No"}
            </span>
          </div>

          {isSignedIn && user && (
            <>
              <div className="flex items-center gap-2">
                <span className="font-medium">User ID:</span>
                <span className="font-mono text-sm text-gray-600">
                  {userId}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Email:</span>
                <span className="text-sm text-gray-600">
                  {user.emailAddresses[0]?.emailAddress}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Name:</span>
                <span className="text-sm text-gray-600">
                  {user.firstName} {user.lastName}
                </span>
              </div>
            </>
          )}

          {!isSignedIn && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                You need to sign in to test file uploads. The upload API
                requires authentication.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button
          onClick={() => (window.location.href = "/test-upload")}
          disabled={!isSignedIn}
        >
          Go to Upload Test
        </Button>
      </div>
    </div>
  );
}
