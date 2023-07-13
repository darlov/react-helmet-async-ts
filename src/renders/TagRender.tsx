import {ITypedTagProps, TagName} from "../types";
import React, {createElement, FC, memo, useEffect, useInsertionEffect, useMemo, useState} from "react";
import {createPortal} from "react-dom";

type TagRenderProps = ITypedTagProps<TagName>["tagProps"] & { tagType: TagName }

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
          
          if(isRootNode && isElement(addedNode)){
            applyAttributes(addedNode, existTitle);
          }
          if(!isRootNode){
            if(addedNode.parentNode !== null) {
              addedNode.parentNode.childNodes.forEach((node, key) => {
                const existNode = existTitle.childNodes[key];
                if(existNode === undefined){
                  existTitle.appendChild(node.cloneNode(true))
                } else if(!node.isEqualNode(existNode)){
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

const documentMutationCallback = (mutations: MutationRecord[], tag: TagRenderProps, fragment: DocumentFragment) => {
  console.log(mutations);

  for (const mutation of mutations) {

    const isRootNode = mutation.target == fragment;

    switch (mutation.type) {
      case "attributes": {
        break;
      }
      case "childList": {
        processChildList(mutation, isRootNode, tag.tagType);
        break;
      }

      case "characterData": {
        break
      }
    }
  }
}

export const TagRender: FC<TagRenderProps> = memo<TagRenderProps>((tag) => {
  const placeHolder = useMemo(() => {
    return document.createDocumentFragment();
  }, []);

  useInsertionEffect(() => {
    const config: MutationObserverInit = {attributes: true, childList: true, subtree: true, characterData: true};

    const observer = new MutationObserver((mutations) => documentMutationCallback(mutations, tag, placeHolder));
    observer.observe(placeHolder, config);
    return () => observer.disconnect();
  }, [])

  const {tagType, ...restObject} = tag;


  const tagComponent = createElement(
    (tagType == TagName.html || tagType == TagName.body)
      ? "div"
      : tagType,
    {...restObject, "data-rh": "true"});

  return <>
    {createPortal(tagComponent, placeHolder)}
    {/*<HtmlTagInjector fragment={placeHolder} tag={tag}/>*/}
  </>
});

TagRender.displayName = "TagRender";