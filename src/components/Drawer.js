import React from 'react';
import {
    View,
    TouchableHighlight,
    FlatList,
    Text,
    StyleSheet,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import PropTypes from 'prop-types';
import ButtonIcon from './ButtonIcon';

class DrawerTrigger extends React.Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        isBack: PropTypes.bool,
        iconSize: PropTypes.number,
        style: PropTypes.object
    };

    static defaultProps = {
        iconSize: 25,
        isBack: false
    };

    _onPressed = () => {
        const { navigation, isBack } = this.props;
        isBack ? navigation.goBack() : navigation.toggleDrawer();
    };

    render() {
        const { iconSize, style, isBack } = this.props;
        const defaultStyle = { marginLeft: 10 };

        return (
            <ButtonIcon
                iconName={isBack ? 'chevron-left' : 'menu'}
                iconColor={Platform.OS === 'ios' ? 'red' : 'white'}
                iconSize={iconSize}
                style={[defaultStyle, style]}
                onPress={this._onPressed}
            />
        );
    }
}

class DrawerMenuContent extends React.Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            user: null
        };
    }

    _onPress(item) {
        this.props.navigation.navigate(item.navigationId);
    }

    _doRenderUser() {
        const defaultUserStyle = {
            color: '#fff',
            fontSize: 16,
            marginTop: 10,
            fontWeight: 'bold'
        };

        return (
            <View style={styles.header}>
                <Text style={defaultUserStyle}>{this.state.user.username}</Text>
            </View>
        );
    }

    render() {
        const navItems = [
            {
                title: 'Home',
                key: 'home',
                icon: 'home',
                navigationId: 'Home'
            },
            {
                title: 'Notifications',
                key: 'notifications',
                icon: 'bell',
                navigationId: ''
            },
            {
                title: 'Conversations',
                key: 'conversations',
                icon: 'inbox',
                navigationId: 'Conversation'
            },
            {
                title: 'Forums',
                key: 'forums',
                icon: 'folder',
                navigationId: 'Forum'
            },
            {
                title: 'Watched Content',
                key: 'watched_content',
                icon: 'bookmark',
                navigationId: ''
            },
            {
                title: 'Settings',
                key: 'settings',
                icon: 'settings',
                navigationId: ''
            }
        ];

        let userHeader;
        if (this.state.user) {
            userHeader = this._doRenderUser();
        } else {
            userHeader = null;
        }

        const iconStyle = {
            paddingRight: 20
        };
        const textStyle = {
            fontSize: 16
        };

        return (
            <View style={styles.container}>
                {userHeader}
                <FlatList
                    data={navItems}
                    renderItem={({ item }) => (
                        <TouchableHighlight
                            onPress={() => this._onPress(item)}
                            underlayColor="rgb(237, 246, 253)">
                            <View style={styles.item}>
                                <Icon
                                    name={item.icon}
                                    size={20}
                                    style={iconStyle}
                                />
                                <Text style={textStyle}>{item.title}</Text>
                            </View>
                        </TouchableHighlight>
                    )}
                />
            </View>
        );
    }
}

export { DrawerTrigger, DrawerMenuContent };

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgb(245,245,245)',
        flex: 1,
        borderWidth: 0
    },

    header: {
        backgroundColor: 'red',
        height: 160,
        padding: 15,
        justifyContent: 'flex-end'
    },

    item: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }
});
