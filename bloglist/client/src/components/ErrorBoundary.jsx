import { Component } from 'react'

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = {hasError: false}
    }

    static getDerivedStateFromError() {
        return { hasError: true}
    }

    componentDidCatch(error, info) {
        console.error('error:', error, info)
    }

    render() {
        if (this.state.hasError) {
            return <p>Something went wrong. Try again.</p>
        }
        return this.props.children
    }
}

export default ErrorBoundary