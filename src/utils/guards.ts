import { CharacterType, EpisodeType, LocationType, ListResponse } from 'src/types/dataTypes';

const isNumber = (data: unknown): data is number => typeof data === 'number';

const isString = (data: unknown): data is string => typeof data === 'string';

const isObj = (data: unknown): data is object => !!data && typeof data === 'object';

const isCharacter = (data: unknown): data is CharacterType =>
  isObj(data) &&
  'name' in data &&
  'status' in data &&
  'species' in data &&
  'gender' in data &&
  'image' in data &&
  'origin' in data &&
  isString(data.name) &&
  isString(data.status) &&
  isString(data.species) &&
  isString(data.gender) &&
  isString(data.image) &&
  isObj(data.origin) &&
  'name' in data.origin &&
  isString(data.origin.name);

export const isCharacterArr = (data: unknown): data is CharacterType[] =>
  Array.isArray(data) && data.every((el) => isCharacter(el));

const isLocation = (data: unknown): data is LocationType =>
  isObj(data) &&
  'name' in data &&
  'type' in data &&
  'dimension' in data &&
  isString(data.dimension) &&
  isString(data.name) &&
  isString(data.type);

export const isLocationArr = (data: unknown): data is LocationType[] =>
  Array.isArray(data) && data.every((el) => isLocation(el));

const isEpisode = (data: unknown): data is EpisodeType =>
  isObj(data) &&
  'air_date' in data &&
  'name' in data &&
  'episode' in data &&
  isString(data.air_date) &&
  isString(data.episode) &&
  isString(data.name);

export const isEpisodeArr = (data: unknown): data is EpisodeType[] =>
  Array.isArray(data) && data.every((el) => isEpisode(el));

export const isListResponse = (data: unknown): data is ListResponse =>
  isObj(data) &&
  'results' in data &&
  (isCharacterArr(data.results) || isLocationArr(data.results) || isEpisodeArr(data.results)) &&
  'info' in data &&
  isObj(data.info) &&
  'pages' in data.info &&
  isNumber(data.info.pages);
