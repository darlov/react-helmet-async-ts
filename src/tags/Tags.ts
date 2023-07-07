import {
  BaseProps,
  BodyProps,
  HtmlProps,
  LinkProps,
  MetaProps,
  NoscriptProps,
  primaryLinkAttributes,
  primaryMetaAttributes,
  ScriptProps,
  StyleProps,
  TagName,
  TitleProps
} from "../types";
import {createTagComponent} from "./CommonTag";
import {_} from "../utils";

const isMetaValid = (tag: MetaProps) => primaryMetaAttributes.some(attr => tag[attr] !== undefined)
const isBaseValid = (tag: BaseProps) => tag.href !== undefined
const isBodyValid = (tag: BodyProps) => !_.isEmpty(tag);
const isHtmlValid = (tag: HtmlProps) => !_.isEmpty(tag);
const isLinkValid = (tag: LinkProps) => primaryLinkAttributes.every(attr => tag[attr] !== undefined);
const isNoscriptValid = (tag: NoscriptProps) => tag.children !== undefined;
const isScriptValid = (tag: ScriptProps) => tag.children !== undefined || tag.src !== undefined;
const isStyleValid = (tag: StyleProps) => tag.children !== undefined;
const titleEmptyFallback = () : TitleProps => {
  return  {children: ""};
};

export const Title = createTagComponent(TagName.title, undefined, titleEmptyFallback);
Title.displayName = "Title";
export const Meta = createTagComponent(TagName.meta, isMetaValid);
Meta.displayName = "Meta"
export const Base = createTagComponent(TagName.base, isBaseValid);
Base.displayName = "Base";
export const Body = createTagComponent(TagName.body, isBodyValid);
Body.displayName = "Body";
export const Html = createTagComponent(TagName.html, isHtmlValid);
Html.displayName = "Html"
export const Link = createTagComponent(TagName.link, isLinkValid);
Link.displayName = "Link";
export const Noscript = createTagComponent(TagName.noscript, isNoscriptValid);
Noscript.displayName = "Noscript";
export const Script = createTagComponent(TagName.script, isScriptValid);
Script.displayName = "Script";
export const Style = createTagComponent(TagName.style, isStyleValid);
Style.displayName = "Style";

