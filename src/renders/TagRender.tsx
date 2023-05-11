import {FC, useEffect, useMemo} from "react";
import {IHelmetState} from "../types";
import {MetaRender} from "./MetaRender";
import {StyleRender} from "./StyleRender";
import {ScriptRender} from "./ScriptRender";
import {LinkRender} from "./LinkRender";
import {NoscriptRender} from "./NoscriptRender";
import {HtmlAttributesRender} from "./HtmlAttributesRender";
import {TitleTestRender} from "./TitleTestRender";
import {createRoot} from "react-dom/client";

interface ITagRenderProps {
  state?: IHelmetState;
}

export const TagRender: FC<ITagRenderProps> = ({state}) => {

  const fragment = useMemo(() => {
    return document.createDocumentFragment()
  },[]);
  
  const root = useMemo(() => {
    return createRoot(fragment)
  },[fragment]);
  
  useEffect(() => {
    if(state?.titleTag){
      root.render(<title { ...state?.titleTag } data-rh={ "true" }/>);

      document.head.appendChild(fragment);
      const title = document.head.querySelector("title");
      console.log(title);
    }
 
  },[fragment, root, state?.titleTag])
  
  if (state) {
    return (
      <>
        {/*<HtmlAttributesRender tag={state.titleTag} tagName={"title"} attachTo={document.head}/>*/}
        <HtmlAttributesRender tag={state.bodyTag} tagName={"body"} attachTo={document}/>
        <HtmlAttributesRender tag={state.htmlTag} tagName={"html"} attachTo={document}/>
        <HtmlAttributesRender tag={state.baseTag} tagName={"base"} attachTo={document.head}/>
        <TitleTestRender tag={state.titleTag} />


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
