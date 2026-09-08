import type { Metadata } from "next";
import ContactPage from "@/components/public/contact/ContactPage";
import { getContactContent } from "@/services/contact-page.service";

export const metadata: Metadata = {
  title: "Contact | Cornerstone Social Circle",
  description:
    "Get in touch with Cornerstone Social Circle about events, membership, or companionship services.",
};

export default async function ContactRoute() {
  const content = await getContactContent().catch(() => undefined);
  return (
    <ContactPage
      enquiryEmail={
        process.env.CONTACT_ENQUIRY_EMAIL ??
        process.env.COMPANIONSHIP_ENQUIRY_EMAIL ??
        "cornerstonesocialcircle@gmail.com"
      }
      content={content}
    />
  );
}
