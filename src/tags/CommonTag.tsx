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
    tagType: T,
    isValid?: (value: TagPropsMap[T]) => boolean,
    emptyFallback?: () => TagPropsMap[T]): FC<TagPropsMap[T]> => {
    return memo((tagProps) => {
      const actions = useScopedHelmetContext().actions;

      const rootContext = useHelmetContext();

      const tagId = useId();
      const typeProps = useMemo((): ITypedTagProps<T> => {
        return {tagProps, tagType: tagType, id: tagId}
      }, [tagProps, tagType, tagId])

      const addCallback = useCallback(() => {
        if (isValid) {
          if (isValid(typeProps.tagProps)) {
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
  }
