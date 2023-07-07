import {Helmet, IHelmetDataContext, Style} from '../../src';
import {render, stateAndHeaderTagsShouldBeDefined} from './utils';
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

      stateAndHeaderTagsShouldBeDefined(context);
      const styleComponents = context.state!.headerTags.toComponent();
      expect(styleComponents).toHaveLength(2);

      const markup = renderToStaticMarkup(<>{styleComponents}</>);

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

      stateAndHeaderTagsShouldBeDefined(context);
      const {headerTags} = context.state!;
      expect(headerTags.toString()).toMatchSnapshot();
    });
  });
});
