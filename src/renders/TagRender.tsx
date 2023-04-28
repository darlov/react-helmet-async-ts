import { FC, memo, useEffect, useMemo } from "react";
import { IHelmetInstanceState } from "../types";
import { TitleRender } from "./TitleRender";
import { MetaRender } from "./MetaRender";
import { StyleRender } from "./StyleRender";
import { ScriptRender } from "./ScriptRender";
import { LinkRender } from "./LinkRender";
import { NoscriptRender } from "./NoscriptRender";
import { _, buildState } from "../utils";
import { BaseRender } from "./BaseRender";
import { BodyRender } from "./BodyRender";
import { useHelmetContext } from "../HelmetProvider";

interface ITagRenderProps {
  instances?: IHelmetInstanceState[];
}

export const TagRender: FC<ITagRenderProps> = memo(({ instances }) => {
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
        <TitleRender tag={rootContext.state.titleTag} />
        <BaseRender tag={rootContext.state.baseTag} />
        <BodyRender tag={rootContext.state.bodyTag} />

        <MetaRender tags={rootContext.state.metaTags} />
        <StyleRender tags={rootContext.state.styleTags} />
        <ScriptRender tags={rootContext.state.scriptTags} />
        <LinkRender tags={rootContext.state.linkTags} />
        <NoscriptRender tags={rootContext.state.noscriptTags} />
      </>
    );
  }

  return null;
});

TagRender.displayName = "TagRender";
