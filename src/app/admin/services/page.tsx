import { servicesPublicEnabled } from "@/lib/services-release";
import ServiceConsultationsAdmin from "@/components/admin/services/ServiceConsultationsAdmin";
import CurrentServicesEditor from "@/components/admin/services/CurrentServicesEditor";

export default function AdminServicesPage() {
  const publicEnabled=servicesPublicEnabled();
  return <><p className={`border-b px-5 py-3 text-sm font-medium ${publicEnabled?"border-green-200 bg-green-50 text-green-900":"border-amber-200 bg-amber-50 text-amber-900"}`}>{publicEnabled?"The public Services pages are enabled.":"The public Services pages are currently hidden. Set SERVICES_PUBLIC_ENABLED=true when they are ready to launch."}</p><CurrentServicesEditor/><ServiceConsultationsAdmin/></>;
}
