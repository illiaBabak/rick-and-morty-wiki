import { Component, JSX } from 'react';
import { BrowserRouter, Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { routes } from 'src/config/routes';
import MainPageWithRouter from 'src/pages/MainPage';
import RedirectPageWithRouter from 'src/pages/RedirectPage';

class App extends Component<RouteComponentProps> {
  render(): JSX.Element {
    const { mainPage, redirectPage } = routes;

    return (
      <BrowserRouter>
        <Switch>
          <Route path='/' exact>
            <Redirect to={mainPage} />
          </Route>

          <Route exact path={mainPage} component={MainPageWithRouter} />
          <Route path={redirectPage} component={RedirectPageWithRouter} />

          <Route path='*'>
            <Redirect to={redirectPage} />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

const AppWithRouter = withRouter(App);

export default AppWithRouter;
