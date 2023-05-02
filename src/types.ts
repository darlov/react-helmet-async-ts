import {ReactElement} from "react";

export type TitleProps = JSX.IntrinsicElements['title'];
export type MetaProps = JSX.IntrinsicElements['meta'];
export type StyleProps = JSX.IntrinsicElements['style'];
export type ScriptProps = JSX.IntrinsicElements['script'];
export type LinkProps = JSX.IntrinsicElements['link'];
export type NoscriptProps = JSX.IntrinsicElements['noscript'];
export type BaseProps = JSX.IntrinsicElements['base'];
export type BodyProps = JSX.IntrinsicElements['body'];
export type HtmlProps = JSX.IntrinsicElements['html'];

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

export interface IHelmetTags {
  titleTags?: TitleProps[],
  metaTags?: MetaProps[]
  styleTags?: StyleProps[]
  scriptTags?: ScriptProps[]
  linkTags?: LinkProps[]
  noscriptTags?: NoscriptProps[],
  baseTags?: BaseProps[]
  bodyTags?: BodyProps[]
  htmlTags?: HtmlProps[]
}

export interface IHelmetInstanceState extends IHelmetTags {
  id: number
  emptyState: boolean
}

export interface IHelmetState {
  titleTag?: TitleProps,
  baseTag?: BaseProps,
  bodyTag?: BodyProps,
  htmlTag?: HtmlProps
  metaTags: MetaProps[]
  styleTags: StyleProps[],
  scriptTags: ScriptProps[],
  linkTags: LinkProps[],
  noscriptTags: NoscriptProps[],
}

export interface IHelmetDatum<T> {
  toComponent: () => T;
  toString: () => string;
}

export interface IHelmetServerState {
  title: IHelmetDatum<ReactElement>,
  base: IHelmetDatum<ReactElement>,
  body: IHelmetDatum<Required<IHelmetState>["bodyTag"]>,
  html: IHelmetDatum<Required<IHelmetState>["htmlTag"]>
  meta: IHelmetDatum<ReactElement[]>
  style: IHelmetDatum<ReactElement[]>,
  script: IHelmetDatum<ReactElement[]>,
  link: IHelmetDatum<ReactElement[]>,
  noscript: IHelmetDatum<ReactElement[]>,
}

export interface IHelmetData {
  state?: IHelmetServerState;
}

export type OnChangeClientState = (newState: IHelmetState, addedTags: IHelmetTags, removedTags: IHelmetTags) => void;

export type ArrayElement<T> = T extends Array<infer K> ? K : never;

export type MetaAttribute = keyof Pick<MetaProps, "charSet" | "name" | "httpEquiv" | "property" | "itemProp">;
export type LinkAttribute = keyof Pick<LinkProps, "rel" | "href">;
export const primaryMetaAttributes: readonly MetaAttribute[] = ["charSet", "name", "httpEquiv", "property", "itemProp"] as const
export const primaryLinkAttributes: readonly LinkAttribute[] = ["rel", "href"] as const

export const HELMET_ATTRIBUTE = 'data-rh';

