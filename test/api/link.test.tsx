import { Helmet, Link } from "../../src";
import { HELMET_ATTRIBUTE } from "../../src";
import { render } from "./utils";

describe("link tags", () => {
  describe("Declarative API", () => {
    it("updates link tags", () => {
      render(
        <Helmet>
          <Link href="http://localhost/helmet" rel="canonical" />
          <Link href="http://localhost/style.css" rel="stylesheet" type="text/css" />
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll<HTMLLinkElement>(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [...tagNodes];

      expect(existingTags).toBeDefined();

      const filteredTags = existingTags.filter(
        tag =>
          (tag.href === "http://localhost/style.css" && tag.rel === "stylesheet" && tag.type === "text/css") 
          || (tag.href === "http://localhost/helmet" && tag.rel === "canonical")
      );

      expect(filteredTags).toHaveLength(2);
    });

    it("clears all link tags if none are specified", () => {
      render(
        <Helmet>
          <Link href="http://localhost/helmet" rel="canonical" />
        </Helmet>,
        <Helmet />
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [...tagNodes];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags without 'href' or 'rel' are not accepted, even if they are valid for other tags", () => {
      render(
        <Helmet>
          <Link lang="won't work" />
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [...tagNodes];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags 'rel' and 'href' properly use 'rel' as the primary identification for this tag, regardless of ordering", () => {
      render(
        <div>
          <Helmet>
            <Link href="http://localhost/helmet" rel="canonical" />
          </Helmet>
          <Helmet>
            <Link rel="canonical" href="http://localhost/helmet/new" />
          </Helmet>
          <Helmet>
            <Link href="http://localhost/helmet/newest" rel="canonical" />
          </Helmet>
        </div>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [...tagNodes];
      const firstTag = existingTags[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute("rel")).toBe("canonical");
      expect(firstTag.getAttribute("href")).toBe("http://localhost/helmet/newest");
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it("tags with rel='stylesheet' uses the href as the primary identification of the tag, regardless of ordering", () => {
      render(
        <div>
          <Helmet>
            <Link href="http://localhost/style.css" rel="stylesheet" type="text/css" media="all" />
          </Helmet>
          <Helmet>
            <Link rel="stylesheet" href="http://localhost/inner.css" type="text/css" media="all" />
          </Helmet>
        </div>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [...tagNodes];
      const firstTag = existingTags[0];
      const secondTag = existingTags[1];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute("href")).toBe("http://localhost/style.css");
      expect(firstTag.getAttribute("rel")).toBe("stylesheet");
      expect(firstTag.getAttribute("type")).toBe("text/css");
      expect(firstTag.getAttribute("media")).toBe("all");
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute("rel")).toBe("stylesheet");
      expect(secondTag.getAttribute("href")).toBe("http://localhost/inner.css");
      expect(secondTag.getAttribute("type")).toBe("text/css");
      expect(secondTag.getAttribute("media")).toBe("all");
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it("sets link tags based on deepest nested component", () => {
      render(
        <div>
          <Helmet>
            <Link rel="canonical" href="http://localhost/helmet" />
            <Link href="http://localhost/style.css" rel="stylesheet" type="text/css" media="all" />
          </Helmet>
          <div>
            <Helmet>
              <Link rel="canonical" href="http://localhost/helmet/innercomponent" />
              <Link
                href="http://localhost/inner.css"
                rel="stylesheet"
                type="text/css"
                media="all"
              />
            </Helmet>
          </div>
        </div>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [...tagNodes];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(3);

      const firstTag = existingTags[0];
      const secondTag = existingTags[1];
      const thirdTag = existingTags[2];

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.outerHTML).toMatchSnapshot();
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute("href")).toBe("http://localhost/helmet/innercomponent");
      expect(firstTag.getAttribute("rel")).toBe("canonical");


      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.outerHTML).toMatchSnapshot();
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute("href")).toBe("http://localhost/style.css");
      expect(secondTag.getAttribute("rel")).toBe("stylesheet");
      expect(secondTag.getAttribute("type")).toBe("text/css");
      expect(secondTag.getAttribute("media")).toBe("all");

      expect(thirdTag).toBeInstanceOf(Element);
      expect(thirdTag.outerHTML).toMatchSnapshot();
      expect(thirdTag.getAttribute).toBeDefined();
      expect(thirdTag.getAttribute("href")).toBe("http://localhost/inner.css");
      expect(thirdTag.getAttribute("rel")).toBe("stylesheet");
      expect(thirdTag.getAttribute("type")).toBe("text/css");
      expect(thirdTag.getAttribute("media")).toBe("all");
    });

    it("allows duplicate link tags if specified in the same component", () => {
      render(
        <Helmet>
          <Link rel="canonical" href="http://localhost/helmet" />
          <Link rel="canonical" href="http://localhost/helmet/component" />
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [...tagNodes];
      const firstTag = existingTags[0];
      const secondTag = existingTags[1];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute("rel")).toBe("canonical");
      expect(firstTag.getAttribute("href")).toBe("http://localhost/helmet");
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute("rel")).toBe("canonical");
      expect(secondTag.getAttribute("href")).toBe("http://localhost/helmet/component");
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it("overrides duplicate link tags with a single link tag in a nested component", () => {
      render(
        <div>
          <Helmet>
            <Link rel="canonical" href="http://localhost/helmet" />
            <Link rel="canonical" href="http://localhost/helmet/component" />
          </Helmet>
          <Helmet>
            <Link rel="canonical" href="http://localhost/helmet/innercomponent" />
          </Helmet>
        </div>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [...tagNodes];
      const firstTag = existingTags[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute("rel")).toBe("canonical");
      expect(firstTag.getAttribute("href")).toBe("http://localhost/helmet/innercomponent");
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it("overrides single link tag with duplicate link tags in a nested component", () => {
      render(
        <div>
          <Helmet>
            <Link rel="canonical" href="http://localhost/helmet" />
          </Helmet>
          <Helmet>
            <Link rel="canonical" href="http://localhost/helmet/component" />
            <Link rel="canonical" href="http://localhost/helmet/innercomponent" />
          </Helmet>
        </div>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [...tagNodes];
      const firstTag = existingTags[0];
      const secondTag = existingTags[1];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute("rel")).toBe("canonical");
      expect(firstTag.getAttribute("href")).toBe("http://localhost/helmet/component");
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute("rel")).toBe("canonical");
      expect(secondTag.getAttribute("href")).toBe("http://localhost/helmet/innercomponent");
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it("does not render tag when primary attribute is null", () => {
      render(
        <Helmet>
          <Link rel="icon" sizes="192x192" href={undefined} />
          <Link rel="canonical" href="http://localhost/helmet/component" />
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [...tagNodes];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);
      
      const firstTag = existingTags[0];

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute("rel")).toBe("canonical");
      expect(firstTag.getAttribute("href")).toBe("http://localhost/helmet/component");
      expect(firstTag.outerHTML).toMatchSnapshot();
    });
  });
});
