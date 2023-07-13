import {FC, useEffect, useMemo} from "react";
import {ITypedTagProps, TagName} from "../types";

interface IHtmlTagInjectorProps {
  fragment: DocumentFragment,
  tag: ITypedTagProps<TagName>["tagProps"] & { tagType: TagName }
}

interface IAttrModifyElement {
  from: HTMLElement,
  to: HTMLElement,
  appliedAttrNames: string[],
  applyContent?: boolean
}

const applyAttributes = (data: IAttrModifyElement) => {
  for (let i = 0; i < data.from.attributes.length; i++) {
    const attr = data.from.attributes[i];
    data.to.setAttribute(attr.name, attr.value);
  }

  if (data.applyContent && data.from.childNodes.length > 0) {
    while (data.to.firstChild) {
      data.to.removeChild(data.to.firstChild);
    }

    while (data.from.firstChild) {
      data.to.appendChild(data.from.firstChild);
    }
  }
  return data;
}

const addHeadElement = (element: HTMLElement) => {
  document.head.appendChild(element);
  return element;
}

export const HtmlTagInjector: FC<IHtmlTagInjectorProps> = ({fragment, tag}) => {
  const data = useMemo(() => {
    let headElement: HTMLElement | undefined;
    let attributeData: IAttrModifyElement | undefined;

    const node = fragment.childNodes[0];
    if(node !== undefined) {
      const htmlElement = node as HTMLElement
      switch (tag.tagType) {
        case TagName.title: {
          const existTitle = document.head.querySelector("title");
          if (existTitle !== null) {
            attributeData = {
              from: htmlElement,
              to: existTitle,
              appliedAttrNames: htmlElement.getAttributeNames(),
              applyContent: true
            };
          } else {
            headElement = htmlElement;
          }
          break;
        }
        case TagName.body: {
          attributeData = {
            from: htmlElement,
            to: document.body,
            appliedAttrNames: htmlElement.getAttributeNames()
          };
          break;
        }
        case TagName.html: {
          const html = document.querySelector("html")!;
          attributeData = {
            from: htmlElement,
            to: html,
            appliedAttrNames: htmlElement.getAttributeNames()
          };
          break;
        }
        default: {
          headElement = htmlElement;
          break;
        }
      }
    }
    return {headElement, attributeData}
  }, [fragment, tag])

  useEffect(() => {
    return () => {
      if (data.headElement !== undefined) {
        document.head.removeChild(data.headElement)
      } else if (data.attributeData !== undefined) {
        for (const attrName of data.attributeData.appliedAttrNames) {
          data.attributeData.to.removeAttribute(attrName);
        }
      }
    }
  }, []);

  useEffect(() => {

    if(data.headElement !== undefined){
      document.head.appendChild(data.headElement);
    }else if (data.attributeData !== undefined){
      applyAttributes(data.attributeData);
    }

  }, [data]);

  return null;
}