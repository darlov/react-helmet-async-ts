// @vitest-environment node
import {Helmet, IHelmetDataContext, Noscript} from '../../src';
import { render } from './utils';
import {renderToStaticMarkup} from "react-dom/server";

describe('server', () => {
  describe('Declarative API', () => {
    it('renders noscript tags as React components', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Noscript id="foo"><link rel="stylesheet" type="text/css" href="/style.css" /></Noscript>
          <Noscript id="bar"><link rel="stylesheet" type="text/css" href="/style2.css" /></Noscript>
        </Helmet>,
        context
      );

      expect(context.state).toBeDefined();
      const {noscript} = context.state!;

      expect(noscript).toBeDefined();
      expect(noscript.toComponent).toBeDefined();

      const noscriptComponent = noscript.toComponent();
      
      expect(noscriptComponent).toHaveLength(2);

      noscriptComponent.forEach(noscript => {
        expect(noscript).toEqual(expect.objectContaining({ type: 'noscript' }));
      });

      const markup = renderToStaticMarkup(<>{noscriptComponent}</>);

      expect(markup).toMatchSnapshot();
    });
  });
});
