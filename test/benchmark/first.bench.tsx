import {afterEach, beforeEach, bench, describe} from 'vitest'
import {Helmet as HelmetAsync, HelmetProvider as HelmetProviderAsync} from 'react-helmet-async';
import {Helmet, HelmetContextProvider, Html, Link, Title} from "../../src"
import {render} from "react-dom";
import {createRoot, Root} from "react-dom/client";
import {act} from "react-dom/test-utils";

describe('sort', () => {

  let container = document.createElement('div')
  const root = createRoot(container);

  bench('Async Helmet', () => {
    act(() => {
      root.render(<HelmetProviderAsync>
        <HelmetAsync prioritizeSeoTags={true}>
          <title>Hello World</title>
          <link rel="canonical" href="https://www.tacobell.com/"/>
        </HelmetAsync>
        <HelmetAsync prioritizeSeoTags={true}>
          <title>Hello World</title>
          <link rel="canonical" href="https://www.tacobell.com/"/>
        </HelmetAsync>
        <HelmetAsync prioritizeSeoTags={true}>
          <title>Hello World</title>
          <link rel="canonical" href="https://www.tacobell.com/"/>
          <html className="myClassName" lang="en" />
        </HelmetAsync>
      </HelmetProviderAsync>);
    })
  }, {time: 1000})
  
  bench('New Helmet', () => {
    act(() => {
      root.render(
        <HelmetContextProvider>
          <Helmet>
            <Title>Hello World</Title>
            <Link rel="canonical" href="https://www.tacobell.com/"/>
          </Helmet>
          <Helmet>
            <Title>Hello World</Title>
            <Link rel="canonical" href="https://www.tacobell.com/"/>
          </Helmet>
          <Helmet>
            <Title>Hello World</Title>
            <Link rel="canonical" href="https://www.tacobell.com/"/>
            <Html className="myClassName" lang="en" />
          </Helmet>
        </HelmetContextProvider>);
    })
  }, {time: 1000})


})