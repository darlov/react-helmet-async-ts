export type TitleProps = JSX.IntrinsicElements['title'];
export type MetaProps = JSX.IntrinsicElements['meta'];
export type StyleProps = JSX.IntrinsicElements['style'];
export type ScriptProps = JSX.IntrinsicElements['script'];
export type LinkProps = JSX.IntrinsicElements['link'];
export type NoscriptProps = JSX.IntrinsicElements['noscript'];
export type BaseProps = JSX.IntrinsicElements['base'];
export type BodyProps = JSX.IntrinsicElements['body'];

export type TagProps = TitleProps | MetaProps | StyleProps | ScriptProps | LinkProps | NoscriptProps | BaseProps | BodyProps;

export interface IHelmetTags {
  titles?: TitleProps[],
  metas?: MetaProps[]
  styles?: StyleProps[]
  scripts?: ScriptProps[]
  links?: LinkProps[]
  noscripts?: NoscriptProps[],
  bases?: BaseProps[]
  bodies?: BodyProps[]
}

export interface IHelmetInstanceState extends IHelmetTags {
  id: number
  emptyState: boolean
}

export type OnChangeClientState = (newState: IHelmetInstanceState, addedTags: IHelmetTags, removedTags: IHelmetTags) => void;


export type MetaAttribute = keyof Pick<MetaProps, "charSet" | "name" | "httpEquiv" | "property" | "itemProp">;
export type LinkAttribute = keyof Pick<LinkProps, "rel" | "href">;
export const primaryMetaAttributes: readonly MetaAttribute[] = ["charSet", "name", "httpEquiv", "property", "itemProp"] as const
export const primaryLinkAttributes: readonly LinkAttribute[] = ["rel", "href"] as const

export const HELMET_ATTRIBUTE = 'data-rh';