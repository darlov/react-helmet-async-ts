import {ITypedTagProps, TagName} from "../types";
import {createElement, FC, memo, useMemo} from "react";
import {createPortal} from "react-dom";
import {HtmlTagInjector} from "./HtmlTagInjector";

type TagRenderProps = ITypedTagProps<TagName>["tagProps"] & {tagType: TagName}

export const TagRender: FC<TagRenderProps> = memo<TagRenderProps>((tag) => {
  const placeHolder = useMemo(() => {
    return document.createDocumentFragment();
  }, []);

  const { tagType, id, ...restObject } = tag;
  
  const tagComponent = createElement(tagType, {...restObject, "data-rh": "true"});

  return <>
    {createPortal(tagComponent, placeHolder)}
    <HtmlTagInjector fragment={placeHolder} tag={tag}/>
  </>
});

TagRender.displayName = "TagRender";