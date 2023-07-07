import {Helmet, IHelmetDataContext, Link, Meta, Script} from '../../src';
import {render, stateAndHeaderTagsShouldBeDefined} from './utils';
import {renderToStaticMarkup} from "react-dom/server";

describe('server', () => {
  describe('API', () => {
    it('rewind() provides a fallback object for empty Helmet state', () => {
      const context: IHelmetDataContext = {};
      render(<div />, context);

      stateAndHeaderTagsShouldBeDefined(context);
      const state = context.state!;
      
      expect(state.htmlAttributes).toBeDefined();
      expect(state.htmlAttributes.toString).toBeDefined();
      expect(state.htmlAttributes.toString()).toBe('');
      expect(state.htmlAttributes.toComponent).toBeDefined();
      expect(state.htmlAttributes.toComponent()).toEqual({});      

      const markup = renderToStaticMarkup(state.headerTags.toComponent()[0]);

      expect(markup).toEqual("");
    });
  });

  describe('Declarative API', () => {
    it('does not render undefined attribute values', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Script src="foo.js" crossOrigin={undefined}/>
        </Helmet>,
        context
      );

      stateAndHeaderTagsShouldBeDefined(context);
      const scriptComponents = context.state!.headerTags;

      expect(scriptComponents.toString()).toMatchSnapshot();
    });

    it('prioritizes SEO tags', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Link rel="notImportant" href="https://www.chipotle.com"/>
          <Link rel="canonical" href="https://www.tacobell.com"/>
          <Meta property="og:title" content="A very important title"/>
        </Helmet>,
        context
      );

      stateAndHeaderTagsShouldBeDefined(context);
      const state = context.state!;

      const headerComponents = state.headerTags.toComponent()
      expect(headerComponents).toHaveLength(3);

      const firstTag = renderToStaticMarkup(headerComponents[0]);
      const secondTag = renderToStaticMarkup(headerComponents[1]);
      const thirdTag = renderToStaticMarkup(headerComponents[2]);

      expect(firstTag).toMatchSnapshot();
      expect(firstTag).toContain("property=\"og:title\"");

      expect(secondTag).toMatchSnapshot();
      expect(secondTag).toContain("rel=\"canonical\"");

      expect(thirdTag).toMatchSnapshot();
      expect(thirdTag).toContain("rel=\"notImportant\"");
    });
  })
});
