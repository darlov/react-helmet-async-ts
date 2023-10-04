import {IHeadAnchorElement, TagName} from "../types";
import {DocumentPosition, tagConfigs} from "../tagConfiguration";

export const getNextElementSiblingAt = (index: number, element: Element | null) => {
  let foundElement: Element | null = element;
  let i = 0;
  while(foundElement != null && i < index){
    i++
    foundElement = foundElement.nextElementSibling;
  }

  return foundElement;
}

export const getElementAt = (index: number, anchor: IHeadAnchorElement) : Element | null => {
  switch(anchor.elementType){
    case "first":
      return getNextElementSiblingAt(index, anchor.element.nextElementSibling);
    case "firstIncluded":
      return getNextElementSiblingAt(index, anchor.element);
    case "parent":
      return anchor.element.children.item(index);
  }
}

export const getCurrentElement = (isFirst: boolean, anchor: IHeadAnchorElement, name: TagName) : Element | null => {
  const tagConfig = tagConfigs[name];
  if(tagConfig.position === DocumentPosition.Document) {
    return document.querySelector(name);
  }
  
  if(tagConfig.position === DocumentPosition.Header){
    if(tagConfig.isUnique){
      return document.head.querySelector(name);
    }

    const currentElement = getElementAt(index, anchor);
    if(currentElement && currentElement.tagName.localeCompare(name) === 0){
      return currentElement
    }
  }
  


 
 return null;
}

export const addTag = (from: Element, isFirst: boolean, anchor: IHeadAnchorElement): () => void => {
  const element = from.cloneNode(true) as Element;
  let attachedElement: Element | null | undefined = null
  switch(anchor.elementType) {
    case "first":
      attachedElement = getNextElementSiblingAt(index, anchor.element)?.insertAdjacentElement("afterend", element);
      break;
    case "parent":
      if (index === 0) {
        attachedElement = anchor.element?.insertAdjacentElement("afterbegin", element);
      } else {
        attachedElement = anchor.element.children.item(index - 1)?.insertAdjacentElement("afterend", element);
      }
      break;
  }

  return () => {
    if(attachedElement){
      attachedElement.remove();
    }

  }
}

const removeAllChildNodes = (parent: Element) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

export const updateTag = (from: Element, to: Element, tagName: TagName): () => void => {
  const attributes = [...from.attributes];
  const applyOnlyAttrs = tagConfigs[tagName].applyOnlyAttrs;

  for (const attribute of attributes) {
    to.setAttribute(attribute.name, attribute.value);
  }

  let childNodes: Element[] = []
  if(!applyOnlyAttrs){
    if(from.children.length > 0) {
      childNodes = [...(from.cloneNode(true) as Element).children];
      removeAllChildNodes(to)
      childNodes.forEach((node) => {
        to.appendChild(node);
      })
    } 
  }
  

  return () => {
    for (const attribute of attributes) {
      to.removeAttribute(attribute.name);
    }
    if(!applyOnlyAttrs && childNodes.length > 0) {
      childNodes.forEach((node) => {
        node.remove();
      })
    }
  }
}