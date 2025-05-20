import { NavItem } from '../../models/navigation/nav-item.model';

export const NAV_HEADERS: NavItem[] = [
  {
    icon: 'dashboard',
    title: 'Dashboard',
    route: 'dashboard',
  },
  {
    icon: 'label',
    title: 'Kategorie',
    route: 'categories',
  },
  {
    icon: 'equalizer',
    title: 'Statystyki',
    route: 'stats',
  },
  {
    icon: 'group',
    title: 'Znajomi',
    route: 'friends',
  },
  {
    icon: 'event',
    title: 'Wydarzenia',
    route: 'events',
  },
];

export const SETTINGS_ITEM: NavItem = {
  icon: 'settings',
  title: 'Ustawienia',
  route: 'settings',
};
