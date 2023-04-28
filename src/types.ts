export interface IAnyAttrOptions {
  [key: string]: any;
}

export type TitleProps = JSX.IntrinsicElements['title'] & IAnyAttrOptions;
export type MetaProps = JSX.IntrinsicElements['meta'] & IAnyAttrOptions;
export type StyleProps = JSX.IntrinsicElements['style'] & IAnyAttrOptions;
export type ScriptProps = JSX.IntrinsicElements['script'] & IAnyAttrOptions;
export type LinkProps = JSX.IntrinsicElements['link'] & IAnyAttrOptions;
export type NoscriptProps = JSX.IntrinsicElements['noscript'] & IAnyAttrOptions;
export type BaseProps = JSX.IntrinsicElements['base'] & IAnyAttrOptions;
export type BodyProps = JSX.IntrinsicElements['body'] & IAnyAttrOptions;
export type HtmlProps = JSX.IntrinsicElements['html'] & IAnyAttrOptions;

export type TagProps = TitleProps | MetaProps | StyleProps | ScriptProps | LinkProps | NoscriptProps | BaseProps | BodyProps | HtmlProps;

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

export type OnChangeClientState = (newState: IHelmetState, addedTags: IHelmetTags, removedTags: IHelmetTags) => void;

export type ArrayElement<T> = T extends Array<infer K> ? K : never;

export type MetaAttribute = keyof Pick<MetaProps, "charSet" | "name" | "httpEquiv" | "property" | "itemProp">;
export type LinkAttribute = keyof Pick<LinkProps, "rel" | "href">;
export const primaryMetaAttributes: readonly MetaAttribute[] = ["charSet", "name", "httpEquiv", "property", "itemProp"] as const
export const primaryLinkAttributes: readonly LinkAttribute[] = ["rel", "href"] as const

export const HELMET_ATTRIBUTE = 'data-rh';
export const DOCUMENT_TITLE_INSTANCE_ID = -1;

