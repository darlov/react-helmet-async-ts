import {renderToStaticMarkup} from 'react-dom/server';
import {Base, Helmet, IHelmetData} from '../../src';
import {render} from './utils';

describe('server', () => {
  describe('Declarative API', () => {
    it('renders base tag as React component', () => {
      const context: IHelmetData = {};
      render(
        <Helmet>
          <Base target="_blank" href="http://localhost/"/>
        </Helmet>,
        context
      );

      expect(context.state).toBeDefined();
      const head = context.state!;
      
      expect(head.base).toBeDefined();
      expect(head.base.toComponent).toBeDefined();

      const baseComponent = head!.base.toComponent();

      expect(baseComponent).toBeDefined()
      expect(baseComponent).toEqual(expect.objectContaining({type: 'base'}));

      const markup = renderToStaticMarkup(baseComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders base tags as string', () => {
      const context: IHelmetData = {};
      render(
        <Helmet>
          <Base target="_blank" href="http://localhost/"/>
        </Helmet>,
        context
      );

      const head = context.state;

      expect(head).toBeDefined();
      expect(head!.base).toBeDefined();
      expect(head!.base.toString).toBeDefined();
      expect(head!.base.toString()).toMatchSnapshot();
    });
  });
});
