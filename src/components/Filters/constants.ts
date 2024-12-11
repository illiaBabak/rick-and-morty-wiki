export const CHARACTER_FILTERS = ['name', 'status', 'species', 'type', 'gender'] as const;
export const LOCATION_FILTERS = ['name', 'type', 'dimension'] as const;
export const EPISODES_FILTERS = ['name', 'episode'] as const;

export const CHARACTER_GENDER_OPTIONS = ['Unselected', 'Male', 'Female', 'unknown', 'Genderless'] as const;
export const CHARACTER_STATUS_OPTIONS = ['Unselected', 'Alive', 'Dead', 'unknown'] as const;

export const FILTERS_DEFAULT_VAL = {
  characterFilters: {
    name: '',
    status: 'Unselected',
    species: '',
    type: '',
    gender: 'Unselected',
  },
  locationFilters: {
    name: '',
    type: '',
    dimension: '',
  },
  episodeFilters: {
    name: '',
    episode: '',
  },
};
