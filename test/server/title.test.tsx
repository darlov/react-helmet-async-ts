import {Helmet, IHelmetDataContext, Title} from '../../src';

import {render, stateAndHeaderTagsShouldBeDefined} from './utils';
import {renderToStaticMarkup} from "react-dom/server";
import {expect} from "vitest";


describe('server', () => {
  describe('Declarative API', () => {
    it('encodes special characters in title', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Title>{`Dangerous <script> include`}</Title>
        </Helmet>,
        context
      );

      stateAndHeaderTagsShouldBeDefined(context);
      const {headerTags} = context.state!;

      expect(headerTags.toString()).toMatchSnapshot();
    });

    it('renders title as React component', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Title>{`Dangerous <script> include`}</Title>
        </Helmet>,
        context
      );

      stateAndHeaderTagsShouldBeDefined(context);
      const {headerTags} = context.state!;

      const titleComponents = headerTags.toComponent();
      expect(titleComponents).toHaveLength(1);
      const titleComponent = titleComponents[0];

      expect(titleComponent).toEqual(expect.objectContaining({type: 'title'}));

      const markup = renderToStaticMarkup(titleComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders title with itemprop name as React component', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Title itemProp="name">Title with Itemprop</Title>
        </Helmet>,
        context
      );

      stateAndHeaderTagsShouldBeDefined(context);
      const {headerTags} = context.state!;

      const titleComponents = headerTags.toComponent();
      expect(titleComponents).toHaveLength(1);

      const titleComponent = titleComponents[0];
      expect(titleComponent).toEqual(expect.objectContaining({type: 'title'}));

      const markup = renderToStaticMarkup(titleComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders title tag as string', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Title>{'Dangerous <script> include'}</Title>
        </Helmet>,
        context
      );

      stateAndHeaderTagsShouldBeDefined(context);
      const {headerTags} = context.state!;
      
      expect(headerTags.toString()).toMatchSnapshot();
    });

    it('renders title and allows children containing expressions', () => {
      const context: IHelmetDataContext = {};
      const someValue = 'Some Great Title';

      render(
        <Helmet>
          <Title>Title: {someValue}</Title>
        </Helmet>,
        context
      );

      stateAndHeaderTagsShouldBeDefined(context);
      const {headerTags} = context.state!;
      
      expect(headerTags.toString()).toMatchSnapshot();
    });

    it('renders title with itemprop name as string', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Title itemProp="name">Title with Itemprop</Title>
        </Helmet>,
        context
      );

      stateAndHeaderTagsShouldBeDefined(context);
      const {headerTags} = context.state!;

      expect(headerTags.toString()).toMatchSnapshot();
    });

    it('does not encode all characters with HTML character entity equivalents', () => {
      const context: IHelmetDataContext = {};
      const chineseTitle = '膣膗 鍆錌雔';

      render(
        <div>
          <Helmet>
            <Title>{chineseTitle}</Title>
          </Helmet>
        </div>,
        context
      );

      stateAndHeaderTagsShouldBeDefined(context);
      const {headerTags} = context.state!;

      expect(headerTags.toString()).toMatchSnapshot();
    });
  });

  describe('renderStatic', () => {
    it('does html encode title', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Title>{`Dangerous <script> include`}</Title>
        </Helmet>,
        context
      );

      stateAndHeaderTagsShouldBeDefined(context);
      const {headerTags} = context.state!;
      
      expect(headerTags.toString()).toMatchSnapshot();
    });

    it('renders title as React component', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Title>{`Dangerous <script> include`}</Title>
        </Helmet>,
        context
      );

      stateAndHeaderTagsShouldBeDefined(context);
      const {headerTags} = context.state!;
      const titleComponents = headerTags.toComponent();
      expect(titleComponents).toHaveLength(1);
      const titleComponent = titleComponents[0];
      
      expect(titleComponent).toEqual(expect.objectContaining({type: 'title'}));

      const markup = renderToStaticMarkup(titleComponent);

      expect(markup).toMatchSnapshot();
    });
  });
});
