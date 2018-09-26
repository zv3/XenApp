import React from 'react';
import {
    View, Text, ActivityIndicator
} from 'react-native';

import PropTypes from "prop-types";

export default class LoadingScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator/>
                <Text>Loading data...</Text>
            </View>
        );
    }
}
LoadingScreen.propTypes = {
    isError: PropTypes.bool
};
LoadingScreen.defaultProps = {
    isError: false
};