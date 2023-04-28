import { FC } from "react";
import {NoscriptProps} from "../types";
import { createPortal } from "react-dom";

interface INoscriptRenderProps {
  tags: NoscriptProps[],
}

export const NoscriptRender: FC<INoscriptRenderProps> = ({tags}) => {
  return tags.length > 0
      ? createPortal(tags.map((m, i) => <noscript { ...m } key={ i } data-rh={ "true" }>{m.children}</noscript>), document.head)
    : null;
}