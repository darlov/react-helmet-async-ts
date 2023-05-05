import {FC, ReactNode, useEffect, useId, useMemo} from "react";
import {
  IHelmetInstanceState,
} from "./types";
import {useHelmetContext} from "./HelmetProvider";
import {Base, Title} from "./tags";
import {createActionsData, HelmetScopedContext, IHelmetScopedContextData} from "./HelmetScopedProvider";

interface IHelmetProps {
  defaultTitle?: ReactNode,
  children?: ReactNode
}

export const Helmet: FC<IHelmetProps> = ({children, defaultTitle}) => {
  const rootContext = useHelmetContext();
  const sourceId = useId();
  const id = useMemo(() => {
    return parseInt(sourceId.replace(":r", "").replace(":", ""), 32);
  }, [sourceId])

  const instanceState = useMemo<IHelmetInstanceState>(() => {
    return {
      id,
      emptyState: false
    }
  }, [id])

  useEffect(() => {
    rootContext.addInstance(instanceState);
    return () => rootContext.removeInstance(instanceState);
  }, [instanceState, rootContext.addInstance, rootContext.removeInstance])

  if (!rootContext.canUseDOM) {
    rootContext.addInstance(instanceState);
  }

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