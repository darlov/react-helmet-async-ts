import {Helmet, HelmetContextProvider, Meta, Title} from '../../src';
import { render as testRender } from "@testing-library/react";
import {ReactNode} from "react";

const render = (node: ReactNode) => {
  testRender(<HelmetContextProvider>{node}</HelmetContextProvider>);
};

describe('fragments', () => {
  it('parses Fragments', () => {
    render(
      <Helmet>
        <>
          <Title>Hello</Title>
          <Meta charSet="utf-8" />
        </>
      </Helmet>
    );

    expect(document.title).toMatchSnapshot();
  });

  it('parses nested Fragments', () => {
    render(
      <Helmet>
        <>
          <Title>Foo</Title>
          <>
            <Title>Bar</Title>
            <Title>Baz</Title>
          </>
        </>
      </Helmet>
    );

    expect(document.title).toMatchSnapshot();
  });
});
