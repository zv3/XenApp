import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Style } from '../Style';
import Button from '../components/Button';

export const LoadingState = Object.freeze({
    Begin: 0,
    Done: 1,
    Error: -1
});

type Props = {
    navigation: Object
};
export default class BaseScreen extends React.Component<Props> {
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
        throw new Error('Children must be implemented!');
    }

    _doReload() {
        throw new Error('Children must be implemented!');
    }

    _doRenderRequireAuth() {
        const goToLogIn = () => this.props.navigation.navigate('Login');

        return (
            <View style={[Style.container, Style.contentCenter]}>
                <Text>You must log-in to view this content.</Text>
                <Button title={'Log in'} onPress={goToLogIn} />
            </View>
        );
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
                justifyContent: 'center',
                paddingHorizontal: 20
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
                    <Text style={style.loading}>
                        Whoops! Something went wrong. Please try again.
                    </Text>
                    <Button title={'Reload'} onPress={() => this._doReload()} />
                </View>
            );
        } else if (loadingState === LoadingState.Done) {
            return this._doRender();
        }

        throw new Error(`Unknown loading state ${loadingState} for rendering`);
    }
}
