import React from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log("ErrorBoundary message: " + error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Lỗi trong thành phần:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Đã xảy ra lỗi, vui lòng thử lại sau.</h1>;
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;