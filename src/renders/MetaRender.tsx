import { IHelmetInstanceState, MetaProps, primaryMetaAttributes } from "../Types";
import { FC, useMemo } from "react";
import { createPortal } from "react-dom";
import { _, mergeTags } from "../Utils";

interface IMetaRenderProps {
  instances: IHelmetInstanceState[]
}

const findPrimaryAttribute = (meta: MetaProps) => {
  const foundAttr = primaryMetaAttributes.find(attr => meta[attr] !== undefined);

  if(foundAttr !== undefined){
    return `${foundAttr}_${meta[foundAttr]}`
  }
}

const mergeMetas = (instances: IHelmetInstanceState[]) => {
  let result: MetaProps[] = [];
  return mergeTags("metas", result, instances, findPrimaryAttribute);
};

export const MetaRender: FC<IMetaRenderProps> = ({instances}) => {
  const resultMetas = useMemo(() => {
    return mergeMetas(instances);
  }, [instances])

  return resultMetas.length > 0 
    ? createPortal(resultMetas.map((m, i) => <meta { ...m } key={ i } data-rh={ "true" }/>), document.head) 
    : null;
}