export enum StatsOperations {
  SUM = 'SUM',
  AVERAGE = 'AVERAGE',
}

export type StatsOperationType = StatsOperations;

export const StatsOparationsItems: { label: string; value: StatsOperationType }[] = [
  { label: 'Suma', value: StatsOperations.SUM },
  { label: 'Średnia', value: StatsOperations.AVERAGE },
];
