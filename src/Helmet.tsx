import {FC, memo, ReactNode, useMemo} from "react";
import {IHelmetInstanceState} from "./types";
import {useHelmetContext} from "./HelmetProvider";
import {Title} from "./tags";
import {createActionsData, HelmetScopedContext, HelmetScopedContextData} from "./HelmetScopedProvider";
import {useServerSideEffect} from "./hooks/useServerSideEffect";

interface IHelmetProps {
  defaultTitle?: ReactNode,
  children?: ReactNode
  prioritizeSeoTags?: boolean
}

let counter = 0;
export const Helmet = memo<IHelmetProps>(({children, defaultTitle}) => {
  const rootContext = useHelmetContext();
  const instanceState = useMemo<IHelmetInstanceState>(() => {
    return {id: counter++}
  }, [])

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
});

Helmet.displayName = "Helmet";