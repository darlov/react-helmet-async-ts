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

export const Title = createTagComponent("Title", TagName.title, undefined, titleEmptyFallback);
export const Meta = createTagComponent("Meta", TagName.meta, isMetaValid);
export const Base = createTagComponent("Base", TagName.base, isBaseValid);
export const Body = createTagComponent("Body", TagName.body, isBodyValid);
export const Html = createTagComponent("Html", TagName.html, isHtmlValid);
export const Link = createTagComponent("Link", TagName.link, isLinkValid);
export const Noscript = createTagComponent("Noscript", TagName.noscript, isNoscriptValid);
export const Script = createTagComponent("Script", TagName.script, isScriptValid);
export const Style = createTagComponent("Style", TagName.style, isStyleValid);

