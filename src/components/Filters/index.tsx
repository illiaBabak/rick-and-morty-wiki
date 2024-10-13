import { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import { CharacterType, EpisodeType, LocationType } from 'src/types/dataTypes';
import { capitalize } from 'src/utils/capitalize';
import { CHIPS } from 'src/utils/constants';
import { isCharacterArr, isEpisodeArr, isLocationArr, isResponse } from 'src/utils/guards';

const loadDataWithParams = async (category: string, params: string) => {
  const response = await fetch(
    `https://rickandmortyapi.com/api/${category.toLocaleLowerCase().slice(0, category.length - 1)}?${params}`
  );

  const data: unknown = await response.json();
  const parsedData: unknown = isResponse(data) ? data.results : [];

  return parsedData;
};

const CHARACTER_FILTERS = ['name', 'status', 'species', 'type', 'gender'] as const;
const LOCATION_FILTERS = ['name', 'type', 'dimension'] as const;
const EPISODES_FILTERS = ['name', 'episode'] as const;

const CHARACTER_GENDER_OPTIONS = ['Male', 'Female', 'unknown', 'Genderless'] as const;
const CHARACTER_STATUS_OPTIONS = ['Alive', 'Dead', 'unknown'] as const;

const DEFAULT_VAL = {
  characterFilters: {
    name: '',
    status: 'Alive',
    species: '',
    type: '',
    gender: 'Male',
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

interface Props {
  category: (typeof CHIPS)[number];
  useFilteredData: (filteredData: CharacterType[] | LocationType[] | EpisodeType[]) => void;
  clearFilters: () => void;
}

interface State {
  characterFilters: Record<(typeof CHARACTER_FILTERS)[number], string>;
  locationFilters: Record<(typeof LOCATION_FILTERS)[number], string>;
  episodeFilters: Record<(typeof EPISODES_FILTERS)[number], string>;
}

export class Filters extends Component<Props> {
  state: State = DEFAULT_VAL;

  getFiltersByCategory(category: (typeof CHIPS)[number]) {
    const filters = {
      Characters: this.state.characterFilters,
      Locations: this.state.locationFilters,
      Episodes: this.state.episodeFilters,
    };

    return filters[category];
  }

  async getFilteredData(params: string) {
    const filteredData = await loadDataWithParams(this.props.category, params);

    if (isCharacterArr(filteredData) || isLocationArr(filteredData) || isEpisodeArr(filteredData))
      this.props.useFilteredData(filteredData);
  }

  handleSearch(): void {
    const values = Object.entries(this.getFiltersByCategory(this.props.category)).filter(([_, v]) => v.length);
    const params = values.map(([key, val]) => `${key}=${val}`).join('&');

    this.getFilteredData(params);
  }

  handleClear(): void {
    this.setState(DEFAULT_VAL);
    this.props.clearFilters();
  }

  handleInputChange = (filter: string, value: string): void => {
    this.setState((prevState: State) => {
      switch (this.props.category) {
        case 'Characters':
          return {
            characterFilters: {
              ...prevState.characterFilters,
              [filter]: value,
            },
          };
        case 'Locations':
          return {
            locationFilters: {
              ...prevState.locationFilters,
              [filter]: value,
            },
          };
        case 'Episodes':
          return {
            episodeFilters: {
              ...prevState.episodeFilters,
              [filter]: value,
            },
          };
        default:
          return prevState;
      }
    });
  };

  render(): JSX.Element {
    const { category } = this.props;
    const { characterFilters, locationFilters, episodeFilters } = this.state;

    return (
      <div className='filters d-flex flex-column justify-content-center align-items-center w-75 mt-4 p-3 text-white'>
        <h2>Filters:</h2>
        <div className='d-flex flex-row align-items-center justify-content-center flex-wrap'>
          {category === 'Characters' &&
            CHARACTER_FILTERS.map((filter, index) => (
              <div
                className='d-flex flex-row justify-content-center align-items-center m-2 p-1'
                key={`filter-${filter}-${index}`}
              >
                <p className='m-0 me-2'>{capitalize(filter)}</p>
                {['status', 'gender'].includes(filter) ? (
                  <Dropdown
                    onSelect={(option) =>
                      this.setState({
                        characterFilters: {
                          ...characterFilters,
                          [filter]: option,
                        },
                      })
                    }
                  >
                    <Dropdown.Toggle className='dropdown-filter d-flex justify-content-center align-items-center text-center'>
                      {characterFilters[filter]}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {(filter === 'status'
                        ? CHARACTER_STATUS_OPTIONS
                        : filter === 'gender'
                          ? CHARACTER_GENDER_OPTIONS
                          : []
                      ).map((option, index) => (
                        <Dropdown.Item key={`${index}-option`} eventKey={option}>
                          {option}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <input
                    className='field'
                    type='text'
                    value={characterFilters[filter]}
                    onChange={({ currentTarget: { value } }) => this.handleInputChange(filter, value)}
                  />
                )}
              </div>
            ))}

          {category === 'Locations' &&
            LOCATION_FILTERS.map((filter, index) => (
              <div
                className='d-flex flex-row justify-content-center align-items-center m-2 p-1'
                key={`filter-${filter}-${index}`}
              >
                <p className='m-0 me-2'>{capitalize(filter)}</p>
                <input
                  className='field'
                  type='text'
                  value={locationFilters[filter]}
                  onChange={({ currentTarget: { value } }) => this.handleInputChange(filter, value)}
                />
              </div>
            ))}

          {category === 'Episodes' &&
            EPISODES_FILTERS.map((filter, index) => (
              <div
                className='d-flex flex-row justify-content-center align-items-center m-2 p-1'
                key={`filter-${filter}-${index}`}
              >
                <p className='m-0 me-2'>{capitalize(filter)}</p>
                <input
                  className='field'
                  type='text'
                  value={episodeFilters[filter]}
                  onChange={({ currentTarget: { value } }) => this.handleInputChange(filter, value)}
                />
              </div>
            ))}
        </div>
        <div className='d-flex flex-row justify-content-center align-items-center'>
          <div
            onClick={() => this.handleSearch()}
            className={`btn-wrapper m-2 d-flex justify-content-center align-items-center ${!Object.values(this.getFiltersByCategory(this.props.category)).filter((val) => !!val.length).length ? 'disabled' : ''}`}
          >
            <div className='btn fs-6 d-flex justify-content-center align-items-center p-1 text-white'>Search</div>
          </div>
          <div
            className='btn-wrapper m-2 d-flex justify-content-center align-items-center'
            onClick={() => this.handleClear()}
          >
            <div className='btn fs-6 d-flex justify-content-center align-items-center p-1 text-white'>
              Clear filters
            </div>
          </div>
        </div>
      </div>
    );
  }
}
