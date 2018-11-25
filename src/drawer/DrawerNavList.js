import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, StyleSheet, View } from 'react-native';
import DrawerNavItem from './DrawerNavItem';
import DrawerHeader from './DrawerHeader';

const navItems = [
    {
        title: 'Home',
        icon: 'home',
        navigationId: 'Home'
    },
    {
        title: 'Notifications',
        icon: 'bell',
        navigationId: 'Notifications'
    },
    {
        title: 'Conversations',
        icon: 'inbox',
        navigationId: 'Conversation'
    },
    {
        title: 'Forums',
        icon: 'folder',
        navigationId: 'Forum'
    },
    {
        title: 'Watched Content',
        icon: 'bookmark',
        navigationId: 'WatchedContent'
    },
    {
        title: 'Settings',
        icon: 'settings',
        navigationId: 'Settings'
    }
];

export default class DrawerNavList extends React.PureComponent {
    static propTypes = {
        navigation: PropTypes.object.isRequired
    };

    _onNavItemPress = (item) =>
        this.props.navigation.navigate(item.navigationId);
    _renderNavItem = ({ item }) => (
        <DrawerNavItem item={item} onPress={this._onNavItemPress} />
    );

    render() {
        const { navigation } = this.props;

        return (
            <View style={styles.container}>
                <DrawerHeader navigation={navigation} />
                <FlatList
                    data={navItems}
                    keyExtractor={(item) => item.navigationId}
                    renderItem={this._renderNavItem}
                    getItemLayout={(data, index) => ({
                        length: 40,
                        offset: 40 * index,
                        index: index
                    })}
                    numColumns={1}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        flex: 1,
        borderWidth: 0
    }
});
