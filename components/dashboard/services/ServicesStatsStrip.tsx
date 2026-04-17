type Props = {
  total: number;
  active: number;
  inactive: number;
};

const ServicesStatsStrip = ({ total, active, inactive }: Props) => (
  <div className="flex items-center gap-1 flex-wrap">
    <span className="text-sm font-semibold text-foreground">{total}</span>
    <span className="text-sm text-muted-foreground">Total</span>
    <span className="text-border text-sm mx-1">·</span>
    <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
      {active}
    </span>
    <span className="text-sm text-muted-foreground">Active</span>
    <span className="text-border text-sm mx-1">·</span>
    <span className="text-sm font-semibold text-muted-foreground">
      {inactive}
    </span>
    <span className="text-sm text-muted-foreground">Inactive</span>
  </div>
);

export default ServicesStatsStrip;
