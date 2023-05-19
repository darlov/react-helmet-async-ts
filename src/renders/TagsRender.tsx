import {ITypedTagProps, MetaProps, TagName} from "../types";
import {createElement, FC, useEffect, useMemo} from "react";
import {createPortal, flushSync} from "react-dom";
import {createRoot} from "react-dom/client";

interface ITagsRenderProps<T extends TagName> {
  tags: ITypedTagProps<T>[]
}

type ReturnTypeComponent<T extends TagName> = ReturnType<FC<ITagsRenderProps<T>>>;
type PropType<T extends TagName> = Parameters<FC<ITagsRenderProps<T>>>[0];

export const TagsRender = <T extends TagName, >({tags}: PropType<T>): ReturnTypeComponent<T> => {

  // const fragment = useMemo(() => {
  //   return document.createDocumentFragment();
  // }, []);
  //
  // const root = useMemo(() => {
  //   return createRoot(fragment)
  // }, [fragment]);
  //
  // useEffect(() => {
  //   flushSync(() => root.render());
  //   document.head.appendChild(fragment);
  //
  // }, [fragment, root, tags])

  return createPortal((tags.map((m, i) => createElement(m.tagType, {...m.tagProps, key: i, "data-rh": "true"}))), document.head);
}