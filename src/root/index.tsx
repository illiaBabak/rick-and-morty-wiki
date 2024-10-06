import { Component } from 'react';
import { Header } from 'src/components/Header';
import Main from 'src/components/Main';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface AppProps extends RouteComponentProps {}

class App extends Component<AppProps> {
  componentDidMount(): void {
    const { location } = this.props;

    const categoryQuery = new URLSearchParams(location.search).get('category');

    if (!categoryQuery) window.location.href = '/?category=Characters'; //set category default equales to Character
  }

  render() {
    return (
      <div className='app-container d-flex justify-content-start flex-column w-100 h-100'>
        <Header />
        <Main />
      </div>
    );
  }
}

export default withRouter(App);
