// Home Page (Server Component)
// Redirects to /sign-in if user is not authenticated, otherwise renders main content

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MainContentWrapper } from "~/components/MainContentWrapper";

export default async function HomePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Render your main content (e.g., Drive dashboard)
  return <MainContentWrapper />;
}
