import { Component, ReactNode } from "react";

interface IState {
  hasError: false;
}

interface IProps {
  children: ReactNode;
}

export default class ErrorBoundary extends Component<IProps, IState> {
  public state: IState;
  
  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
