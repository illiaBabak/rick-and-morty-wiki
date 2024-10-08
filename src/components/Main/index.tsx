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

interface Props extends RouteComponentProps {}

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

class Main extends Component<Props> {
  state: State = {
    category: 'Characters',
    isLoading: false,
    initialized: true,
    charactersData: {
      characters: [],
      page: 1,
    },
    locationsData: {
      locations: [],
      page: 1,
    },
    episodesData: {
      episodes: [],
      page: 1,
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

    return dataByCategory[category] ?? 1;
  }

  getData(category: string): void {
    if (this.state.isLoading) return;

    this.setState({ isLoading: true });

    const pageNumber = this.getPageByCategory(category);

    const loadData = async () => {
      const response = await fetch(
        `https://rickandmortyapi.com/api/${category
          .toLocaleLowerCase()
          .slice(0, category.length - 1)}?page=${pageNumber}`
      );

      const data: unknown = await response.json();
      const parsedData: unknown = isResponse(data) ? data.results : [];

      this.updateData(parsedData);
    };

    loadData();
  }

  updateData(data: unknown): void {
    if (isCharacterArr(data)) {
      this.setState((prev: State) => ({
        charactersData: {
          characters: [...prev.charactersData.characters, ...data],
          page: prev.charactersData.page,
        },
      }));
    } else if (isLocationArr(data)) {
      this.setState((prev: State) => ({
        locationsData: {
          locations: [...prev.locationsData.locations, ...data],
          page: prev.locationsData.page,
        },
      }));
    } else if (isEpisodeArr(data)) {
      this.setState((prev: State) => ({
        episodesData: {
          episodes: [...prev.episodesData.episodes, ...data],
          page: prev.episodesData.page,
        },
      }));
    }

    this.setState({ isLoading: false });
  }

  updatePage = () => {
    const { category } = this.state;
    const nextPage = this.getPageByCategory(category) + 1;

    if (category === 'Characters' && this.state.charactersData.page + 1 <= MAX_CHARACTERS_PAGES) {
      this.setState(
        (prev: State) => ({
          charactersData: {
            ...prev.charactersData,
            page: nextPage,
          },
        }),
        () => this.getData(category)
      );
    } else if (category === 'Locations' && this.state.locationsData.page + 1 <= MAX_LOCATIONS_PAGES) {
      this.setState(
        (prev: State) => ({
          locationsData: {
            ...prev.locationsData,
            page: nextPage,
          },
        }),
        () => this.getData(category)
      );
    } else if (category === 'Episodes' && this.state.episodesData.page + 1 <= MAX_EPISODES_PAGES) {
      this.setState(
        (prev: State) => ({
          episodesData: {
            ...prev.episodesData,
            page: nextPage,
          },
        }),
        () => this.getData(category)
      );
    }
  };

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

    this.setState(
      {
        category: category,
      },
      () => this.getData(category)
    );
  }

  componentDidMount(): void {
    if (this.isInitialized) {
      this.changeCategory();
      this.isInitialized = false;
    }

    if (this.observerRef.current) {
      this.handleObserver(this.observerRef.current);
    }
  }

  componentDidUpdate(prevProps: Props): void {
    const { location } = this.props;

    if (prevProps.location.search !== location.search) {
      this.changeCategory();
      this.updatePage();
    }
  }

  componentWillUnmount() {
    if (this.observer) this.observer.disconnect();
  }

  render() {
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
            characters.map((character, index) => (
              <Character character={character} key={`character-${character.name}-${index}`} />
            ))}

          {category === 'Locations' &&
            locations.map((location, index) => (
              <Location location={location} key={`location-${location.name}-${index}`} />
            ))}

          {category === 'Episodes' &&
            episodes.map((episode, index) => <Episode episode={episode} key={`episode-${episode.name}-${index}`} />)}

          {isLoading && <Loader />}
          <div ref={this.observerRef} className='position-relative observer w-100' />
        </div>
      </div>
    );
  }
}

export default withRouter(Main);
