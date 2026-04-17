type Props = {
  total: number;
  active: number;
  pending: number;
};

const StaffStatsStrip = ({ total, active, pending }: Props) => (
  <div className="flex items-center gap-1 flex-wrap">
    <span className="text-sm font-semibold text-foreground">{total}</span>
    <span className="text-sm text-muted-foreground">Total</span>
    <span className="text-sm text-border mx-1">·</span>
    <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
      {active}
    </span>
    <span className="text-sm text-muted-foreground">Active</span>
    {pending > 0 && (
      <>
        <span className="text-sm text-border mx-1">·</span>
        <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
          {pending}
        </span>
        <span className="text-sm text-muted-foreground">Pending invite</span>
      </>
    )}
  </div>
);

export default StaffStatsStrip;
