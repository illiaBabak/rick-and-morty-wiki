import { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { isCharacterArr, isEpisodeArr, isLocationArr, isResponse } from 'src/utils/guards';
import { Character } from '../Character';
import { Location } from '../Location';
import { CharacterType, EpisodeType, LocationType } from 'src/types/dataTypes';
import { CHIPS } from 'src/utils/constants';
import { Episode } from '../Episode';

interface Props extends RouteComponentProps {}

interface State {
  category: (typeof CHIPS)[number];
  characters: CharacterType[];
  locations: LocationType[];
  episodes: EpisodeType[];
}

class Main extends Component<Props> {
  state: State = {
    category: 'Characters',
    characters: [],
    locations: [],
    episodes: [],
  };

  getData(category: string): void {
    const loadData = async () => {
      const response = await fetch(`https://rickandmortyapi.com/api/${category}`);

      const data: unknown = await response.json();

      const parsedData: unknown = isResponse(data) ? data.results : [];

      if (isCharacterArr(parsedData)) {
        this.setState({ characters: parsedData });
        return;
      }

      if (isLocationArr(parsedData)) {
        this.setState({ locations: parsedData });
        return;
      }

      if (isEpisodeArr(parsedData)) {
        this.setState({ episodes: parsedData });
        return;
      }
    };

    loadData();
  }

  componentDidMount(): void {
    this.getData('character'); //as default
  }

  componentDidUpdate(prevProps: Props): void {
    const { location } = this.props;

    if (prevProps.location.search !== location.search) {
      const query = new URLSearchParams(location.search).get('category');

      this.setState({
        category: query,
      });

      const category = query?.toLocaleLowerCase().slice(0, query.length - 1);

      this.getData(category ?? '');
    }
  }

  render() {
    const { characters, locations, episodes, category } = this.state;

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
        </div>
      </div>
    );
  }
}

export default withRouter(Main);
