import {renderToStaticMarkup} from 'react-dom/server';
import {Base, Helmet, IHelmetDataContext} from '../../src';
import {render, stateAndHeaderTagsShouldBeDefined} from './utils';
import {expect} from "vitest";

describe('server', () => {
  describe('Declarative API', () => {
    it('renders base tag as React component', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Base target="_blank" href="http://localhost/"/>
        </Helmet>,
        context
      );

      stateAndHeaderTagsShouldBeDefined(context);
      const baseComponents = context.state!.headerTags.toComponent();
      expect(baseComponents).toHaveLength(1);
      
      const base = baseComponents[0];
      expect(base).toBeDefined()
      expect(base).toEqual(expect.objectContaining({type: 'base'}));

      const markup = renderToStaticMarkup(base);

      expect(markup).toMatchSnapshot();
    });

    it('renders base tags as string', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Base target="_blank" href="http://localhost/"/>
        </Helmet>,
        context
      );

      stateAndHeaderTagsShouldBeDefined(context);
      const {headerTags} = context.state!;
      expect(headerTags.toString()).toMatchSnapshot();
    });
  });
});
