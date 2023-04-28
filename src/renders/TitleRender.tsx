import { FC } from "react";
import { TitleProps } from "../types";
import { createPortal } from "react-dom";

interface ITitleRenderProps {
  tag?: TitleProps;
}

export const TitleRender: FC<ITitleRenderProps> = ({ tag }) => {
  return tag !== undefined
    ? createPortal(<title {...tag} data-rh={"true"} />, document.head)
    : null;
};