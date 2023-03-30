import { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { IHelmetInstanceState } from "./Types";
import { removeAction, addAction } from "./Utils";
import { TagRender } from "./renders";

interface IHelmetContextData {
  addInstance: (state: IHelmetInstanceState) => void;
  removeInstance: (state: IHelmetInstanceState) => void;
}

interface IHelmetContextProviderProps {
  children?: ReactNode
}

const HelmetContext = createContext<IHelmetContextData | undefined>(undefined);

export const HelmetContextProvider: FC<IHelmetContextProviderProps> = ({children}) => {
  const [instances, setInstances] = useState<IHelmetInstanceState[]>();
  const [currentTitle, setCurrentTitle] = useState<HTMLTitleElement | undefined>(() => document.head.getElementsByTagName("title")[0]);

  const context = useMemo<IHelmetContextData>(() => {
    return {
      addInstance: addAction(setInstances, m => m.id),
      removeInstance: removeAction(setInstances, m => m.id),
    }
  }, [setInstances])

  useEffect(() => {
    if (currentTitle && !currentTitle.getAttribute("data-rh")) {
      context.addInstance({
        id: -1,
        emptyState: false,
        titles: [{children: currentTitle.text}]
      })
      currentTitle.remove();
      setCurrentTitle(undefined);
    }
  }, [currentTitle, setCurrentTitle, context.addInstance])


  return (
    <HelmetContext.Provider value={ context }>
      { children }
      <TagRender instances={ instances }/>
    </HelmetContext.Provider>)
}

export const useHelmetContext = () => {
  const context = useContext(HelmetContext);
  if (!context) {
    throw new Error("Helmet context cannot be null, please add a HelmetContextProvider");
  }

  return context;
}


