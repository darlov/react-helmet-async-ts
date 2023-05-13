import {createElement, Key, ReactElement} from "react";
import {
  ArrayElement,
  DefaultTagPriorityConfig,
  HelmetTags,
  IHelmetInstanceState,
  IHelmetServerState,
  IHelmetState,
  ITypedTagProps,
  primaryLinkAttributes,
  primaryMetaAttributes,
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

  export const remove = <T, >(elements: T[], element: T) => {
    const index = elements.indexOf(element, 0);
    if (index > -1) {
      return elements.splice(index, 1);
    }
    return elements;
  };
}

const findMetaPrimaryAttribute = (meta: ITypedTagProps<TagName.meta>) => {
  const foundAttr = primaryMetaAttributes.find(attr => meta.tagProps[attr] !== undefined);

  if (foundAttr !== undefined) {
    return `${foundAttr}_${meta.tagProps[foundAttr]}`;
  }

  return undefined;
};

const findLinkPrimaryAttribute = (link: ITypedTagProps<TagName.link>) => {
  const foundAttr = primaryLinkAttributes.find(attr => {
    return link.tagProps[attr] !== undefined ? !(attr === "rel" && link.tagProps[attr] === "stylesheet") : false;
  });

  if (foundAttr !== undefined) {
    return `${foundAttr}_${link.tagProps[foundAttr]}`;
  }

  return undefined;
};

const mergeAllToOne = <T extends keyof HelmetTags, TElement extends ArrayElement<HelmetTags[T]>>(
  values: TElement[] | undefined,
  isEmptyState: boolean,
  result: TElement | undefined,
  usePrevResult?: boolean,
  emptyStateFallback?: (result: TElement | undefined) => TElement | undefined
): TElement | undefined => {
  if (isEmptyState) {
    if (emptyStateFallback !== undefined) {
      return emptyStateFallback(result);
    }

    return undefined;
  }

  return (values || []).reduce((prev, current) => {
    return usePrevResult ? {...prev, ...current} : {...current};
  }, result);
};

const mergeAllToAll = <T extends keyof HelmetTags, TElement extends ArrayElement<HelmetTags[T]>>(
  values: TElement[] | undefined,
  isEmptyState: boolean,
  result: TElement[]
): TElement[] => {
  if (isEmptyState) {
    _.clear(result);
  }

  if (values) {
    result.push(...values);
  }

  return result;
};

