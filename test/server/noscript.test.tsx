// @vitest-environment node
import {Helmet, IHelmetDataContext, Noscript} from '../../src';
import {render, stateAndHeaderTagsShouldBeDefined} from './utils';
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

      stateAndHeaderTagsShouldBeDefined(context);
      const noscriptComponents = context.state!.headerTags.toComponent();
      expect(noscriptComponents).toHaveLength(2);

      noscriptComponents.forEach(noscript => {
        expect(noscript).toEqual(expect.objectContaining({ type: 'noscript' }));
      });

      const markup = renderToStaticMarkup(<>{noscriptComponents}</>);

      expect(markup).toMatchSnapshot();
    });
  });
});
