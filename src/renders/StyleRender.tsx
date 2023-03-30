import { FC, useMemo } from "react";
import { IHelmetInstanceState, MetaProps, StyleProps, TitleProps } from "../Types";
import { createPortal } from "react-dom";
import { _ } from "../Utils";

interface IStyleRenderProps {
  instances: IHelmetInstanceState[],
}

const mergeStyles = (instances: IHelmetInstanceState[]) => {
  let result: StyleProps[] = [];

  for (const instance of instances) {
    if (instance.styles) {
      if (instance.emptyState) {
        _.clear(result);
      } else {
        result.push(...instance.styles);
      }
    }
  }

  return result;
};

export const StyleRender: FC<IStyleRenderProps> = ({instances}) => {
  const resultStyles = useMemo(() => {
    return mergeStyles(instances);
  }, [instances])

  return resultStyles.length > 0
    ? createPortal(resultStyles.map((m, i) => <style { ...m } key={ i } data-rh={ "true" }/>), document.head)
    : null;
}