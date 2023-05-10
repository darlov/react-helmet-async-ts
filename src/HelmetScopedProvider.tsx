import { createContext, useContext } from "react";
import {
  BaseProps,
  BodyProps, HtmlProps, IHelmetInstanceState,
  LinkProps,
  MetaProps,
  NoscriptProps,
  ScriptProps,
  StyleProps,
  TagProps,
  TitleProps, UpdateInstanceCallback
} from "./types";

export interface ITagsActions<T extends TagProps> {
  add: (tag: T) => void;
  remove: (tag: T) => void;
}

export const createActionsData = <
  T extends TagProps,
>(
  instance: IHelmetInstanceState,
  propName: keyof Omit<IHelmetInstanceState, "id" >,
  context:{addItem: UpdateInstanceCallback, removeItem: UpdateInstanceCallback }): ITagsActions<T> => {
  return {
    add: (value) => context.addItem(instance, propName, value),
    remove: (value) => context.removeItem(instance, propName, value)
  }
}

export interface IHelmetScopedContextData {
  titleActions: ITagsActions<TitleProps>;
  metaActions: ITagsActions<MetaProps>;
  styleActions: ITagsActions<StyleProps>;
  scriptActions: ITagsActions<ScriptProps>;
  linkActions: ITagsActions<LinkProps>;
  noscriptActions: ITagsActions<NoscriptProps>;
  baseActions: ITagsActions<BaseProps>;
  bodyActions: ITagsActions<BodyProps>;
  htmlActions: ITagsActions<HtmlProps>;
}

export const HelmetScopedContext = createContext<IHelmetScopedContextData | undefined>(undefined);

export const useScopedHelmetContext = () => {
  const context = useContext(HelmetScopedContext);
  if (!context) {
    throw new Error("HelmetScoped context cannot be null, please put tags inside Helmet component");
  }

  return context;
}