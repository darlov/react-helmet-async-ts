import {IHeadAnchorElement, TagName, TypedTagsProps} from "../types";
import React, {createElement, FC, memo, useEffect, useMemo, useRef, useState} from "react";

interface ITagRender {
  tag: TypedTagsProps
  index: number
  anchor: IHeadAnchorElement
}

const attributeName = "data-rh";
const attributeValue = "1";

const isElement = (node: Node): node is Element => {
  const element = (node as Element);
  return element.setAttribute !== undefined && element.attributes !== undefined;
}

const applyAttributes = (from: Element, to: Element) => {
  for (const attribute of from.attributes) {
    to.setAttribute(attribute.name, attribute.value)
  }
}
const processChildList = (mutation: MutationRecord, isRootNode: boolean, tagType: TagName) => {
  switch (tagType) {
    case TagName.title: {
      const existTitle = document.head.querySelector("title");

      for (const addedNode of mutation.addedNodes) {
        if (existTitle !== null) {

          if (isRootNode && isElement(addedNode)) {
            applyAttributes(addedNode, existTitle);
          }
          if (!isRootNode) {
            if (addedNode.parentNode !== null) {
              addedNode.parentNode.childNodes.forEach((node, key) => {
                const existNode = existTitle.childNodes[key];
                if (existNode === undefined) {
                  existTitle.appendChild(node.cloneNode(true))
                } else if (!node.isEqualNode(existNode)) {
                  existTitle.replaceChild(node.cloneNode(true), existNode);
                }
              })
            }
          } else {
            const clonedNode = addedNode.cloneNode(true);
            while (clonedNode.firstChild) {
              existTitle.appendChild(clonedNode.firstChild);
            }
          }
        } else {
          document.head.appendChild(addedNode.cloneNode(true));
        }
      }

      for (const addedNode of mutation.removedNodes) {
        if (existTitle !== null) {
          if (!isRootNode) {
            if (addedNode.parentNode !== null) {

              existTitle.childNodes.forEach((node, key) => {
                const existNode = existTitle.childNodes[key];
              })
              addedNode.parentNode.childNodes.forEach((node, key) => {
                const existNode = existTitle.childNodes[key];
                if (existNode === undefined) {
                  existTitle.appendChild(node.cloneNode(true))
                } else if (!node.isEqualNode(existNode)) {
                  existTitle.replaceChild(node.cloneNode(true), existNode);
                }
              })
            }
          }
        }
      }
      break;
    }
  }
}

const appendElement = (item: Element, appendTo: Element | null) => {
  if (appendTo === null) {
    document.head.appendChild(item);
  } else {
    appendTo.insertAdjacentElement("afterend", item);
  }
}

const runInitial = (from: Element, to: Element | null, updateChild: boolean, appendTo: Element | null): [Element, () => void] => {

  const element = from.cloneNode() as Element;
  if (to === null) {
    appendElement(element, appendTo);
  } else {
  }

  return [to ?? element, () => {
    if (to === null) {
      element.remove();
    }
  }]
}

const isApplyOnyAttributes = (tagName: TagName) => {
  switch (tagName) {
    case TagName.html:
    case TagName.body:
    case TagName.base:
      return true
    default:
      return false;
  }
};

const isUniqueTag = (tagName: TagName) => {
  switch (tagName) {
    case TagName.html:
    case TagName.body:
    case TagName.base:
    case TagName.title:
      return true
    default:
      return false;
  }
};

const getParentNode = (tagName: TagName): ParentNode => {
  switch (tagName) {
    case TagName.html:
    case TagName.body:
      return document;
    default:
      return document.head;
  }
}

const getElementTo = (tag: TypedTagsProps): Element | undefined => {
  const parentNode = getParentNode(tag.tagType);
  const existElements = parentNode.querySelectorAll(tag.tagType);
  if (existElements.length) {
    if (isUniqueTag(tag.tagType)) {
      if (existElements.length === 1) {
        return existElements[0]
      } else {
        throw new Error(`Found more the one unique ${tag.tagType} tags.`)
      }
    } else {
      
    }
  }


  return undefined;
}

const getNextElementSiblingAt = (index: number, element: Element | null) => {
  let foundElement: Element | null = element;
  let i = 0;
  while(foundElement != null && i < index){
    i++
    foundElement = foundElement.nextElementSibling;
  }
  
  return foundElement;
}

const getElementAt = (index: number, anchor: IHeadAnchorElement) : Element | null => {
  switch(anchor.elementType){
    case "first":
      return getNextElementSiblingAt(index, anchor.element.nextElementSibling);
    case "firstIncluded":
      return getNextElementSiblingAt(index, anchor.element);
    case "parent":
      return anchor.element.children.item(index);
  }
}

export const TagRender: FC<ITagRender> = memo(({tag, index, anchor}) => {
  const elementFrom = useRef<Element>();
  const [elementTo, setElementTo] = useState<Element | undefined>(() => getElementTo(tag));


  useEffect(() => {
    if (elementFrom.current !== undefined ) {

      let toElement: Element | null = null;
      let updateChild = !isApplyOnyAttributes(tag.tagType);
      const existElements = getParentNode(tag.tagType).querySelectorAll(tag.tagType);

      const currentElement = getElementAt(index, anchor);
      
      if(currentElement){
        
      }
      
    
      //
      // const [element, clearCallBack] = runInitial(elementFrom.current, toElement, updateChild, appendToElement);
      //
      // return () => {
      //   clearCallBack();
      // };
    }
  }, [anchor, elementFrom])

  switch (tag.tagType) {
    case TagName.html:
    case TagName.body:
      return createElement("span", {key: tag.id, ...tag.tagProps, "data-rh": true, ref: elementFrom});
    default:
      return createElement(tag.tagType, {key: tag.id, ...tag.tagProps, "data-rh": true, ref: elementFrom});
  }
});


TagRender.displayName = "TagRender";