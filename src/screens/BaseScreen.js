import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

export const LoadingState = Object.freeze({
    Begin: 0,
    Done: 1,
    Error: -1
});

export default class BaseScreen extends React.Component {
    state = {
        loadingState: LoadingState.Begin
    };

    _setLoadingState(loadingState, otherStates: ?Object) {
        switch (loadingState) {
            case LoadingState.Begin:
            case LoadingState.Done:
            case LoadingState.Error:
                this.setState({ ...otherStates, loadingState });
                break;
            default:
                throw new Error(`Unknown loading state ${loadingState}`);
        }
    }

    _doRender() {
        throw new Error('Child must be implemented!');
    }

    render() {
        const style = {
            loading: {
                marginTop: 10,
                fontSize: 18
            },
            container: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }
        };

        const { loadingState } = this.state;

        if (loadingState === LoadingState.Begin) {
            return (
                <View style={style.container}>
                    <ActivityIndicator />
                    <Text style={style.loading}>Loading...</Text>
                </View>
            );
        } else if (loadingState === LoadingState.Error) {
            return (
                <View style={style.container}>
                    <Text>Whoops! Something went wrong. Please try again.</Text>
                </View>
            );
        } else if (loadingState === LoadingState.Done) {
            return this._doRender();
        }

        throw new Error(`Unknown loading state ${loadingState} for rendering`);
    }
}
