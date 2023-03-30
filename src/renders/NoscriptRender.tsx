import { FC, useMemo } from "react";
import {IHelmetInstanceState, NoscriptProps, ScriptProps} from "../Types";
import { createPortal } from "react-dom";
import { _ } from "../Utils";

interface INoscriptRenderProps {
  instances: IHelmetInstanceState[],
}

const mergeTags = (instances: IHelmetInstanceState[]) => {
  let result: NoscriptProps[] = [];

  for (const instance of instances) {
    if (instance.noscripts) {
      if (instance.emptyState) {
        _.clear(result);
      } else {
        result.push(...instance.noscripts);
      }
    }
  }

  return result;
};

export const NoscriptRender: FC<INoscriptRenderProps> = ({instances}) => {
  const resultStyles = useMemo(() => {
    return mergeTags(instances);
  }, [instances])

  return resultStyles.length > 0
      ? createPortal(resultStyles.map((m, i) => <noscript { ...m } key={ i } data-rh={ "true" }>{m.children}</noscript>), document.head)
    : null;
}