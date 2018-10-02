import React from 'react';
import {
    View, Text, FlatList, TouchableHighlight, StyleSheet,
    ScrollView
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Feather';
import LoadingScreen, {LoadingSwitch} from "./LoadingScreen";
import {apiFetcher} from "../helpers/apiFetcher";
import {DrawerTrigger} from "../components/Drawer";
import {Config} from "../Config";
import {handleDefaultErrors, isPlainObject} from "../helpers/funcs";
import {CardSeparator, ThreadCard} from "../components/Card";
import {ButtonIcon} from "../components/Button";

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
        const backButtonVisible = !!params;

        return {
            title: params ? params.title : 'Forums',
            headerLeft: (
                <DrawerTrigger isBack={backButtonVisible} navigation={navigation} />
            ),
            headerRight: (
                <ButtonIcon iconName="home" onPress={() => (
                    console.log(222)
                )}/>
            )
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            loadingState: Config.Constants.LOADING_STATE_BEGIN
        };
    }

    componentDidMount() {
        let parentId = 0, item, batchParams = [];
        if (this.props.navigation) {
            parentId = this.props.navigation.getParam('parentId', 0);
            item = this.props.navigation.getParam('item');
        }

        batchParams.push({
            method: 'GET',
            uri: 'navigation',
            params: {
                parent: parentId
            }
        });

        if (item && item.navigation_type === 'forum') {
            batchParams.push({
                method: 'GET',
                uri: 'threads',
                params: {
                    forum_id: item.forum_id
                }
            });
        }

        return apiFetcher.post('batch', JSON.stringify(batchParams), {
            onSuccess: (data) => {
                this.setState({
                    loadingState: Config.Constants.LOADING_STATE_DONE,
                    navDataSource: data.jobs.navigation.elements,
                    threads: data.jobs.hasOwnProperty('threads') ? data.jobs.threads.threads : null
                });
            },
            onError: (errors) => {
                handleDefaultErrors(errors);
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
                        title: item.navigation_title,
                        item: item
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

    _doRenderHeader() {
        if (!this.state.threads) {
            return null;
        }

        const items = this._getRenderableItems();
        if (items.length === 0) {
            return null;
        }

        return (
            <View style={{ flex: 1, paddingBottom: 20 }}>
                {items.map((item, index) => (
                    this._doRenderNavItem(item)
                ))}
            </View>
        );
    }

    _getRenderableItems() {
        let items = [];

        if (Array.isArray(this.state.navDataSource)) {
            for (let i = 0; i < this.state.navDataSource.length; i++) {
                let item = this.state.navDataSource[i];
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
        }

        return items;
    }

    _doRenderNavItem(item) {
        return (
            <TouchableHighlight onPress={() => this._onItemPressed(item)} key={JSON.stringify(item.navigation_id)}>
                <View style={style.row}>
                    <Icon name="folder" size={24} style={{ paddingRight: 15 }} />
                    <Text style={style.text}>{item.navigation_title}</Text>
                    <Icon name="chevron-right" size={24} />
                </View>
            </TouchableHighlight>
        );
    }

    _doRenderNavList() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={this._getRenderableItems()}
                    keyExtractor={(item, index) => JSON.stringify(item.navigation_id)}
                    renderItem={({item}) => this._doRenderNavItem(item)}
                />
            </View>
        );
    }

    _doRenderMixedList() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={this.state.threads}
                    ListHeaderComponent={this._doRenderHeader()}
                    keyExtractor={(item, index) => JSON.stringify(item.thread_id)}
                    ItemSeparatorComponent={() => <CardSeparator/>}
                    renderItem={({item}) => <ThreadCard navigation={this.props.navigation}
                                                        thread={item}/>}
                />
            </View>
        );
    }

    render() {
        let contentView;
        if (this.state.navDataSource && this.state.threads) {
            contentView = this._doRenderMixedList();
        } else {
            contentView = this._doRenderNavList();
        }

        return <LoadingSwitch loadState={this.state.loadingState} view={contentView}/>;
    }
}