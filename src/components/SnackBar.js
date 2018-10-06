import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    LayoutAnimation
} from 'react-native';
import PropTypes from 'prop-types';

export default class SnackBar extends React.Component {
    constructor(props) {
        super(props);

        this.windowHeight = Dimensions.get('window').height;

        this.state = {
            offsetY: -this.windowHeight,
            text: ''
        };

        this.autoCloseId = 0;
    }

    componentWillUnmount() {
        if (this.autoCloseId > 0) {
            clearTimeout(this.autoCloseId);
        }
    }

    // string text
    // int duration <seconds>
    show(text, duration = 3) {
        LayoutAnimation.easeInEaseOut();

        this.setState({
            offsetY: 30,
            text: text
        });

        this.autoCloseId = setTimeout(() => {
            this.autoCloseId = 0;
            this.hide();
        }, 3 * 1000);
    }

    hide() {
        LayoutAnimation.easeInEaseOut();

        if (this.autoCloseId > 0) {
            clearTimeout(this.autoCloseId);
            this.autoCloseId = 0;
        }

        this.setState({
            offsetY: -this.windowHeight,
            duration: 200,
            text: ''
        });
    }

    render() {
        return (
            <View style={[styles.container, { bottom: this.state.offsetY }]}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>
                    {this.state.text}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#323232',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 4,

        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: -1 },
        width: Dimensions.get('window').width - 60,

        position: 'absolute'
    }
});
