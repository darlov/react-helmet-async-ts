import {createElement, ReactElement} from "react";
import {
  ArrayElement,
  IHelmetInstanceState, IHelmetServerState,
  IHelmetState,
  IHelmetTags,
  LinkProps,
  MetaProps,
  primaryLinkAttributes,
  primaryMetaAttributes,
  TagProps,
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

const mergeAllToAll = <T extends keyof IHelmetTags, TElement extends ArrayElement<IHelmetTags[T]>>(
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

const mergeAllByPrimaryAttribute = <T extends keyof IHelmetTags, TElement = IHelmetTags[T]>(
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

  const titleEmptyStateFallback = (result: IHelmetState["titleTag"]) => {
    return result !== undefined ? {children: result.children} : undefined
  };

  for (const instance of instances) {
    const isEmptyState = _.isEmptyArray(instance.titleTags, instance.linkTags, instance.baseTags, instance.bodyTags,
      instance.htmlTags, instance.styleTags, instance.scriptTags, instance.noscriptTags, instance.metaTags, instance.linkTags);

    state.titleTag = mergeAllToOne(instance.titleTags, isEmptyState, state.titleTag, true, titleEmptyStateFallback);
    state.baseTag = mergeAllToOne(instance.baseTags, isEmptyState, state.baseTag);
    state.bodyTag = mergeAllToOne(instance.bodyTags, isEmptyState, state.bodyTag);
    state.htmlTag = mergeAllToOne(instance.htmlTags, isEmptyState, state.htmlTag);
    state.styleTags = mergeAllToAll(instance.styleTags, isEmptyState, state.styleTags);
    state.scriptTags = mergeAllToAll(instance.scriptTags, isEmptyState, state.scriptTags);
    state.noscriptTags = mergeAllToAll(instance.noscriptTags, isEmptyState, state.noscriptTags);
    state.metaTags = mergeAllByPrimaryAttribute(
      instance.metaTags,
      isEmptyState,
      state.metaTags,
      findMetaPrimaryAttribute
    );
    state.linkTags = mergeAllByPrimaryAttribute(
      instance.linkTags,
      isEmptyState,
      state.linkTags,
      findLinkPrimaryAttribute
    );
  }

  return state;
};

const createReactComponent = <T extends TagProps, >(tag: T | undefined, tagName: keyof HTMLElementTagNameMap, fallbackTag?: T) => tag
  ? createComponent(tagName, tag)
  : (fallbackTag ? createComponent(tagName, fallbackTag) : <></>);
const createReactComponents = <T extends TagProps, >(tags: T[], tagName: keyof HTMLElementTagNameMap) => tags.map((m, i) => createComponent(tagName, {
  ...m,
  key: i
}));

export const buildServerState = (state: IHelmetState): IHelmetServerState => {
  const titleComponentCallback = () => createReactComponent(state.titleTag, "title", {});
  const baseComponentCallback = () => createReactComponent(state.baseTag, "base");
  const bodyComponentCallback = () => createReactComponent(state.bodyTag, "body");
  const htmlComponentCallback = () => createReactComponent(state.htmlTag, "html");
  const metaComponentsCallback = () => createReactComponents(state.metaTags, "meta");
  const styleComponentsCallback = () => createReactComponents(state.styleTags, "style");
  const scriptComponentsCallback = () => createReactComponents(state.scriptTags, "script");
  const linkComponentsCallback = () => createReactComponents(state.linkTags, "link");
  const noscriptComponentsCallback = () => createReactComponents(state.noscriptTags, "noscript");

  return {
    title: {
      toComponent: titleComponentCallback,
      toString: () => renderToStaticMarkup(titleComponentCallback())
    },
    base: {
      toComponent: baseComponentCallback,
      toString: () => renderToStaticMarkup(baseComponentCallback())
    },
    body: {
      toComponent: () => bodyComponentCallback().props ?? {},
      toString: () => renderToStaticMarkup(bodyComponentCallback()).replace("<body ", "").replace("></body>", "")
    },
    html: {
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
      toComponent: () => noscriptComponentsCallback(),
      toString: () => renderToStaticMarkup(<>{noscriptComponentsCallback()}</>)
    },
    priority: {
      toComponent: () => [<></>],
      toString: () => renderToStaticMarkup(<></>)
    }
  }
}

export const renderToHtmlMarkup = (node: ReactElement) => {
  return renderToStaticMarkup(node);
}

export const renderToHtmlElement = (node: ReactElement, selector: keyof HTMLElementTagNameMap) => {
  const parser = new DOMParser();
  const htmlMarkup = renderToHtmlMarkup(node);
  const parsed = parser.parseFromString(htmlMarkup, "application/xml");
  const element = parsed.querySelector(selector);
  if (element == null) {
    throw new Error(`Couldn't found element ${selector} in the ${htmlMarkup}`)
  }

  return element;
}

export const createComponent = (tagName: keyof HTMLElementTagNameMap, tagProps: TagProps) => {
  return createElement(tagName, {...tagProps, "data-rh": true})
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



