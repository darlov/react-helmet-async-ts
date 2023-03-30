import React, {ClassAttributes, createElement, DetailedHTMLProps, HTMLAttributes, ReactElement} from 'react';
import {
  ATTRIBUTE_NAMES,
  HELMET_ATTRIBUTE,
  REACT_TAG_MAP,
  SEO_PRIORITY_TAGS,
  TAG_NAMES,
  TAG_PROPERTIES,
} from './constants';
import {flattenArray, prioritizer} from './utils';
import {
  HelmetDatum,
  HelmetHTMLBodyDatum,
  HelmetHTMLElementDatum,
  HelmetServerState,
  IStateType,
  TitleProps,
  toEntries
} from "./types";

const SELF_CLOSING_TAGS = [TAG_NAMES.NOSCRIPT, TAG_NAMES.SCRIPT, TAG_NAMES.STYLE];


const encodeSpecialCharacters = (str: string, encode = true) => {
  if (!encode) {
    return String(str);
  }

  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

const generateElementAttributesAsString = (data: TypedTagsAttributes) =>
  toEntries(data.attributes).reduce((str, [key, value]) => {
    const attr = value !== undefined
      ? `${key}="${value}"`
      : `${key}`;
    return str ? `${str} ${attr}` : attr;
  }, '');

const generateTitleAsString = (data: TypedTagsAttrTitle, encode?: boolean) => {
  const attributeString = generateElementAttributesAsString(data);
  const flattenedTitle = flattenArray(data.title);
  return attributeString
    ? `<${data.type} ${HELMET_ATTRIBUTE}="true" ${attributeString}>${encodeSpecialCharacters(
      flattenedTitle,
      encode
    )}</${data.type}>`
    : `<${data.type} ${HELMET_ATTRIBUTE}="true">${encodeSpecialCharacters(
      flattenedTitle,
      encode
    )}</${data.type}>`;
};

const generateTagsAsString = (data: Exclude<TagType, TypedTagsAttributes>, encode?: boolean): string =>
  (data.tags as any[]).reduce((str, tag) => {
    const attributeHtml = Object.keys(tag)
      .filter(
        attribute =>
          !(attribute === TAG_PROPERTIES.INNER_HTML || attribute === TAG_PROPERTIES.CSS_TEXT)
      )
      .reduce((string, attribute) => {
        const attr =
          typeof tag[attribute] === 'undefined'
            ? attribute
            : `${attribute}="${encodeSpecialCharacters(tag[attribute], encode)}"`;
        return string ? `${string} ${attr}` : attr;
      }, '');

    const tagContent = tag.innerHTML || tag.cssText || '';

    const isSelfClosing = SELF_CLOSING_TAGS.indexOf(data.type) === -1;

    return `${str}<${data.type} ${HELMET_ATTRIBUTE}="true" ${attributeHtml}${
      isSelfClosing ? `/>` : `>${tagContent}</${data.type}>`
    }`;
  }, '');

type extractGeneric<Type> = Type extends DetailedHTMLProps<HTMLAttributes<infer T>, any> ? T : never

const convertElementAttributesToReactProps = <P extends HTMLAttributes<T>, T extends HTMLElement>(attributes: ClassAttributes<T> & P, initProps: any = {}): HTMLAttributes<T> =>
  toEntries(attributes).reduce((obj, [key, value]) => {
    obj[REACT_TAG_MAP[key as keyof typeof REACT_TAG_MAP] || key] = value;
    return obj;
  }, initProps);

const generateTitleAsReactComponent = (title: string | undefined, attributes: TitleProps) => {
  // assigning into an array to define toString function on it
  const initProps = {
    key: title,
    [HELMET_ATTRIBUTE]: true,
  };
  const props = convertElementAttributesToReactProps(attributes, initProps);

  return [createElement(TAG_NAMES.TITLE, props, title)];
};

const generateTagsAsReactComponent = <T extends Exclude<TagType, TypedTagsAttributes>>(data: T): ReactElement[] => {
  return data.tags.map((tag, i) => {
    const mappedTag: any = {
      key: i,
      [HELMET_ATTRIBUTE]: true,
    };

    toEntries(tag).forEach(([attribute, value]) => {
      if (attribute  as any == TAG_PROPERTIES.INNER_HTML || attribute as any === TAG_PROPERTIES.CSS_TEXT) {
        const content = (tag as any).innerHTML || (tag as any).cssText;
        mappedTag.dangerouslySetInnerHTML = {__html: content};
      } else {
        const mappedAttribute = REACT_TAG_MAP[attribute as unknown as keyof typeof REACT_TAG_MAP] || attribute;
        mappedTag[mappedAttribute] = value;
      }
    });

    return createElement(data.type, mappedTag);
  })
}


type TypedItem<T> = { type: T };
type TypedTagsAttr<T, TKey extends keyof IStateType> = TypedItem<T> & { attributes: IStateType[TKey] };
type TypedTags<T, TKey extends keyof IStateType> = TypedItem<T> & { tags: IStateType[TKey] };

type TypedTagsAttrTitle = TypedTagsAttr<TAG_NAMES.TITLE, "titleAttributes"> & { title: IStateType["title"] };
type TypedTagsAttrBody = TypedTagsAttr<ATTRIBUTE_NAMES.BODY, "bodyAttributes">;
type TypedTagsAttrHtml = TypedTagsAttr<ATTRIBUTE_NAMES.HTML, "htmlAttributes">;

type TypedTagsAttributes = TypedTagsAttrTitle | TypedTagsAttrBody | TypedTagsAttrHtml;

type TagType =
  TypedTagsAttributes
  | TypedTags<TAG_NAMES.STYLE, "styleTags">
  | TypedTags<TAG_NAMES.SCRIPT, "scriptTags">
  | TypedTags<TAG_NAMES.NOSCRIPT, "noscriptTags">
  | TypedTags<TAG_NAMES.META, "metaTags">
  | TypedTags<TAG_NAMES.LINK, "linkTags">
  | TypedTags<TAG_NAMES.BASE, "baseTag">;


type TagOrAttribute<T extends TagType> =
  T extends { type: ATTRIBUTE_NAMES.HTML } ? HelmetHTMLElementDatum :
    T extends { type: ATTRIBUTE_NAMES.BODY } ? HelmetHTMLBodyDatum :
      HelmetDatum;

const getMethodsForTag = <T extends TagType, TReturn extends TagOrAttribute<T>>(data: T, encode?: boolean): TagOrAttribute<T> => {
  switch (data.type) {
    case TAG_NAMES.TITLE:
      return {
        toComponent: () => generateTitleAsReactComponent(data.title, data.attributes),
        toString: () => generateTitleAsString(data, encode),
      } as any;
    case ATTRIBUTE_NAMES.BODY:
      return {
        toComponent: () => convertElementAttributesToReactProps(data.attributes),
        toString: () => generateElementAttributesAsString(data),
      } as any;
    case ATTRIBUTE_NAMES.HTML:
      return {
        toComponent: () => convertElementAttributesToReactProps(data.attributes),
        toString: () => generateElementAttributesAsString(data),
      } as any;
    default:
      return {
        toComponent: () => generateTagsAsReactComponent(data),
        toString: () => generateTagsAsString(data, encode),
      } as any;
  }
};

const getPriorityMethods = ({metaTags, linkTags, scriptTags, encode}: IStateType) => {
  const meta = prioritizer(metaTags, SEO_PRIORITY_TAGS.meta);
  const link = prioritizer(linkTags, SEO_PRIORITY_TAGS.link);
  const script = prioritizer(scriptTags, SEO_PRIORITY_TAGS.script);

  // need to have toComponent() and toString()
  const priorityMethods = {
    toComponent: () => [
      ...generateTagsAsReactComponent({type: TAG_NAMES.META, tags: meta.priority}),
      ...generateTagsAsReactComponent({type: TAG_NAMES.LINK, tags: link.priority}),
      ...generateTagsAsReactComponent({type: TAG_NAMES.SCRIPT, tags: script.priority}),
    ][0],
    toString: () =>
      // generate all the tags as strings and concatenate them
      `${getMethodsForTag({type: TAG_NAMES.META, tags: meta.priority}, encode)} ${getMethodsForTag(
        {type: TAG_NAMES.LINK, tags: link.priority},
        encode
      )} ${getMethodsForTag({type: TAG_NAMES.SCRIPT, tags: script.priority}, encode)}`,
  };

  return {
    priorityMethods,
    metaTags: meta.default,
    linkTags: link.default,
    scriptTags: script.default,
  };
};

const mapStateOnServer = (props: IStateType): HelmetServerState => {
  const {
    baseTag,
    bodyAttributes,
    encode,
    htmlAttributes,
    noscriptTags,
    styleTags,
    title = '',
    titleAttributes,
    prioritizeSeoTags,
  } = props;
  let {linkTags, metaTags, scriptTags} = props;
  let priorityMethods = {
    toComponent: (): ReactElement => (<></>),
    toString: () => '',
  };
  if (prioritizeSeoTags) {
    ({priorityMethods, linkTags, metaTags, scriptTags} = getPriorityMethods(props));
  }
  return {
    priority: priorityMethods,
    base: getMethodsForTag({type: TAG_NAMES.BASE, tags: baseTag}, encode),
    bodyAttributes: getMethodsForTag({type: ATTRIBUTE_NAMES.BODY, attributes: bodyAttributes}, encode),
    htmlAttributes: getMethodsForTag({type: ATTRIBUTE_NAMES.HTML, attributes: htmlAttributes}, encode),
    link: getMethodsForTag({type: TAG_NAMES.LINK, tags: linkTags}, encode),
    meta: getMethodsForTag({type: TAG_NAMES.META, tags: metaTags}, encode),
    noscript: getMethodsForTag({type: TAG_NAMES.NOSCRIPT, tags: noscriptTags}, encode),
    script: getMethodsForTag({type: TAG_NAMES.SCRIPT, tags: scriptTags}, encode),
    style: getMethodsForTag({type: TAG_NAMES.STYLE, tags: styleTags}, encode),
    title: getMethodsForTag({type: TAG_NAMES.TITLE, title, attributes: titleAttributes}, encode),
  };
};

export default mapStateOnServer;
