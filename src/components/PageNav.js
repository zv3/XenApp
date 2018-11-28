import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated,
    Easing
} from 'react-native';
import PropTypes from 'prop-types';
import ButtonIcon from './ButtonIcon';

const { width } = Dimensions.get('window');
const PAGE_NAV_WIDTH = 200;

export default class PageNav extends React.PureComponent {
    static propTypes = {
        links: PropTypes.object.isRequired,
        gotoPage: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            translateY: new Animated.Value(35)
        };

        this._showDelayId = 0;
    }

    _onItemPressed = (iconName) => {
        const { links, gotoPage } = this.props;
        const { prev, page, pages, next } = links;

        switch (iconName) {
            case 'chevrons-left':
                gotoPage(prev, 1);
                break;
            case 'chevron-left':
                gotoPage(prev, page - 1);
                break;
            case 'chevron-right':
                gotoPage(next, page + 1);
                break;
            case 'chevrons-right':
                gotoPage(next, pages);
                break;
            default:
                throw new Error(`Unknown icon name ${iconName}`);
        }
    };

    _doRenderButton = (iconName, disabled = false) => (
        <ButtonIcon
            iconName={iconName}
            disabled={disabled}
            iconColor={disabled ? '#888888' : 'rgba(255, 255, 255, 0.88)'}
            onPress={() => this._onItemPressed(iconName)}
        />
    );

    show() {
        if (this._showDelayId) {
            clearTimeout(this._showDelayId);
        }

        this._showDelayId = setTimeout(() => {
            this._showDelayId = 0;

            Animated.timing(this.state.translateY, {
                toValue: -65,
                duration: 100,
                useNativeDriver: true,
                easing: Easing.bounce
            }).start();
        }, 1000);
    }

    hide() {
        if (this._showDelayId) {
            clearTimeout(this._showDelayId);
            this._showDelayId = 0;
        }

        Animated.timing(this.state.translateY, {
            toValue: 35,
            duration: 100,
            useNativeDriver: true
        }).start();
    }

    componentWillUnmount(): void {
        if (this._showDelayId) {
            clearTimeout(this._showDelayId);
            this._showDelayId = 0;
        }
    }

    render() {
        const { page, pages } = this.props.links;

        const transform = {
            transform: [{ translateY: this.state.translateY }]
        };

        return (
            <Animated.View style={transform}>
                <View style={styles.container}>
                    {this._doRenderButton('chevrons-left', page === 1)}
                    {this._doRenderButton('chevron-left', page === 1)}

                    <Text style={styles.text}>
                        {page} / {pages}
                    </Text>

                    {this._doRenderButton('chevron-right', page === pages)}
                    {this._doRenderButton('chevrons-right', page === pages)}
                </View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: PAGE_NAV_WIDTH,
        height: 35,
        backgroundColor: '#131313',
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        left: (width - PAGE_NAV_WIDTH - 10 * 2) / 2,
        paddingLeft: 10,
        paddingRight: 10,
        zIndex: 3
    },
    text: {
        fontSize: 17,
        color: 'rgba(255, 255, 255, 0.88)'
    }
});
