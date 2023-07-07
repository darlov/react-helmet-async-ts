import {Helmet, IHelmetDataContext, Meta} from '../../src';
import {render, stateAndHeaderTagsShouldBeDefined} from './utils';
import {renderToStaticMarkup} from "react-dom/server";

describe('server', () => {
  describe('Declarative API', () => {
    it('renders meta tags as React components', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Meta charSet="utf-8" />
          <Meta
            name="description"
            content={'Test description & encoding of special characters like \' " > < `'}
          />
          <Meta httpEquiv="content-type" content="text/html" />
          <Meta property="og:type" content="article" />
          <Meta itemProp="name" content="Test name itemprop" />
        </Helmet>,
        context
      );

      stateAndHeaderTagsShouldBeDefined(context);
      const metaComponents = context.state!.headerTags.toComponent();
      
      expect(metaComponents).toHaveLength(5);

      metaComponents.forEach(meta => {
        expect(meta).toEqual(expect.objectContaining({ type: 'meta' }));
      });

      const markup = renderToStaticMarkup(<>{metaComponents}</>);

      expect(markup).toMatchSnapshot();
    });

    it('renders meta tags as string', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Meta charSet="utf-8" />
          <Meta
            name="description"
            content='Test description &amp; encoding of special characters like &#x27; " &gt; &lt; `'
          />
          <Meta httpEquiv="content-type" content="text/html" />
          <Meta property="og:type" content="article" />
          <Meta itemProp="name" content="Test name itemprop" />
        </Helmet>,
        context
      );

      stateAndHeaderTagsShouldBeDefined(context);
      const {headerTags} = context.state!;
      expect(headerTags.toString()).toMatchSnapshot();
    });
  });
});
