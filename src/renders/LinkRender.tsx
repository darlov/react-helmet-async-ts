import { FC, useMemo } from "react";
import { IHelmetInstanceState, LinkProps, primaryLinkAttributes } from "../Types";
import { createPortal } from "react-dom";
import { _, mergeTags } from "../Utils";

interface ILinkRenderProps {
  instances: IHelmetInstanceState[],
}

const findPrimaryAttribute = (link: LinkProps) => {
  const foundAttr = primaryLinkAttributes.find(attr => {
    return link[attr] !== undefined ? !(attr === "rel" && link[attr] === "stylesheet") : false;
  });
  
  if(foundAttr !== undefined){
    return `${foundAttr}_${link[foundAttr]}`
  }
}

const mergeLinks = (instances: IHelmetInstanceState[]) => {
  let result: LinkProps[] = [];
  return mergeTags("links", result, instances, findPrimaryAttribute);
};

export const LinkRender: FC<ILinkRenderProps> = ({instances}) => {
  const resultStyles = useMemo(() => {
    return mergeLinks(instances);
  }, [instances])

  return resultStyles.length > 0
    ? createPortal(resultStyles.map((m, i) => <link { ...m } key={ i } data-rh={ "true" }/>), document.head)
    : null;
}