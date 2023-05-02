import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext, useEffect,
  useMemo,
  useState,
} from "react";
import {IHelmetData, IHelmetInstanceState, IHelmetState} from "./types";
import {removeAction, addAction, _, buildState, buildServerState} from "./utils";
import {TagRender} from "./renders";

interface IHelmetContextData {
  addInstance: (state: IHelmetInstanceState) => void;
  removeInstance: (state: IHelmetInstanceState) => void;
}

interface IHelmetContextProviderProps {
  data?: IHelmetData,
  children?: ReactNode;
  canUseDOM?: boolean;
}

const HelmetContext = createContext<IHelmetContextData | undefined>(undefined);

export const HelmetContextProvider: FC<IHelmetContextProviderProps> = ({data, children, canUseDOM = typeof document !== 'undefined'}) => {
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
      removeInstance: removeInstance
    };
  }, [addInstance, removeInstance]);

  useEffect(() => {
    if (instances && instances.length > 0) {
      const orderedInstances = _.sortBy(instances, "id");
      const state = buildState(orderedInstances);
      
      if(!canUseDOM && data){
        data.state = buildServerState(state)
      }

      setState(state);
    } else {
      setState(undefined);
    }
  }, [instances, setState]);


  return (
    <>
      <HelmetContext.Provider value={context}>
        {children}
      </HelmetContext.Provider>
      <TagRender state={state}/>
    </>
  );
};

export const useHelmetContext = () => {
  const context = useContext(HelmetContext);
  if (!context) {
    throw new Error("Helmet context cannot be null, please add a HelmetContextProvider");
  }

  return context;
};
