import {FC, useCallback, useEffect, useMemo} from "react";
import {ITypedTagProps, TagName, TagProps, TagPropsMap} from "../types";
import {HelmetScopedContextData, ITagsActions, useScopedHelmetContext} from "../HelmetScopedProvider";
import {useHelmetContext} from "../HelmetProvider";
import {_} from "../utils";
import {useServerSideEffect} from "../hooks/useServerSideEffect";

interface ICommonTagProps<T extends TagName> {
  tagType: T,
  tagProps: TagPropsMap[T],
  isValid?: (value: TagPropsMap[T]) => boolean,
  actions: ITagsActions<T>
  emptyFallback?: () => TagPropsMap[T]
}

type ReturnTypeComponent<T extends TagName> = ReturnType<FC<ICommonTagProps<T>>>
type PropType<T extends TagName> = Parameters<FC<ICommonTagProps<T>>>[0]

export const CommonTag = <T extends TagName, >({
                                                 tagType,
                                                  tagProps,
                                                  isValid,
                                                  actions,
                                                  emptyFallback
                                                }: PropType<T>): ReturnTypeComponent<T> => {
  const rootContext = useHelmetContext();
  
  const typeProps = useMemo(():ITypedTagProps<T> => {
    return {tagProps, tagType: tagType}
  }, [tagProps, tagType])

  const addCallback = useCallback(() => {
    if (isValid) {
      if (isValid(typeProps.tagProps)) {
        actions.add(typeProps);
        return () => {
          actions.add(typeProps);
        };
      }
    } else {
      if (emptyFallback && _.isEmpty(typeProps.tagProps)) {
        tagProps = emptyFallback()
      }
      actions.add(typeProps);
      return () => {
        actions.add(typeProps);
      };
    }
  }, [typeProps, isValid, actions, emptyFallback])

  useServerSideEffect(
    () => addCallback(),
    () => !rootContext.canUseDOM,
    [addCallback]);

  return null;
}

export const createTagComponent =
  <
    T extends TagName,
  >
  (
    tagType: T,
    isValid?: (value: TagPropsMap[T]) => boolean,
    emptyFallback?: () => TagPropsMap[T]): FC<TagPropsMap[T]> => {
    return (props) => {
      const actions = useScopedHelmetContext().actions;
      return <CommonTag tagType={tagType} tagProps={props} actions={actions} isValid={isValid} emptyFallback={emptyFallback}/>
    }
  }
