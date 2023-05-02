import {Helmet, IHelmetData, Link} from '../../src';
import { render } from './utils';
import {renderToStaticMarkup} from "react-dom/server";

describe('server', () => {
  describe('Declarative API', () => {
    it('renders link tags as React components', () => {
      const context:IHelmetData = {};
      render(
        <Helmet>
          <Link href="http://localhost/helmet" rel="canonical" />
          <Link href="http://localhost/style.css" rel="stylesheet" type="text/css" />
        </Helmet>,
        context
      );

      expect(context.state).toBeDefined();
      const {link} = context.state!;

      expect(link).toBeDefined();
      expect(link.toComponent).toBeDefined();

      const linkComponent = link.toComponent();

      expect(linkComponent).toHaveLength(2);

      linkComponent.forEach(link => {
        expect(link).toEqual(expect.objectContaining({ type: 'link' }));
      });

      const markup = renderToStaticMarkup(<>{linkComponent}</>);

      expect(markup).toMatchSnapshot();
    });

    it('renders link tags as string', () => {
      const context: IHelmetData = {};
      render(
        <Helmet>
          <Link href="http://localhost/helmet" rel="canonical" />
          <Link href="http://localhost/style.css" rel="stylesheet" type="text/css" />
        </Helmet>,
        context
      );

      const {link} = context.state!;

      expect(link).toBeDefined();
      expect(link.toString).toBeDefined();
      expect(link.toString()).toMatchSnapshot();
    });
  });
});
