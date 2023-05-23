import {ITypedTagProps, MetaProps, TagName} from "../types";
import {createElement, FC, memo, ReactNode, useEffect, useInsertionEffect, useMemo, useState} from "react";
import {createPortal, flushSync} from "react-dom";
import {createRoot, Root} from "react-dom/client";

interface ITagsRenderProps<T extends TagName> {
  tags: ITypedTagProps<T>[]
}

type ReturnTypeComponent<T extends TagName> = ReturnType<FC<ITagsRenderProps<T>>>;
type PropType<T extends TagName> = Parameters<FC<ITagsRenderProps<T>>>[0];

interface ITagContainerProps {
  fragment: DocumentFragment,
  tagComponents: ReactNode
}

const TagContainer: FC<ITagContainerProps> = ({fragment, tagComponents}) => {

  useEffect(() => {
    document.head.appendChild(fragment)
    return () => {
       document.head.removeChild(fragment);
    }
  }, [fragment, tagComponents]);

  return null;
}

const TagsRenderC = <T extends TagName, >({tags}: PropType<T>): ReturnTypeComponent<T> => {

  const [isRendered, setIsRendered] = useState(false);

  const placeHolder = useMemo(() => {
    return document.createDocumentFragment();
  }, []);

  // const [root, setRoot] = useState<Root | undefined>()
  //
  // useEffect(() => {
  //   console.log("createdRoot")
  //   const createdRoot = createRoot(placeHolder);
  //   setRoot(createdRoot)
  //
  //   return () => {
  //     setRoot(undefined)
  //     setTimeout(() => {
  //       console.log("unmount")
  //       createdRoot.unmount();
  //     }, 0)
  //   };
  // }, [setRoot, placeHolder])
  //
  // if (root != undefined) {
  //   setTimeout(() => {
  //     flushSync(() => {
  //       console.log("render")
  //       root.render((tags.map((m, i) => createElement(m.tagType, {
  //         ...m.tagProps,
  //         key: i,
  //         "data-rh": "true"
  //       }))))
  //     })
  //   }, 0);
  // }


  const tagComponents = tags.map((m, i) => createElement(m.tagType, {...m.tagProps, key: i, "data-rh": "true"}))


  return <>
    {createPortal(tagComponents, placeHolder)}
    <TagContainer fragment={placeHolder} tagComponents={tagComponents}/>
  </>
}

export const TagsRender = memo(TagsRenderC);