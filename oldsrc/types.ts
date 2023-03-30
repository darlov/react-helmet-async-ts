import { HTMLAttributes, ReactElement, ReactNode } from "react";
import { ATTRIBUTE_NAMES, TAG_NAMES, TAG_PROPERTIES } from "./constants";


export interface HelmetDatumBase<T> {
  toString(): string;

  toComponent(): T
}

export type HelmetHTMLBodyDatum = HelmetDatumBase<HTMLAttributes<HTMLBodyElement>>
export type HelmetHTMLElementDatum = HelmetDatumBase<HTMLAttributes<HTMLHtmlElement>>
export type HelmetDatum = HelmetDatumBase<ReactElement[]>
export type HelmetPriorityDatum = HelmetDatumBase<ReactElement>

export interface HelmetServerState {
  base: HelmetDatum;
  bodyAttributes: HelmetHTMLBodyDatum;
  htmlAttributes: HelmetHTMLElementDatum;
  link: HelmetDatum;
  meta: HelmetDatum;
  noscript: HelmetDatum;
  script: HelmetDatum;
  style: HelmetDatum;
  title: HelmetDatum;
  priority: HelmetPriorityDatum;
}

export interface ProviderContext {
  helmet?: HelmetServerState;
}

export type FilledContext = Required<ProviderContext>;

interface OtherElementAttributes {
  [key: string]: string | number | boolean | null | undefined;
}

export type HtmlProps = JSX.IntrinsicElements['html'];
export type BodyProps = JSX.IntrinsicElements['body'];
export type LinkProps = JSX.IntrinsicElements['link'];
export type MetaProps = JSX.IntrinsicElements['meta'];
export type BaseProps = JSX.IntrinsicElements['base'];
export type NoscriptProps = JSX.IntrinsicElements['noscript'];
export type ScriptProps = JSX.IntrinsicElements['script'];
export type StyleProps = JSX.IntrinsicElements['style'];
export type TitleProps = JSX.IntrinsicElements['title'];

export type HelmetElement =
  HtmlProps
  | BodyProps
  | LinkProps
  | MetaProps
  | BaseProps
  | NoscriptProps
  | ScriptProps
  | StyleProps
  | TitleProps;

export type HelmetNode = ReactElement<HelmetElement> | ReactElement<HelmetElement>[];


export interface HelmetTags {
  baseTag: Array<HTMLBaseElement>;
  linkTags: Array<HTMLLinkElement>;
  metaTags: Array<HTMLMetaElement>;
  noscriptTags: Array<HTMLElement>;
  scriptTags: Array<HTMLScriptElement>;
  styleTags: Array<HTMLStyleElement>;
}

export interface IHelmetProviderContext {
  setHelmet: (serverState?: HelmetServerState) => void
  helmetInstances: {
    get: () => HelmetProps[]
    add: (instance: HelmetProps) => void
    remove: (instance: HelmetProps) => void
  }
}

export interface IHelmetData {
  context: {
    helmet?: HelmetServerState;
  };

  value: IHelmetProviderContext
}


export interface HelmetProps {
  async?: boolean;
  base?: BaseProps;
  bodyAttributes?: BodyProps;
  defaultTitle?: string;
  defer?: boolean;
  encodeSpecialCharacters?: boolean;
  helmetData?: IHelmetData;
  htmlAttributes?: HtmlProps;
  onChangeClientState?: (newState: IStateType, addedTags: HelmetTags, removedTags: HelmetTags) => void;
  link?: LinkProps[];
  meta?: MetaProps[];
  noscript?: NoscriptProps[];
  script?: ScriptProps[];
  style?: StyleProps[];
  title?: string;
  titleAttributes?: TitleProps;
  titleTemplate?: string;
  prioritizeSeoTags?: boolean;
}


export interface IStateType {
  baseTag: BaseProps[],
  bodyAttributes: BodyProps,
  defer?: boolean,
  encode?: boolean,
  htmlAttributes: HtmlProps,
  linkTags: LinkProps[],
  metaTags: MetaProps[],
  noscriptTags: NoscriptProps[],
  onChangeClientState: (newState: IStateType, addedTags: HelmetTags, removedTags: HelmetTags) => void,
  scriptTags: ScriptProps[],
  styleTags: StyleProps[],
  title?: string,
  titleAttributes: TitleProps,
  prioritizeSeoTags: boolean,
}

export type TagPropsType = Pick<HelmetProps, "meta" | "link" | "noscript" | "script" | "style">
export type AttributePropsType = Pick<HelmetProps, "bodyAttributes" | "htmlAttributes" | "titleAttributes">

export type AttributeNamesMap = {
  [ATTRIBUTE_NAMES.BODY]: BodyProps,
  [ATTRIBUTE_NAMES.HTML]: HtmlProps
  [ATTRIBUTE_NAMES.TITLE]: TitleProps
}


export interface IStateTypeTagNameMap {
  [TAG_NAMES.BASE]: IStateType["baseTag"],
  [TAG_NAMES.LINK]: IStateType["linkTags"],
  [TAG_NAMES.META]: IStateType["metaTags"],
  [TAG_NAMES.NOSCRIPT]: IStateType["noscriptTags"],
  [TAG_NAMES.SCRIPT]: IStateType["scriptTags"],
  [TAG_NAMES.STYLE]: IStateType["styleTags"],
}


type InferKey<T> = T extends Partial<Record<infer K, any>> ? K : never;
type InferValue<T> = T extends Partial<Record<any, infer V>> ? V : never;

/** Returns strongly-typed entries of obj. */
export const toEntries = <T extends Partial<Record<string, any>>>(obj: T) => {
  return Object.entries(obj) as [InferKey<T>, InferValue<T>][];
};




