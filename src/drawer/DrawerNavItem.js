import React from 'react';
import { TouchableHighlight, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { DrawerStyle } from '../Style';
import Visitor from '../utils/Visitor';
import AuthEvent from '../events/AuthEvent';

type Props = {
    item: Object,
    onPress: Function
};
export default class DrawerNavItem extends React.PureComponent<Props> {
    state = {
        counter: 0
    };

    _onOAuthEvent = (user) => {
        if (!user) {
            this.setState({ counter: 0 });

            return;
        }

        const item = this.props.item;
        if (
            item.navigationId === 'NotificationList' ||
            item.navigationId === 'ConversationList'
        ) {
            if (item.navigationId === 'NotificationList') {
                this.setState({
                    counter: user.user_unread_notification_count
                });
            } else if (item.navigationId === 'ConversationList') {
                this.setState({
                    counter: user.user_unread_conversation_count
                });
            }
        }
    };

    componentDidMount(): void {
        if (!Visitor.isGuest()) {
            this._onOAuthEvent(Visitor.getVisitor());
        }

        AuthEvent.addListener(this._onOAuthEvent);
    }

    componentWillUnmount(): void {
        AuthEvent.removeListener(this._onOAuthEvent);
    }

    render() {
        const { item, onPress } = this.props;
        const counter = this.state.counter;

        const counterComponent =
            counter > 0 ? (
                <Text style={DrawerStyle.itemBadge}>{counter}</Text>
            ) : null;

        return (
            <TouchableHighlight
                onPress={() => onPress(item)}
                underlayColor={DrawerStyle.itemHighlightedColor}>
                <View style={DrawerStyle.item}>
                    <Icon name={item.icon} size={20} />
                    <Text style={DrawerStyle.itemText}>{item.title}</Text>
                    {counterComponent}
                </View>
            </TouchableHighlight>
        );
    }
}
