import {Body, Helmet, IHelmetDataContext} from '../../src';
import {render} from './utils';
import {renderToStaticMarkup} from "react-dom/server";

describe('server', () => {
  describe('Declarative API', () => {
    it('renders body attributes as component', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Body lang="ga" className="myClassName"/>
        </Helmet>,
        context
      );

      expect(context.state).toBeDefined();
      const {bodyAttributes} = context.state!;
      const attrs = bodyAttributes.toComponent();

      expect(attrs).toBeDefined();

      const markup = renderToStaticMarkup(<body lang="en" {...attrs} />);

      expect(markup).toMatchSnapshot();
    });

    it('renders body attributes as string', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Body lang="ga" className="myClassName"/>
        </Helmet>,
        context
      );

      expect(context.state).toBeDefined();
      const {bodyAttributes} = context.state!;

      expect(bodyAttributes).toBeDefined();
      expect(bodyAttributes.toString).toBeDefined();
      expect(bodyAttributes.toString()).toMatchSnapshot();
    });
  });
});
