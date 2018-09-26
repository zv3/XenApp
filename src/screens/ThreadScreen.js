import React from 'react';
import {
    View, Text, Alert,
    FlatList
} from 'react-native';
import DrawerTrigger from "../DrawerTrigger";
import LoadingScreen from "./LoadingScreen";
import {ThreadCard} from "../components/Card";


class ThreadListScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        const { params } = navigation.state;

        return {
            title: params.forum.forum_title,
            headerLeft: (<DrawerTrigger isBack={true} navigation={navigation} />)
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true
        };
    }

    componentDidMount() {
        const forum = this.props.navigation.getParam('forum');

        return fetch(forum.links.threads + '&exclude_fields=first_post')
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.hasOwnProperty('errors')) {
                    const errors = responseJson.errors;

                    Alert.alert(
                        'Failed to load data',
                        errors[0]
                    );

                    return;
                }

                this.setState({
                   isLoading: false,
                   dataSource: responseJson.threads
                });
            })
            .catch((error) => {
                console.error(error);
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
                    renderItem={({item}) => <ThreadCard thread={item}/>}
                />
            </View>
        );
    }
}

export {
    ThreadListScreen
}