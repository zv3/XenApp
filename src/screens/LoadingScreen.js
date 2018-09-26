import React from 'react';
import {
    View, Text, ActivityIndicator
} from 'react-native';

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

