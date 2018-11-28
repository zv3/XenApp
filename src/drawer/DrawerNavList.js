import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, StyleSheet, View } from 'react-native';
import DrawerNavItem from './DrawerNavItem';
import DrawerHeader from './DrawerHeader';
import AuthEvent from '../events/AuthEvent';
import { Visitor } from '../utils/Visitor';
import BaseEvent from "../events/BaseEvent";

const navItems = [
    {
        title: 'Home',
        icon: 'home',
        navigationId: 'Home'
    },
    {
        title: 'Notifications',
        icon: 'bell',
        navigationId: 'NotificationList'
    },
    {
        title: 'Conversations',
        icon: 'inbox',
        navigationId: 'ConversationList'
    },
    {
        title: 'Forums',
        icon: 'folder',
        navigationId: 'Forum'
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

    state = {
        user: null
    };

    _onNavItemPress = (item) =>
        this.props.navigation.navigate(item.navigationId);
    _renderNavItem = ({ item }) => {
        return <DrawerNavItem item={item} onPress={this._onNavItemPress} />;
    };

    _onAuthEvent = (user) => this.setState({ user });

    componentDidMount(): void {
        AuthEvent.addListener(this._onAuthEvent);

        Visitor.getVisitor()
            .then((user) => this.setState({ user }))
            .catch(() => this._onAuthEvent(null));
    }

    componentWillUnmount(): void {
        AuthEvent.removeListener(this._onAuthEvent);
    }

    render() {
        const { navigation } = this.props;

        return (
            <View style={styles.container}>
                <DrawerHeader navigation={navigation} user={this.state.user} />
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
