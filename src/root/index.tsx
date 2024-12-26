import { Component } from 'react';
import { Header } from 'src/components/Header';
import Main from 'src/components/Main';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { BASE_URL } from 'src/utils/constants';

class App extends Component<RouteComponentProps> {
  componentDidMount(): void {
    const { location } = this.props;

    const categoryQuery = new URLSearchParams(location.search).get('category');

    if (!categoryQuery) window.location.href = `${BASE_URL}/?category=Characters`; //set category default equales to Character
  }

  render(): JSX.Element {
    return (
      <div className='app-container d-flex justify-content-start flex-column w-100 h-100'>
        <Header />
        <Main />
      </div>
    );
  }
}

const AppWithRouter = withRouter(App);

export default AppWithRouter;
