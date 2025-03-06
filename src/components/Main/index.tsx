import { Component, createRef } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { isCharacterArr, isEpisodeArr, isLocationArr } from 'src/utils/guards';
import { Character } from '../Character';
import { Location } from '../Location';
import { CharacterType, EpisodeType, LocationType } from 'src/types/dataTypes';
import { Episode } from '../Episode';
import { Loader } from '../Loader';
import { Filters } from '../Filters';
import { State } from './types';
import {
  CATEGORY_LIST,
  DEFAULT_CATEGORY,
  DEFAULT_CONTENT_DATA,
  MAIN_STATE_DEFAULT_VAL,
  OBSERVER_OPTIONS,
} from './constants';
import { CATEGORIES } from 'src/utils/constants';
import { loadList } from 'src/api/list';

class Main extends Component<RouteComponentProps> {
  state: State = MAIN_STATE_DEFAULT_VAL;

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

  async getContentData(
    pageNumber: number,
    category: (typeof CATEGORIES)[number]
  ): Promise<{ data: CharacterType[] | LocationType[] | EpisodeType[]; pageCount: number }> {
    if (this.state.isLoading) return { data: [], pageCount: 0 };

    this.setState({ isLoading: true });

    const data = await loadList(category, pageNumber, this.state.params);

    if (!data?.info.pages) return { data: [], pageCount: 0 };

    return { data: data.results, pageCount: data.info.pages };
  }

  clearData = (): void => {
    this.setState(DEFAULT_CONTENT_DATA);
  };

  async updatePage() {
    const { category } = this.state;
    const nextPage = this.getPageByCategory(category) + 1;

    if (category === 'Characters' && nextPage <= this.state.charactersData.maxPages) {
      const { data, pageCount } = await this.getContentData(nextPage, category);

      if (!isCharacterArr(data)) return;

      this.setState((prev: State) => ({
        charactersData: {
          characters: [...prev.charactersData.characters, ...data],
          page: nextPage,
          maxPages: pageCount,
        },
      }));
    } else if (category === 'Locations' && nextPage <= this.state.locationsData.maxPages) {
      const { data, pageCount } = await this.getContentData(nextPage, category);

      if (!isLocationArr(data)) return;

      this.setState((prev: State) => ({
        locationsData: {
          locations: [...prev.locationsData.locations, ...data],
          page: nextPage,
          maxPages: pageCount,
        },
      }));
    } else if (category === 'Episodes' && nextPage <= this.state.episodesData.maxPages) {
      const { data, pageCount } = await this.getContentData(nextPage, category);

      if (!isEpisodeArr(data)) return;

      this.setState((prev: State) => ({
        episodesData: {
          episodes: [...prev.episodesData.episodes, ...data],
          page: nextPage,
          maxPages: pageCount,
        },
      }));
    }

    this.setState({ isLoading: false });
  }

  handleObserver = (el: HTMLElement | null) => {
    if (this.observer) this.observer.disconnect();

    this.observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;

      this.updatePage();
    }, OBSERVER_OPTIONS);

    if (el) this.observer.observe(el);
  };

  changeCategory(): void {
    if (this.state.isLoading) return;

    const category = new URLSearchParams(location.search).get('category') ?? DEFAULT_CATEGORY;

    this.setState({
      category,
      params: '',
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

    if (this.observerRef.current && !this.isInitialized)
      setTimeout(() => this.handleObserver(this.observerRef.current), 0);
  }

  componentDidUpdate(prevProps: RouteComponentProps): void {
    const category = new URLSearchParams(prevProps.location.search).get('category') ?? DEFAULT_CATEGORY;

    if (prevProps.location.search !== this.props.location.search && CATEGORY_LIST.includes(category)) {
      this.changeCategory();
      this.clearData();
    }
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
        <Filters
          category={category}
          clearData={this.clearData}
          setParams={(params: string) =>
            this.setState({
              params,
            })
          }
        />
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

const MainWithRouter = withRouter(Main);

export default MainWithRouter;
