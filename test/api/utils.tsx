import { ReactNode, StrictMode } from 'react';
import { act } from "react-dom/test-utils";
import { HelmetContextProvider } from "../../src";
import { render } from "@testing-library/react";

export const customRender = (node: ReactNode) => {
  act(() => {
    render(
        <HelmetContextProvider>{ node }</HelmetContextProvider>
    )
  })
};


