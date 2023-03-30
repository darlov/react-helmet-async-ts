import { Dispatch, SetStateAction } from "react";
import { IHelmetInstanceState, IHelmetTags, TagProps } from "./Types";

export const addUniqueItem = <T, K extends T[] | undefined>(items: K, item: T, keySelector?: (item: T) => any): K => {
  if (!items) {
    return [item] as K;
  }

  const exist = keySelector !== undefined 
      ? items.some(m => keySelector(m) === keySelector(item))
      : items.some(m => m === item);
  return exist ? items : [...items, item] as K;
}

export const removeAction = <T, K extends T[] | undefined>(action: Dispatch<SetStateAction<K>>, keySelector?: (item: T) => any) => (item: T) => {
  action(items => {
    return keySelector !== undefined 
        ? items?.filter(m => keySelector(m) !== keySelector(item)) as K
        : items?.filter(m => m !== item) as K
  });
};
export const addAction = <T, K extends T[] | undefined>(action: Dispatch<SetStateAction<K>>, keySelector?: (item: T) => any) => {
  return (item: T) => action(items => addUniqueItem<T, K>(items, item, keySelector));
};


export namespace _ {
  export type TSelector<T> = ((elem: T) => any) | keyof T;

  export const sortBy = <T>(array: T[] | undefined, selector: TSelector<T>) => {
    if (typeof selector === "function") {
      return array?.sort((x, y) => selector(x) > selector(y) ? 1 : selector(x) < selector(y) ? -1 : 0);
    }

    return array?.sort((x, y) => x[selector] > y[selector] ? 1 : x[selector] < y[selector] ? -1 : 0);
  }

  export const clear = <T>(array: T[] | undefined) => {
    if (array !== undefined && array.length > 0) {
      array.splice(0, array.length)
    }
  }

  export const isEmpty = (obj: Record<string, any>) => {
    return Object.keys(obj).length === 0;
  }

  type TArray = any[] | undefined
  export const isEmptyArray = (...obj: TArray[]) => {
    return obj.every(m => m === undefined || m.length === 0)
  }

  type InferKey<T> = T extends Partial<Record<infer K, any>> ? K : never;
  type InferValue<T> = T extends Partial<Record<any, infer V>> ? V : never;

  export const toPairs = <T extends Partial<Record<string, any>>>(obj: T) => {
    return Object.entries(obj) as [InferKey<T>, InferValue<T>][];
  };


  type TValSelReturn<TItem, T extends ((arg: TItem, index: number) => any) | undefined>
    = T extends (arg: TItem, index: number) => infer K ? K
    : T extends undefined ? TItem
      : never;

  type TValueSelector<T> = ((item: T, index: number) => T) | ((item: T, index: number) => any)

  export const groupBy = <T, K extends keyof any, V extends TValSelReturn<T, TFunc>, TFunc extends TValueSelector<T>>(items: T[], keySelector: (item: T, index: number) => K | undefined, valueSelector?: TFunc): Map<K, TValSelReturn<T, TFunc>[]> => {
    return items.reduce((result, item, index) => {
      const key = keySelector(item, index);
      if (key !== undefined) {
        if (!result.has(key)) {
          result.set(key, [])
        }
        result.get(key)!.push(valueSelector && valueSelector(item, index));
        return result
      }
      return result;
    }, new Map<K, TValSelReturn<T, TFunc>[]>);
  }
}

export const mergeTags = <T extends TagProps>(tagProp: keyof IHelmetTags, result: T[], instances: IHelmetInstanceState[], primaryAttributeSelector: (tag: T) => string | undefined) => {
  for (const instance of instances) {
    const inTags = instance[tagProp] as T[] | undefined;
    if (inTags) {
      if (instance.emptyState) {
        _.clear(result);
      } else if (result.length === 0) {
        result.push(...inTags);
      } else {
        const instanceGrouped = _.groupBy(inTags, primaryAttributeSelector, (item, index) => ([item, index] as [T, number]));
        const resultGrouped = _.groupBy(result, primaryAttributeSelector, (item, index) => ([item, index] as [T, number]));

        for (const [attr, instanceTags] of instanceGrouped.entries()) {
          const resultTags = resultGrouped.get(attr);

          if (resultTags === undefined) {
            result.push(...instanceTags.map(([tags]) => tags))
          } else if (instanceTags.length !== resultTags.length) {
            result = result.filter(m => !resultTags.some(([tag]) => m === tag));
            result.push(...instanceTags.map(([tag]) => tag))
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
}

