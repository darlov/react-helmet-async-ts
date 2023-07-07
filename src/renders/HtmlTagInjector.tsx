import {FC, useEffect} from "react";
import {ITypedTagProps, TagName, TagProps} from "../types";

interface IHtmlTagInjectorProps {
  fragment: DocumentFragment,
  tag: ITypedTagProps<TagName>["tagProps"] & {tagType: TagName}
}

interface IAttrModifyElement {
  from: HTMLElement,
  to: HTMLElement,
  appliedAttrNames: string[]
}

const applyAttributes = (from: HTMLElement, to: HTMLElement, applyContent?: boolean) => {
  const data: IAttrModifyElement = {
    from: from,
    to: to,
    appliedAttrNames: new Array<string>(from.attributes.length)
  }

  for (let i = 0; i < from.attributes.length; i++) {
    const attr = from.attributes[i];
    to.setAttribute(attr.name, attr.value);
    data.appliedAttrNames[i] = attr.name;
  }

  if (applyContent && from.innerHTML !== "") {
    to.innerHTML = from.innerHTML;
  }

  return data;
}

const addHeadElement = (element: HTMLElement) => {
  document.head.appendChild(element);
  return element;
}

export const HtmlTagInjector: FC<IHtmlTagInjectorProps> = ({fragment, tag}) => {
  useEffect(() => {
    const node = fragment.childNodes[0].cloneNode(true);
    let headElement: HTMLElement | undefined;
    let attributeData: IAttrModifyElement | undefined;

    const htmlElement = node as HTMLElement
    switch (tag.tagType) {
      case TagName.title: {
        const existTitle = document.head.querySelector("title");
        if (existTitle !== null) {
          attributeData = applyAttributes(htmlElement, existTitle, true);
        } else {
          headElement = addHeadElement(htmlElement);
        }
        break;
      }
      case TagName.body: {
        attributeData = applyAttributes(htmlElement, document.body);
        break;
      }
      case TagName.html: {
        const html = document.querySelector("html")!;
        attributeData = applyAttributes(htmlElement, html);
        break;
      }
      default: {
        headElement = addHeadElement(htmlElement);
        break;
      }
    }

    return () => {
      if (headElement !== undefined) {
        document.head.removeChild(headElement)
      } else if (attributeData !== undefined) {
        for (const attrName of attributeData.appliedAttrNames) {
          attributeData.to.removeAttribute(attrName);
        }
      }
    }
  }, [fragment, tag]);

  return null;
}