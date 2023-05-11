import { FC, useEffect } from "react";
import { TagProps } from "../types";
import {
  getHtmlAttributesFromHtmlElement,
  renderToHtmlElement,
   createComponent,
} from "../utils";
import {createRoot} from "react-dom/client";

interface IDocumentElementRenderProps {
  tag: TagProps | undefined;
  tagName: keyof HTMLElementTagNameMap;
  attachTo: ParentNode | Element;
}

const isElement = (attachTo: ParentNode | Element): attachTo is Element => {
  return "insertAdjacentHTML" in attachTo;
};

const getOrCreateHtmlElement = (
  htmlElement: Element,
  tagName: keyof HTMLElementTagNameMap,
  attachTo: ParentNode | Element
): [boolean, Element] => {
  let isCreated = false;
  const element = attachTo.querySelector(tagName);
  if (element === null) {
    if (isElement(attachTo)) {
      attachTo.insertAdjacentHTML("beforeend", htmlElement.outerHTML);

      const attachedHtmlElement = attachTo.querySelector(tagName);
      if (attachedHtmlElement == null) {
        throw new Error(`Couldn't found element ${tagName} in the ${htmlElement.outerHTML}`);
      }

      isCreated = true;

      return [isCreated, attachedHtmlElement];
    }

    throw new Error(`Couldn't found html element ${tagName} in the document`);
  }
  return [isCreated, element];
};

export const HtmlAttributesRender: FC<IDocumentElementRenderProps> = ({
  tag,
  tagName,
  attachTo,
}) => {
  
  createRoot
  useEffect(() => {
    if (tag !== undefined) {
      const htmlElement = renderToHtmlElement(
        createComponent(tagName, tag),
        tagName
      );
      const [isCreated, attachedHtmlElement] = getOrCreateHtmlElement(
        htmlElement,
        tagName,
        attachTo
      );
      const attributes = getHtmlAttributesFromHtmlElement(htmlElement);

      attributes.forEach(attr => attachedHtmlElement.setAttribute(attr.name, attr.value));

      if(tag.children !== undefined){
        attachedHtmlElement.innerHTML = htmlElement.innerHTML;
      }
      
      return () => {
        if (isCreated) {
          attachedHtmlElement.remove();
        } else {
          attributes.forEach(attr => attachedHtmlElement.removeAttribute(attr.name));
          if(tag.children !== undefined){
            attachedHtmlElement.innerHTML = "";
          }
        }
      };
    }
  }, [tag]);

  return null;
};
