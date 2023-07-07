import {Helmet, IHelmetDataContext, Link} from '../../src';
import {render, stateAndHeaderTagsShouldBeDefined} from './utils';
import {renderToStaticMarkup} from "react-dom/server";

describe('server', () => {
  describe('Declarative API', () => {
    it('renders link tags as React components', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Link href="http://localhost/helmet" rel="canonical"/>
          <Link href="http://localhost/style.css" rel="stylesheet" type="text/css"/>
        </Helmet>,
        context
      );

      stateAndHeaderTagsShouldBeDefined(context);
      const linkComponents = context.state!.headerTags.toComponent();

      expect(linkComponents).toHaveLength(2);

      linkComponents.forEach(link => {
        expect(link).toEqual(expect.objectContaining({type: 'link'}));
      });

      const markup = renderToStaticMarkup(<>{linkComponents}</>);

      expect(markup).toMatchSnapshot();
    });

    it('renders link tags as string', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Link href="http://localhost/helmet" rel="canonical"/>
          <Link href="http://localhost/style.css" rel="stylesheet" type="text/css"/>
        </Helmet>,
        context
      );

      stateAndHeaderTagsShouldBeDefined(context);
      const {headerTags} = context.state!;
      expect(headerTags.toString()).toMatchSnapshot();
    });
  });
});
