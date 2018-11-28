import React from 'react';
import {View} from 'react-native'
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

export default class Avatar extends React.PureComponent {
    static propTypes = {
        uri: PropTypes.string,
        size: PropTypes.number,
        style: PropTypes.object
    };

    static defaultProps = {
        size: 46
    };

    render() {
        const { uri, size, style } = this.props;
        const styles = [
            {
                width: size,
                height: size,
                borderRadius: size / 2
            },
            style
        ];

        if (!uri) {
            return <View style={styles}/>;
        }

        return <FastImage source={{ uri: uri }} style={styles} />;
    }
}
