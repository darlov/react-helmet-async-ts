import {FC, ReactNode, useId, useMemo} from "react";
import {
  IHelmetInstanceState,
} from "./types";
import {useHelmetContext} from "./HelmetProvider";
import {Title} from "./tags";
import {createActionsData, HelmetScopedContext, IHelmetScopedContextData} from "./HelmetScopedProvider";
import {useServerSideEffect} from "./hooks/useServerSideEffect";

interface IHelmetProps {
  defaultTitle?: ReactNode,
  children?: ReactNode
  prioritizeSeoTags?: boolean
}

export const Helmet: FC<IHelmetProps> = ({children, defaultTitle}) => {
  const rootContext = useHelmetContext();
  const sourceId = useId();
  const id = useMemo(() => {
    return parseInt(sourceId.replace(":r", "").replace(":", ""), 32);
  }, [sourceId])

  const instanceState = useMemo<IHelmetInstanceState>(() => {
    return {id}
  }, [id])

  useServerSideEffect(() => {
      rootContext.addInstance(instanceState);
      return () => rootContext.removeInstance(instanceState);
    },
    () => !rootContext.canUseDOM,
    [instanceState, rootContext.addInstance, rootContext.removeInstance]);

  const context = useMemo<IHelmetScopedContextData>(() => {
    return {
      baseActions: createActionsData(instanceState, "baseTags", rootContext),
      htmlActions: createActionsData(instanceState, "htmlTags", rootContext),
      bodyActions: createActionsData(instanceState, "bodyTags", rootContext),
      scriptActions: createActionsData(instanceState, "scriptTags", rootContext),
      noscriptActions: createActionsData(instanceState, "noscriptTags", rootContext),
      styleActions: createActionsData(instanceState, "styleTags", rootContext),
      titleActions: createActionsData(instanceState, "titleTags", rootContext),
      metaActions: createActionsData(instanceState, "metaTags", rootContext),
      linkActions: createActionsData(instanceState, "linkTags", rootContext)
    }
  }, [instanceState, rootContext.addItem, rootContext.removeItem])

  return (
    <HelmetScopedContext.Provider value={context}>
      {defaultTitle && <Title>{defaultTitle}</Title>}
      {children}
    </HelmetScopedContext.Provider>);
}

Helmet.displayName = "Helmet";