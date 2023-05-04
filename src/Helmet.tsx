import {Children, FC, isValidElement, ReactNode, useEffect, useId, useMemo} from "react";
import {
  IHelmetInstanceState,
} from "./types";
import {useHelmetContext} from "./HelmetProvider";
import {Base, Title} from "./tags";

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
      emptyState: false,
    }
  }, [id])

  useEffect(() => {
    rootContext.addInstance(instanceState);
    return () => rootContext.removeInstance(instanceState);
  }, [instanceState, rootContext.addInstance, rootContext.removeInstance])

  if (!rootContext.canUseDOM) {
    rootContext.addInstance(instanceState);
  }

  const childElements = Children.map(children, (node) => {
    if (isValidElement(node)) {
      if (node.type == "base") {
        return (<Base key={node.key} {...node.props} instance={instanceState}/>)
      }
    }

    return node;
  })

  return (
    <>
      {defaultTitle && <Title>{defaultTitle}</Title>}
      {childElements}
    </>);
}

Helmet.displayName = "Helmet";