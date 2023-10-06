import {ReactElement, JSX, HTMLAttributes, BaseHTMLAttributes, HtmlHTMLAttributes} from "react";

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

export interface ITypedTagProps<TName extends TagName> {
  id: string,
  tagName: TName,
  tagProps: TagPropsMap[TName]
}

export type TypedTagPropsMap = {
  [Properties in keyof TagPropsMap]: ITypedTagProps<Properties>
}
export type TypedTagsProps = TypedTagPropsMap[keyof TypedTagPropsMap]
export type TagProps = TagPropsMap[keyof TagPropsMap];

export interface IHelmetInstanceState {
  id: number;
  tags?: TypedTagsProps[]
}

export interface IHelmetState {
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
export const HELMET_ATTRIBUTE = 'data-rh';


export type ModifyInstanceCallback = <T extends TagName>(instance: IHelmetInstanceState, value: ITypedTagProps<T>) => void;

interface ITagValueConfig<T> {
  seoAnyValue?: boolean,
  seoValues?: T[]
}

export type TagConfig<T extends string, K extends TagProps> = {
  tagName: T
} & {
  [P in keyof K]: K[P] | ITagValueConfig<K[P]>
};

export type TitleTagConfigName = TagName.title | typeof TagName.title;
export type BaseTagConfigName = TagName.base | typeof TagName.base;
export type MetaTagConfigName = TagName.meta | typeof TagName.meta;
export type StyleTagConfigName = TagName.style | typeof TagName.style;
export type ScriptTagConfigName = TagName.script | typeof TagName.script;
export type LinkTagConfigName = TagName.link | typeof TagName.link;
export type NoscriptTagConfigName = TagName.noscript | typeof TagName.noscript;

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

export type AnchorElementType = "child" | "head";
export type AnchorInsertPosition = "before" | "after";

export interface IHeadAnchorElement{
  element: Element,
  elementType: AnchorElementType
  insertPosition: AnchorInsertPosition
}




