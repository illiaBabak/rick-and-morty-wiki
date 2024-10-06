import { Component } from 'react';
import { LocationType } from 'src/types/dataTypes';
import { CardWrapper } from '../CardWrapper';

interface LocationProps {
  location: LocationType;
}

export class Location extends Component<LocationProps> {
  render() {
    const { location } = this.props;

    return (
      <CardWrapper>
        <div className='location d-flex justify-content-center align-items-center flex-column text-center'>
          <h2>{location.name}</h2>
          <p>Type: {location.type}</p>
          <p>Dimension: {location.dimension}</p>
        </div>
      </CardWrapper>
    );
  }
}
