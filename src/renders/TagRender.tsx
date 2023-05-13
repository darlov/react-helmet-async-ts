import {FC, useEffect, useMemo} from "react";
import {IHelmetState} from "../types";
import {HtmlAttributesRender} from "./HtmlAttributesRender";
import {TitleTestRender} from "./TitleTestRender";
import {createRoot} from "react-dom/client";
import {TagsRender} from "./TagsRender";

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
        <HtmlAttributesRender tag={state.bodyAttributes} attachTo={document}/>
        <HtmlAttributesRender tag={state.htmlAttributes} attachTo={document}/>

        <TitleTestRender tag={state.titleTag} />

        <TagsRender tags={state.metaTags}/>
        <TagsRender tags={state.styleTags}/>
        <TagsRender tags={state.scriptTags}/>
        <TagsRender tags={state.linkTags}/>
        <TagsRender tags={state.noscriptTags}/>
      </>
    );
  }

  return null;
};
