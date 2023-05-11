import {Helmet, Html, IHelmetDataContext} from '../../src';
import {render} from './utils';
import {renderToStaticMarkup} from "react-dom/server";

describe('server', () => {
  describe('Declarative API', () => {
    it('renders html attributes as component', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Html lang="ga" className="myClassName"/>
        </Helmet>,
        context
      );

      expect(context.state).toBeDefined();
      const {htmlAttributes} = context.state!;
      const attrs = htmlAttributes.toComponent();

      expect(attrs).toBeDefined();

      const markup = renderToStaticMarkup(<html lang="en" {...attrs} />);

      expect(markup).toMatchSnapshot();
    });

    it('renders html attributes as string', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Html lang="ga" className="myClassName"/>
        </Helmet>,
        context
      );

      expect(context.state).toBeDefined();
      const {htmlAttributes} = context.state!;

      expect(htmlAttributes).toBeDefined();
      expect(htmlAttributes.toString).toBeDefined();
      expect(htmlAttributes.toString()).toMatchSnapshot();
    });
  });
});
