export interface CharacterType {
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  origin: {
    name: string;
  };
}

export interface LocationType {
  name: string;
  type: string;
  dimension: string;
}

export interface EpisodeType {
  air_date: string;
  name: string;
  episode: string;
}

export interface ResponseType {
  info: {
    pages: number;
  };
  results: CharacterType[] | LocationType[] | EpisodeType[];
}
