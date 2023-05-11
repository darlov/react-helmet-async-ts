import { FC } from "react";
import {StyleProps, TitleProps} from "../types";
import { createPortal } from "react-dom";

interface ITitleTestRenderProps {
  tag: TitleProps | undefined
}
export const TitleTestRender: FC<ITitleTestRenderProps> = ({tag}) => {
  return tag != undefined 
    ? createPortal(<title { ...tag } data-rh={ "true" }/>, document.head)
    : null;
}