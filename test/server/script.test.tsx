import {Helmet, IHelmetDataContext, Script} from '../../src';
import {render, stateAndHeaderTagsShouldBeDefined} from './utils';
import {renderToStaticMarkup} from "react-dom/server";


describe('server', () => {
  describe('Declarative API', () => {
    it('renders script tags as React components', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Script src="http://localhost/test.js" type="text/javascript"/>
          <Script src="http://localhost/test2.js" type="text/javascript"/>
        </Helmet>,
        context
      );

      stateAndHeaderTagsShouldBeDefined(context);
      const scriptComponents = context.state!.headerTags.toComponent();
      expect(scriptComponents).toHaveLength(2);

      scriptComponents.forEach(script => {
        expect(script).toEqual(expect.objectContaining({type: 'script'}));
      });

      const markup = renderToStaticMarkup(<>{scriptComponents}</>);

      expect(markup).toMatchSnapshot();
    });

    it('renders script tags as string', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Script src="http://localhost/test.js" type="text/javascript"/>
          <Script src="http://localhost/test2.js" type="text/javascript"/>
        </Helmet>,
        context
      );

      stateAndHeaderTagsShouldBeDefined(context);
      const {headerTags} = context.state!;
      expect(headerTags.toString()).toMatchSnapshot();
    });
  });
});
