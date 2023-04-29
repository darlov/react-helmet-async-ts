import { HELMET_ATTRIBUTE } from "../../src";
import { customRender } from "./utils";
import { Helmet, Meta } from "../../src";

describe("meta tags", () => {
  describe("Declarative API", () => {
    it("updates meta tags", async () => {
      customRender(
        <Helmet>
          <Meta charSet="utf-8" />
          <Meta name="description" content="Test description" />
          <Meta httpEquiv="content-type" content="text/html" />
          <Meta property="og:type" content="article" />
          <Meta itemProp="name" content="Test name itemprop" />
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTags: Element[] = [].slice.call(tagNodes);

      expect(existingTags).toBeDefined();

      const filteredTags = existingTags.filter(
        tag =>
          tag.getAttribute("charset") === "utf-8" ||
          (tag.getAttribute("name") === "description" &&
            tag.getAttribute("content") === "Test description") ||
          (tag.getAttribute("http-equiv") === "content-type" &&
            tag.getAttribute("content") === "text/html") ||
          (tag.getAttribute("itemprop") === "name" &&
            tag.getAttribute("content") === "Test name itemprop")
      );

      expect(filteredTags.length).toBeGreaterThanOrEqual(4);
    });

    it("clears all meta tags if none are specified", () => {
      customRender(
        <Helmet>
          <Meta name="description" content="Test description" />
        </Helmet>,
        <Helmet />
      );

      const existingTags = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags without 'name', 'http-equiv', 'property', 'charset', or 'itemprop' are not accepted", () => {
      customRender(
        <Helmet>
          <Meta content="won't work" />
        </Helmet>
      );

      const existingTags = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("sets meta tags based on deepest nested component", () => {
      customRender(
        <div>
          <Helmet>
            <Meta charSet="utf-8" />
            <Meta name="description" content="Test description" />
          </Helmet>
          <Helmet>
            <Meta name="description" content="Inner description" />
            <Meta name="keywords" content="test,meta,tags" />
          </Helmet>
        </div>
      );

      const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTags: Element[] = [].slice.call(tagNodes);

      const firstTag = existingTags[0];
      const secondTag = existingTags[1];
      const thirdTag = existingTags[2];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(3);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute("charset")).toBe("utf-8");
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute("name")).toBe("description");
      expect(secondTag.getAttribute("content")).toBe("Inner description");
      expect(secondTag.outerHTML).toMatchSnapshot();

      expect(thirdTag).toBeInstanceOf(Element);
      expect(thirdTag.getAttribute).toBeDefined();
      expect(thirdTag.getAttribute("name")).toBe("keywords");
      expect(thirdTag.getAttribute("content")).toBe("test,meta,tags");
      expect(thirdTag.outerHTML).toMatchSnapshot();
    });

    it("allows duplicate meta tags if specified in the same component", () => {
      customRender(
        <Helmet>
          <Meta name="description" content="Test description" />
          <Meta name="description" content="Duplicate description" />
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTags: Element[] = [].slice.call(tagNodes);
      const firstTag = existingTags[0];
      const secondTag = existingTags[1];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute("name")).toBe("description");
      expect(firstTag.getAttribute("content")).toBe("Test description");
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute("name")).toBe("description");
      expect(secondTag.getAttribute("content")).toBe("Duplicate description");
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it("overrides duplicate meta tags with single meta tag in a nested component", () => {
      customRender(
        <div>
          <Helmet>
            <Meta name="description" content="Test description" />
            <Meta name="description" content="Duplicate description" />
          </Helmet>
          <Helmet>
            <Meta name="description" content="Inner description" />
          </Helmet>
        </div>
      );

      const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTags: Element[] = [].slice.call(tagNodes);
      const firstTag = existingTags[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute("name")).toBe("description");
      expect(firstTag.getAttribute("content")).toBe("Inner description");
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it("overrides single meta tag with duplicate meta tags in a nested component", () => {
      customRender(
        <div>
          <Helmet>
            <Meta name="description" content="Test description" />
          </Helmet>
          <Helmet>
            <Meta name="description" content="Inner description" />
            <Meta name="description" content="Inner duplicate description" />
          </Helmet>
        </div>
      );

      const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTags: Element[] = [].slice.call(tagNodes);
      const firstTag = existingTags[0];
      const secondTag = existingTags[1];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute("name")).toBe("description");
      expect(firstTag.getAttribute("content")).toBe("Inner description");
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute("name")).toBe("description");
      expect(secondTag.getAttribute("content")).toBe("Inner duplicate description");
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it("does not render tag when primary attribute is null", () => {
      customRender(
        <Helmet>
          <Meta name={undefined} content="Inner duplicate description" />
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTags: Element[] = [].slice.call(tagNodes);

      expect(existingTags).toHaveLength(0);
    });
  });
});
