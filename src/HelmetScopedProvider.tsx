import { createContext, Dispatch, SetStateAction, useContext } from "react";
import {
  BaseProps,
  BodyProps, HtmlProps,
  LinkProps,
  MetaProps,
  NoscriptProps,
  ScriptProps,
  StyleProps,
  TagProps,
  TitleProps
} from "./types";
import { addAction, removeAction } from "./utils";

export interface ITagsActions<T extends TagProps> {
  add: (title: T) => void;
  remove: (title: T) => void;
}

export const createActionsData = <T extends TagProps, K extends T[] | undefined, >(action: Dispatch<SetStateAction<K>>): ITagsActions<T> => {
  return {
    add: addAction(action),
    remove: removeAction(action)
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