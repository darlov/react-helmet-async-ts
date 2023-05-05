import {HelmetContextProvider, IHelmetDataContext} from "../../src";
import {ReactNode} from "react";
import {renderToString} from "react-dom/server";

export const render = (node: ReactNode, context: IHelmetDataContext = {}) => {
  renderToString(
    <HelmetContextProvider value={context} canUseDOM={false}>
      {node}
    </HelmetContextProvider>
  );
};
