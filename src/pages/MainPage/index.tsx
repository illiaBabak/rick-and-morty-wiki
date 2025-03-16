import { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Header } from 'src/components/Header';
import Main from 'src/components/Main';
import { CATEGORY_LIST } from 'src/components/Main/constants';
import { routes } from 'src/config/routes';

class MainPage extends Component<RouteComponentProps> {
  componentDidMount(): void {
    const { location } = this.props;

    const category = new URLSearchParams(location.search).get('category');

    if (category && !CATEGORY_LIST.includes(category)) this.props.history.push(routes.redirectPage);

    if (!category) window.location.href = `${routes.mainPage}?category=Characters`; //set category default equales to Character
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

const MainPageWithRouter = withRouter(MainPage);

export default MainPageWithRouter;
