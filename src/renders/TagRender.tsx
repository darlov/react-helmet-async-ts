import {ITypedTagProps, TagName, TagPropsMap, TypedTagsProps} from "../types";
import React, {createElement, FC, memo, useEffect, useInsertionEffect, useMemo, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {TagsRender} from "./TagsRender";

interface ITagRender {
  tag: TypedTagsProps
  index: number
}

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


const runInitial = (from: Element, to: Element | null, updateChild: boolean, index: number) => {

  const element = from.cloneNode(true);
  if (to === null) {
    document.head.insertBefore
  }else {
    
  }


  return () => {
    if (to === null) {
      document.head.removeChild(element);
    }
  }
}

export const TagRender: FC<ITagRender> = memo(({tag, index}) => {
  const ref = useRef<Element>();

  useEffect(() => {
    if (ref.current !== undefined) {

      let toElement: Element | null = null;
      let updateChild = tag.tagType != TagName.html && tag.tagType != TagName.body;

      switch (tag.tagType) {
        case TagName.html:
        case TagName.body:
        case TagName.base:
        case TagName.title:
          toElement = document.querySelector(tag.tagType);
      }

      const clearCallBack = runInitial(ref.current, toElement, updateChild, index);

      return () => {
        clearCallBack();
      };
    }
  })

  switch (tag.tagType) {
    case TagName.html:
    case TagName.body:
      return createElement("span", {key: tag.id, ...tag.tagProps, "data-rh": true, ref: ref});
    default:
      return createElement(tag.tagType, {key: tag.id, ...tag.tagProps, "data-rh": true, ref: ref});
  }
});


TagRender.displayName = "TagRender";