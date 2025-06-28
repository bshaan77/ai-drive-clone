/**
 * Test Share Dialog Page
 *
 * Demonstrates the ShareDialog component functionality
 */

"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { ShareDialog } from "~/components/file-display/ShareDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function TestSharePage() {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareResult, setShareResult] = useState<string | null>(null);

  const handleShare = async (data: {
    users: Array<{ id: string; permission: "view" | "edit" }>;
    createPublicLink: boolean;
    publicPermission: "view" | "edit";
  }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = {
      users: data.users,
      publicLink: data.createPublicLink
        ? { url: `https://example.com/share/abc123` }
        : undefined,
      publicPermission: data.publicPermission,
    };

    setShareResult(JSON.stringify(result, null, 2));
    console.log("Share data:", result);

    // Return the result for the ShareDialog to use
    return result;
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Share Dialog Test
        </h1>
        <p className="text-gray-600">
          Test the ShareDialog component with different scenarios
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>
              Open the share dialog with different configurations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setIsShareDialogOpen(true)}
              className="w-full"
            >
              Open Share Dialog
            </Button>

            <div className="text-sm text-gray-600">
              <p>• Test user search (type an email)</p>
              <p>• Test permission selection</p>
              <p>• Test public link creation</p>
              <p>• Test form validation</p>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Share Results</CardTitle>
            <CardDescription>
              Data returned from the share dialog
            </CardDescription>
          </CardHeader>
          <CardContent>
            {shareResult ? (
              <pre className="max-h-64 overflow-auto rounded bg-gray-100 p-3 text-xs">
                {shareResult}
              </pre>
            ) : (
              <p className="text-sm text-gray-500">
                No share data yet. Open the dialog and submit to see results.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        onShare={handleShare}
        itemName="example-document.pdf"
        itemType="file"
        itemId="550e8400-e29b-41d4-a716-446655440000"
        currentShares={[
          {
            user: {
              id: "1",
              email: "john@example.com",
              firstName: "John",
              lastName: "Doe",
            },
            permission: "view",
          },
          {
            user: {
              id: "2",
              email: "jane@example.com",
              firstName: "Jane",
              lastName: "Smith",
            },
            permission: "edit",
          },
        ]}
      />
    </div>
  );
}
