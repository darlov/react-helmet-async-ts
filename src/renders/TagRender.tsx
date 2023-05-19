import {FC, useEffect, useMemo} from "react";
import {IHelmetState} from "../types";
import {HtmlAttributesRender} from "./HtmlAttributesRender";
import {createRoot} from "react-dom/client";
import {TagsRender} from "./TagsRender";

interface ITagRenderProps {
  state?: IHelmetState;
}

export const TagRender: FC<ITagRenderProps> = ({state}) => {


  
  if (state) {
    return (
      <>
        <HtmlAttributesRender tag={state.bodyAttributes} attachTo={document}/>
        <HtmlAttributesRender tag={state.htmlAttributes} attachTo={document}/>
        <TagsRender tags={state.headerTags}/>
      </>
    );
  }

  return null;
};
