import { CATEGORIES } from 'src/utils/constants';
import { CHARACTER_FILTERS, LOCATION_FILTERS, EPISODES_FILTERS } from './constants';

export type Filter = Record<
  (typeof CHARACTER_FILTERS | typeof LOCATION_FILTERS | typeof EPISODES_FILTERS)[number],
  string
>;

export interface Props {
  category: (typeof CATEGORIES)[number];
  clearData: () => void;
  setParams: (params: string) => void;
}

export interface State {
  charactersFilters: Record<(typeof CHARACTER_FILTERS)[number], string>;
  locationsFilters: Record<(typeof LOCATION_FILTERS)[number], string>;
  episodesFilters: Record<(typeof EPISODES_FILTERS)[number], string>;
}
