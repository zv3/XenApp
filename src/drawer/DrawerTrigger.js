import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import ButtonIcon from '../components/ButtonIcon';

export default class DrawerTrigger extends React.PureComponent {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        isBack: PropTypes.bool,
        iconSize: PropTypes.number,
        style: PropTypes.object
    };

    static defaultProps = {
        iconSize: 28,
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
