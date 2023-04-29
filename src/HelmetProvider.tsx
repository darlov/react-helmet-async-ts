import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {IHelmetInstanceState, IHelmetState } from "./types";
import { removeAction, addAction } from "./utils";
import { TagRender } from "./renders";

interface IHelmetContextData {
  addInstance: (state: IHelmetInstanceState) => void;
  removeInstance: (state: IHelmetInstanceState) => void;
  setState: (state?: IHelmetState) => void;
  readonly state?: IHelmetState;
}

interface IHelmetContextProviderProps {
  children?: ReactNode;
}

const HelmetContext = createContext<IHelmetContextData | undefined>(undefined);

export const HelmetContextProvider: FC<IHelmetContextProviderProps> = ({ children }) => {
  const [instances, setInstances] = useState<IHelmetInstanceState[]>();
  const [state, setState] = useState<IHelmetState | undefined>();

  const addInstance = useCallback<IHelmetContextData["addInstance"]>(
    addAction(setInstances, m => m.id),
    [setInstances]
  );

  const removeInstance = useCallback<IHelmetContextData["removeInstance"]>(
    removeAction(setInstances, m => m.id),
    [setInstances]
  );

  const context = useMemo<IHelmetContextData>(() => {
    return {
      addInstance: addInstance,
      removeInstance: removeInstance,
      setState: setState,
      state: state,
    };
  }, [addInstance, removeInstance, setState, state]);

  return (
    <HelmetContext.Provider value={context}>
      <TagRender instances={instances} />
      {children}
  
    </HelmetContext.Provider>
  );
};

export const useHelmetContext = () => {
  const context = useContext(HelmetContext);
  if (!context) {
    throw new Error("Helmet context cannot be null, please add a HelmetContextProvider");
  }

  return context;
};
