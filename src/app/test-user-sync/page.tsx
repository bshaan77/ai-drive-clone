/**
 * Test User Sync Page
 *
 * Debug page to sync user data and test user search functionality
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { User, RefreshCw, Search, Users } from "lucide-react";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  clerkId: string;
  createdAt: string;
}

export default function TestUserSyncPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users");
      const data = (await response.json()) as {
        success: boolean;
        users?: User[];
        error?: string;
      };

      if (response.ok && data.success) {
        setUsers(data.users ?? []);
      } else {
        console.error("Failed to fetch users:", data.error);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const syncCurrentUser = async () => {
    try {
      setSyncing(true);
      const response = await fetch("/api/users/sync", {
        method: "POST",
      });
      const data = (await response.json()) as {
        success: boolean;
        message?: string;
        user?: User;
        error?: string;
      };

      if (response.ok && data.success) {
        console.log("User synced successfully:", data.user);
        await fetchUsers(); // Refresh the user list
      } else {
        console.error("Failed to sync user:", data.error);
      }
    } catch (error) {
      console.error("Error syncing user:", error);
    } finally {
      setSyncing(false);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(searchQuery)}`,
      );
      const data = (await response.json()) as {
        users?: User[];
        error?: string;
      };

      if (response.ok) {
        setSearchResults(data.users ?? []);
      } else {
        console.error("Search failed:", data.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          User Sync Test
        </h1>
        <p className="text-gray-600">
          Test user synchronization and search functionality. This page helps
          debug user data issues.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Sync Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Sync Current User
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Click the button below to sync your current user data from Clerk
              to the database.
            </p>
            <Button
              onClick={syncCurrentUser}
              disabled={syncing}
              className="w-full"
            >
              {syncing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Sync My User Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* User List Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Users ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={fetchUsers}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh User List
                </>
              )}
            </Button>

            {users.length > 0 && (
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-lg border border-gray-200 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.email}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {users.length === 0 && !loading && (
              <p className="text-center text-gray-500">No users found</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Search Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Test User Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search for users:</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter email, first name, or last name..."
                className="flex-1"
              />
              <Button
                onClick={searchUsers}
                disabled={loading || !searchQuery.trim()}
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">
                Search Results ({searchResults.length})
              </h4>
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="rounded-lg border border-blue-200 bg-blue-50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.email}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchQuery && searchResults.length === 0 && !loading && (
            <p className="text-center text-gray-500">
              No users found matching your search
            </p>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 rounded-lg bg-blue-50 p-4">
        <h3 className="mb-2 font-medium text-blue-900">Instructions:</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div>
            1. Click &quot;Sync My User Data&quot; to update your user record
          </div>
          <div>
            2. Click &quot;Refresh User List&quot; to see all users in the
            database
          </div>
          <div>3. Use the search to test user search functionality</div>
          <div>
            4. Check that users have proper email, first name, and last name
          </div>
          <div>
            5. If search returns no results, make sure users exist and have
            proper data
          </div>
        </div>
      </div>
    </div>
  );
}
