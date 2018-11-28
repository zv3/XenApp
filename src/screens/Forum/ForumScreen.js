import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableHighlight,
    Text
} from 'react-native';
import PropTypes from 'prop-types';
import BaseScreen, { LoadingState } from '../BaseScreen';
import ButtonIcon from '../../components/ButtonIcon';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Feather';
import { ThreadRowSeparator } from '../../components/ThreadRow';
import DrawerTrigger from '../../drawer/DrawerTrigger';
import BatchApi from '../../api/BatchApi';
import ThreadList from "../../components/ThreadList";

export default class ForumScreen extends BaseScreen {
    static propTypes = {
        navigation: PropTypes.object.isRequired
    };

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        const backButtonVisible = !!params;
        const backToRoot = () => navigation.navigate('Forum');

        const headerRightStyle = { marginRight: 10 };

        const headerRight =
            backButtonVisible ? <ButtonIcon iconName={'home'} onPress={backToRoot} style={headerRightStyle}/> : null;

        return {
            title: params ? params.title : 'Forums',
            headerLeft: (
                <DrawerTrigger
                    isBack={backButtonVisible}
                    navigation={navigation}
                />
            ),
            headerRight: headerRight
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
            item;

        const { navigation } = this.props;
        if (navigation) {
            parentId = navigation.getParam('parentId', 0);
            item = navigation.getParam('item');
        }

        BatchApi.addRequest('GET', 'navigation', {
            parent: parentId
        });

        if (item && item.navigation_type === 'forum') {
            BatchApi.addRequest('get', 'threads', { forum_id: item.forum_id });
            BatchApi.addRequest('get', `forums/${item.forum_id}`);
        }

        BatchApi.dispatch()
            .then((response) => {
                const { navigation, threads } = response;

                const stateData = {
                    navItems: navigation.elements
                };

                if (item && item.navigation_type === 'forum') {
                    stateData.threads = threads.threads;
                    stateData.forum = response[`forums/${item.forum_id}`].forum;
                }
                this._setLoadingState(LoadingState.Done, stateData);
            })
            .catch(() => this._setLoadingState(LoadingState.Error));
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
        const { forum, threads } = this.state;
        let createThreadButton = null;

        if (forum.permissions.create_thread) {
            createThreadButton = (
                <View style={styles.floatButton}>
                    <ButtonIcon
                        iconName="plus"
                        iconSize={30}
                        type="primary"
                        onPress={() => this._onCreateThreadPressed()}
                        iconColor="white"
                        style={styles.addButton}
                    />
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <ThreadList
                    threads={threads}
                    navigation={this.props.navigation}
                    ListHeaderComponent={this._doRenderHeader()}
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
            <View style={styles.container}>
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

    floatButton: {
        position: 'absolute',
        bottom: 20,
        right: 20
    },

    addButton: {
        width: 40,
        height: 40,
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
