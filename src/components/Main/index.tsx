import { Component, createRef } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { isCharacterArr, isEpisodeArr, isLocationArr, isResponse } from 'src/utils/guards';
import { Character } from '../Character';
import { Location } from '../Location';
import { CharacterType, EpisodeType, LocationType, ResponseType } from 'src/types/dataTypes';
import { CHIPS, OBSERVER_OPTIONS } from 'src/utils/constants';
import { Episode } from '../Episode';
import { Loader } from '../Loader';
import { Filters } from '../Filters';

const loadData = async (category: string, pageNumber: number): Promise<ResponseType | null> => {
  const response = await fetch(
    `https://rickandmortyapi.com/api/${category.toLocaleLowerCase().slice(0, category.length - 1)}?page=${pageNumber}`
  );

  const data: unknown = await response.json();
  const parsedResponse: ResponseType | null = isResponse(data) ? data : null;

  return parsedResponse;
};

interface Data {
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

interface State extends Data {
  category: (typeof CHIPS)[number];
  isLoading: boolean;
  initialized: boolean;
  hasFilters: boolean;
}

class Main extends Component<RouteComponentProps> {
  state: State = {
    category: 'Characters',
    isLoading: false,
    initialized: true,
    hasFilters: false,
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

  observer: IntersectionObserver | null = null;
  observerRef = createRef<HTMLDivElement>();
  isInitialized = true;

  getPageByCategory(category: string): number {
    const dataByCategory: Record<string, number> = {
      Characters: this.state.charactersData.page,
      Locations: this.state.locationsData.page,
      Episodes: this.state.episodesData.page,
    };

    return dataByCategory[category] ?? 0;
  }

  async getCharactersData(pageNumber: number): Promise<[CharacterType[], number]> {
    if (this.state.isLoading) return [[], 0];

    this.setState({ isLoading: true });

    const data = await loadData('Characters', pageNumber);
    const parsedData = isCharacterArr(data?.results) ? data.results : [];

    if (!data?.info.pages) return [[], 0];

    return [parsedData, data.info.pages];
  }

  async getLocationsData(pageNumber: number): Promise<[LocationType[], number]> {
    if (this.state.isLoading) return [[], 0];

    this.setState({ isLoading: true });

    const data = await loadData('Locations', pageNumber);
    const parsedData = isLocationArr(data?.results) ? data.results : [];

    if (!data?.info.pages) return [[], 0];

    return [parsedData, data.info.pages];
  }

  async getEpisodesData(pageNumber: number): Promise<[EpisodeType[], number]> {
    if (this.state.isLoading) return [[], 0];

    this.setState({ isLoading: true });

    const data = await loadData('Episodes', pageNumber);
    const parsedData = isEpisodeArr(data?.results) ? data.results : [];

    if (!data?.info.pages) return [[], 0];

    return [parsedData, data.info.pages];
  }

  getFilterToUpdate = (updatedData: CharacterType[] | LocationType[] | EpisodeType[]): keyof Data => {
    if (this.state.category === 'Characters' && isCharacterArr(updatedData)) return 'charactersData';
    else if (this.state.category === 'Locations' && isLocationArr(updatedData)) return 'locationsData';

    return 'episodesData';
  };

  useFilteredData = (filteredData: CharacterType[] | LocationType[] | EpisodeType[]): void => {
    const filterToUpdate = this.getFilterToUpdate(filteredData);
    const field = filterToUpdate.slice(0, filterToUpdate.length - 4);

    this.setState({
      hasFilters: true,
      [filterToUpdate]: {
        [field]: filteredData,
        page: 0,
      },
    });
  };

  clearFilters = (): void => {
    this.setState({
      hasFilters: false,
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
    });

    this.changeCategory();
  };

  async updatePage() {
    const { category } = this.state;
    const nextPage = this.getPageByCategory(category) + 1;

    if (category === 'Characters' && nextPage <= this.state.charactersData.maxPages) {
      const newPageData = await this.getCharactersData(nextPage);

      this.setState((prev: State) => ({
        charactersData: {
          characters: [...prev.charactersData.characters, ...newPageData[0]],
          page: nextPage,
          maxPages: newPageData[1],
        },
      }));
    } else if (category === 'Locations' && nextPage <= this.state.locationsData.maxPages) {
      const newPageData = await this.getLocationsData(nextPage);

      this.setState((prev: State) => ({
        locationsData: {
          locations: [...prev.locationsData.locations, ...newPageData[0]],
          page: nextPage,
          maxPages: newPageData[1],
        },
      }));
    } else if (category === 'Episodes' && nextPage <= this.state.episodesData.maxPages) {
      const newPageData = await this.getEpisodesData(nextPage);

      this.setState((prev: State) => ({
        episodesData: {
          episodes: [...prev.episodesData.episodes, ...newPageData[0]],
          page: nextPage,
          maxPages: newPageData[1],
        },
      }));
    }

    this.setState({ isLoading: false });
  }

  handleObserver = (el: HTMLElement | null) => {
    if (this.observer) this.observer.disconnect();

    this.observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting || this.state.hasFilters) return;

      this.updatePage();
    }, OBSERVER_OPTIONS);

    if (el) this.observer.observe(el);
  };

  changeCategory(): void {
    const category = new URLSearchParams(location.search).get('category') ?? 'Characters';

    if (this.state.isLoading) return;

    this.setState({
      category,
      hasFilters: false,
    });

    setTimeout(() => {
      this.updatePage();
    }, 0);
  }

  componentDidMount(): void {
    if (this.isInitialized) {
      this.changeCategory();
      this.isInitialized = false;
    }

    if (this.observerRef.current && !this.isInitialized) {
      setTimeout(() => this.handleObserver(this.observerRef.current), 0);
    }
  }

  componentDidUpdate(prevProps: RouteComponentProps): void {
    const { location } = this.props;

    const category = new URLSearchParams(prevProps.location.search).get('category') ?? '';

    if (prevProps.location.search !== location.search && ['Characters', 'Locations', 'Episodes'].includes(category))
      this.changeCategory();
  }

  componentWillUnmount() {
    if (this.observer) this.observer.disconnect();
  }

  render(): JSX.Element {
    const {
      charactersData: { characters },
      locationsData: { locations },
      episodesData: { episodes },
      category,
      isLoading,
    } = this.state;

    return (
      <div className='main d-flex w-100 flex-grow-1 flex-column align-items-center'>
        <Filters category={category} useFilteredData={this.useFilteredData} clearFilters={this.clearFilters} />
        <div className='d-flex flex-row flex-wrap justify-content-around mt-4'>
          {category === 'Characters' &&
            characters?.map((character, index) => (
              <Character character={character} key={`character-${character.name}-${index}`} />
            ))}

          {category === 'Locations' &&
            locations?.map((location, index) => (
              <Location location={location} key={`location-${location.name}-${index}`} />
            ))}

          {category === 'Episodes' &&
            episodes?.map((episode, index) => <Episode episode={episode} key={`episode-${episode.name}-${index}`} />)}

          {isLoading && <Loader />}
          <div ref={this.observerRef} className='position-relative observer w-100' />
        </div>
      </div>
    );
  }
}

export default withRouter(Main);
