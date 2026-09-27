import ContactEditor from "@/components/admin/contact/ContactEditor";
export default function AdminContactPage() {
  const enquiryEmail = process.env.CONTACT_ENQUIRY_EMAIL ?? process.env.COMPANIONSHIP_ENQUIRY_EMAIL ?? "cornerstonesocialcircle@gmail.com";
  return <ContactEditor enquiryEmail={enquiryEmail} />;
}
