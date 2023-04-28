import { Dispatch, SetStateAction } from "react";
import {
  ArrayElement,
  DOCUMENT_TITLE_INSTANCE_ID,
  IHelmetInstanceState,
  IHelmetState,
  IHelmetTags,
  LinkProps,
  MetaProps,
  primaryLinkAttributes,
  primaryMetaAttributes,
} from "./types";

export const addUniqueItem = <T, K extends T[] | undefined>(
  items: K,
  item: T,
  keySelector?: (item: T) => any
): K => {
  if (!items) {
    return [item] as K;
  }

  const exist =
    keySelector !== undefined
      ? items.some(m => keySelector(m) === keySelector(item))
      : items.some(m => m === item);
  return exist ? items : ([...items, item] as K);
};

export const removeAction =
  <T, K extends T[] | undefined>(
    action: Dispatch<SetStateAction<K>>,
    keySelector?: (item: T) => any
  ) =>
  (item: T) => {
    action(items => {
      return keySelector !== undefined
        ? (items?.filter(m => keySelector(m) !== keySelector(item)) as K)
        : (items?.filter(m => m !== item) as K);
    });
  };
export const addAction = <T, K extends T[] | undefined>(
  action: Dispatch<SetStateAction<K>>,
  keySelector?: (item: T) => any
) => {
  return (item: T) => action(items => addUniqueItem<T, K>(items, item, keySelector));
};

export namespace _ {
  export type TSelector<T> = ((elem: T) => any) | keyof T;

  export const sortBy = <T, K extends T[] | undefined>(array: K, selector: TSelector<T>): K => {
    if(array === undefined){
      return array;
    }
    
    if (typeof selector === "function") {
      return array.sort((x, y) =>
        selector(x) > selector(y) ? 1 : selector(x) < selector(y) ? -1 : 0
      ) as K;
    }

    return array.sort((x, y) =>
      x[selector] > y[selector] ? 1 : x[selector] < y[selector] ? -1 : 0
    ) as K;
  };

  export const clear = <T>(array: T[] | undefined) => {
    if (array !== undefined && array.length > 0) {
      array.splice(0, array.length);
    }
  };

  export const isEmpty = (obj: Record<string, any>) => {
    return Object.keys(obj).length === 0;
  };

  type TArray = any[] | undefined;
  export const isEmptyArray = (...obj: TArray[]) => {
    return obj.every(m => m === undefined || m.length === 0);
  };

  type InferKey<T> = T extends Partial<Record<infer K, any>> ? K : never;
  type InferValue<T> = T extends Partial<Record<any, infer V>> ? V : never;

  export const toPairs = <T extends Partial<Record<string, any>>>(obj: T) => {
    return Object.entries(obj) as [InferKey<T>, InferValue<T>][];
  };

  type TValSelReturn<
    TItem,
    T extends ((arg: TItem, index: number) => any) | undefined
  > = T extends (arg: TItem, index: number) => infer K ? K : T extends undefined ? TItem : never;

  type TValueSelector<T> = ((item: T, index: number) => T) | ((item: T, index: number) => any);

  export const groupBy = <
    T,
    K extends keyof any,
    V extends TValSelReturn<T, TFunc>,
    TFunc extends TValueSelector<T>
  >(
    items: T[],
    keySelector: (item: T, index: number) => K | undefined,
    valueSelector?: TFunc
  ): Map<K, TValSelReturn<T, TFunc>[]> => {
    return items.reduce((result, item, index) => {
      const key = keySelector(item, index);
      if (key !== undefined) {
        if (!result.has(key)) {
          result.set(key, []);
        }
        result.get(key)!.push(valueSelector && valueSelector(item, index));
        return result;
      }
      return result;
    }, new Map<K, TValSelReturn<T, TFunc>[]>());
  };
}

const findMetaPrimaryAttribute = (meta: MetaProps) => {
  const foundAttr = primaryMetaAttributes.find(attr => meta[attr] !== undefined);

  if (foundAttr !== undefined) {
    return `${foundAttr}_${meta[foundAttr]}`;
  }

  return undefined;
};

const findLinkPrimaryAttribute = (link: LinkProps) => {
  const foundAttr = primaryLinkAttributes.find(attr => {
    return link[attr] !== undefined ? !(attr === "rel" && link[attr] === "stylesheet") : false;
  });

  if (foundAttr !== undefined) {
    return `${foundAttr}_${link[foundAttr]}`;
  }

  return undefined;
};

