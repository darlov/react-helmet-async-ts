import {ReactElement} from "react";

export enum TagName {
  title = "title",
  meta = "meta",
  style = "style",
  script = "script",
  link = "link",
  noscript = "noscript",
  base = "base",
  body = "body",
  html = "html"
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

export interface ITypedTagProps<TName extends TagName> extends ITagProps {
  tagType: TName,
  tagProps: TagPropsMap[TName]
}

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

export type HelmetTags = {
  [key in TagName]?: ITypedTagProps<key>[]
};

export interface IHelmetInstanceState extends HelmetTags {
  id: number;
}

export interface IHelmetState {
  baseTag?: ITypedTagProps<TagName.base>,
  bodyAttributes?: ITypedTagProps<TagName.body>,
  htmlAttributes?: ITypedTagProps<TagName.html>
  linkTags: ITypedTagProps<TagName.link>[],
  metaTags: ITypedTagProps<TagName.meta>[]
  noscriptTags: ITypedTagProps<TagName.noscript>[],
  scriptTags: ITypedTagProps<TagName.script>[],
  styleTags: ITypedTagProps<TagName.style>[],
  titleTag?: ITypedTagProps<TagName.title>,

  headerTags: ITagProps[]
}

export interface IHelmetDatum<T> {
  toComponent: () => T;
  toString: () => string;
}

export interface IHelmetServerState {
  title: IHelmetDatum<ReactElement>,
  base: IHelmetDatum<ReactElement>,
  bodyAttributes: IHelmetDatum<Required<IHelmetState>["bodyAttributes"]>,
  htmlAttributes: IHelmetDatum<Required<IHelmetState>["htmlAttributes"]>
  meta: IHelmetDatum<ReactElement[]>
  style: IHelmetDatum<ReactElement[]>,
  script: IHelmetDatum<ReactElement[]>,
  link: IHelmetDatum<ReactElement[]>,
  noscript: IHelmetDatum<ReactElement[]>,
  priority: IHelmetDatum<ReactElement[]>
}

export interface IHelmetDataContext {
  state?: IHelmetServerState;
}

export type OnChangeClientState = (newState: IHelmetState, addedTags: HelmetTags, removedTags: HelmetTags) => void;

export type ArrayElement<T> = T extends Array<infer K> ? K : never;

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

export type TagPriorityConfig = TagConfig<TagName.title | "title", TitleProps>
  | TagConfig<TagName.base | "base", BaseProps>
  | TagConfig<TagName.meta | "meta", MetaProps>
  | TagConfig<TagName.style | "style", StyleProps>
  | TagConfig<TagName.script | "script", ScriptProps>
  | TagConfig<TagName.link | "link", BaseProps>
  | TagConfig<TagName.noscript | "noscript", BaseProps>

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
    name: "description",
    content: TagValue.oneOf(
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
  {tagName: TagName.meta},
  {tagName: TagName.link},
  {tagName: TagName.style},
  {tagName: TagName.script},
  {tagName: TagName.noscript}
];



