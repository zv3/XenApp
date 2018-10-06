import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    LayoutAnimation
} from 'react-native';
import PropTypes from 'prop-types';
import { ButtonIcon } from './Button';

export default class PageNav extends React.Component {
    static propTypes = {
        links: PropTypes.object.isRequired,
        gotoPage: PropTypes.func.isRequired
    };

    state = {
        offsetY: 20
    };

    _onItemPressed(iconName) {
        const links = this.props.links;

        switch (iconName) {
            case 'chevrons-left':
                this.props.gotoPage(links.prev, 1);
                break;
            case 'chevron-left':
                this.props.gotoPage(links.prev, links.page - 1);
                break;
            case 'chevron-right':
                this.props.gotoPage(links.next, links.page + 1);
                break;
            case 'chevrons-right':
                this.props.gotoPage(links.next, links.pages);
                break;
        }
    }

    _doRenderButton(iconName, disabled = false) {
        return (
            <ButtonIcon
                iconName={iconName}
                disabled={disabled}
                iconColor={disabled ? '#888888' : 'rgba(255, 255, 255, 0.88)'}
                onPress={() => this._onItemPressed(iconName)}
            />
        );
    }

    show() {
        LayoutAnimation.easeInEaseOut();
        this.setState({
            offsetY: 20
        });
    }

    hide() {
        this.setState({
            offsetY: -35
        });
    }

    render() {
        const links = this.props.links;

        return (
            <View style={[styles.container, { bottom: this.state.offsetY }]}>
                {this._doRenderButton('chevrons-left', links.page === 1)}
                {this._doRenderButton('chevron-left', links.page === 1)}
                <Text style={styles.text}>
                    {this.props.links.page} / {this.props.links.pages}
                </Text>
                {this._doRenderButton(
                    'chevron-right',
                    links.page === links.pages
                )}
                {this._doRenderButton(
                    'chevrons-right',
                    links.page === links.pages
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: 200,
        height: 35,
        backgroundColor: '#131313',
        // bottom: -35,
        borderRadius: 4,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        left: (Dimensions.get('window').width - 220) / 2,
        paddingLeft: 10,
        paddingRight: 10
    },
    text: {
        fontSize: 17,
        color: 'rgba(255, 255, 255, 0.88)'
    }
});
