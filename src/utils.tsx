import {createElement, Key, ReactElement} from "react";
import {
  IHelmetInstanceState,
  IHelmetServerState,
  IHelmetState,
  ITagPriorityConfigMap,
  ITagProps,
  ITypedTagProps,
  LinkProps,
  MetaProps,
  primaryLinkAttributes,
  primaryMetaAttributes,
  TagConfigName,
  TagName,
  TagNames,
  TagPriorityConfig,
  TypedTagProps,
} from "./types";
import {renderToStaticMarkup} from "react-dom/server";

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

export const removeItem = <T, K extends T[] | undefined>(
  items: K,
  item: T,
  keySelector?: (item: T) => any
): K => {
  return keySelector !== undefined
    ? (items?.filter(m => keySelector(m) !== keySelector(item)) as K)
    : (items?.filter(m => m !== item) as K);
}

export namespace _ {
  export type TSelector<T> = ((elem: T) => any) | keyof T;

  export const sortBy = <T, K extends T[] | undefined>(array: K, selector: TSelector<T>): K => {
    if (array === undefined) {
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

  export const clear = <T, >(array: T[] | undefined) => {
    if (array !== undefined && array.length > 0) {
      return array.splice(0, array.length);
    }
    return [];
  };

  export const isEmpty = (obj: Record<string, any>) => {
    return Object.keys(obj).length === 0;
  };

  type TArray = any[] | undefined;
  export const isEmptyArray = (...obj: TArray[]) => {
    return obj.every(m => m === undefined || m.length === 0);
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
    valueSelector: TFunc
  ): Map<K, TValSelReturn<T, TFunc>[]> => {
    return items.reduce((result, item, index) => {
      const key = keySelector(item, index);
      if (key !== undefined) {
        const collection = result.get(key);
        if (collection !== undefined) {
          collection.push(valueSelector(item, index))
        } else {
          result.set(key, [valueSelector(item, index)])
        }
        return result;
      }
      return result;
    }, new Map<K, TValSelReturn<T, TFunc>[]>());
  };

  export const remove = <T, >(elements: T[], element: T) => {
    const index = elements.indexOf(element, 0);
    if (index > -1) {
      return elements.splice(index, 1);
    }
    return [];
  };
}

const findMetaPrimaryAttribute = (metaProps: MetaProps) => {
  const foundAttr = primaryMetaAttributes.find(attr => metaProps[attr] !== undefined);

  if (foundAttr !== undefined) {
    return `meta_${foundAttr}_${metaProps[foundAttr]}`;
  }

  return undefined;
};

const findLinkPrimaryAttribute = (linkProps: LinkProps) => {
  const foundAttr = primaryLinkAttributes.find(attr => {
    return linkProps[attr] !== undefined ? !(attr === "rel" && linkProps[attr] === "stylesheet") : false;
  });

  if (foundAttr !== undefined) {
    return `link_${foundAttr}_${linkProps[foundAttr]}`;
  }

  return undefined;
};

// const mergeAllToOne = <T extends keyof HelmetTags, TElement extends ArrayElement<HelmetTags[T]>>(
//   values: TElement[] | undefined,
//   isEmptyState: boolean,
//   result: TElement | undefined,
//   usePrevResult?: boolean,
//   emptyStateFallback?: (result: TElement | undefined) => TElement | undefined
// ): TElement | undefined => {
//   if (isEmptyState) {
//     if (emptyStateFallback !== undefined) {
//       return emptyStateFallback(result);
//     }
//
//     return undefined;
//   }
//
//   return (values || []).reduce((prev, current) => {
//     return usePrevResult ? {...prev, ...current} : {...current};
//   }, result);
// };

// const mergeAllToAll = <T extends keyof HelmetTags, TElement extends ArrayElement<HelmetTags[T]>>(
//   values: TElement[] | undefined,
//   isEmptyState: boolean,
//   result: TElement[]
// ): TElement[] => {
//   if (isEmptyState) {
//     _.clear(result);
//   }
//
//   if (values) {
//     result.push(...values);
//   }
//
//   return result;
// };

// const mergeAllByPrimaryAttribute = <T extends keyof HelmetTags, TElement = HelmetTags[T]>(
//   values: TElement[] | undefined,
//   isEmptyState: boolean,
//   result: TElement[],
//   primaryAttributeSelector: (tag: TElement) => string | undefined
// ) => {
//   if (isEmptyState) {
//     _.clear(result);
//   } else {
//     if (values) {
//       if (result.length === 0) {
//         result.push(...values);
//       } else {
//         const instanceGrouped = _.groupBy(
//           values,
//           primaryAttributeSelector,
//           (item, index) => [item, index] as [TElement, number]
//         );
//         const resultGrouped = _.groupBy(
//           result,
//           primaryAttributeSelector,
//           (item, index) => [item, index] as [TElement, number]
//         );
//
//         for (const [attr, instanceTags] of instanceGrouped.entries()) {
//           const resultTags = resultGrouped.get(attr);
//
//           if (resultTags === undefined) {
//             result.push(...instanceTags.map(([tags]) => tags));
//           } else if (instanceTags.length !== resultTags.length) {
//             result = result.filter(m => !resultTags.some(([tag]) => m === tag));
//             result.push(...instanceTags.map(([tag]) => tag));
//           } else {
//             for (let i = 0; i < instanceTags.length; i++) {
//               const [instanceTag] = instanceTags[i];
//               const [resultTag, resultIndex] = resultTags[i];
//
//               result[resultIndex] = {...resultTag, ...instanceTag};
//             }
//           }
//         }
//       }
//     }
//   }
//
//   return result;
// };

export const buildState = (instances: IHelmetInstanceState[], priority: Map<TagConfigName, ITagPriorityConfigMap[]>): IHelmetState => {
  const state: IHelmetState = {
    tags: [],
    isEmptyState: true
  };

  // const titleEmptyStateFallback = (result?: ITypedTagProps<TagName.title>): ITypedTagProps<TagName.title> | undefined => {
  //   return result !== undefined ? {tagType: TagName.title, tagProps: {children: result?.tagProps.children}} : undefined
  // };

  const uniqueItems = new Map<string, ITypedTagProps<TagName>[]>();
  let otherItems: ITypedTagProps<TagName>[] = [];

  for (const instance of instances) {
    const isEmptyInstance = _.isEmptyArray(instance.tags);

    const instanceDuplicateItems = new Map<string, ITypedTagProps<TagName>[]>();

    if (instance.tags) {
      for (const tag of instance.tags) {
        switch (tag.tagType) {
          case TagName.title:
          case TagName.base:
          case TagName.body:
          case TagName.html:
            const existItems = uniqueItems.get(tag.tagType) ?? [];
            uniqueItems.set(tag.tagType, [{...existItems[0], ...tag}])
            break;
          case TagName.style:
          case TagName.script:
          case TagName.noscript:
            otherItems.push(tag);
            break;
          case TagName.link: {
            const primaryAttrKey = findLinkPrimaryAttribute(tag.tagProps as LinkProps);
            if (primaryAttrKey !== undefined) {
              const values = instanceDuplicateItems.get(primaryAttrKey);
              if (values !== undefined) {
                values.push(tag)
              } else {
                instanceDuplicateItems.set(primaryAttrKey, [tag])
              }
            }
            break;
          }
          case TagName.meta: {
            const primaryAttrKey = findMetaPrimaryAttribute(tag.tagProps as MetaProps);
            if (primaryAttrKey !== undefined) {
              const values = instanceDuplicateItems.get(primaryAttrKey);
              if (values !== undefined) {
                values.push(tag)
              } else {
                instanceDuplicateItems.set(primaryAttrKey, [tag])
              }
            }
            break;
          }
        }
      }
    } else {
      otherItems = [];
      const existTitles = uniqueItems.get(TagName.title);
      uniqueItems.clear();

      if (existTitles !== undefined && existTitles.length > 0) {
        const existTitle = existTitles[0];
        uniqueItems.set(TagName.title, [{
          id: existTitle.id,
          tagType: existTitle.tagType,
          tagProps: {children: existTitle.tagProps.children}
        }]);
      }
    }

    for (const [key, values] of instanceDuplicateItems) {
      uniqueItems.set(key, values);
    }
  }

  const sourceTags = [...[...uniqueItems.values()].flatMap(m => m), ...otherItems];
  state.tags = buildHeaderTags(sourceTags, priority);

  return state;
};

// const addTitle = (state: IHelmetState, priorities: TypedTagProps[]) => {
//   if (state.titleTag) {
//     priorities.push(state.titleTag);
//     state.titleTag = undefined;
//   }
// }

// const addBase = (state: IHelmetState, priorities: TypedTagProps[]) => {
//   if (state.baseTag) {
//     priorities.push(state.baseTag)
//     state.baseTag = undefined;
//   }
// }


const buildHeaderTags = (sourceTags: ITypedTagProps<TagName>[], priorityConfig: Map<TagConfigName, ITagPriorityConfigMap[]>): ITypedTagProps<TagName>[] => {
  let headerTags: ITypedTagProps<TagName>[] = [];

  const outOfConfigStartIndex = Number.MAX_VALUE - sourceTags.length;
  const priorityTags: { priority: number, tag: ITypedTagProps<TagName> }[] = [];

  for (let i = 0; i < sourceTags.length; i++) {
    const sourceTag = sourceTags[i];
    const configItems = priorityConfig.get(sourceTag.tagType as TagConfigName);

    if (configItems === undefined) {
      priorityTags.push({priority: outOfConfigStartIndex + i, tag: sourceTag})
    } else {
      let foundConfig = false;
      for (const configItem of configItems) {
        if (isTagMatch(sourceTag, configItem.config)) {
          priorityTags.push({priority: configItem.priority, tag: sourceTag});
          foundConfig = true;
          break;
        }
      }

      if (!foundConfig) {
        priorityTags.push({priority: outOfConfigStartIndex + i, tag: sourceTag})
      }
    }
  }

  return _.sortBy(priorityTags, "priority").map(m => m.tag);
}

const isTagMatch = (tag: ITypedTagProps<TagName>, config: TagPriorityConfig) => {
  for (const [key, configValue] of Object.entries(config)) {
    if (key == "tagName") {
      continue;
    }

    const tagValue = tag.tagProps[key as keyof ITypedTagProps<TagName>["tagProps"]];
    if (tagValue === undefined) {
      return false;
    }

    if (configValue["seoAnyValue"] !== undefined && configValue["seoAnyValue"]) {
      continue;
    }

    if (configValue["seoValues"]) {
      if (configValue["seoValues"].find((m: any) => m === tagValue)) {
        return true;
      }
    }

    if (tagValue !== configValue) {
      return false;
    }
  }

  return true;
}

const createReactComponent = <T extends TagName, >(tag: ITypedTagProps<T> | undefined, fallbackTag?: ITypedTagProps<T>): JSX.Element => tag
  ? createComponent(tag)
  : (fallbackTag ? createComponent(fallbackTag) : <></>);

const createReactComponents = <T extends TagName, >(tags: ITypedTagProps<T>[]): JSX.Element[] => tags.map((m, i) => createComponent(m, i));

export const buildServerState = (state: IHelmetState): IHelmetServerState => {

  let bodyAttributes: ITypedTagProps<TagName> | undefined;
  let htmlAttributes: ITypedTagProps<TagName> | undefined;

  const tags = state.tags.flatMap((val, i) => {
    switch (val.tagType) {
      case TagName.body:
        bodyAttributes = val;
        return [];
      case TagName.html:
        htmlAttributes = val;
        return [];
      default:
        return val;
    }
  });

  const bodyComponentCallback = () => createReactComponent(bodyAttributes);
  const htmlComponentCallback = () => createReactComponent(htmlAttributes);
  const headerTagsComponentsCallback = () => createReactComponents(tags);

  return {
    bodyAttributes: {
      toComponent: () => bodyComponentCallback().props ?? {},
      toString: () => renderToStaticMarkup(bodyComponentCallback()).replace("<body ", "").replace("></body>", "")
    },
    htmlAttributes: {
      toComponent: () => htmlComponentCallback().props ?? {},
      toString: () => renderToStaticMarkup(htmlComponentCallback()).replace("<html ", "").replace("></html>", "")
    },
    headerTags: {
      toComponent: headerTagsComponentsCallback,
      toString: () => renderToStaticMarkup(<>{headerTagsComponentsCallback()}</>)
    }
  }
}

const renderToHtmlMarkup = (node: ReactElement) => {
  return renderToStaticMarkup(node);
}

export const renderToHtmlElement = (node: ReactElement, selector: TagNames) => {
  const parser = new DOMParser();
  const htmlMarkup = renderToHtmlMarkup(node);
  const parsed = parser.parseFromString(htmlMarkup, "application/xml");
  const element = parsed.querySelector(selector);
  if (element == null) {
    throw new Error(`Couldn't found element ${selector} in the ${htmlMarkup}`)
  }

  return element;
}

export const createComponent = <T extends TagName, >(tag: ITypedTagProps<T>, key?: Key): JSX.Element => {
  return createElement(tag.tagType, {...tag.tagProps, "data-rh": true, key: key})
}

export const getHtmlAttributesFromHtmlElement = <T extends Element>(htmlElement: T) => {
  return htmlElement.getAttributeNames().reduce((result, attrName) => {
    const attrValue = htmlElement.getAttribute(attrName);
    if (attrValue !== null) {
      result.push({name: attrName, value: attrValue});
    }
    return result;
  }, [] as { name: string, value: string }[])
}




