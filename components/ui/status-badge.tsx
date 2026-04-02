import type { ArtworkStatus } from '@/types/artwork';

interface StatusBadgeProps {
  status: ArtworkStatus;
}

const statusMap = {
  available: { label: 'Disponibile', className: 'bg-success/10 text-success' },
  reserved: { label: 'Prenotata', className: 'bg-accent-light text-accent' },
  sold: { label: 'Venduta', className: 'bg-text-secondary/10 text-text-secondary' }
} as const;

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusMap[status];
  return (
    <span className={`rounded-full px-3 py-1 text-xs ${config.className}`}>
      {config.label}
    </span>
  );
}
