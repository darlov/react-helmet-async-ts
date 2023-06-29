import {ITypedTagProps, MetaProps, TagName} from "../types";
import {createElement, FC, memo, ReactNode, useEffect, useInsertionEffect, useMemo, useState} from "react";
import {createPortal, flushSync} from "react-dom";

interface ITagsRenderProps<T extends TagName> {
  tags: ITypedTagProps<T>[]
}

type ReturnTypeComponent<T extends TagName> = ReturnType<FC<ITagsRenderProps<T>>>;
type PropType<T extends TagName> = Parameters<FC<ITagsRenderProps<T>>>[0];

interface ITagContainerProps {
  fragment: DocumentFragment,
  tagComponents: ReactNode
}

const HeadTagRender: FC<ITagContainerProps> = ({fragment, tagComponents}) => {

  useEffect(() => {
    const cloned = fragment.cloneNode(true);
    const headNodes: ChildNode[] = [];
    const attributeNodes: ChildNode[] = [];

    for (const node of [...cloned.childNodes]) {
      node.nodeName
      switch(node.nodeName){
        case TagName.title:
          break;
      }
    }
   
    const headChildNodes = document.head.childNodes;

    if (headChildNodes.length > 0){
     
    }else {
      document.head.appendChild(cloned)
    }
  
    return () => {
      headNodes.forEach(ch => {
        document.head.removeChild(ch)
      })
    }
  }, [fragment, tagComponents]);

  return null;
}

const TagsRenderC = <T extends TagName, >({tags}: PropType<T>): ReturnTypeComponent<T> => {

  const [isRendered, setIsRendered] = useState(false);

  const placeHolder = useMemo(() => {
    return document.createDocumentFragment();
  }, []);
  
  const tagComponents = tags.map((m, i) => createElement(m.tagType, {...m.tagProps, key: i, "data-rh": "true"}));


  return <>
    {createPortal(tagComponents, placeHolder)}
    <HeadTagRender fragment={placeHolder} tagComponents={tagComponents}/>
  </>
}

export const TagsRender = memo(TagsRenderC);