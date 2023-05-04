import {render as testRender, RenderResult} from "@testing-library/react";
import {HelmetContextProvider, IHelmetData} from "../../src";
import {ReactNode} from "react";
import {renderToString} from "react-dom/server";
import {act} from "react-dom/test-utils";
import {HelmetData} from "../../src/HelmetData";

export const render = (node: ReactNode, context: HelmetData = new HelmetData()) => {
  act(() =>{ renderToString(
    <HelmetContextProvider data={context} canUseDOM={false}>
      {node}
    </HelmetContextProvider>
  )});
};
