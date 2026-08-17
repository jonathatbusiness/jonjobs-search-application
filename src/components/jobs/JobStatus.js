import Badge from "@/components/ui/Badge";

const variants = {
  new: "brand",
  viewed: "default",
  discarded: "danger",
  applied: "success",
  screening: "warning",
  interview: "accent",
  case: "accent",
  offer: "success",
  rejected: "danger",
  withdrawn: "default",
};

export default function JobStatus({ status }) {
  if (!status) return null;
  const label = status.replaceAll("_", " ");
  return <Badge variant={variants[status] || "default"}>{label}</Badge>;
}
