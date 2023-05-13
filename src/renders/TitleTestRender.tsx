import { FC } from "react";
import {ITagProps, ITypedTagProps, StyleProps, TagName, TagPropsMap, TitleProps} from "../types";
import { createPortal } from "react-dom";

interface ITitleTestRenderProps {
  tag: ITypedTagProps<TagName.title> | undefined
}
export const TitleTestRender: FC<ITitleTestRenderProps> = ({tag}) => {
  return tag != undefined 
    ? createPortal(<tag.tagType { ...tag.tagProps } data-rh={ "true" }/>, document.head)
    : null;
}