import {createContext, useContext} from "react";
import {
  IHelmetInstanceState, ITypedTagProps,
  TagName,
  ModifyInstanceCallback
} from "./types";

export interface ITagsActions<T extends TagName> {
  add: (tag: ITypedTagProps<T>) => void;
  remove: (tag: ITypedTagProps<T>) => void;
}

export const createActionsData = <
  T extends TagName,
>(
  instance: IHelmetInstanceState,
  context: { addItem: ModifyInstanceCallback, removeItem: ModifyInstanceCallback }
): ITagsActions<T> => {
  return {
    add: (value) => context.addItem(instance, value),
    remove: (value) => context.removeItem(instance, value)
  }
}

export type HelmetScopedContextData = { actions: ITagsActions<TagName> };

export const HelmetScopedContext = createContext<HelmetScopedContextData | undefined>(undefined);

export const useScopedHelmetContext = () => {
  const context = useContext(HelmetScopedContext);
  if (!context) {
    throw new Error("HelmetScoped context cannot be null, please put tags inside Helmet component");
  }

  return context;
}