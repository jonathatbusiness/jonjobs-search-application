import Badge from "@/components/ui/Badge";

export default function JobBadges({ job, limit = 3 }) {
  const badges = [job.workplace_type, job.seniority, job.employment_type].filter(Boolean).slice(0, limit);

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <Badge key={badge} variant="brand">
          {badge}
        </Badge>
      ))}
    </div>
  );
}
