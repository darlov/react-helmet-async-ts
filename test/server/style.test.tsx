import {Helmet, IHelmetDataContext, Style} from '../../src';
import { render } from './utils';
import {renderToStaticMarkup} from "react-dom/server";


describe('server', () => {
  describe('Declarative API', () => {
    it('renders style tags as React components', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Style type="text/css">{`body {background-color: green;}`}</Style>
          <Style type="text/css">{`p {font-size: 12px;}`}</Style>
        </Helmet>,
        context
      );

      expect(context.state).toBeDefined();
      const {style} = context.state!;

      expect(style).toBeDefined();
      expect(style.toComponent).toBeDefined();

      const styleComponent = style.toComponent();

      expect(styleComponent).toHaveLength(2);

      const markup = renderToStaticMarkup(<>{styleComponent}</>);

      expect(markup).toMatchSnapshot();
    });

    it('renders style tags as string', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Style type="text/css">{`body {background-color: green;}`}</Style>
          <Style type="text/css">{`p {font-size: 12px;}`}</Style>
        </Helmet>,
        context
      );

      expect(context.state).toBeDefined();
      const {style} = context.state!;

      expect(style).toBeDefined();
      expect(style.toString).toBeDefined();
      expect(style.toString()).toMatchSnapshot();
    });
  });
});
