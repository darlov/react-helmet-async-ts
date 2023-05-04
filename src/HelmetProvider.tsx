import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
} from "react";
import {IHelmetInstanceState, UpdateInstanceCallback} from "./types";
import {TagRender} from "./renders";
import {HelmetData} from "./HelmetData";
import {useForceUpdate} from "./hooks/useForceUpdate";

interface IHelmetContextData {
  addInstance: (state: IHelmetInstanceState) => void;
  removeInstance: (state: IHelmetInstanceState) => void;
  addInstanceItems: UpdateInstanceCallback,
  canUseDOM: boolean;
}

interface IHelmetContextProviderProps {
  data?: HelmetData,
  children?: ReactNode;
  canUseDOM?: boolean;
}

const HelmetContext = createContext<IHelmetContextData | undefined>(undefined);

export const HelmetContextProvider: FC<IHelmetContextProviderProps> = ({data = new HelmetData(), children}) => {
  const forceUpdate = useForceUpdate()
  
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
      canUseDOM: data.canUseDOM
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