const mergeAllByPrimaryAttribute = <T extends keyof HelmetTags, TElement = HelmetTags[T]>(
  values: TElement[] | undefined,
  isEmptyState: boolean,
  result: TElement[],
  primaryAttributeSelector: (tag: TElement) => string | undefined
) => {
  if (isEmptyState) {
    _.clear(result);
  } else {
    if (values) {
      if (result.length === 0) {
        result.push(...values);
      } else {
        const instanceGrouped = _.groupBy(
          values,
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

export const buildState = (instances: IHelmetInstanceState[], priority: TagPriorityConfig[] | boolean): IHelmetState => {
  const state: IHelmetState = {
    titleTag: undefined,
    baseTag: undefined,
    bodyAttributes: undefined,
    htmlAttributes: undefined,
    metaTags: [],
    styleTags: [],
    scriptTags: [],
    linkTags: [],
    noscriptTags: [],
    headerTags: []
  };

  const titleEmptyStateFallback = (result?: ITypedTagProps<TagName.title>): ITypedTagProps<TagName.title> | undefined => {
    return result !== undefined ? {tagType: TagName.title, tagProps: {children: result.tagProps.children}} : undefined
  };

  for (const instance of instances) {
    const isEmptyState = _.isEmptyArray(instance.title, instance.link, instance.base, instance.body,
      instance.html, instance.style, instance.script, instance.noscript, instance.meta, instance.link);

    state.titleTag = mergeAllToOne(instance.title, isEmptyState, state.titleTag, true, titleEmptyStateFallback);
    state.baseTag = mergeAllToOne(instance.base, isEmptyState, state.baseTag);
    state.bodyAttributes = mergeAllToOne(instance.body, isEmptyState, state.bodyAttributes);
    state.htmlAttributes = mergeAllToOne(instance.html, isEmptyState, state.htmlAttributes);
    state.styleTags = mergeAllToAll(instance.style, isEmptyState, state.styleTags);
    state.scriptTags = mergeAllToAll(instance.script, isEmptyState, state.scriptTags);
    state.noscriptTags = mergeAllToAll(instance.noscript, isEmptyState, state.noscriptTags);
    state.metaTags = mergeAllByPrimaryAttribute(
      instance.meta,
      isEmptyState,
      state.metaTags,
      findMetaPrimaryAttribute
    );
    state.linkTags = mergeAllByPrimaryAttribute(
      instance.link,
      isEmptyState,
      state.linkTags,
      findLinkPrimaryAttribute
    );
  }

  const priorityConfig = typeof priority == "boolean"
    ? priority ? DefaultTagPriorityConfig : undefined
    : priority;

  if (priorityConfig) {
    state.headerTags = buildTagsPriority(state, priorityConfig)
  }

  return state;
};

const buildTagsPriority = (state: IHelmetState, priorityConfig: TagPriorityConfig[]): TypedTagProps[] => {
  let priorities: TypedTagProps[] = []
  for (const config of priorityConfig) {
    switch (config.tagName) {
      case TagName.title:
        if (state.titleTag) {
          priorities.push(state.titleTag);
          state.titleTag = undefined;
        }
        break
      case TagName.base:
        if (state.baseTag) {
          priorities.push(state.baseTag)
          state.baseTag = undefined;
        }
        break
      case TagName.meta:
        priorities.push(...getMatchedTags(state.metaTags, config))
        break
      case TagName.style:
        priorities.push(...getMatchedTags(state.styleTags, config))
        break
      case TagName.link:
        priorities.push(...getMatchedTags(state.linkTags, config))
        break
      case TagName.script:
        priorities.push(...getMatchedTags(state.scriptTags, config))
        break
      case TagName.noscript:
        priorities.push(...getMatchedTags(state.noscriptTags, config))
        break
    }
  }
  return priorities
}

const getMatchedTags = <T extends TagName, >(tags: ITypedTagProps<T>[], config: TagPriorityConfig) => {
  const priorities: TypedTagProps[] = [];
  for (const tag of tags) {
    if (isTagMatch(tag, config)) {
      priorities.push(tag);
      _.remove(tags, tag);
    }
  }

  return priorities
}

const isTagMatch = <T, >(tag: T, config: TagPriorityConfig) => {
  for (const [key, configValue] of Object.entries(config)) {
    if (key == "tagName") {
      continue;
    }

    const tagValue = tag[key as keyof T];
    if (tagValue === undefined) {
      return false;
    }

    if (configValue["seoAnyValue"] !== undefined && configValue["seoAnyValue"]) {
      continue;
    }

    if (configValue["seoValues"]) {
      if (!configValue["seoValues"].find((m: any) => m === tagValue)) {
        return false;
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

const fallBackTitle: ITypedTagProps<TagName.title> = {tagType: TagName.title, tagProps: {}}
export const buildServerState = (state: IHelmetState): IHelmetServerState => {
  const titleComponentCallback = () => createReactComponent(state.titleTag, fallBackTitle);
  const baseComponentCallback = () => createReactComponent(state.baseTag);
  const bodyComponentCallback = () => createReactComponent(state.bodyAttributes);
  const htmlComponentCallback = () => createReactComponent(state.htmlAttributes);
  const metaComponentsCallback = () => createReactComponents(state.metaTags);
  const styleComponentsCallback = () => createReactComponents(state.styleTags);
  const scriptComponentsCallback = () => createReactComponents(state.scriptTags);
  const linkComponentsCallback = () => createReactComponents(state.linkTags);
  const noscriptComponentsCallback = () => createReactComponents(state.noscriptTags);

  const priorityComponentsCallback = () => createReactComponents(state.headerTags);

  return {
    title: {
      toComponent: titleComponentCallback,
      toString: () => renderToStaticMarkup(titleComponentCallback())
    },
    base: {
      toComponent: baseComponentCallback,
      toString: () => renderToStaticMarkup(baseComponentCallback())
    },
    bodyAttributes: {
      toComponent: () => bodyComponentCallback().props ?? {},
      toString: () => renderToStaticMarkup(bodyComponentCallback()).replace("<body ", "").replace("></body>", "")
    },
    htmlAttributes: {
      toComponent: () => htmlComponentCallback().props ?? {},
      toString: () => renderToStaticMarkup(htmlComponentCallback()).replace("<html ", "").replace("></html>", "")
    },
    meta: {
      toComponent: metaComponentsCallback,
      toString: () => renderToStaticMarkup(<>{metaComponentsCallback()}</>)
    },
    style: {
      toComponent: styleComponentsCallback,
      toString: () => renderToStaticMarkup(<>{styleComponentsCallback()}</>)
    },
    script: {
      toComponent: scriptComponentsCallback,
      toString: () => renderToStaticMarkup(<>{scriptComponentsCallback()}</>)
    },
    link: {
      toComponent: linkComponentsCallback,
      toString: () => renderToStaticMarkup(<>{linkComponentsCallback()}</>)
    },
    noscript: {
      toComponent: noscriptComponentsCallback,
      toString: () => renderToStaticMarkup(<>{noscriptComponentsCallback()}</>)
    },
    priority: {
      toComponent: priorityComponentsCallback,
      toString: () => renderToStaticMarkup(<>{priorityComponentsCallback()}</>)
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



