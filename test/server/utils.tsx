import {render as testRender, RenderResult} from "@testing-library/react";
import {HelmetContextProvider, IHelmetData} from "../../src";
import {ReactNode} from "react";

export const render = (node: ReactNode, context: IHelmetData = {}) => {
  testRender(
    <HelmetContextProvider data={context} canUseDOM={false}>
      {node}
    </HelmetContextProvider>
  );
};
