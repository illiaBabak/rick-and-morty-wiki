import { CharacterType, LocationType, EpisodeType } from 'src/types/dataTypes';
import { CATEGORIES } from 'src/utils/constants';

export interface Data {
  charactersData: {
    characters: CharacterType[];
    page: number;
    maxPages: number;
  };
  locationsData: {
    locations: LocationType[];
    page: number;
    maxPages: number;
  };
  episodesData: {
    episodes: EpisodeType[];
    page: number;
    maxPages: number;
  };
}

export interface State extends Data {
  category: (typeof CATEGORIES)[number];
  isLoading: boolean;
  params: string;
  hasFilters: boolean;
}
