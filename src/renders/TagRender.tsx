import {IHeadAnchorElement, TagName, TypedTagsProps} from "../types";
import {createElement, FC, memo, useEffect, useRef} from "react";
import {addTag, getCurrentElement, updateTag} from "./tagUtils";

interface ITagRender {
  tag: TypedTagsProps
  isFirst: boolean
  anchor: IHeadAnchorElement
}

const attributeName = "data-rh";
const attributeValue = "1";

export const TagRender: FC<ITagRender> = memo(({tag, isFirst, anchor}) => {
  const elementFrom = useRef<Element>();

  useEffect(() => {
    if (elementFrom.current !== undefined) {
      const currentElement = getCurrentElement(isFirst, anchor, tag.tagName);
      if (currentElement !== null) {
        return updateTag(elementFrom.current, currentElement, tag.tagName);
      } else {
        return addTag(elementFrom.current, isFirst, anchor);
      }
    }
  }, [tag, anchor, elementFrom])

  switch (tag.tagName) {
    case TagName.html:
    case TagName.body:
      return createElement("span", {key: tag.id, ...tag.tagProps, "data-rh": true, ref: elementFrom});
    default:
      return createElement(tag.tagName, {key: tag.id, ...tag.tagProps, "data-rh": true, ref: elementFrom});
  }
});

TagRender.displayName = "TagRender";