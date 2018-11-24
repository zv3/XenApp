import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import Icon from 'react-native-vector-icons/Feather';

export default class ButtonIcon extends React.PureComponent {
    static propTypes = {
        iconName: PropTypes.string.isRequired,
        iconSize: PropTypes.number,
        iconColor: PropTypes.string,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        iconSize: 25,
        disabled: false
    };

    render() {
        const { title, style } = this.props;
        const buttonStyles = [];

        if (title) {
            buttonStyles.push({
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            });
        }
        buttonStyles.push(style);

        return (
            <Button title={''} {...this.props} style={buttonStyles}>
                <Icon
                    name={this.props.iconName}
                    color={this.props.iconColor}
                    size={this.props.iconSize}
                />
            </Button>
        );
    }
}
