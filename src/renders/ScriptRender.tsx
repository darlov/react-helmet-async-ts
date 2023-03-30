import { FC, useMemo } from "react";
import { IHelmetInstanceState, ScriptProps } from "../Types";
import { createPortal } from "react-dom";
import { _ } from "../Utils";

interface IScriptRenderProps {
  instances: IHelmetInstanceState[],
}

const mergeScripts = (instances: IHelmetInstanceState[]) => {
  let result: ScriptProps[] = [];

  for (const instance of instances) {
    if (instance.scripts) {
      if (instance.emptyState) {
        _.clear(result);
      } else {
        result.push(...instance.scripts);
      }
    }
  }

  return result;
};

export const ScriptRender: FC<IScriptRenderProps> = ({instances}) => {
  const resultStyles = useMemo(() => {
    return mergeScripts(instances);
  }, [instances])

  return resultStyles.length > 0
    ? createPortal(resultStyles.map((m, i) => <script { ...m } key={ i } data-rh={ "true" }/>), document.head)
    : null;
}