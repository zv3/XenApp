import React from 'react';
import {View, Alert, FlatList} from 'react-native';
import {LoadingSwitch} from "./LoadingScreen";
import {ButtonIcon} from "../components/Button";
import {apiFetcher} from "../helpers/apiFetcher";
import {CardSeparator, ThreadCard} from "../components/Card"
import {objectStore} from "../data/objectStore";
import Avatar from "../components/Avatar";
import {Config} from "../Config";
import {simpleEventDispatcher} from "../events/simpleEventDispatcher";

class HomeHeaderRight extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: objectStore.get(Config.Constants.VISITOR)
        };

        this.subscribeId = 0;
    }

    componentDidMount() {
        this.subscribeId = simpleEventDispatcher.subscribe('logged', () => {
            this.setState({ user: objectStore.get(Config.Constants.VISITOR)});
        });
    }

    componentWillUnmount() {
        simpleEventDispatcher.unsubscribe('logged', this.subscribeId);
    }

    render() {
        if (this.state.user) {
            const user = this.state.user;

            return (
            <View style={{ marginRight: 10 }}>
                <Avatar url={user.links.avatar_small} size={25}/>
            </View>);
        }

        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <ButtonIcon iconName="log-in" onPress={() => {
                    this.props.navigation.navigate(Config.Constants.SCREEN_LOGIN);
                }} />
            </View>
        );
    }
}

export default class HomeScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Home',
            headerRight: (<HomeHeaderRight navigation={navigation}/>)
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loadingState: Config.Constants.LOADING_STATE_BEGIN
        };
    }

    componentDidMount() {
        return apiFetcher.get('threads/recent', {}, {
            onSuccess: (data) => {
                this.setState({
                    dataSource: data.results,
                    loadingState: Config.Constants.LOADING_STATE_DONE
                });
            },
            onError: () => {
                Alert.alert('Failed load data', 'Failed to load data. Please try again.');
            }
        });
    }

    _doRefreshData() {
    }

    render() {
        const finalView = (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={this.state.dataSource}
                    keyExtractor={(item, index) => JSON.stringify(item.thread_id)}
                    ItemSeparatorComponent={() => <CardSeparator/>}
                    renderItem={({item}) => <ThreadCard thread={item} navigation={this.props.navigation}/>}
                />
            </View>
        );

        return <LoadingSwitch loadState={this.state.loadingState}
                              view={finalView}
                              refreshFn={() => this._doRefreshData()}/>
    }
}