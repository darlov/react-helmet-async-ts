import React, {createContext, FC, ReactNode, useMemo} from 'react';
import {createHelmetData} from './HelmetData';
import { IHelmetProviderContext, ProviderContext } from "./types";

export const Context = createContext<IHelmetProviderContext>({
  helmetInstances : {
    add: instance => {},
    get: () => [],
    remove: instance => {}
  },
  setHelmet: serverState => {}
});

interface IProviderProps {
  children: ReactNode,
  context?: ProviderContext
}

const canUseDOM = typeof document !== 'undefined';

export const Provider: FC<IProviderProps> & {canUseDOM: boolean} = ({children, context = {}}) => {
  const data = useMemo(() => createHelmetData(context, Provider.canUseDOM), [context])

  return (<Context.Provider value={data.value}>{children}</Context.Provider>)
}

Provider.canUseDOM = canUseDOM
Provider.displayName = "HelmetProvider";