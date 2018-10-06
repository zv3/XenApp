import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableHighlight,
    Text
} from 'react-native';
import PropTypes from 'prop-types';
import BaseScreen, { LoadingState } from './BaseScreen';
import { DrawerTrigger } from '../components/Drawer';
import { ButtonIcon } from '../components/Button';
import { fetcher } from '../utils/Fetcher';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Feather';
import ThreadRow, { ThreadRowSeparator } from '../components/ThreadRow';

export default class ForumScreen extends BaseScreen {
    static propTypes = {
        navigation: PropTypes.object.isRequired
    };

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        const backButtonVisible = !!params;

        return {
            title: params ? params.title : 'Forums',
            headerLeft: (
                <DrawerTrigger
                    isBack={backButtonVisible}
                    navigation={navigation}
                />
            )
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            navItems: []
        };
    }

    componentDidMount() {
        let parentId = 0,
            item,
            batchParams = [];
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

            batchParams.push({
                method: 'GET',
                uri: `forums/${item.forum_id}`
            });
        }

        return fetcher
            .post('batch', { body: JSON.stringify(batchParams) })
            .then((response) => {
                const navItems = response.jobs.navigation.elements;

                this._setLoadingState(LoadingState.Done);

                let stateData = {
                    navItems: navItems
                };

                if (item && item.navigation_type === 'forum') {
                    stateData.threads = response.jobs.threads.threads;
                    stateData.forum =
                        response.jobs[`forums/${item.forum_id}`].forum;
                }

                this.setState(stateData);
            })
            .catch(() => {
                this._setLoadingState(LoadingState.Error);
            });
    }

    _getRenderableItems() {
        let items = [];

        if (Array.isArray(this.state.navItems)) {
            for (let i = 0; i < this.state.navItems.length; i++) {
                let item = this.state.navItems[i];
                switch (item.navigation_type) {
                    case 'forum':
                        item.navigation_title = item.forum_title;
                        item.iconName = 'message-square';
                        break;
                    case 'category':
                        item.navigation_title = item.category_title;
                        item.iconName = 'folder';
                        break;
                    case 'page':
                        item.navigation_title = item.page_title;
                        item.iconName = 'external-link';
                        break;
                    case 'link-forum':
                        item.navigation_title = item.link_forum_title;
                        item.iconName = 'external-link';
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

    _onItemPressed(item) {
        this.props.navigation.dispatch(
            NavigationActions.navigate({
                routeName: 'Forum',
                key: `Forum_${item.navigation_id}`,
                params: {
                    parentId: item.navigation_id,
                    title: item.navigation_title,
                    item: item
                }
            })
        );
    }

    _doRenderNavItem(item) {
        const iconStyle = {
            paddingRight: 15
        };

        return (
            <TouchableHighlight
                onPress={() => this._onItemPressed(item)}
                key={JSON.stringify(item.navigation_id)}>
                <View style={styles.iconRowContainer}>
                    <Icon name={item.iconName} size={24} style={iconStyle} />
                    <Text style={styles.iconText}>{item.navigation_title}</Text>
                    <Icon name="chevron-right" size={24} />
                </View>
            </TouchableHighlight>
        );
    }

    _onCreateThreadPressed() {
        const forum = this.state.forum;

        this.props.navigation.dispatch(
            NavigationActions.navigate({
                routeName: 'ThreadCreate',
                key: `ThreadCreate_${forum.forum_id}`,
                params: {
                    forum: forum
                }
            })
        );
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
            <View style={styles.tableHeader}>
                {items.map((item) => this._doRenderNavItem(item))}
            </View>
        );
    }

    _doRenderMixed() {
        const forum = this.state.forum;
        let createThreadButton = null;

        if (forum.permissions.create_thread) {
            createThreadButton = (
                <ButtonIcon
                    iconName="plus"
                    iconSize={30}
                    type="primary"
                    onPress={() => this._onCreateThreadPressed()}
                    iconColor="white"
                    style={styles.addButton}
                />
            );
        }

        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.threads}
                    ListHeaderComponent={this._doRenderHeader()}
                    keyExtractor={(item) => JSON.stringify(item.thread_id)}
                    ItemSeparatorComponent={() => ThreadRowSeparator()}
                    renderItem={({ item }) => (
                        <ThreadRow
                            navigation={this.props.navigation}
                            thread={item}
                        />
                    )}
                />
                {createThreadButton}
            </View>
        );
    }

    _doRender() {
        if (this.state.threads) {
            return this._doRenderMixed();
        }

        return (
            <View>
                <FlatList
                    renderItem={({ item }) => this._doRenderNavItem(item)}
                    data={this._getRenderableItems()}
                    ItemSeparatorComponent={() => ThreadRowSeparator()}
                    keyExtractor={(item) => JSON.stringify(item.navigation_id)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    iconRowContainer: {
        flex: 1,
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#fafafa',
        alignItems: 'center'
    },
    iconText: {
        flex: 1,
        fontSize: 18
    },

    tableHeader: {
        flex: 1,
        paddingBottom: 20
    },

    addButton: {
        width: 40,
        height: 40,
        position: 'absolute',
        bottom: 20,
        right: 20,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        backgroundColor: '#ff4081',
        shadowColor: '#000',
        shadowOpacity: 0.24,
        shadowOffset: { width: 1, height: 1 }
    }
});
