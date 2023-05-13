import { FC, useEffect } from "react";
import {ITagProps, TagNames} from "../types";
import {
  getHtmlAttributesFromHtmlElement,
  renderToHtmlElement,
  createComponent,
} from "../utils";

interface IDocumentElementRenderProps {
  tag: ITagProps | undefined;
  attachTo: ParentNode | Element;
}

const getHtmlElement = (
  tagName: TagNames,
  attachTo: ParentNode | Element
): Element => {
  return attachTo.querySelector(tagName)!;
};

export const HtmlAttributesRender: FC<IDocumentElementRenderProps> = ({
  tag,
  attachTo,
}) => {
  
  useEffect(() => {
    if (tag !== undefined) {
      const htmlElement = renderToHtmlElement(
        createComponent(tag),
        tag.tagType
      );
      const attachedHtmlElement = getHtmlElement(tag.tagType, attachTo);
      const attributes = getHtmlAttributesFromHtmlElement(htmlElement);

      attributes.forEach(attr => attachedHtmlElement.setAttribute(attr.name, attr.value));
      return () => {
          attributes.forEach(attr => attachedHtmlElement.removeAttribute(attr.name));
      };
    }
  }, [tag]);

  return null;
};
