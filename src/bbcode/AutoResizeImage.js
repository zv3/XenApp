import React from 'react'
import {Image, Dimensions} from 'react-native'
import PropTypes from 'prop-types'

export default class AutoResizeImage extends React.Component {
    static propTypes = {
        uri: PropTypes.string.isRequired,
        initialWidth: PropTypes.number,
        initialHeight: PropTypes.number
    };

    static defaultProps = {
        initialWidth: 100,
        initialHeight: 100
    };

    render() {
        return <Image source={{ uri: this.props.uri }}
                      style={{ width: this.props.initialWidth, height: this.props.initialHeight }} />
    }
}
