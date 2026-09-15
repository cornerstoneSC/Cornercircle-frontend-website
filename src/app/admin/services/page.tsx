import ServicesEditor from "@/components/admin/services/ServicesEditor";
import { servicesPublicEnabled } from "@/lib/services-release";
import ServiceConsultationsAdmin from "@/components/admin/services/ServiceConsultationsAdmin";

export default function AdminServicesPage() {
  return <><ServiceConsultationsAdmin/><ServicesEditor publicEnabled={servicesPublicEnabled()} /></>;
}
