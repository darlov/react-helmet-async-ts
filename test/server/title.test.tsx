import {Helmet, IHelmetDataContext, Title} from '../../src';

import { render } from './utils';
import {renderToStaticMarkup} from "react-dom/server";


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

      expect(context.state).toBeDefined();
      const {title} = context.state!;

      expect(title).toBeDefined();
      expect(title.toString).toBeDefined();
      expect(title.toString()).toMatchSnapshot();
    });

    // TODO: Need to research
    // it('opts out of string encoding', () => {
    //   const context: IHelmetData = {};
    //   /* eslint-disable react/no-unescaped-entities */
    //   render(
    //     <Helmet>
    //       <Title>{"This is text and  & and '."}</Title>
    //     </Helmet>,
    //     context
    //   );

    //   expect(context.state).toBeDefined();
    //   const {title} = context.state!;
    //
    //   expect(title).toBeDefined();
    //   expect(title.toString).toBeDefined();
    //   expect(title.toString()).toMatchSnapshot();
    // });

    it('renders title as React component', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Title>{`Dangerous <script> include`}</Title>
        </Helmet>,
        context
      );

      expect(context.state).toBeDefined();
      const {title} = context.state!;

      expect(title).toBeDefined();
      expect(title.toComponent).toBeDefined();

      const titleComponent = title.toComponent();
      
      expect(titleComponent).toEqual(expect.objectContaining({ type: 'title' }));

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

      expect(context.state).toBeDefined();
      const {title} = context.state!;

      expect(title).toBeDefined();
      expect(title.toComponent).toBeDefined();

      const titleComponent = title.toComponent();
      expect(titleComponent).toEqual(expect.objectContaining({ type: 'title' }));

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

      expect(context.state).toBeDefined();
      const {title} = context.state!;

      expect(title).toBeDefined();
      expect(title.toString).toBeDefined();
      expect(title.toString()).toMatchSnapshot();
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

      expect(context.state).toBeDefined();
      const {title} = context.state!;

      expect(title).toBeDefined();
      expect(title.toString).toBeDefined();
      expect(title.toString()).toMatchSnapshot();
    });

    it('renders title with itemprop name as string', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Title itemProp="name">Title with Itemprop</Title>
        </Helmet>,
        context
      );
      
      expect(context.state).toBeDefined();
      const {title} = context.state!;

      expect(title).toBeDefined();
      expect(title.toString).toBeDefined();

      const titleString = title.toString();

      expect(titleString).toMatchSnapshot();
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

      expect(context.state).toBeDefined();
      const {title} = context.state!;

      expect(title).toBeDefined();
      expect(title.toString).toBeDefined();
      expect(title.toString()).toMatchSnapshot();
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

      expect(context.state).toBeDefined();
      const {title} = context.state!;

      expect(title).toBeDefined();
      expect(title.toString).toBeDefined();
      expect(title.toString()).toMatchSnapshot();
    });

    it('renders title as React component', () => {
      const context: IHelmetDataContext = {};
      render(
        <Helmet>
          <Title>{`Dangerous <script> include`}</Title>
        </Helmet>,
        context
      );

      expect(context.state).toBeDefined();
      const {title} = context.state!;

      expect(title).toBeDefined();
      expect(title.toComponent).toBeDefined();

      const titleComponent = title.toComponent();
      expect(titleComponent).toEqual(expect.objectContaining({ type: 'title' }));

      const markup = renderToStaticMarkup(titleComponent);

      expect(markup).toMatchSnapshot();
    });
  });
});
