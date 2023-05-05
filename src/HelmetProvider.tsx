import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
} from "react";
import {IHelmetDataContext, IHelmetInstanceState, UpdateInstanceCallback} from "./types";
import {TagRender} from "./renders";
import {HelmetData} from "./HelmetData";
import {useForceUpdate} from "./hooks/useForceUpdate";

interface IHelmetContextData {
  addInstance: (state: IHelmetInstanceState) => void;
  removeInstance: (state: IHelmetInstanceState) => void;
  addItem: UpdateInstanceCallback,
  removeItem: UpdateInstanceCallback
  canUseDOM: boolean;
}

interface IHelmetContextProviderProps {
  value?: IHelmetDataContext,
  children?: ReactNode;
  canUseDOM?: boolean;
}

const HelmetContext = createContext<IHelmetContextData | undefined>(undefined);

export const HelmetContextProvider: FC<IHelmetContextProviderProps> = ({value, canUseDOM, children}) => {
  const forceUpdate = useForceUpdate()
  
  const data = useMemo(() => new HelmetData(value, canUseDOM), [value, canUseDOM])
  const context = useMemo<IHelmetContextData>(() => {
    return {
      addInstance: (instance) => {
        data.addInstance(instance)
        forceUpdate();
      },
      removeInstance:  (instance) => {
        data.removeInstance(instance)
        forceUpdate();
      },
      addItem: (instance, propName, value) => {
        data.addItem(instance, propName, value);
        forceUpdate();
      },
      removeItem: (instance, propName, value) => {
        data.removeItem(instance, propName, value);
        forceUpdate();
      },
      canUseDOM: data.canUseDOM,
    };
  }, [data]);

  return (
    <>
      <HelmetContext.Provider value={context}>
        {children}
      </HelmetContext.Provider>
      {data.canUseDOM && <TagRender state={data.helmetState}/>}
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
