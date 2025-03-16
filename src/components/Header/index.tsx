import { Component, JSX } from 'react';
import { CATEGORIES } from 'src/utils/constants';
import { Link } from 'react-router-dom';
import { routes } from 'src/config/routes';

export class Header extends Component {
  render(): JSX.Element {
    return (
      <div className='header d-flex flex-column justify-content-center align-items-center w-100 text-white'>
        <h1>Rick and Morty wiki</h1>
        <div className='d-flex flex-row align-items-center justify-content-center'>
          {CATEGORIES.map((chip, index) => (
            <Link
              className='chip m-2 p-2 text-white'
              to={`${routes.mainPage}/?category=${chip}`}
              key={`link-${chip}-${index}`}
            >
              {chip}
            </Link>
          ))}
        </div>
      </div>
    );
  }
}
