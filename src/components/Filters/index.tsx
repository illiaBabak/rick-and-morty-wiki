import { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import { capitalize } from 'src/utils/capitalize';
import { CATEGORIES } from 'src/utils/constants';
import {
  CHARACTER_FILTERS,
  LOCATION_FILTERS,
  EPISODES_FILTERS,
  CHARACTER_STATUS_OPTIONS,
  CHARACTER_GENDER_OPTIONS,
  FILTERS_DEFAULT_VAL,
} from './constants';
import { Filter, Props, State } from './types';

export class Filters extends Component<Props> {
  state: State = FILTERS_DEFAULT_VAL;

  getFiltersByCategory(category: (typeof CATEGORIES)[number]): Filter {
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

  handleSearch(): void {
    const values = Object.entries(this.getFiltersByCategory(this.props.category));
    const params = new URLSearchParams(values).toString();

    this.props.setParams(params);
    this.props.clearData();
  }

  handleClear(): void {
    this.setState(FILTERS_DEFAULT_VAL);
    this.props.clearData();
    this.props.setParams('');
  }

  getStateCategoryField = (): keyof State => {
    if (this.props.category === 'Characters') return 'characterFilters';

    if (this.props.category === 'Locations') return 'locationFilters';

    return 'episodeFilters';
  };

  handleInputChange = (filter: string, value: string): void => {
    const fieldToChange = this.getStateCategoryField();

    this.setState((prevState: State) => {
      return { ...prevState, [fieldToChange]: { ...prevState[fieldToChange], [filter]: value } };
    });
  };

  render(): JSX.Element {
    const { category } = this.props;
    const { characterFilters, locationFilters, episodeFilters } = this.state;

    const disabledClassName = !Object.values(this.getFiltersByCategory(this.props.category)).length ? 'disabled' : '';

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
                      {(filter === 'status' ? CHARACTER_STATUS_OPTIONS : CHARACTER_GENDER_OPTIONS).map(
                        (option, index) => (
                          <Dropdown.Item key={`${index}-option-${option}`} eventKey={option}>
                            {option}
                          </Dropdown.Item>
                        )
                      )}
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

          {['Locations', 'Episodes'].includes(category) &&
            (category === 'Locations' ? LOCATION_FILTERS : EPISODES_FILTERS).map((filter, index) => (
              <div
                className='d-flex flex-row justify-content-center align-items-center m-2 p-1'
                key={`filter-${filter}-${index}`}
              >
                <p className='m-0 me-2'>{capitalize(filter)}</p>
                <input
                  className='field'
                  type='text'
                  value={
                    category === 'Locations'
                      ? locationFilters[filter as (typeof LOCATION_FILTERS)[number]]
                      : episodeFilters[filter as (typeof EPISODES_FILTERS)[number]]
                  }
                  onChange={({ currentTarget: { value } }) => this.handleInputChange(filter, value)}
                />
              </div>
            ))}
        </div>
        <div className='d-flex flex-row justify-content-center align-items-center'>
          <div
            onClick={() => this.handleSearch()}
            className={`btn-wrapper m-2 d-flex justify-content-center align-items-center ${disabledClassName}`}
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
