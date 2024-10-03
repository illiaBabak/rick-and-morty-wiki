import { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps {}

class Main extends Component<Props> {
  state = {
    category: 'Characters',
  };

  componentDidUpdate(prevProps: Props): void {
    const { location } = this.props;

    if (prevProps.location.search !== location.search) {
      const query = new URLSearchParams(location.search).get('category');

      this.setState({
        category: query,
      });
    }
  }

  render() {
    return <div className='main d-flex w-100 flex-grow-1'></div>;
  }
}

export default withRouter(Main);
