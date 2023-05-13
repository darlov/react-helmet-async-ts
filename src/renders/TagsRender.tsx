import {ITypedTagProps, MetaProps, TagName} from "../types";
import {createElement, FC} from "react";
import { createPortal } from "react-dom";

interface ITagsRenderProps<T extends TagName> {
  tags: ITypedTagProps<T>[]
}

type ReturnTypeComponent<T extends TagName> = ReturnType<FC<ITagsRenderProps<T>>>;
type PropType<T extends TagName> = Parameters<FC<ITagsRenderProps<T>>>[0];

export const TagsRender =  <T extends TagName, >({tags}: PropType<T>):ReturnTypeComponent<T>  => {
  return tags.length > 0 
    ? createPortal(tags.map((m, i) => createElement(m.tagType, { ...m.tagProps, key: i, "data-rh":"true" })), document.head) 
    : null;
}