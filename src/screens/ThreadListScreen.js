import React from "react";
import {DrawerTrigger} from "../components/Drawer";
import {Alert, FlatList, View} from "react-native";
import {LoadingSwitch} from "./LoadingScreen";
import {CardSeparator, ThreadCard} from "../components/Card";
import {Config} from "../Config";

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
            loadingState: Config.Constants.LOADING_STATE_BEGIN
        };
    }

    componentDidMount() {
        const forum = this.props.navigation.getParam('forum');

        return fetch(forum.links.threads)
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
                    loadingState: Config.Constants.LOADING_STATE_DONE,
                    dataSource: responseJson.threads
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        let view;
        if (this.state.loadingState === Config.Constants.LOADING_STATE_DONE) {
            view = (
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={this.state.dataSource}
                        keyExtractor={(item, index) => JSON.stringify(item.thread_id)}
                        ItemSeparatorComponent={() => <CardSeparator/>}
                        renderItem={({item}) => <ThreadCard thread={item} navigation={this.props.navigation}/>}
                    />
                </View>
            );
        }

        return <LoadingSwitch loadState={this.state.loadingState} view={view}/>;
    }
}

export default ThreadListScreen