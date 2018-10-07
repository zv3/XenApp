import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Parser } from './Parser';
import PropTypes from 'prop-types';
import AutoResizeImage from './AutoResizeImage'

const bbCodeTagIntoNativeView = {
  br: View,
  b: Text,
  i: Text,
  u: Text,
  color: Text,
  quote: View,
  attach: Text,
  plain: Text
};

const convertOptionsToProps = (tagName, options) => {
  let props = {};

  if (tagName === 'color') {
    if (options.color) {
      props.style = {
        color: options.color
      };
    }
  } else if (tagName === 'b') {
    props.style = {
      fontWeight: 'bold'
    };
  } else if (tagName === 'quote') {
    props.style = {
        borderLeftWidth: 3,
        borderLeftColor: '#f2930d',
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
        borderTopWidth: 1,
        borderTopColor: '#dfdfdf',
        borderRightWidth: 1,
        borderRightColor: '#dfdfdf',
        borderBottomWidth: 1,
        borderBottomColor: '#dfdfdf',

        backgroundColor: '#f5f5f5'
    };
  }

  return props;
};

export default class Renderer extends React.Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    onLinkPressed: PropTypes.func,
    renderTag: PropTypes.func
  };

  _onLinkPressed(tag) {
    if (typeof this.props.onLinkPressed !== 'function') {
      return;
    }

    const url = tag.options.url || tag.content;
    this.props.onLinkPressed(url);
  }

  _defaultRenderTag(tag, index) {
    let view = null;

    if (bbCodeTagIntoNativeView.hasOwnProperty(tag.tagName)) {
      const TagName = bbCodeTagIntoNativeView[tag.tagName];
      const props = convertOptionsToProps(tag.tagName, tag.options);

      view = (
        <TagName {...props} key={index}>
          {this._doRenderTagMap(tag.children)}
        </TagName>
      );
    } else if (tag.tagName === 'url') {
      view = (
        <Text key={index} style={{ color: 'red' }}>
            <Text onPress={() => this._onLinkPressed(tag)}>{this._doRenderTagMap(tag.children)}</Text>
        </Text>
      );
    } else if (tag.tagName === 'list') {
      view = (
        <View key={index}>
          <Text>{tag.tagRaw}</Text>
        </View>
      );
    } else if (tag.tagName === 'img') {
      view = <AutoResizeImage uri={tag.content} key={index} />
    }

    return view;
  }

  _doRenderTagMap(tagMap) {
    if (!tagMap.length) {
      return null;
    }

    let views = [];

    for (let index = 0; index < tagMap.length; index++) {
      const tag = tagMap[index];
      if (tag.tagName === undefined) {
        // it is text.
        if (tag.content.length > 0) {
          views.push(<Text key={index}>{tag.content}</Text>);
        }
      } else {
        let view;
        const { renderTag } = this.props;
        if (typeof renderTag === 'function') {
          view = renderTag(tag, index, this._defaultRenderTag);
        }

        if (view === undefined) {
          view = this._defaultRenderTag(tag, index);
        }

        if (view !== null) {
          views.push(view);
        }
      }
    }

    return views;
  }

  render() {
    const tagMap = Parser(this.props.content);
    if (!tagMap.length) {
      return (
        <View>
          <Text>{this.props.content}</Text>
        </View>
      );
    }

    return this._doRenderTagMap(tagMap);
  }
}
