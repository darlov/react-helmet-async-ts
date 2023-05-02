import {Helmet, Html, IHelmetData} from '../../src';
import {render} from './utils';
import {renderToStaticMarkup} from "react-dom/server";

describe('server', () => {
  describe('Declarative API', () => {
    it('renders html attributes as component', () => {
      const context: IHelmetData = {};
      render(
        <Helmet>
          <Html lang="ga" className="myClassName"/>
        </Helmet>,
        context
      );

      expect(context.state).toBeDefined();
      const {html} = context.state!;
      const attrs = html.toComponent();

      expect(attrs).toBeDefined();

      const markup = renderToStaticMarkup(<html lang="en" {...attrs} />);

      expect(markup).toMatchSnapshot();
    });

    it('renders html attributes as string', () => {
      const context: IHelmetData = {};
      render(
        <Helmet>
          <Html lang="ga" className="myClassName"/>
        </Helmet>,
        context
      );

      expect(context.state).toBeDefined();
      const {html} = context.state!;

      expect(html).toBeDefined();
      expect(html.toString).toBeDefined();
      expect(html.toString()).toMatchSnapshot();
    });
  });
});
