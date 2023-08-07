import {
  TagName, TagPropsMap,
  TitleProps
} from "../types";
import {createTagComponent} from "./CommonTag";
import {_} from "../utils";
import {tagConfigs} from "../tagConfiguration";

const isTagValid = <T extends TagName>(tag: TagPropsMap[T], tagType: T) => {
  const config = tagConfigs[tagType];

  if(config.isValid){
    return config.isValid(tag, config);
  }
  
  if (config.primaryAttrs) {
    return config.primaryAttrs.some(attr => tag[attr] !== undefined)
  }
  
  return !_.isEmpty(tag);
}

const titleEmptyFallback = () : TitleProps => {
  return  {children: ""};
};

export const Title = createTagComponent("Title", TagName.title, undefined, titleEmptyFallback);
export const Meta = createTagComponent("Meta", TagName.meta, isTagValid);
export const Base = createTagComponent("Base", TagName.base, isTagValid);
export const Body = createTagComponent("Body", TagName.body, isTagValid);
export const Html = createTagComponent("Html", TagName.html, isTagValid);
export const Link = createTagComponent("Link", TagName.link, isTagValid);
export const Noscript = createTagComponent("Noscript", TagName.noscript, isTagValid);
export const Script = createTagComponent("Script", TagName.script, isTagValid);
export const Style = createTagComponent("Style", TagName.style, isTagValid);

