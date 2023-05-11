import {Helmet, IHelmetDataContext, Meta} from '../../src';
import { render } from './utils';
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

      expect(context.state).toBeDefined();
      const {meta} = context.state!;

      expect(meta).toBeDefined();
      expect(meta.toComponent).toBeDefined();

      const metaComponent = meta.toComponent();
      
      expect(metaComponent).toHaveLength(5);

      metaComponent.forEach(meta => {
        expect(meta).toEqual(expect.objectContaining({ type: 'meta' }));
      });

      const markup = renderToStaticMarkup(<>{metaComponent}</>);

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

      expect(context.state).toBeDefined();
      const {meta} = context.state!;

      expect(meta).toBeDefined();
      expect(meta.toString).toBeDefined();
      expect(meta.toString()).toMatchSnapshot();
    });
  });
});
