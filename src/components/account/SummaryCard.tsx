import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export function SummaryCard({ title, value, icon: Icon, description }: SummaryCardProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-brand-gray/10 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex items-start gap-4 transition-transform hover:-translate-y-1 duration-300">
      <div className="w-12 h-12 bg-brand-green/10 rounded-2xl flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-brand-green" />
      </div>
      <div>
        <p className="text-sm font-medium text-brand-gray mb-1">{title}</p>
        <p className="font-heading font-bold text-3xl text-brand-blue leading-tight mb-1">{value}</p>
        {description && (
          <p className="text-xs text-brand-gray/70">{description}</p>
        )}
      </div>
    </div>
  );
}
