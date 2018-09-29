import React from 'react';
import {
    View, Text, ActivityIndicator
} from 'react-native';

import PropTypes from "prop-types";
import {Config} from "../Config";
import Icon from "react-native-vector-icons/Feather";
import {Button} from "../components/Button";

class LoadingScreen extends React.Component {
    render() {
        let iconView, textView;
        if (this.props.isError) {
            iconView = (<Icon name="alert-circle" size={100} color="#8c8c8c"/>);
            textView = (
                <View>
                    <Text style={{ fontSize: 18, marginTop: 20, color: "#8c8c8c" }}>Whoops! Something went wrong :(</Text>
                    <Button text="RELOAD" type="default"
                            onPress={() => this.props.refreshFn()}
                            style={{ padding: 5, marginTop: 20 }}/>
                </View>
            );
        } else {
            iconView = (<ActivityIndicator/>);
            textView = (<Text style={{ fontSize: 18 }}>Loading data...</Text>);
        }

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {iconView}
                {textView}
            </View>
        );
    }
}
LoadingScreen.propTypes = {
    isError: PropTypes.bool,
    refreshFn: PropTypes.func.isRequired
};
LoadingScreen.defaultProps = {
    isError: false
};

class LoadingSwitch extends React.Component {
    render() {
        if (this.props.loadState === Config.Constants.LOADING_STATE_BEGIN) {
            return (<LoadingScreen refreshFn={this.props.refreshFn}/>);
        } else if (this.props.loadState === Config.Constants.LOADING_STATE_FAILED) {
            return (<LoadingScreen isError={true} refreshFn={this.props.refreshFn}/>);
        }

        return this.props.view;
    }
}
LoadingSwitch.propTypes = {
    loadState: PropTypes.string.isRequired,
    view: PropTypes.object,
    refreshFn: PropTypes.func
};
LoadingSwitch.defaultProps = {
    refreshFn: () => {}
};

export {LoadingScreen, LoadingSwitch};