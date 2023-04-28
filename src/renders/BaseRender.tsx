import { FC } from "react";
import { BaseProps } from "../types";
import { createPortal } from "react-dom";

interface IBaseRenderProps {
  tag?: BaseProps;
}

export const BaseRender: FC<IBaseRenderProps> = ({ tag }) => {
  return tag !== undefined
    ? createPortal(<base {...tag} data-rh={"true"} />, document.head)
    : null;
};