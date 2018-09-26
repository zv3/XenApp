import React from 'react';
import PropTypes from 'prop-types';
import ButtonIcon from "./ButtonIcon";

export default class DrawerTrigger extends React.Component {
    _onPressed() {
        if (this.props.isBack) {
            this.props.navigation.goBack();
        } else {
            this.props.navigation.toggleDrawer();
        }
    }

    render() {
        const styles = this.props.style ? this.props.style : {};

        return (
            <ButtonIcon iconName={this.props.isBack ? 'chevron-left' : 'menu'}
                        iconColor="red"
                        iconSize={this.props.size}
                        style={{marginLeft: 10}}
                        onPress={() => this._onPressed()}/>
        );
    }
}

DrawerTrigger.propTypes = {
    size: PropTypes.number,
    isBack: PropTypes.bool,
    navigation: PropTypes.object
};

DrawerTrigger.defaultProps = {
    size: 25,
    isBack: false
};