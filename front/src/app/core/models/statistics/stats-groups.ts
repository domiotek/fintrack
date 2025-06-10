export enum StatsGroup {
  DAY = 'DAY',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export type StatsGroupsType = keyof typeof StatsGroup;

export const StatsGroupsItems: { label: string; value: StatsGroupsType }[] = [
  { label: 'Dzień', value: StatsGroup.DAY },
  { label: 'Miesiąc', value: StatsGroup.MONTH },
  { label: 'Rok', value: StatsGroup.YEAR },
];
