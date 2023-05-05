import {FC, useCallback, useEffect} from "react";
import {TagProps} from "../types";
import {ITagsActions} from "../HelmetScopedProvider";
import {useHelmetContext} from "../HelmetProvider";
import {_} from "../utils";

interface ICommonTagProps<T extends TagProps> {
  tagProps: T,
  isValid?: (value: T) => boolean,
  actions: ITagsActions<T>
  emptyFallback?: () => T
}

type ReturnTypeComponent<T extends TagProps> = ReturnType<FC<ICommonTagProps<T>>> 
type PropType<T extends TagProps> = Parameters<FC<ICommonTagProps<T>>>[0]

export const CommonTag = <T extends TagProps,>({tagProps, isValid, actions, emptyFallback}: PropType<T>): ReturnTypeComponent<T> => {
  const rootContext = useHelmetContext();
  
  const addCallback = useCallback(() => {
    if (isValid) {
      if (isValid(tagProps)) {
        actions.add(tagProps);
        return () => {
          actions.add(tagProps);
        };
      }
    } else {
      if (emptyFallback && _.isEmpty(tagProps)) {
        tagProps = emptyFallback()
      }
      actions.add(tagProps);
      return () => {
        actions.add(tagProps);
      };
    }
  },[tagProps, isValid, actions, emptyFallback])

  useEffect(() => addCallback()
  , [addCallback])

  if (!rootContext.canUseDOM) {
    addCallback();
  }

  return null;
}
