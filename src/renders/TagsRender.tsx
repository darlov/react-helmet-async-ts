import {FC, useMemo} from "react";
import {AnchorElementType, AnchorInsertPosition, IHeadAnchorElement, IHelmetState} from "../types";
import {TagRender} from "./TagRender";
import {createPortal} from "react-dom";

interface ITagRenderProps {
  state?: IHelmetState;
  canUseDOM: boolean,
  elementSelector?: string,
  insertPosition?: AnchorInsertPosition
}

export const TagsRender: FC<ITagRenderProps> = ({canUseDOM, state, elementSelector, insertPosition}) => {
  const placeHolder = useMemo(() => {
    return document.createDocumentFragment();
  }, []);

  const anchor = useMemo<IHeadAnchorElement>(() => {
    if (elementSelector) {
      const headElement = document.head.querySelectorAll(elementSelector).item(0);

      if (headElement && headElement.parentNode?.isEqualNode(document.head)) {
        return {element: headElement, elementType: "child", insertPosition: insertPosition ?? "after"}
      }
    }

    return {element: document.head, elementType: "head", insertPosition: insertPosition ?? "after"}

  }, [elementSelector])

  if (canUseDOM && state && state.tags.length > 0) {
    const tags = state.tags.map(
        (tag, index) => <TagRender key={tag.id} tag={tag} isFirst={index === 0} anchor={anchor}/>
    );
    return createPortal(<>{tags.reverse()}</>, placeHolder)
  }

  return null;
};

