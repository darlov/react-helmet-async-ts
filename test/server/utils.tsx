import {HelmetContextProvider, IHelmetDataContext} from "../../src";
import {ReactNode} from "react";
import {renderToString} from "react-dom/server";
import {TagPriorityConfig} from "../../src/types";
import {expect} from "vitest";

export const render = (node: ReactNode, context: IHelmetDataContext = {}, priority?: TagPriorityConfig[]) => {
  renderToString(
    <HelmetContextProvider value={context} canUseDOM={false} priority={priority}>
      {node}
    </HelmetContextProvider>
  );
};

export const stateAndHeaderTagsShouldBeDefined = (context: IHelmetDataContext) => {
  expect(context.state).toBeDefined();
  const headerTags = context.state!.headerTags;
  expect(headerTags).toBeDefined();
  expect(headerTags.toComponent).toBeDefined();
  expect(headerTags.toString).toBeDefined();
}
