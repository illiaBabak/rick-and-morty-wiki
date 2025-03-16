import { Component, JSX } from 'react';

export class Loader extends Component {
  render(): JSX.Element {
    return (
      <div className='loader position-fixed'>
        <img
          className='object-fit-cover loader-icon'
          src='https://img.icons8.com/stickers/512/rick-sanchez.png'
          alt='loader-icon'
        />
      </div>
    );
  }
}
