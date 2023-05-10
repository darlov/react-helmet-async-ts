import {Helmet, IHelmetDataContext, Link, Meta, Script} from '../../src';
import { render } from './utils';
import {renderToStaticMarkup} from "react-dom/server";

describe('server', () => {
  describe('API', () => {
    it('rewind() provides a fallback object for empty Helmet state', () => {
      const context: IHelmetDataContext = {};
      render(<div />, context);

      expect(context.state).toBeDefined();
      const head = context.state!;

      expect(head.html).toBeDefined();
      expect(head.html.toString).toBeDefined();
      expect(head.html.toString()).toBe('');
      expect(head.html.toComponent).toBeDefined();
      expect(head.html.toComponent()).toEqual({});

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
      expect(head.title.toComponent).toBeDefined();

      const markup = renderToStaticMarkup(head.title.toComponent());

      expect(markup).toMatchSnapshot();

      expect(head.base).toBeDefined();
      expect(head.base.toString).toBeDefined();
      expect(head.base.toString()).toBe('');
      expect(head.base.toComponent).toBeDefined();

      const baseComponent = head.base.toComponent();

      expect(baseComponent).toEqual(<></>);

      expect(head.meta).toBeDefined();
      expect(head.meta.toString).toBeDefined();
      expect(head.meta.toString()).toBe('');
      expect(head.meta.toComponent).toBeDefined();

      const metaComponent = head.meta.toComponent();

      expect(metaComponent).toHaveLength(0);

      expect(head.link).toBeDefined();
      expect(head.link.toString).toBeDefined();
      expect(head.link.toString()).toBe('');
      expect(head.link.toComponent).toBeDefined();

      const linkComponent = head.link.toComponent();

      expect(linkComponent).toHaveLength(0);

      expect(head.script).toBeDefined();
      expect(head.script.toString).toBeDefined();
      expect(head.script.toString()).toBe('');
      expect(head.script.toComponent).toBeDefined();

      const scriptComponent = head.script.toComponent();

      expect(scriptComponent).toHaveLength(0);

      expect(head.noscript).toBeDefined();
      expect(head.noscript.toString).toBeDefined();
      expect(head.noscript.toString()).toBe('');
      expect(head.noscript.toComponent).toBeDefined();

      const noscriptComponent = head.noscript.toComponent();

      expect(noscriptComponent).toHaveLength(0);

      expect(head.style).toBeDefined();
      expect(head.style.toString).toBeDefined();
      expect(head.style.toString()).toBe('');
      expect(head.style.toComponent).toBeDefined();

      const styleComponent = head.style.toComponent();

      expect(styleComponent).toHaveLength(0);

      expect(head.priority).toBeDefined();
      expect(head.priority.toString).toBeDefined();
      expect(head.priority.toString()).toBe('');
      expect(head.priority.toComponent).toBeDefined();
    });
  });

  describe('Declarative API', () => {
    it('provides initial values if no state is found', () => {
      const context: IHelmetDataContext = {};
      render(<div />, context);

      expect(context.state).toBeDefined();
      const {meta} = context.state!;

      expect(meta).toBeDefined();
      expect(meta.toString).toBeDefined();

      expect(meta.toString()).toBe('');
    });

    it('rewind() provides a fallback object for empty Helmet state', () => {
      const context: IHelmetDataContext = {};
      render(<div />, context);

      expect(context.state).toBeDefined();
      const head = context.state!;

      expect(head.html).toBeDefined();
      expect(head.html.toString).toBeDefined();
      expect(head.html.toString()).toBe('');
      expect(head.html.toComponent).toBeDefined();
      expect(head.html.toComponent()).toEqual({});

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
      expect(head.title.toComponent).toBeDefined();

      const markup = renderToStaticMarkup(head.title.toComponent());

      expect(markup).toMatchSnapshot();

      expect(head.base).toBeDefined();
      expect(head.base.toString).toBeDefined();
      expect(head.base.toString()).toBe('');
      expect(head.base.toComponent).toBeDefined();

      const baseComponent = head.base.toComponent();

      expect(baseComponent).toEqual(<></>);

      expect(head.meta).toBeDefined();
      expect(head.meta.toString).toBeDefined();
      expect(head.meta.toString()).toBe('');
      expect(head.meta.toComponent).toBeDefined();

      const metaComponent = head.meta.toComponent();

      expect(metaComponent).toHaveLength(0);

      expect(head.link).toBeDefined();
      expect(head.link.toString).toBeDefined();
      expect(head.link.toString()).toBe('');
      expect(head.link.toComponent).toBeDefined();

      const linkComponent = head.link.toComponent();

      expect(linkComponent).toHaveLength(0);

      expect(head.script).toBeDefined();
      expect(head.script.toString).toBeDefined();
      expect(head.script.toString()).toBe('');
      expect(head.script.toComponent).toBeDefined();

      const scriptComponent = head.script.toComponent();

      expect(scriptComponent).toHaveLength(0);

      expect(head.noscript).toBeDefined();
      expect(head.noscript.toString).toBeDefined();
      expect(head.noscript.toString()).toBe('');
      expect(head.noscript.toComponent).toBeDefined();

      const noscriptComponent = head.noscript.toComponent();

      expect(noscriptComponent).toHaveLength(0);

      expect(head.style).toBeDefined();
      expect(head.style.toString).toBeDefined();
      expect(head.style.toString()).toBe('');
      expect(head.style.toComponent).toBeDefined();

      const styleComponent = head.style.toComponent();

      expect(styleComponent).toHaveLength(0);

      expect(head.priority).toBeDefined();
      expect(head.priority.toString).toBeDefined();
      expect(head.priority.toString()).toBe('');
      expect(head.priority.toComponent).toBeDefined();
    });

    it('does not render undefined attribute values', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Script src="foo.js" crossOrigin={undefined} />
        </Helmet>,
        context
      );

      expect(context.state).toBeDefined();
      const { script } = context.state!;

      expect(script.toString()).toMatchSnapshot();
    });

    it('prioritizes SEO tags when asked to', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet prioritizeSeoTags>
          <Link rel="notImportant" href="https://www.chipotle.com" />
          <Link rel="canonical" href="https://www.tacobell.com" />
          <Meta property="og:title" content="A very important title" />
        </Helmet>,
        context
      );

      expect(context.state).toBeDefined();
      const state = context.state!;
      
      expect(state.priority.toString()).toContain(
        'rel="canonical" href="https://www.tacobell.com"'
      );
      expect(state.link.toString()).not.toContain(
        'rel="canonical" href="https://www.tacobell.com"'
      );

      expect(state.priority.toString()).toContain(
        'property="og:title" content="A very important title"'
      );
      expect(state.meta.toString()).not.toContain(
        'property="og:title" content="A very important title"'
      );
    });

    it('does not prioritize SEO unless asked to', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Link rel="notImportant" href="https://www.chipotle.com" />
          <Link rel="canonical" href="https://www.tacobell.com" />
          <Meta property="og:title" content="A very important title" />
        </Helmet>,
        context
      );

      expect(context.state).toBeDefined();
      const state = context.state!;

      expect(state.priority.toString()).not.toContain(
        'rel="canonical" href="https://www.tacobell.com"'
      );
      expect(state.link.toString()).toContain(
        'rel="canonical" href="https://www.tacobell.com"'
      );

      expect(state.priority.toString()).not.toContain(
        'property="og:title" content="A very important title"'
      );
      expect(state.meta.toString()).toContain(
        'property="og:title" content="A very important title"'
      );
    });
  });
});
