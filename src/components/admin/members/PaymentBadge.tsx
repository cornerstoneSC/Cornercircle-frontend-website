import type { PaymentStatus } from "@/services/members-admin.service";

const labels: Record<PaymentStatus, string> = {
  PAID: "Paid",
  PENDING: "Pending",
  FAILED: "Failed",
  REFUNDED: "Refunded",
  EXPIRED: "Expired",
};

export default function PaymentBadge({ status }: { status: PaymentStatus }) {
  return <span className={`member-payment member-payment--${status.toLowerCase()}`}>{labels[status]}</span>;
}
