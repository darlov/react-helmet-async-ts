import React, { FC, useEffect, useState } from 'react';
import handleStateChangeOnClient from './client';
import mapStateOnServer from './server';
import { reducePropsToState } from './utils';
import { HelmetProps, HelmetServerState, IHelmetProviderContext } from "./types";
import { Provider } from "./Provider";

interface IDispatcherProps extends HelmetProps {
  context: IHelmetProviderContext
}

export const Dispatcher: FC<IDispatcherProps> = (props) => {
  const {context, ...helmetProps} = props;
  const [rendered, setRendered] = useState(false);

  const emitChange = () => {
    const {helmetInstances, setHelmet} = context;
    let serverState: HelmetServerState | undefined;
    const state = reducePropsToState(
      helmetInstances.get().map(instanceProps => {
        return {...instanceProps};
      })
    );
    if (Provider.canUseDOM) {
      handleStateChangeOnClient(state);
    } else if (mapStateOnServer) {
      serverState = mapStateOnServer(state);
    }

    setHelmet(serverState);
  }

  useEffect(() => {
    if (rendered) {
      return;
    }
    setRendered(true);
    const {helmetInstances} = context;
    helmetInstances.add(helmetProps);
    emitChange();

    return () => {
      const {helmetInstances} = context;
      helmetInstances.remove(helmetProps);
      emitChange();
    }
  }, [context])


  return null;
}

Dispatcher.displayName = "HelmetDispatcher";

