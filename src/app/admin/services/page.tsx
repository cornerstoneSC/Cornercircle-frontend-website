import ServicesEditor from "@/components/admin/services/ServicesEditor";
import { servicesPublicEnabled } from "@/lib/services-release";

export default function AdminServicesPage() {
  return <ServicesEditor publicEnabled={servicesPublicEnabled()} />;
}
