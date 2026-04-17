type Props = {
  total: number;
  newThis: number;
  returning: number;
};

const CustomersStatsStrip = ({ total, newThis, returning }: Props) => (
  <div className="flex items-center gap-1 flex-wrap">
    <span className="text-sm font-semibold text-foreground">{total}</span>
    <span className="text-sm text-muted-foreground">Total</span>
    <span className="text-sm text-border mx-1">·</span>
    <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
      {newThis}
    </span>
    <span className="text-sm text-muted-foreground">New this month</span>
    <span className="text-sm text-border mx-1">·</span>
    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
      {returning}
    </span>
    <span className="text-sm text-muted-foreground">Returning</span>
  </div>
);

export default CustomersStatsStrip;
