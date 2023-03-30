import {TAG_NAMES, TAG_PROPERTIES, ATTRIBUTE_NAMES, SEO_PRIORITY_TAGS} from './constants';
import {
  HelmetProps,
  BaseProps,
  AttributeNamesMap,
  TagPropsType,
  IStateType,
  MetaProps,
  LinkProps,
  ScriptProps
} from "./types";

enum HELMET_PROPS {
  DEFAULT_TITLE = 'defaultTitle',
  DEFER = 'defer',
  ENCODE_SPECIAL_CHARACTERS = 'encodeSpecialCharacters',
  ON_CHANGE_CLIENT_STATE = 'onChangeClientState',
  TITLE_TEMPLATE = 'titleTemplate',
  PRIORITIZE_SEO_TAGS = 'prioritizeSeoTags'
}

const getInnermostProperty = <T extends keyof HelmetProps>(propsList: HelmetProps[], property: T) => {
  for (let i = propsList.length - 1; i >= 0; i -= 1) {
    const props = propsList[i];

    if (Object.hasOwn(props, property)) {
      return props[property];
    }
  }

  return undefined;
};

const getTitleFromPropsList = (propsList: HelmetProps[]) => {
  let innermostTitle = getInnermostProperty(propsList, TAG_NAMES.TITLE);
  const innermostTemplate = getInnermostProperty(propsList, HELMET_PROPS.TITLE_TEMPLATE);
  if (Array.isArray(innermostTitle)) {
    innermostTitle = innermostTitle.join('');
  }
  if (innermostTemplate && innermostTitle) {
    // use function arg to avoid need to escape $ characters
    return innermostTemplate.replace(/%s/g, innermostTitle);
  }

  const innermostDefaultTitle = getInnermostProperty(propsList, HELMET_PROPS.DEFAULT_TITLE);

  return innermostTitle || innermostDefaultTitle || undefined;
};

const getOnChangeClientState = (propsList: HelmetProps[]) =>
  getInnermostProperty(propsList, HELMET_PROPS.ON_CHANGE_CLIENT_STATE) || (() => {
  });

const getAttributesFromPropsList = <T extends ATTRIBUTE_NAMES>(tagType: T, propsList: HelmetProps[]) =>
  propsList
    .map(props => props[tagType])
    .filter((tag): tag is AttributeNamesMap[T] => !!tag)
    .reduce<AttributeNamesMap[T]>((tagAttrs, current) => ({...tagAttrs, ...current}), {});

const getBaseTagFromPropsList = (primaryAttributes: TAG_PROPERTIES[], propsList: HelmetProps[]) =>
  propsList
    .map(props => props.base)
    .filter((tag): tag is BaseProps => !!tag)
    .reverse()
    .reduce<BaseProps[]>((innermostBaseTag, tag) => {
      if (!innermostBaseTag.length) {
        const keys = Object.keys(tag);

        for (let i = 0; i < keys.length; i += 1) {
          const attributeKey = keys[i];
          const lowerCaseAttributeKey = attributeKey.toLowerCase();

          if (primaryAttributes.some(m => m === lowerCaseAttributeKey) && tag[lowerCaseAttributeKey as keyof BaseProps]) {
            return innermostBaseTag.concat(tag);
          }
        }
      }

      return innermostBaseTag;
    }, []);

// eslint-disable-next-line no-console
const warn = (msg: string) => console && typeof console.warn === 'function' && console.warn(msg);

type Flatten<T> = T extends any[] ? T[number] : T;

const getTagsFromPropsList = <T extends keyof TagPropsType,
  TValidTags extends Required<TagPropsType>,
  TTags = TagPropsType[T],
  TElement = Flatten<TTags>>(tagName: T, primaryAttributes: TAG_PROPERTIES[], propsList: TagPropsType[]) => {
  // Calculate list of tags, giving priority innermost component (end of the propslist)
  const approvedSeenTags: { [key in keyof TElement]: any; } = {} as TElement;

  return propsList
    .filter((props): props is TValidTags => {
      if (Array.isArray(props[tagName])) {
        return true;
      }
      if (typeof props[tagName] !== 'undefined') {
        warn(
          `Helmet: ${ tagName } should be of type "Array". Instead found type "${ typeof props[
            tagName
            ] }"`
        );
      }
      return false;
    })
    .map((props) => props[tagName])
    .reverse()
    .reduce((approvedTags, instanceTags) => {
      const instanceSeenTags: { [key in keyof TElement]: any; } = {} as TElement;
      
      instanceTags
        .filter(tag => {
          let primaryAttributeKey: string | undefined = undefined;
          const keys = Object.keys(tag);
          for (let i = 0; i < keys.length; i += 1) {
            const attributeKey = keys[i];
            const lowerCaseAttributeKey = attributeKey.toLowerCase();

            // Special rule with link tags, since rel and href are both primary tags, rel takes priority
            if (
              primaryAttributes.some(m => m === lowerCaseAttributeKey) &&
              !(
                primaryAttributeKey === TAG_PROPERTIES.REL &&
                tag[primaryAttributeKey as keyof typeof tag].toLowerCase() === 'canonical'
              ) &&
              !(
                lowerCaseAttributeKey === TAG_PROPERTIES.REL &&
                tag[lowerCaseAttributeKey as keyof typeof tag].toLowerCase() === 'stylesheet'
              )
            ) {
              primaryAttributeKey = lowerCaseAttributeKey;
            }
            // Special case for innerHTML which doesn't work lowercased
            if (
              primaryAttributes.some(m => m === attributeKey) &&
              (attributeKey === TAG_PROPERTIES.INNER_HTML ||
                attributeKey === TAG_PROPERTIES.CSS_TEXT ||
                attributeKey === TAG_PROPERTIES.ITEM_PROP)
            ) {
              primaryAttributeKey = attributeKey;
            }
          }

          if (!primaryAttributeKey || !tag[primaryAttributeKey as keyof typeof tag]) {
            return false;
          }

          const value: string = tag[primaryAttributeKey as keyof typeof tag].toLowerCase();

          if (!approvedSeenTags[primaryAttributeKey as keyof TElement]) {
            approvedSeenTags[primaryAttributeKey as keyof TElement] = {};
          }

          if (!instanceSeenTags[primaryAttributeKey as keyof TElement]) {
            instanceSeenTags[primaryAttributeKey as keyof TElement] = {};
          }

          if (!approvedSeenTags[primaryAttributeKey as keyof TElement][value]) {
            instanceSeenTags[primaryAttributeKey as keyof TElement][value] = true;
            return true;
          }

          return false;
        }, [])
        .reverse()
        .forEach(tag => approvedTags.push(tag as TElement));

      // Update seen tags with tags from this instance
      const keys = Object.keys(instanceSeenTags);
      for (let i = 0; i < keys.length; i += 1) {
        const attributeKey = keys[i];
        const tagUnion = {
          ...approvedSeenTags[attributeKey as keyof TElement],
          ...instanceSeenTags[attributeKey as keyof TElement],
        };

        approvedSeenTags[attributeKey as keyof TElement] = tagUnion;
      }

      return approvedTags;
    }, [] as TElement[])
    .reverse();
};

