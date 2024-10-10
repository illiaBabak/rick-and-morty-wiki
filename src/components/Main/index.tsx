import { Component, createRef } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { isCharacterArr, isEpisodeArr, isLocationArr, isResponse } from 'src/utils/guards';
import { Character } from '../Character';
import { Location } from '../Location';
import { CharacterType, EpisodeType, LocationType } from 'src/types/dataTypes';
import {
  CHIPS,
  MAX_CHARACTERS_PAGES,
  MAX_EPISODES_PAGES,
  MAX_LOCATIONS_PAGES,
  OBSERVER_OPTIONS,
} from 'src/utils/constants';
import { Episode } from '../Episode';
import { Loader } from '../Loader';

const loadData = async (category: string, pageNumber: number) => {
  const response = await fetch(
    `https://rickandmortyapi.com/api/${category.toLocaleLowerCase().slice(0, category.length - 1)}?page=${pageNumber}`
  );

  const data: unknown = await response.json();
  const parsedData: unknown = isResponse(data) ? data.results : [];

  return parsedData;
};

interface State {
  category: (typeof CHIPS)[number];
  isLoading: boolean;
  initialized: boolean;
  charactersData: {
    characters: CharacterType[];
    page: number;
  };
  locationsData: {
    locations: LocationType[];
    page: number;
  };
  episodesData: {
    episodes: EpisodeType[];
    page: number;
  };
}

class Main extends Component<RouteComponentProps> {
  state: State = {
    category: 'Characters',
    isLoading: false,
    initialized: true,
    charactersData: {
      characters: [],
      page: 0,
    },
    locationsData: {
      locations: [],
      page: 0,
    },
    episodesData: {
      episodes: [],
      page: 0,
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

  async getCharactersData(pageNumber: number): Promise<CharacterType[]> {
    if (this.state.isLoading) return [];

    this.setState({ isLoading: true });

    const data = await loadData('Characters', pageNumber);
    const parsedData = isCharacterArr(data) ? data : [];

    return parsedData;
  }

  async getLocationsData(pageNumber: number): Promise<LocationType[]> {
    if (this.state.isLoading) return [];

    this.setState({ isLoading: true });

    const data = await loadData('Locations', pageNumber);
    const parsedData = isLocationArr(data) ? data : [];

    return parsedData;
  }

  async getEpisodesData(pageNumber: number): Promise<EpisodeType[]> {
    if (this.state.isLoading) return [];

    this.setState({ isLoading: true });

    const data = await loadData('Episodes', pageNumber);
    const parsedData = isEpisodeArr(data) ? data : [];

    return parsedData;
  }

  async updatePage() {
    const { category } = this.state;
    const nextPage = this.getPageByCategory(category) + 1;

    if (category === 'Characters' && this.state.charactersData.page + 1 <= MAX_CHARACTERS_PAGES) {
      const newPageData = await this.getCharactersData(nextPage);

      this.setState((prev: State) => ({
        charactersData: {
          characters: [...prev.charactersData.characters, ...newPageData],
          page: nextPage,
        },
      }));
    } else if (category === 'Locations' && this.state.locationsData.page + 1 <= MAX_LOCATIONS_PAGES) {
      const newPageData = await this.getLocationsData(nextPage);

      this.setState((prev: State) => ({
        locationsData: {
          locations: [...prev.locationsData.locations, ...newPageData],
          page: nextPage,
        },
      }));
    } else if (category === 'Episodes' && this.state.episodesData.page + 1 <= MAX_EPISODES_PAGES) {
      const newPageData = await this.getEpisodesData(nextPage);

      this.setState((prev: State) => ({
        episodesData: {
          episodes: [...prev.episodesData.episodes, ...newPageData],
          page: nextPage,
        },
      }));
    }

    this.setState({ isLoading: false });
  }

  handleObserver = (el: HTMLElement | null) => {
    this.observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;

      this.updatePage();
    }, OBSERVER_OPTIONS);

    if (el) this.observer.observe(el);
  };

  changeCategory(): void {
    const category = new URLSearchParams(location.search).get('category') ?? 'Characters';

    if (this.state.isLoading) return;

    this.setState({
      category,
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
      <div className='main d-flex w-100 flex-grow-1'>
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
