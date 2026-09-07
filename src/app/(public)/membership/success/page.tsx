import type { Metadata } from "next";
import { redirect } from "next/navigation";
import MembershipSuccess from "@/components/public/membership/MembershipSuccess";

export const metadata: Metadata = { title: "Membership Confirmation | Cornerstone Social Circle" };

export default async function MembershipSuccessPage({ searchParams }: { searchParams: Promise<{ application_id?: string | string[] }> }) {
  const value = (await searchParams).application_id;
  const applicationId = Array.isArray(value) ? value[0] : value;
  if (!applicationId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(applicationId)) redirect("/membership");
  return <MembershipSuccess applicationId={applicationId} />;
}
