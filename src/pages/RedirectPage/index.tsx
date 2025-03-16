import { Component, JSX } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { routes } from 'src/config/routes';

class RedirectPage extends Component<RouteComponentProps> {
  render(): JSX.Element {
    return (
      <div className='d-flex justify-content-center align-items-center flex-column redirect-page w-100 h-100 text-white'>
        <div className='window d-flex flex-column align-items-center justify-content-center p-4 text-center'>
          <h2>Oops... something went wrong :(</h2>
          <div className='redirect-btn' onClick={() => this.props.history.push(routes.mainPage)}>
            Redirect to main page
          </div>
        </div>
      </div>
    );
  }
}

const RedirectPageWithRouter = withRouter(RedirectPage);

export default RedirectPageWithRouter;
