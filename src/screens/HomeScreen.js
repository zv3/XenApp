import React from 'react';
import {View, Alert, FlatList, Image} from 'react-native';
import LoadingScreen from "./LoadingScreen";
import ButtonIcon from "../ButtonIcon";
import {apiFetcher} from "../helpers/apiFetcher";
import {ThreadCard} from "../components/Card"
import {dataStore} from "../helpers/dataStore";


class HomeHeaderRight extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        const _doFetchUser = () => {
            apiFetcher.get('users/me', {}, {
                onSuccess: (data) => {
                    this.setState({ user: data.user });
                }
            });
        };

        dataStore.getOAuthData().then((value) => {
            let json;
            try {
                json = JSON.parse(value);
            } catch (e) {
            }

            if (json && json.hasOwnProperty('access_token')) {
                _doFetchUser();
            }
        });

    }

    render() {
        if (this.state.user) {
            const user = this.state.user;

            return (
            <View>
                <Image source={{ uri: user.links.avatar_small }}
                       style={{ width: 25, height: 25, borderRadius: 12.5, marginRight: 10 }}/>
            </View>);
        }

        return (
            <View style={{ flex: 1, marginRight: 10, flexDirection: 'row' }}>
                <ButtonIcon iconName="log-in" onPress={() => {
                    this.props.navigation.navigate('Login');
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
            isLoading: true
        };
    }

    componentDidMount() {
        return apiFetcher.get('threads/recent', {}, {
            onSuccess: (data) => {
                this.setState({
                    dataSource: data.results,
                    isLoading: false
                });
            },
            onError: () => {
                Alert.alert('Failed load data', 'Failed to load data. Please try again.');
            }
        });
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingScreen/>;
        }

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={this.state.dataSource}
                    keyExtractor={(item, index) => JSON.stringify(item.thread_id)}
                    ItemSeparatorComponent={() => <View style={{ width:"100%", backgroundColor: 'rgb(245,245,245)', height: 10 }}>hi</View>}
                    renderItem={({item}) => <ThreadCard thread={item}/>}
                />
            </View>
        );
    }
}