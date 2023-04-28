import { MetaProps } from "../types";
import { FC } from "react";
import { createPortal } from "react-dom";

interface IMetaRenderProps {
  tags: MetaProps[]
}
export const MetaRender: FC<IMetaRenderProps> = ({tags}) => {
  return tags.length > 0 
    ? createPortal(tags.map((m, i) => <meta { ...m } key={ i } data-rh={ "true" }/>), document.head) 
    : null;
}