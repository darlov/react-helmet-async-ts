import {ReactElement} from "react";

export const TitleTagName = "title";
export const MetaTagName = "meta";
export const StyleTagName = "style";
export const ScriptTagName = "script";
export const LinkTagName = "link";
export const NoscriptTagName = "noscript";
export const BaseTagName = "base";
export const BodyTagName = "body";
export const HtmlTagName = "html";

export enum TagName {
  title = TitleTagName,
  meta = MetaTagName,
  style = StyleTagName,
  script = ScriptTagName,
  link = LinkTagName,
  noscript = NoscriptTagName,
  base = BaseTagName,
  body = BodyTagName,
  html = HtmlTagName
}

export type TagNames = keyof typeof TagName;

export type BaseProps = JSX.IntrinsicElements[TagName.base];
export type BodyProps = JSX.IntrinsicElements[TagName.body];
export type HtmlProps = JSX.IntrinsicElements[TagName.html];
export type LinkProps = JSX.IntrinsicElements[TagName.link];
export type MetaProps = JSX.IntrinsicElements[TagName.meta];
export type NoscriptProps = JSX.IntrinsicElements[TagName.noscript];
export type ScriptProps = JSX.IntrinsicElements[TagName.script];
export type StyleProps = JSX.IntrinsicElements[TagName.style];
export type TitleProps = JSX.IntrinsicElements[TagName.title];

export type TagPropsMap = {
  [TagName.base]: BaseProps,
  [TagName.body]: BodyProps,
  [TagName.html]: HtmlProps,
  [TagName.link]: LinkProps,
  [TagName.meta]: MetaProps,
  [TagName.noscript]: NoscriptProps,
  [TagName.script]: ScriptProps,
  [TagName.style]: StyleProps,
  [TagName.title]: TitleProps,
}

export interface ITagProps {
  tagType: TagName,
  tagProps: Exclude<TagProps, BodyProps | HtmlProps>
}

export interface ITypedTagProps<TName extends TagName> {
  id: string,
  tagType: TName,
  tagProps: TagPropsMap[TName]
}

export type TypedTagsProps = ITypedTagProps<TagName.base>
  | ITypedTagProps<TagName.body>
  | ITypedTagProps<TagName.html>
  | ITypedTagProps<TagName.link>
  | ITypedTagProps<TagName.meta>
  | ITypedTagProps<TagName.noscript>
  | ITypedTagProps<TagName.script>
  | ITypedTagProps<TagName.style>
  | ITypedTagProps<TagName.title>;

export type TypedTagProps = { tagProps: Exclude<TagProps, BodyProps | HtmlProps>, tagType: TagName };


export type TagProps =
  TitleProps
  | MetaProps
  | StyleProps
  | ScriptProps
  | LinkProps
  | NoscriptProps
  | BaseProps
  | BodyProps
  | HtmlProps;

export interface IHelmetInstanceState {
  id: number;
  tags?: TypedTagsProps[]
}

export interface IHelmetState {
  // sourceTags: ITypedTagProps<TagName>[]
  // baseTag?: ITypedTagProps<TagName.base>,
  // bodyAttributes?: ITypedTagProps<TagName.body>,
  // htmlAttributes?: ITypedTagProps<TagName.html>
  // linkTags: ITypedTagProps<TagName.link>[],
  // metaTags: ITypedTagProps<TagName.meta>[]
  // noscriptTags: ITypedTagProps<TagName.noscript>[],
  // scriptTags: ITypedTagProps<TagName.script>[],
  // styleTags: ITypedTagProps<TagName.style>[],
  // titleTag?: ITypedTagProps<TagName.title>,
  isEmptyState: boolean

  tags: TypedTagsProps[]
}

export interface IHelmetDatum<T> {
  toComponent: () => T;
  toString: () => string;
}

export interface IHelmetServerState {
  bodyAttributes: IHelmetDatum<ITypedTagProps<TagName.body>>,
  htmlAttributes: IHelmetDatum<ITypedTagProps<TagName.html>>
  headerTags: IHelmetDatum<ReactElement[]>
}

export interface IHelmetDataContext {
  state?: IHelmetServerState;
}

export type MetaAttribute = keyof Pick<MetaProps, "charSet" | "name" | "httpEquiv" | "property" | "itemProp">;
export type LinkAttribute = keyof Pick<LinkProps, "rel" | "href">;
export const primaryMetaAttributes: readonly MetaAttribute[] = ["charSet", "name", "httpEquiv", "property", "itemProp"] as const
export const primaryLinkAttributes: readonly LinkAttribute[] = ["rel", "href"] as const

export const HELMET_ATTRIBUTE = 'data-rh';


export type ModifyInstanceCallback = <
  T extends TagName,
>(instance: IHelmetInstanceState, value: ITypedTagProps<T>) => void;

interface ITagValueConfig<T> {
  seoAnyValue?: boolean,
  seoValues?: T[]
}

export type TagConfig<T extends string, K extends TagProps> = {
  tagName: T
} & {
  [P in keyof K]: K[P] | ITagValueConfig<K[P]>
};

export type TitleTagConfigName = TagName.title | typeof TitleTagName;
export type BaseTagConfigName = TagName.base | typeof BaseTagName;
export type MetaTagConfigName = TagName.meta | typeof MetaTagName;
export type StyleTagConfigName = TagName.style | typeof StyleTagName;
export type ScriptTagConfigName = TagName.script | typeof ScriptTagName;
export type LinkTagConfigName = TagName.link | typeof LinkTagName;
export type NoscriptTagConfigName = TagName.noscript | typeof NoscriptTagName;

export type TagConfigName = TitleTagConfigName
  | BaseTagConfigName
  | MetaTagConfigName
  | StyleTagConfigName
  | ScriptTagConfigName
  | LinkTagConfigName
  | NoscriptTagConfigName;

export type TagPriorityConfig = TagConfig<TitleTagConfigName, TitleProps>
  | TagConfig<BaseTagConfigName, BaseProps>
  | TagConfig<MetaTagConfigName, MetaProps>
  | TagConfig<StyleTagConfigName, StyleProps>
  | TagConfig<ScriptTagConfigName, ScriptProps>
  | TagConfig<LinkTagConfigName, LinkProps>
  | TagConfig<NoscriptTagConfigName, NoscriptProps>

export interface ITagPriorityConfigMap {
  config: TagPriorityConfig,
  priority: number
}

export const TagValue = {
  any: (): ITagValueConfig<any> => {
    return {seoAnyValue: true}
  },
  oneOf: <T, >(...val: T[]): ITagValueConfig<T> => {
    return {seoValues: val}
  }
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