const mergeAllToOne = <T extends keyof IHelmetTags, TElement extends ArrayElement<IHelmetTags[T]>>(
  key: T,
  result: TElement | undefined,
  instance: IHelmetInstanceState,
  emptyStateFallback?: (result: TElement | undefined) => TElement | undefined
): TElement | undefined => {
  if (instance.emptyState) {
    if (emptyStateFallback !== undefined) {
      return emptyStateFallback(result);
    }

    return undefined;
  }

  const values = instance[key] as TElement[] | undefined;
  return (values || []).reduce((prev, current) => {
    return { ...current };
  }, result);
};

const mergeAllToAll = <T extends keyof IHelmetTags, TElement extends ArrayElement<IHelmetTags[T]>>(
  key: T,
  result: TElement[],
  instance: IHelmetInstanceState
): TElement[] => {

  if (instance.emptyState) {
    _.clear(result);
  }
  
  if (instance[key]) {
      const values = instance[key] as TElement[];
      result.push(...values);
  }

  return result;
};

const mergeAllByPrimaryAttribute = <T extends keyof IHelmetTags, TElement = IHelmetTags[T]>(
  tagProp: T,
  result: TElement[],
  instance: IHelmetInstanceState,
  primaryAttributeSelector: (tag: TElement) => string | undefined
) => {
  if (instance.emptyState) {
    _.clear(result);
  }else {
    const instanceInputTags = instance[tagProp] as TElement[] | undefined;
    if (instanceInputTags) {
      if (result.length === 0) {
        result.push(...instanceInputTags);
      } else {
        const instanceGrouped = _.groupBy(
            instanceInputTags,
            primaryAttributeSelector,
            (item, index) => [item, index] as [TElement, number]
        );
        const resultGrouped = _.groupBy(
            result,
            primaryAttributeSelector,
            (item, index) => [item, index] as [TElement, number]
        );

        for (const [attr, instanceTags] of instanceGrouped.entries()) {
          const resultTags = resultGrouped.get(attr);

          if (resultTags === undefined) {
            result.push(...instanceTags.map(([tags]) => tags));
          } else if (instanceTags.length !== resultTags.length) {
            result = result.filter(m => !resultTags.some(([tag]) => m === tag));
            result.push(...instanceTags.map(([tag]) => tag));
          } else {
            for (let i = 0; i < instanceTags.length; i++) {
              const [instanceTag] = instanceTags[i];
              const [resultTag, resultIndex] = resultTags[i];

              result[resultIndex] = {...resultTag, ...instanceTag};
            }
          }
        }
      }
    }
  }

  return result;
};

export const buildState = (instances: IHelmetInstanceState[]): IHelmetState => {
  const state: IHelmetState = {
    titleTag: undefined,
    baseTag: undefined,
    bodyTag: undefined,
    htmlTag: undefined,
    metaTags: [],
    styleTags: [],
    scriptTags: [],
    linkTags: [],
    noscriptTags: [],
  };

  const documentTitleInstance = instances.find(m => m.id == DOCUMENT_TITLE_INSTANCE_ID);

  const titleEmptyStateFallback = (result: IHelmetState["titleTag"]) =>
    documentTitleInstance !== undefined && documentTitleInstance.titleTags !== undefined
      ? documentTitleInstance.titleTags[0]
      : result;

  for (const instance of instances) {
    state.titleTag = mergeAllToOne("titleTags", state.titleTag, instance, titleEmptyStateFallback);
    state.baseTag = mergeAllToOne("baseTags", state.baseTag, instance);
    state.bodyTag = mergeAllToOne("bodyTags", state.bodyTag, instance);
    state.htmlTag = mergeAllToOne("htmlTags", state.htmlTag, instance);
    state.styleTags = mergeAllToAll("styleTags", state.styleTags, instance);
    state.scriptTags = mergeAllToAll("scriptTags", state.scriptTags, instance);
    state.noscriptTags = mergeAllToAll("noscriptTags", state.noscriptTags, instance);
    state.metaTags = mergeAllByPrimaryAttribute(
      "metaTags",
      state.metaTags,
      instance,
      findMetaPrimaryAttribute
    );
    state.linkTags = mergeAllByPrimaryAttribute(
      "linkTags",
      state.linkTags,
      instance,
      findLinkPrimaryAttribute
    );
  }

  return state;
};
