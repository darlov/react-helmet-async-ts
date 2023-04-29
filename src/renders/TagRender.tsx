import {FC, memo, useEffect} from "react";
import {IHelmetInstanceState} from "../types";
import {MetaRender} from "./MetaRender";
import {StyleRender} from "./StyleRender";
import {ScriptRender} from "./ScriptRender";
import {LinkRender} from "./LinkRender";
import {NoscriptRender} from "./NoscriptRender";
import {_, buildState} from "../utils";
import {useHelmetContext} from "../HelmetProvider";
import {HtmlAttributesRender} from "./HtmlAttributesRender";

interface ITagRenderProps {
  instances?: IHelmetInstanceState[];
}

export const TagRender: FC<ITagRenderProps> = memo(({instances}) => {
  const rootContext = useHelmetContext();

  useEffect(() => {
    if (instances && instances.length > 0) {
      const orderedInstances = _.sortBy(instances, "id");
      const state = buildState(orderedInstances);

      rootContext.setState(state);
    } else {
      rootContext.setState(undefined);
    }
  }, [instances, rootContext.setState]);

  if (rootContext.state) {
    return (
      <>
        <HtmlAttributesRender tag={rootContext.state.titleTag} tagName={"title"} attachTo={document.head}/>
        <HtmlAttributesRender tag={rootContext.state.baseTag} tagName={"base"} attachTo={document.head}/>
        <HtmlAttributesRender tag={rootContext.state.bodyTag} tagName={"body"} attachTo={document}/>
        <HtmlAttributesRender tag={rootContext.state.htmlTag} tagName={"html"} attachTo={document}/>

        <MetaRender tags={rootContext.state.metaTags}/>
        <StyleRender tags={rootContext.state.styleTags}/>
        <ScriptRender tags={rootContext.state.scriptTags}/>
        <LinkRender tags={rootContext.state.linkTags}/>
        <NoscriptRender tags={rootContext.state.noscriptTags}/>
      </>
    );
  }

  return null;
});

TagRender.displayName = "TagRender";
