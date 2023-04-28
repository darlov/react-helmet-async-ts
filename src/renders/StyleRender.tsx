import { FC } from "react";
import { StyleProps } from "../types";
import { createPortal } from "react-dom";

interface IStyleRenderProps {
  tags: StyleProps[]
}
export const StyleRender: FC<IStyleRenderProps> = ({tags}) => {
  return tags.length > 0
    ? createPortal(tags.map((m, i) => <style { ...m } key={ i } data-rh={ "true" }/>), document.head)
    : null;
}