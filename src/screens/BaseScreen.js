import React from "react"
import {View, ActivityIndicator, Text} from "react-native"

export const LoadingState = Object.freeze({
    Begin: 0,
    Done: 1,
    Error: -1
});

export default class BaseScreen extends React.Component {
    state = {
        loadingState: LoadingState.Begin
    };

    _setLoadingState(state) {
        switch (state) {
            case LoadingState.Begin:
            case LoadingState.Done:
            case LoadingState.Error:
                this.setState({ loadingState: state });
                break;
            default:
                throw new Error(`Unknown loading state ${state}`);
        }
    }

    _doRender() {
        throw new Error('Child must be implemented!');
    }

    render() {
        if (this.state.loadingState === LoadingState.Begin) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator/>
                    <Text style={{ marginTop: 10, fontSize: 18 }}>Loading data...</Text>
                </View>
            );
        } else if (this.state.loadingState === LoadingState.Error) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Whoops! Something went wrong. Please try again.</Text>
                </View>
            );
        }

        return this._doRender();
    }
}