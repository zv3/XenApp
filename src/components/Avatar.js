import React from "react"
import {Image} from "react-native"
import PropTypes from "prop-types"

export default class Avatar extends React.Component {
    render() {
        const borderRadius = this.props.size/2;

        return (
            <Image source={{ uri: this.props.url }}
                   style={{ width: this.props.size, height: this.props.size, borderRadius: borderRadius }} />
        );
    }
}
Avatar.propTypes = {
    url: PropTypes.string,
    size: PropTypes.number
};