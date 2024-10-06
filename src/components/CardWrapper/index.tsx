import { Component, ReactNode } from 'react';

interface CardWrapperProps {
  children: ReactNode;
}

export class CardWrapper extends Component<CardWrapperProps> {
  render() {
    const { children } = this.props;

    return <div className='wrapper p-2 m-3'>{children}</div>;
  }
}
