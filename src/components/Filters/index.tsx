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

const CHARACTER_GENDER_OPTIONS = ['Unselected', 'Male', 'Female', 'unknown', 'Genderless'] as const;
const CHARACTER_STATUS_OPTIONS = ['Unselected', 'Alive', 'Dead', 'unknown'] as const;

type Filter =
  | Record<(typeof CHARACTER_FILTERS)[number], string>
  | Record<(typeof LOCATION_FILTERS)[number], string>
  | Record<(typeof EPISODES_FILTERS)[number], string>;

const DEFAULT_VAL = {
  characterFilters: {
    name: '',
    status: 'Unselected',
    species: '',
    type: '',
    gender: 'Unselected',
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

  getFiltersByCategory(category: (typeof CHIPS)[number]): Filter {
    const filters = {
      Characters: this.state.characterFilters,
      Locations: this.state.locationFilters,
      Episodes: this.state.episodeFilters,
    };

    const selectedFilters = filters[category];
    const filtersToApply = Object.fromEntries(
      Object.entries(selectedFilters).filter(([, v]) => v.length && v !== 'Unselected')
    ) as Filter;

    return filtersToApply;
  }

  async getFilteredData(params: string): Promise<void> {
    const filteredData = await loadDataWithParams(this.props.category, params);

    if (isCharacterArr(filteredData) || isLocationArr(filteredData) || isEpisodeArr(filteredData))
      this.props.useFilteredData(filteredData);
  }

  handleSearch(): void {
    const values = Object.entries(this.getFiltersByCategory(this.props.category));
    const params = new URLSearchParams(values).toString();

    this.getFilteredData(params);
  }

  handleClear(): void {
    this.setState(DEFAULT_VAL);
    this.props.clearFilters();
  }

  getStateCategoryField = (): keyof State => {
    if (this.props.category === 'Characters') return 'characterFilters';
    else if (this.props.category === 'Locations') return 'locationFilters';

    return 'episodeFilters';
  };

  handleInputChange = (filter: string, value: string): void => {
    const fieldToChange = this.getStateCategoryField();

    this.setState((prevState: State) => {
      return { ...prevState, [fieldToChange]: { ...prevState[fieldToChange], [filter]: value } };
    });
  };

  getOptionFields = (filter: string): typeof CHARACTER_STATUS_OPTIONS | typeof CHARACTER_GENDER_OPTIONS | [] => {
    if (filter === 'status') return CHARACTER_STATUS_OPTIONS;
    else if (filter === 'gender') return CHARACTER_GENDER_OPTIONS;

    return [];
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
                      {this.getOptionFields(filter).map((option, index) => (
                        <Dropdown.Item key={`${index}-option-${option}`} eventKey={option}>
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
            className={`btn-wrapper m-2 d-flex justify-content-center align-items-center ${!Object.values(this.getFiltersByCategory(this.props.category)).length ? 'disabled' : ''}`}
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