const getAnyTrueFromPropsList = <T extends keyof HelmetProps>(propsList: HelmetProps[], checkedTag: T) => {
  if (Array.isArray(propsList) && propsList.length) {
    for (let index = 0; index < propsList.length; index += 1) {
      const prop = propsList[index];
      if (prop[checkedTag]) {
        return true;
      }
    }
  }
  return false;
};
const reducePropsToState = (propsList: HelmetProps[]): IStateType => ({
  baseTag: getBaseTagFromPropsList([TAG_PROPERTIES.HREF], propsList),
  bodyAttributes: getAttributesFromPropsList(ATTRIBUTE_NAMES.BODY, propsList),
  defer: getInnermostProperty(propsList, HELMET_PROPS.DEFER),
  encode: getInnermostProperty(propsList, HELMET_PROPS.ENCODE_SPECIAL_CHARACTERS),
  htmlAttributes: getAttributesFromPropsList(ATTRIBUTE_NAMES.HTML, propsList),
  linkTags: getTagsFromPropsList(
    TAG_NAMES.LINK,
    [TAG_PROPERTIES.REL, TAG_PROPERTIES.HREF],
    propsList
  ),
  metaTags: getTagsFromPropsList(
    TAG_NAMES.META,
    [
      TAG_PROPERTIES.NAME,
      TAG_PROPERTIES.CHARSET,
      TAG_PROPERTIES.HTTPEQUIV,
      TAG_PROPERTIES.PROPERTY,
      TAG_PROPERTIES.ITEM_PROP,
    ],
    propsList
  ),
  noscriptTags: getTagsFromPropsList(TAG_NAMES.NOSCRIPT, [TAG_PROPERTIES.INNER_HTML], propsList),
  onChangeClientState: getOnChangeClientState(propsList),
  scriptTags: getTagsFromPropsList(
    TAG_NAMES.SCRIPT,
    [TAG_PROPERTIES.SRC, TAG_PROPERTIES.INNER_HTML],
    propsList
  ),
  styleTags: getTagsFromPropsList(TAG_NAMES.STYLE, [TAG_PROPERTIES.CSS_TEXT], propsList),
  title: getTitleFromPropsList(propsList),
  titleAttributes: getAttributesFromPropsList(ATTRIBUTE_NAMES.TITLE, propsList),
  prioritizeSeoTags: getAnyTrueFromPropsList(propsList, HELMET_PROPS.PRIORITIZE_SEO_TAGS),
});

export const flattenArray = (possibleArray: any) =>
  Array.isArray(possibleArray) ? possibleArray.join('') : possibleArray;

export { reducePropsToState };

const checkIfPropsMatch = (props: any, toMatch: any) => {
  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i += 1) {
    // e.g. if rel exists in the list of allowed props [amphtml, alternate, etc]
    if (toMatch[keys[i]] && toMatch[keys[i]].includes(props[keys[i]])) {
      return true;
    }
  }
  return false;
};

export type Prioritizer =
  { element: MetaProps, propsToMatch: typeof SEO_PRIORITY_TAGS["meta"] }
  | { element: LinkProps, propsToMatch: typeof SEO_PRIORITY_TAGS["link"] }
  | { element: ScriptProps, propsToMatch: typeof SEO_PRIORITY_TAGS["script"] };

export const prioritizer = <TElement extends Prioritizer["element"], TMatch extends Prioritizer["propsToMatch"]>(
  elements: TElement[],
  propsToMatch: TMatch) => {

  const result: { priority: TElement[], default: TElement[] } = {priority: [], default: []};

  if (Array.isArray(elements)) {

    for (const element of elements) {
      if (checkIfPropsMatch(element, propsToMatch)) {
        result.priority.push(element);
      } else {
        result.default.push(element);
      }
    }
  }
  return  result;
};

export const without = (obj: any, key: any) => {
  return {
    ...obj,
    [key]: undefined,
  };
}
