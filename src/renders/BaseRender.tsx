import { FC, useMemo } from "react";
import {BaseProps, IHelmetInstanceState} from "../Types";
import { createPortal } from "react-dom";
import {_, mergeTags} from "../Utils";

interface IBaseRenderProps {
  instances: IHelmetInstanceState[],
}

const findPrimaryAttribute = (base: BaseProps) => base.href !== undefined ? "href" : undefined

const mergeBases = (instances: IHelmetInstanceState[]) => {
  let result: BaseProps[] = [];
  return mergeTags("bases", result, instances, findPrimaryAttribute);
};

export const BaseRender: FC<IBaseRenderProps> = ({instances}) => {
  const resultStyles = useMemo(() => {
    return mergeBases(instances);
  }, [instances])

  return resultStyles.length > 0
      ? createPortal(resultStyles.map((m, i) => <base { ...m } key={ i } data-rh={ "true" }/>), document.head)
      : null;
}