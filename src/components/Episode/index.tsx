import { Component } from 'react';
import { EpisodeType } from 'src/types/dataTypes';
import { CardWrapper } from '../CardWrapper';

interface EpisodeProps {
  episode: EpisodeType;
}

export class Episode extends Component<EpisodeProps> {
  render() {
    const { episode } = this.props;

    return (
      <CardWrapper>
        <div className='episode d-flex flex-column justify-content-center align-items-center text-center'>
          <h2>{episode.episode}</h2>
          <p>Name: {episode.name}</p>
          <p>Date: {episode.air_date}</p>
        </div>
      </CardWrapper>
    );
  }
}
