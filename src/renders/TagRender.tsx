import {FC} from "react";
import {IHelmetState} from "../types";
import {MetaRender} from "./MetaRender";
import {StyleRender} from "./StyleRender";
import {ScriptRender} from "./ScriptRender";
import {LinkRender} from "./LinkRender";
import {NoscriptRender} from "./NoscriptRender";
import {HtmlAttributesRender} from "./HtmlAttributesRender";

interface ITagRenderProps {
  state?: IHelmetState;
}

export const TagRender: FC<ITagRenderProps> = ({state}) => {
  if (state) {
    return (
      <>
        <HtmlAttributesRender tag={state.titleTag} tagName={"title"} attachTo={document.head}/>
        <HtmlAttributesRender tag={state.baseTag} tagName={"base"} attachTo={document.head}/>
        <HtmlAttributesRender tag={state.bodyTag} tagName={"body"} attachTo={document}/>
        <HtmlAttributesRender tag={state.htmlTag} tagName={"html"} attachTo={document}/>

        <MetaRender tags={state.metaTags}/>
        <StyleRender tags={state.styleTags}/>
        <ScriptRender tags={state.scriptTags}/>
        <LinkRender tags={state.linkTags}/>
        <NoscriptRender tags={state.noscriptTags}/>
      </>
    );
  }

  return null;
};
