type AiDemoBadgeProps = {
  className?: string;
};

export default function AiDemoBadge({ className = "" }: AiDemoBadgeProps) {
  return (
    <p
      className={[
        "inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900",
        className,
      ].join(" ")}
      role="status"
    >
      AI-помощник находится в демо-режиме
    </p>
  );
}
