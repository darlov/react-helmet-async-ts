import { Helmet, HELMET_ATTRIBUTE, Script } from "../../src";
import { customRender } from "./utils";

describe("script tags", () => {
  describe("Declarative API", () => {
    it("updates script tags", () => {
      const scriptInnerHTML = `
          {
            "@context": "http://schema.org",
            "@type": "NewsArticle",
            "url": "http://localhost/helmet"
          }
        `;
      customRender(
        <Helmet>
          <Script src="http://localhost/test.js" type="text/javascript" />
          <Script src="http://localhost/test2.js" type="text/javascript" />
          <Script type="application/ld+json">{scriptInnerHTML}</Script>
        </Helmet>
      );

      const existingTags = document.head.getElementsByTagName("script");

      expect(existingTags).toBeDefined();

      const filteredTags = [...existingTags].filter(
        tag =>
          (tag.getAttribute("src") === "http://localhost/test.js" &&
            tag.getAttribute("type") === "text/javascript") ||
          (tag.getAttribute("src") === "http://localhost/test2.js" &&
            tag.getAttribute("type") === "text/javascript") ||
          (tag.getAttribute("type") === "application/ld+json" && tag.innerHTML === scriptInnerHTML)
      );

      expect(filteredTags.length).toBeGreaterThanOrEqual(3);
    });

    it("clears all scripts tags if none are specified", () => {
      customRender(
        <Helmet>
          <Script src="http://localhost/test.js" type="text/javascript" />
        </Helmet>,
        <Helmet />
      );

      const existingTags = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags without 'src' are not accepted", () => {
      customRender(
        <Helmet>
          <Script property="won't work" />
        </Helmet>
      );

      const existingTags = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("sets script tags based on deepest nested component", () => {
      customRender(
        <div>
          <Helmet>
            <Script src="http://localhost/test.js" type="text/javascript" />
            <Script src="http://localhost/test2.js" type="text/javascript" />
          </Helmet>
        </div>
      );

      const tagNodes = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);
      const existingTags = [...tagNodes];
      const firstTag = existingTags[0];
      const secondTag = existingTags[1];

      expect(existingTags).toBeDefined();
      expect(existingTags.length).toBeGreaterThanOrEqual(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute("src")).toBe("http://localhost/test.js");
      expect(firstTag.getAttribute("type")).toBe("text/javascript");
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute("src")).toBe("http://localhost/test2.js");
      expect(secondTag.getAttribute("type")).toBe("text/javascript");
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it("sets undefined attribute values to empty strings", () => {
      customRender(
        <Helmet>
          <Script src="foo.js" async={undefined} />
        </Helmet>
      );

      const existingTag = document.head.querySelector<HTMLScriptElement>(
        `script[${HELMET_ATTRIBUTE}]`
      );

      expect(existingTag).toBeDefined();
      expect(existingTag!.outerHTML).toMatchSnapshot();
    });

    it("does not render tag when primary attribute (src) is null", () => {
      customRender(
        <Helmet>
          <Script src={undefined} type="text/javascript" />
        </Helmet>
      );

      const existingTags = document.head.querySelectorAll<HTMLScriptElement>(
        `script[${HELMET_ATTRIBUTE}]`
      );

      expect(existingTags).toHaveLength(0);
    });

    it("does not render tag when primary attribute (innerHTML) is null", () => {
      customRender(
        <Helmet>
          <Script>{undefined}</Script>
        </Helmet>
      );

      const existingTags = document.head.querySelectorAll<HTMLScriptElement>(
        `script[${HELMET_ATTRIBUTE}]`
      );

      expect(existingTags).toHaveLength(0);
    });
  });
});
