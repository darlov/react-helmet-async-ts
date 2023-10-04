import {FC, useMemo} from "react";
import {AnchorElementType, IHeadAnchorElement, IHelmetState} from "../types";
import {TagRender} from "./TagRender";
import {createPortal} from "react-dom";

interface ITagRenderProps {
  state?: IHelmetState;
  canUseDOM: boolean,
  elementSelector?: string,
  elementType?: Exclude<AnchorElementType, "parent">
}

export const TagsRender: FC<ITagRenderProps> = ({canUseDOM, state, elementSelector, elementType}) => {
  const placeHolder = useMemo(() => {
    return document.createDocumentFragment();
  }, []);

  const firstElement = useMemo<IHeadAnchorElement>(() => {
    if (elementSelector) {
      const headElement = document.head.querySelectorAll(elementSelector).item(0);

      if (headElement) {
        return {element: headElement, elementType: elementType ?? "first"}
      }
    }

    return {element: document.head, elementType: "parent"}

  }, [elementSelector])

  if (canUseDOM && state && state.tags.length > 0) {
    const tags = state.tags.map(
      (tag, index) => <TagRender key={tag.id} tag={tag} index={index} anchor={firstElement}/>
    );
    return createPortal(<>{tags}</>, placeHolder)
  }

  return null;
};

