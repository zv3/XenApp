import React from 'react';
import {View, Text, Image, StyleSheet, Alert, FlatList} from 'react-native';
import LoadingScreen from "./LoadingScreen";
import ThreadListItem from "../ThreadListItem";
import ButtonIcon from "../ButtonIcon";
import {apiFetcher} from "../helpers/apiFetcher";


export default class HomeScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Home',
            headerRight: (
                <View style={{ flex: 1, marginRight: 10, flexDirection: 'row' }}>
                    <ButtonIcon iconName="log-in" onPress={() => {
                        navigation.navigate('Login');
                    }} />
                </View>
            )
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
                    renderItem={({item}) => <ThreadListItem thread={item}/>}
                />
            </View>
        );
    }
}