import {FC, useMemo} from "react";
import {AnchorInsertPosition, IHeadAnchorElement, IHelmetState} from "../types";
import {HeadTagRender} from "./HeadTagRender";
import {createPortal} from "react-dom";
import {DocumentPosition, tagConfigs} from "../tagConfiguration";
import {DocumentTagRender} from "./DocumentTagRender";

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
      const headElement = document.head.querySelector(elementSelector);

      if (headElement && headElement.parentNode?.isEqualNode(document.head)) {
        return {element: headElement, elementType: "child", insertPosition: insertPosition ?? "after"}
      }
    }

    return {element: document.head, elementType: "head", insertPosition: insertPosition ?? "after"}

  }, [elementSelector])

  if (canUseDOM && state && state.tags.length > 0) {
    const tags = state.tags.map(
        (tag, index) => {
          const tagConfig = tagConfigs[tag.tagName];
          switch (tagConfig.position) {
            case DocumentPosition.Header :
              return <HeadTagRender key={tag.id} tag={tag}/>;
            case DocumentPosition.Document :
              return <DocumentTagRender key={tag.id} tag={tag}/>;
          }
        }
    );
    return createPortal(<>{tags}</>, placeHolder)
  }

  return null;
};

