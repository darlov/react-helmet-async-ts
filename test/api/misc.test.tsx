import { render as testRender } from "@testing-library/react";
import {HelmetContextProvider, Helmet, HELMET_ATTRIBUTE, Meta, Title, Script} from "../../src";
import {ReactNode} from "react";
import {vi} from "vitest";
const render = (node: ReactNode) => {
  testRender(<HelmetContextProvider>{node}</HelmetContextProvider>);
};

describe('misc', () => {
  describe('Declarative API', () => {
    it('encodes special characters', () => {
      render(
        <Helmet>
          <Meta name="description" content={'This is "quoted" text and & and \'.'} />
        </Helmet>
      );

      const existingTags = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTag = existingTags[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(existingTag).toBeInstanceOf(Element);
      expect(existingTag.getAttribute).toBeDefined();
      expect(existingTag.getAttribute('name')).toBe('description');
      expect(existingTag.getAttribute('content')).toBe('This is "quoted" text and & and \'.');
      expect(existingTag.outerHTML).toMatchSnapshot();
    });

    it('throws on invalid children', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const renderInvalid = () => {
        render(
          <Helmet>
            <Title>Test Title</Title>
            <Script>
              <Title>Title you will never see</Title>
            </Script>
          </Helmet>
        );
      };
      expect(renderInvalid).toThrowError("HelmetScoped context cannot be null, please put tags inside Helmet component");
      
      vi.spyOn(console, 'error').mockClear();
    });

    it('handles undefined children', () => {
      const charSet = undefined;

      render(
        <Helmet>
          {charSet && <Meta charSet={charSet} />}
          <Title>Test Title</Title>
        </Helmet>
      );

      expect(document.title).toBe('Test Title');
    });

    it('recognizes valid tags regardless of attribute ordering', () => {
      render(
        <Helmet>
          <Meta content="Test Description" name="description" />
        </Helmet>
      );

      const existingTags = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTag = existingTags[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(existingTag).toBeInstanceOf(Element);
      expect(existingTag.getAttribute).toBeDefined();
      expect(existingTag.getAttribute('name')).toBe('description');
      expect(existingTag.getAttribute('content')).toBe('Test Description');
      expect(existingTag.outerHTML).toMatchSnapshot();
    });
  });
});
