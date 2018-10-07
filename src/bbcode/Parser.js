const tagsDoesNotHaveChildren = ['img'];

const parseOptions = (tag, tagName, content) => {
  const matches = tag.match(/=(\'|")?(.*)(\'|")?[^\]]*\]/);

  if (tagName === 'url') {
    if (matches === null) {
      return {
        url: content
      };
    }

    return {
      url: matches[2]
    };
  } else if (tagName === 'img') {
    return {
      url: content
    };
  } else if (tagName === 'color') {
    if (matches !== null) {
      return {
        color: matches[2]
      };
    }
  }

  return null;
};

const parseText = (text) => {
  let tagMap = [];

  tagMap.push({
    tagName: undefined,
    content: text
  });

  return tagMap;
};

const parseTagChildren = (tagName, content) => {
  if(!content.length) {
    return [];
  }

  if (tagsDoesNotHaveChildren.indexOf(tagName) !== -1) {
    return [];
  }

  switch (tagName) {
    case 'list':
      const elements = content.split('\n');
      const tagMap = [];

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (!element.length) {
          continue;
        }

        const children = Parser(element.substr(3));

        tagMap.push({
          tagRaw: element,
          tagName: undefined,
          content: children.length > 0 ? '' : element.substr(3),
          children: children
        });
      }

      return tagMap;
    default:
      return Parser(content);
  }
};

export const Parser = (message) => {
  let index = 0;
  let tagMap = [];

  const matches = message.match(/(?:\[([a-z0-9_]+)(=|\])|\[\/([a-z0-9_]+)])/gi);

  if (matches === null) {
    return [
      {
        tagName: undefined,
        content: message,
        children: []
      }
    ];
  }

  while (index < matches.length) {
    let tag = matches[index];
    index++;

    if (tag.substr(-1) !== ']') {
      // missing close tags
      const openPosition = message.indexOf(tag);
      const closePosition = message.indexOf(']');

      tag = message.substring(openPosition, closePosition + 1);
    }

    const tagPosition = message.indexOf(tag);
    if (tagPosition > 0) {
      const tagContent = message.substr(0, tagPosition);
      const textMap = parseText(tagContent);
      for (let i = 0; i < textMap.length; i++) {
        tagMap.push(textMap[i]);
      }

      message = message.substr(tagPosition + tag.length);
    } else {
      message = message.substr(tag.length);
    }

    let tagName = tag.substr(1),
      splitterPosition = tagName.indexOf('=');
    if (splitterPosition !== -1) {
      tagName = tagName.substring(0, splitterPosition);
    } else {
      tagName = tagName.substr(0, tagName.length - 1);
    }

    let closeTagIndex = index,
      closeTag;
    while (closeTagIndex < matches.length) {
      // loop to find close tag.
      const closeTag_ = matches[closeTagIndex];
      closeTagIndex++;

      if (closeTag_.toLowerCase() === `[/${tagName.toLowerCase()}]`) {
        closeTag = closeTag_;
        break;
      }
    }

    if (closeTag) {
      const closeTagPosition = message.indexOf(closeTag);
      const tagContent = message.substr(0, closeTagPosition);

      message = message.substr(closeTagPosition + closeTag.length);
      const tagNameLower = tagName.toLowerCase();
      const children = parseTagChildren(tagNameLower, tagContent);

      tagMap.push({
        tagRaw: `${tag}${tagContent}${closeTag}`,
        tagName: tagNameLower,
        content: children.length > 0 ? '' : tagContent,
        options: parseOptions(tag, tagNameLower, tagContent),
        children: children
      });

      index = closeTagIndex;
    }
  }

  if (message.length > 0) {
    const textMap = parseText(message);
    for (let i = 0; i < textMap.length; i++) {
      tagMap.push(textMap[i]);
    }
  }

  return tagMap;
};
