import { FC, useMemo } from "react";
import { IHelmetInstanceState, TitleProps } from "../Types";
import { createPortal } from "react-dom";

interface ITitleRenderProps {
  instances: IHelmetInstanceState[],
}

export const TitleRender: FC<ITitleRenderProps> = ({instances}) => {
  const title = useMemo(() => {
    let result: TitleProps | undefined = undefined;

    for (const instance of instances) {
      if(instance.emptyState){
        result = instances[0].titles !== undefined ? instances[0].titles[0] : {};
        continue;
      }
      result = (instance.titles || []).reduce((prev, current) => {
        return {...(prev ?? {}), ...current}
      }, result as TitleProps | undefined )
    }
    return result;
  }, [instances])

  return title !== undefined ? createPortal(<title { ...title } data-rh={ "true" }/>, document.head) : null;
}