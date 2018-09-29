import React from "react"
import {View, Text} from "react-native"
import PropTypes from "prop-types"
import moment from "moment"

import {style} from "../Style"

class DateRelative extends React.Component {
    render() {
        if (!this.props.date) {
            return null;
        }

        return (
            <View>
                <Text style={style.dateRelative.text}>{moment(this.props.date * 1000).fromNow()}</Text>
            </View>
        );
    }
}
DateRelative.propTypes = {
    date: PropTypes.number.isRequired
};

export default DateRelative
