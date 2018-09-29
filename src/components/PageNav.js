import React from "react"
import {View, Text} from "react-native"

import PropTypes from "prop-types"
import {ButtonIcon} from "./Button";
import {style} from "../Style"

class PageNav extends React.Component {
    _calcPage(event) {
        switch (event) {
            case 'first':
                if (this.props.currentPage > 1) {
                    this.props.gotoPage(1);
                }
                break;
            case 'prev':
                const prevPage = Math.max(1, this.props.currentPage - 1);
                if (prevPage !== this.props.currentPage) {
                    this.props.gotoPage(prevPage);
                }
                break;
            case 'next':
                const nextPage = Math.min(this.props.maxPages, this.props.currentPage + 1);
                if (nextPage !== this.props.currentPage) {
                    this.props.gotoPage(nextPage);
                }
                break;
            case 'last':
                if (this.props.currentPage !== this.props.maxPages) {
                    this.props.gotoPage(this.props.maxPages);
                }
                break;
        }
    }

    render() {
        if (this.props.maxPages < 2) {
            return null;
        }

        const iconStyle = {
            padding: 0,
            backgroundColor: 'transparent'
        };

        return (
            <View style={style.pageNav.container}>
                <ButtonIcon iconName="chevrons-left"
                            onPress={() => this._calcPage('first')}
                            disabled={this.props.currentPage === 1}
                            style={iconStyle}
                            iconColor="white"/>
                <ButtonIcon iconName="chevron-left"
                            onPress={() => this._calcPage('prev')}
                            style={iconStyle}
                            iconColor="white"/>
                <Text style={style.pageNav.text}>{this.props.currentPage} / {this.props.maxPages}</Text>
                <ButtonIcon iconName="chevron-right"
                            onPress={() => this._calcPage('next')}
                            style={iconStyle}
                            iconColor="white"/>
                <ButtonIcon iconName="chevrons-right"
                            onPress={() => this._calcPage('last')}
                            disabled={this.props.currentPage === this.props.maxPages}
                            style={iconStyle}
                            iconColor="white"/>
            </View>
        );
    }
}

PageNav.propTypes = {
    maxPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    gotoPage: PropTypes.func.isRequired
};

export default PageNav;