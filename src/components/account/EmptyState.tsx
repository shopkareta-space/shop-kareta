import { LucideIcon } from "lucide-react";
import Link from "next/link";
import BlurFade from "@/components/ui/blur-fade";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <BlurFade delay={0.1} className="w-full flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-brand-gray/10 shadow-sm">
      <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-brand-gray/50" />
      </div>
      <h3 className="font-heading text-2xl font-bold text-brand-blue mb-3">{title}</h3>
      <p className="text-brand-gray mb-8 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link 
          href={actionHref}
          className="inline-flex items-center justify-center bg-[#0F6B46] hover:bg-[#148356] text-white font-semibold py-3.5 px-8 rounded-xl transition-colors shadow-sm"
        >
          {actionLabel}
        </Link>
      )}
    </BlurFade>
  );
}
