import {Helmet, Script} from '../../src';
import {render} from './utils';
import {IHelmetDataContext} from "../../src/types";
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

      expect(context.state).toBeDefined();
      const {script} = context.state!;

      expect(script).toBeDefined();
      expect(script.toComponent).toBeDefined();

      const scriptComponent = script.toComponent();

      expect(scriptComponent).toHaveLength(2);

      scriptComponent.forEach(script => {
        expect(script).toEqual(expect.objectContaining({type: 'script'}));
      });

      const markup = renderToStaticMarkup(<>{scriptComponent}</>);

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

      expect(context.state).toBeDefined();
      const {script} = context.state!;

      expect(script).toBeDefined();
      expect(script.toString).toBeDefined();
      expect(script.toString()).toMatchSnapshot();
    });
  });
});
