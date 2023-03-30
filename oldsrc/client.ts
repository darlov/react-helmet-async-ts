import { HELMET_ATTRIBUTE, TAG_NAMES, TAG_PROPERTIES } from './constants';
import { HelmetTags, IStateType, IStateTypeTagNameMap } from "./types";

const updateTags = <K extends keyof IStateTypeTagNameMap>(type: K, tags: IStateTypeTagNameMap[K]) => {
  const headElement = document.head || document.querySelector(TAG_NAMES.HEAD);
  const tagNodes = headElement.querySelectorAll<HTMLElementTagNameMap[K]>(`${ type }[${ HELMET_ATTRIBUTE }]`);
  const oldTags = [...tagNodes];
  const newTags: typeof oldTags = [];
  let indexToDelete: number;

  if (tags && tags.length) {
    tags.forEach(tag => {
      const newElement = document.createElement(type);

      // eslint-disable-next-line
      for (const attribute in tag) {
        if (Object.hasOwn(tag, attribute)) {
          switch (attribute) {
            case TAG_PROPERTIES.INNER_HTML:
              newElement.innerHTML = tag[attribute as keyof typeof tag];
              break;
            case TAG_PROPERTIES.CSS_TEXT:
              // if (newElement.cssText) {
              //   newElement.sheet.cssText = tag.sheet.cssText;
              // } else {
              //   newElement.appendChild(document.createTextNode(tag.cssText));
              // }
              break;
            default:
              const value = typeof tag[attribute as keyof typeof tag] === undefined ? '' : tag[attribute as keyof typeof tag];
              newElement.setAttribute(attribute, value);
              break;
          }
        }
      }

      newElement.setAttribute(HELMET_ATTRIBUTE, 'true');

      // Remove a duplicate tag from domTagstoRemove, so it isn't cleared.
      if (
        oldTags.some((existingTag, index) => {
          indexToDelete = index;
          return newElement.isEqualNode(existingTag);
        })
      ) {
        oldTags.splice(indexToDelete, 1);
      } else {
        newTags.push(newElement);
      }
    });
  }

  oldTags.forEach(tag => tag.parentNode?.removeChild(tag));
  newTags.forEach(tag => headElement.appendChild(tag));

  return {
    oldTags,
    newTags,
  };
};

const updateAttributes = (tagName: TAG_NAMES, attributes: any) => {
  const elementTag = document.getElementsByTagName(tagName)[0];

  if (!elementTag) {
    return;
  }

  const helmetAttributeString = elementTag.getAttribute(HELMET_ATTRIBUTE);
  const helmetAttributes = helmetAttributeString ? helmetAttributeString.split(',') : [];
  const attributesToRemove = [...helmetAttributes];
  const attributeKeys = Object.keys(attributes);

  for (let i = 0; i < attributeKeys.length; i += 1) {
    const attribute = attributeKeys[i];
    const value = attributes[attribute] || '';

    if (elementTag.getAttribute(attribute) !== value) {
      elementTag.setAttribute(attribute, value);
    }

    if (helmetAttributes.indexOf(attribute) === -1) {
      helmetAttributes.push(attribute);
    }

    const indexToSave = attributesToRemove.indexOf(attribute);
    if (indexToSave !== -1) {
      attributesToRemove.splice(indexToSave, 1);
    }
  }

  for (let i = attributesToRemove.length - 1; i >= 0; i -= 1) {
    elementTag.removeAttribute(attributesToRemove[i]);
  }

  if (helmetAttributes.length === attributesToRemove.length) {
    elementTag.removeAttribute(HELMET_ATTRIBUTE);
  } else if (elementTag.getAttribute(HELMET_ATTRIBUTE) !== attributeKeys.join(',')) {
    elementTag.setAttribute(HELMET_ATTRIBUTE, attributeKeys.join(','));
  }
};

const updateTitle = (title?: string, attributes: any = {}) => {
  if (typeof title !== 'undefined' && document.title !== title) {
    document.title = title;
  }

  updateAttributes(TAG_NAMES.TITLE, attributes);
};

const commitTagChanges = (newState: IStateType, cb?: () => void) => {
  const {
    baseTag,
    bodyAttributes,
    htmlAttributes,
    linkTags,
    metaTags,
    noscriptTags,
    onChangeClientState,
    scriptTags,
    styleTags,
    title,
    titleAttributes,
  } = newState;
  updateAttributes(TAG_NAMES.BODY, bodyAttributes);
  updateAttributes(TAG_NAMES.HTML, htmlAttributes);

  updateTitle(title, titleAttributes);

  const baseTagUpdated = updateTags(TAG_NAMES.BASE, baseTag);
  const linkTagsUpdated = updateTags(TAG_NAMES.LINK, linkTags);
  const metaTagsUpdated = updateTags(TAG_NAMES.META, metaTags);
  const noscriptTagsUpdated = updateTags(TAG_NAMES.NOSCRIPT, noscriptTags);
  const scriptTagsUpdated = updateTags(TAG_NAMES.SCRIPT, scriptTags);
  const styleTagsUpdated = updateTags(TAG_NAMES.STYLE, styleTags);
  
  const addedTags: HelmetTags = {
    baseTag: baseTagUpdated.newTags,
    linkTags: linkTagsUpdated.newTags,
    metaTags: metaTagsUpdated.newTags,
    noscriptTags: noscriptTagsUpdated.newTags,
    scriptTags: scriptTagsUpdated.newTags,
    styleTags: styleTagsUpdated.newTags
  };
  
  const removedTags: HelmetTags = {
    baseTag: baseTagUpdated.oldTags,
    linkTags: linkTagsUpdated.oldTags,
    metaTags: metaTagsUpdated.oldTags,
    noscriptTags: noscriptTagsUpdated.oldTags,
    scriptTags: scriptTagsUpdated.oldTags,
    styleTags: styleTagsUpdated.oldTags
  };

  if (cb) {
    cb();
  }

  onChangeClientState(newState, addedTags, removedTags);
};

// eslint-disable-next-line
let _helmetCallback: number | undefined = undefined;

const handleStateChangeOnClient = (newState: IStateType) => {
  if (_helmetCallback) {
    cancelAnimationFrame(_helmetCallback);
  }

  if (newState.defer) {
    _helmetCallback = requestAnimationFrame(() => {
      commitTagChanges(newState, () => {
        _helmetCallback = undefined;
      });
    });
  } else {
    commitTagChanges(newState);
    _helmetCallback = undefined;
  }
};

export default handleStateChangeOnClient;
