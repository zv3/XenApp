import React from 'react';
import {View, Alert, FlatList, Image} from 'react-native';
import LoadingScreen from "./LoadingScreen";
import ButtonIcon from "../ButtonIcon";
import {apiFetcher} from "../helpers/apiFetcher";
import {ThreadCard} from "../components/Card"
import {dataStore} from "../helpers/dataStore";
import {objectStore} from "../data/objectStore";
import Avatar from "../components/Avatar";
import {Config} from "../Config";


class HomeHeaderRight extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: objectStore.get(Config.Constants.VISITOR)
        };
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
            <View style={{ flex: 1, marginRight: 10, flexDirection: 'row' }}>
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