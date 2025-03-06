import { ListResponse } from 'src/types/dataTypes';
import { isListResponse } from 'src/utils/guards';

export const loadList = async (category: string, pageNumber: number, params: string): Promise<ListResponse | null> => {
  const response = await fetch(
    `https://rickandmortyapi.com/api/${category.toLocaleLowerCase().slice(0, category.length - 1)}?page=${pageNumber}&${params}`
  );

  const data: unknown = await response.json();
  const parsedResponse = isListResponse(data) ? data : null;

  return parsedResponse;
};
