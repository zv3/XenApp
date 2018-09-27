import React from 'react';
import {
    View, Text, FlatList, TouchableHighlight, StyleSheet
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Feather';
import LoadingScreen from "./LoadingScreen";
import {apiFetcher} from "../helpers/apiFetcher";
import {DrawerTrigger} from "../components/Drawer";
import {Config} from "../Config";

const style = StyleSheet.create({
   row: {
       flex: 1,
       flexDirection: 'row',
       padding: 15,
       backgroundColor: '#fafafa',
       alignItems: 'center'
   },
    text: {
       flex: 1,
        fontSize: 18
    }
});

export default class ForumScreen extends React.Component {
    static navigationOptions = ({navigation, navigationOptions}) => {
        const { params } = navigation.state;
        const backButtonVisible = params ? true : false;

        return {
            title: params ? params.title : 'Forums',
            headerLeft: (
                <DrawerTrigger isBack={backButtonVisible} navigation={navigation} />
            )
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true
        };
    }

    componentDidMount() {
        let parentId = 0;
        if (this.props.navigation) {
            parentId = this.props.navigation.getParam('parentId', 0);
        }

        return apiFetcher.get('navigation', {parent: parentId}, {
            onSuccess: (data) => {
                this.setState({
                    isLoading: false,
                    dataSource: data.elements
                });
            },
            onError: () => {
            }
        })
    }

    _onItemPressed(item) {
        if (item.has_sub_elements) {
            this.props.navigation.dispatch(
                NavigationActions.navigate({
                    routeName: Config.Constants.SCREEN_FORUM,
                    key: `forum_nav_${item.navigation_id}`,
                    params: {
                        parentId: item.navigation_id,
                        title: item.navigation_title
                    }
                })
            );

            return;
        }

        if (item.navigation_type === 'forum') {
            // load threads
            this.props.navigation.dispatch(
                NavigationActions.navigate({
                    routeName: Config.Constants.SCREEN_THREAD_LIST,
                    key: `forum_${item.navigation_id}`,
                    params: {
                        forum: item
                    }
                })
            );
        }
    }

    render() {
        if (this.state.isLoading) {
            return (<LoadingScreen/>);
        }

        let items = [];
        for (let i = 0; i < this.state.dataSource.length; i++) {
            let item = this.state.dataSource[i];
            switch (item.navigation_type) {
                case 'forum':
                    item.navigation_title = item.forum_title;
                    break;
                case 'category':
                    item.navigation_title = item.category_title;
                    break;
                case 'page':
                    item.navigation_title = item.page_title;
                    break;
                case 'link-forum':
                    item.navigation_title = item.link_forum_title;
                    break;
            }

            if (!item.hasOwnProperty('navigation_title')) {
                continue;
            }

            items.push(item);
        }

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={items}
                    keyExtractor={(item, index) => JSON.stringify(item.navigation_id)}
                    renderItem={({item}) => (
                        <TouchableHighlight onPress={() => this._onItemPressed(item)}>
                            <View style={style.row}>
                                <Icon name="folder" size={24} style={{ paddingRight: 15 }} />
                                <Text style={style.text}>{item.navigation_title}</Text>
                                <Icon name="chevron-right" size={24} />
                            </View>
                        </TouchableHighlight>
                    )}
                />
            </View>
        );
    }
}