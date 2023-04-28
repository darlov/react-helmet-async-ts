import { FC } from "react";
import { LinkProps } from "../types";
import { createPortal } from "react-dom";

interface ILinkRenderProps {
  tags: LinkProps[],
}
export const LinkRender: FC<ILinkRenderProps> = ({tags}) => {
  return tags.length > 0
    ? createPortal(tags.map((m, i) => <link { ...m } key={ i } data-rh={ "true" }/>), document.head)
    : null;
}