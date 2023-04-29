import { FC, ReactNode, useState } from "react";
import { HelmetContextProvider } from "../../src";
import { render, RenderResult } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import { act } from "react-dom/test-utils";

export const customRender = (node: ReactNode, delayedComponent?: ReactNode) => {
  let result: RenderResult;

  result = render(
    <DelayedRenderComponent delayedComponent={delayedComponent}>{node}</DelayedRenderComponent>
  );

  act(() => {
    const button = result.getByTestId("showComponent");
    fireEvent.click(button);
  });
};

interface ITestComponentProps {
  children: ReactNode;
  delayedComponent?: ReactNode;
}

export const DelayedRenderComponent: FC<ITestComponentProps> = ({ children, delayedComponent }) => {
  const [showComponent, setShowComponent] = useState(false);

  return (
    <HelmetContextProvider>
      {children}
      {showComponent && delayedComponent}
      <button data-testid={"showComponent"} onClick={() => setShowComponent(true)} />
    </HelmetContextProvider>
  );
};
