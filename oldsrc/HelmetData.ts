import mapStateOnServer from './server';
import { HelmetProps, HelmetServerState, IHelmetData, IHelmetProviderContext, ProviderContext } from "./types";
import {ReactElement} from "react";


const globalInstances: HelmetProps[] = [];

export function clearInstances() {
  globalInstances.length = 0;
}

export const createHelmetData = (context: ProviderContext, canUseDOM = typeof document !== 'undefined') : IHelmetData => {
  let instances: HelmetProps[] = [];

  if (!canUseDOM) {
    context.helmet = mapStateOnServer({
      baseTag: [],
      bodyAttributes: {},
      encode: true,
      htmlAttributes: {},
      linkTags: [],
      metaTags: [],
      noscriptTags: [],
      scriptTags: [],
      styleTags: [],
      title: '',
      titleAttributes: {},
      prioritizeSeoTags : false,
      onChangeClientState: () => {}
    })
  }
  const value : IHelmetProviderContext =  {
    setHelmet: serverState => {
      context.helmet = serverState;
    },
    helmetInstances: {
      get: () => (canUseDOM ? globalInstances : instances),
      add: instance => {
        (canUseDOM ? globalInstances : instances).push(instance);
      },
      remove: instance => {
        const index = (canUseDOM ? globalInstances : instances).indexOf(instance);
        (canUseDOM ? globalInstances : instances).splice(index, 1);
      },
    },
  }

  return {
    context,
    value
  }
}
