import {
  ITypedTagProps,
  TagName,
  TagPriorityConfig,
  TagPropsMap,
  TagValue
} from "./types";

enum DocumentPosition {
  Document,
  Header
}

interface ITagRenderConfig<TagType extends TagName> {
  position: DocumentPosition,
  applyOnlyAttrs?: boolean,
  isUnique?: boolean,
  primaryAttrs?: (keyof TagPropsMap[TagType])[] ,
  getUniqueKey?: (tag: ITypedTagProps<TagType>, config: ITagRenderConfig<TagType>) => string | undefined
  isValid?: (tag: ITypedTagProps<TagType>, config: ITagRenderConfig<TagType>) => boolean
}

export type TagRenderConfigs = { [P in keyof TagPropsMap]: Readonly<ITagRenderConfig<P>> }

const buildKey = <TagType extends TagName>(tag: ITypedTagProps<TagType>, attr: keyof TagPropsMap[TagType] | undefined) => {
  return attr === undefined ? undefined : `${tag.tagType}~${String(attr)}~${tag.tagProps[attr]}`
}

export const tagConfigs: TagRenderConfigs = {
  [TagName.body]: {position: DocumentPosition.Document, isUnique: true, applyOnlyAttrs: true},
  [TagName.html]: {position: DocumentPosition.Document, isUnique: true, applyOnlyAttrs: true},
  [TagName.title]: {position: DocumentPosition.Header, isUnique: true},
  [TagName.base]: {position: DocumentPosition.Header, isUnique: true, applyOnlyAttrs: true, primaryAttrs: ["href"]},
  [TagName.script]: {position: DocumentPosition.Header, primaryAttrs: ["children", "src"]},
  [TagName.style]: {position: DocumentPosition.Header, primaryAttrs: ["children"]},
  [TagName.noscript]: {position: DocumentPosition.Header, primaryAttrs: ["children"]},
  [TagName.meta]: {
    position: DocumentPosition.Header,
    primaryAttrs: ["charSet", "name", "httpEquiv", "property", "itemProp"],
    getUniqueKey: (tag, config) => {
      const attr = config.primaryAttrs!.find(attr => tag.tagProps[attr] !== undefined);
      return buildKey(tag, attr);
    }
  },
  [TagName.link]: {
    position: DocumentPosition.Header,
    primaryAttrs: ["href", "rel"],
    isValid: (tag, config) => config.primaryAttrs!.every(attr => tag.tagProps[attr] !== undefined),
    getUniqueKey: (tag, config) => {
      const attr = config.primaryAttrs!.find(attr => tag.tagProps[attr] !== null && !(attr === "rel" && tag.tagProps[attr] === "stylesheet"));
      return buildKey(tag, attr);
    }
  },
}

export const DefaultTagPriorityConfig: TagPriorityConfig[] = [
  {tagName: TagName.meta, charSet: TagValue.any()},
  {tagName: TagName.title},
  {tagName: TagName.base},
  {tagName: TagName.meta, name: "generator"},
  {tagName: TagName.meta, name: "robots"},
  {
    tagName: TagName.meta,
    property: TagValue.oneOf(
      "og:type",
      "og:title",
      "og:url",
      "og:image",
      "og:image:alt",
      "og:description",
      "twitter:url",
      "twitter:title",
      "twitter:description",
      "twitter:image",
      "twitter:image:alt",
      "twitter:card",
      "twitter:site",
    )
  },
  {tagName: TagName.link, rel: "canonical"},
  {tagName: TagName.meta},
  {tagName: TagName.link},
  {tagName: TagName.style},
  {tagName: TagName.script},
  {tagName: TagName.noscript}
];
