import { Component } from 'react';
import { CharacterType } from 'src/types/dataTypes';
import { CardWrapper } from '../CardWrapper';

interface CharacterProps {
  character: CharacterType;
}

export class Character extends Component<CharacterProps> {
  render() {
    const { character } = this.props;

    return (
      <CardWrapper>
        <div className='character d-flex justify-content-start align-items-center flex-row h-100'>
          <img className='character-icon object-fit-contain m-3' src={character.image} alt='character-image' />
          <div className='d-flex flex-column p-3 h-100 w-100'>
            <h3 className='m-0'>{character.name}</h3>
            <p className='mt-3'>
              Status:{' '}
              <span className={`${character.status === 'Alive' ? 'alive' : character.status === 'Dead' ? 'dead' : ''}`}>
                {character.status}
              </span>
            </p>
            <p>Species: {character.species}</p>
            <p>Gender: {character.gender}</p>
            <p>From: {character.origin.name}</p>
          </div>
        </div>
      </CardWrapper>
    );
  }
}
