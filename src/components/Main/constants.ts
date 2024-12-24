import { State } from './types';

export const OBSERVER_OPTIONS = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5,
};

export const DEFAULT_CONTENT_DATA = {
  charactersData: {
    characters: [],
    page: 0,
    maxPages: 1,
  },
  locationsData: {
    locations: [],
    page: 0,
    maxPages: 1,
  },
  episodesData: {
    episodes: [],
    page: 0,
    maxPages: 1,
  },
};

export const MAIN_STATE_DEFAULT_VAL: State = {
  category: 'Characters',
  isLoading: false,
  params: '',
  ...DEFAULT_CONTENT_DATA,
};
