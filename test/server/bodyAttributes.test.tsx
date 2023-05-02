import {Body, Helmet, IHelmetData} from '../../src';
import {render} from './utils';
import {renderToStaticMarkup} from "react-dom/server";

describe('server', () => {
  describe('Declarative API', () => {
    it('renders body attributes as component', () => {
      const context: IHelmetData = {};
      render(
        <Helmet>
          <Body lang="ga" className="myClassName"/>
        </Helmet>,
        context
      );

      expect(context.state).toBeDefined();
      const {body} = context.state!;
      const attrs = body.toComponent();

      expect(attrs).toBeDefined();

      const markup = renderToStaticMarkup(<body lang="en" {...attrs} />);

      expect(markup).toMatchSnapshot();
    });

    it('renders body attributes as string', () => {
      const context: IHelmetData = {};
      render(
        <Helmet>
          <Body lang="ga" className="myClassName"/>
        </Helmet>,
        context
      );

      expect(context.state).toBeDefined();
      const {body} = context.state!;

      expect(body).toBeDefined();
      expect(body.toString).toBeDefined();
      expect(body.toString()).toMatchSnapshot();
    });
  });
});
