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
  StyleProps, TitleProps
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

export const Title = createTagComponent("titleActions", undefined, titleEmptyFallback);
export const Meta = createTagComponent("metaActions", isMetaValid);
export const Base = createTagComponent("baseActions", isBaseValid);
export const Body = createTagComponent("bodyActions", isBodyValid);
export const Html = createTagComponent("htmlActions", isHtmlValid);
export const Link = createTagComponent("linkActions", isLinkValid);
export const Noscript = createTagComponent("noscriptActions", isNoscriptValid);
export const Script = createTagComponent("scriptActions", isScriptValid);
export const Style = createTagComponent("styleActions", isStyleValid);

