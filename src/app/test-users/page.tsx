/**
 * Test Users Page
 *
 * Debug page to view all users in the database
 */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { User, RefreshCw } from "lucide-react";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  clerkId: string;
  createdAt: string;
}

export default function TestUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/users");
      const data = (await response.json()) as {
        success: boolean;
        users?: User[];
        error?: string;
      };

      if (response.ok && data.success) {
        setUsers(data.users ?? []);
      } else {
        setError(data.error ?? "Failed to fetch users");
      }
    } catch {
      setError("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Database Users</h1>
        </div>
        <p className="text-gray-600">
          All users currently in your database. This helps debug user search
          functionality.
        </p>
        <Button onClick={() => void fetchUsers()} className="mt-4 gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {users.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No users found
            </h3>
            <p className="text-gray-600">
              There are no users in your database yet. This is why user search
              returns no results.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Found {users.length} user{users.length !== 1 ? "s" : ""} in database
          </div>
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-lg">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : "No name set"}
                    </div>
                    <div className="text-sm font-normal text-gray-500">
                      {user.email}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                  <div>
                    <span className="font-medium text-gray-600">User ID:</span>
                    <code className="ml-2 rounded bg-gray-100 px-2 py-1 text-xs">
                      {user.id}
                    </code>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Clerk ID:</span>
                    <code className="ml-2 rounded bg-gray-100 px-2 py-1 text-xs">
                      {user.clerkId}
                    </code>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      First Name:
                    </span>
                    <span className="ml-2">{user.firstName ?? "Not set"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Last Name:
                    </span>
                    <span className="ml-2">{user.lastName ?? "Not set"}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-600">Created:</span>
                    <span className="ml-2">
                      {new Date(user.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-lg bg-blue-50 p-4">
        <h3 className="mb-2 font-medium text-blue-900">Debug Information:</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div>• This page shows all users in your database</div>
          <div>• User search will only work if users exist here</div>
          <div>• Users are created when they first sign in via Clerk</div>
          <div>
            • If no users appear, try signing in with a different account
          </div>
          <div>• Check that your Clerk webhook is properly configured</div>
        </div>
      </div>
    </div>
  );
}
