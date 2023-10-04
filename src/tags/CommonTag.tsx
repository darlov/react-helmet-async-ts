import {FC, memo, useCallback, useId, useMemo} from "react";
import {ITypedTagProps, TagName, TagPropsMap} from "../types";
import {useScopedHelmetContext} from "../HelmetScopedProvider";
import {useHelmetContext} from "../HelmetProvider";
import {_} from "../utils";
import {useServerSideEffect} from "../hooks/useServerSideEffect";

export const createTagComponent =
  <
    T extends TagName,
  >
  (
    displayName: string,
    tagType: T,
    isValid?: (value: TagPropsMap[T], tagType: T) => boolean,
    emptyFallback?: () => TagPropsMap[T]): FC<TagPropsMap[T]> => {
    const component = memo((tagProps) => {
      const actions = useScopedHelmetContext().actions;

      const rootContext = useHelmetContext();

      const tagId = useId();
      const typeProps = useMemo((): ITypedTagProps<T> => {
        return {tagProps, tagName: tagType, id: tagId}
      }, [tagProps, tagType, tagId])

      const addCallback = useCallback(() => {
        if (isValid) {
          if (isValid(typeProps.tagProps, tagType)) {
            actions.add(typeProps);
            return () => {
              actions.remove(typeProps);
            };
          }
        } else {
          if (emptyFallback && _.isEmpty(typeProps.tagProps)) {
            tagProps = emptyFallback()
          }
          actions.add(typeProps);
          return () => {
            actions.remove(typeProps);
          };
        }
      }, [typeProps, isValid, actions, emptyFallback]);

      useServerSideEffect(
        () => addCallback(),
        () => !rootContext.canUseDOM,
        [addCallback]);

      return null;
    })

    component.displayName = displayName;
    return component;
  }
