import {HelmetContextProvider, IHelmetDataContext} from "../../src";
import {ReactNode} from "react";
import {renderToString} from "react-dom/server";
import {TagPriorityConfig} from "../../src/types";

export const render = (node: ReactNode, context: IHelmetDataContext = {}, priority: TagPriorityConfig[] | boolean = false) => {
  renderToString(
    <HelmetContextProvider value={context} canUseDOM={false} priority={priority}>
      {node}
    </HelmetContextProvider>
  );
};
