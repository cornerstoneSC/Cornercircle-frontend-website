import MembershipPage from "@/components/public/membership/MembershipPage";
import { defaultMembershipContent } from "@/lib/membership-content";
import { getMembershipContent } from "@/services/membership-page.service";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership | Cornerstone Social Circle",
  description:
    "Join Cornerstone Social Circle and discover intentional gatherings, genuine friendships, and a welcoming community.",
};

export default async function MembershipRoute() {
  const content = await getMembershipContent().catch(() => defaultMembershipContent);
  return <MembershipPage content={content} />;
}
