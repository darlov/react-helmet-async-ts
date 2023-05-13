import {FC, ReactNode, useId, useMemo} from "react";
import {
  IHelmetInstanceState, TagName,
} from "./types";
import {useHelmetContext} from "./HelmetProvider";
import {Title} from "./tags";
import {createActionsData, HelmetScopedContext, HelmetScopedContextData} from "./HelmetScopedProvider";
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

  const context = useMemo<HelmetScopedContextData>(() => {
    return {
      actions: createActionsData(instanceState, rootContext)
    }
  }, [instanceState, rootContext.addItem, rootContext.removeItem])

  return (
    <HelmetScopedContext.Provider value={context}>
      {defaultTitle && <Title>{defaultTitle}</Title>}
      {children}
    </HelmetScopedContext.Provider>);
}

Helmet.displayName = "Helmet";