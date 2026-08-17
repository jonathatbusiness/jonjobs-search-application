import Badge from "@/components/ui/Badge";

const variants = {
  applied: "brand",
  screening: "warning",
  interview: "accent",
  case: "accent",
  offer: "success",
  rejected: "danger",
  withdrawn: "default",
};

export default function ApplicationStatus({ status }) {
  return <Badge variant={variants[status] || "default"}>{status || "applied"}</Badge>;
}
