import { customRender } from "./utils";
import { Html, Helmet, HELMET_ATTRIBUTE } from "../../src";

describe("html attributes", () => {
  it("updates html attributes", () => {
    customRender(
      <Helmet>
        <Html className="myClassName" lang="en" />
      </Helmet>
    );

    const htmlTag = document.getElementsByTagName("html")[0];

    expect(htmlTag.getAttribute("class")).to.equal("myClassName");
    expect(htmlTag.getAttribute("lang")).to.equal("en");
    expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("true");
  });

  it("sets attributes based on the deepest nested component", () => {
    customRender(
      <div>
        <Helmet>
          <Html lang="en" />
        </Helmet>
        <Helmet>
          <Html lang="ja" />
        </Helmet>
      </div>
    );

    const htmlTag = document.getElementsByTagName("html")[0];

    expect(htmlTag.getAttribute("lang")).to.equal("ja");
    expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("true");
  });

  it("handles valueless attributes", () => {
    customRender(
      <Helmet>
        <Html data-amp />
      </Helmet>
    );

    const htmlTag = document.getElementsByTagName("html")[0];

    expect(htmlTag.getAttribute("data-amp")).to.equal("true");
    expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("true");
  });

  it("clears html attributes that are handled within helmet", () => {
    customRender(
      <Helmet>
        <Html lang="en" data-amp />
      </Helmet>,
      <Helmet />
    );

    const htmlTag = document.getElementsByTagName("html")[0];

    expect(htmlTag.getAttribute("lang")).to.be.null;
    expect(htmlTag.getAttribute("data-amp")).to.be.null;
    expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(null);
  });

  it("updates with multiple additions and removals - overwrite and new", () => {
    customRender(
      <Helmet>
        <Html lang="en" data-amp />
      </Helmet>,
      <Helmet>
        <Html lang="ja" id="html-tag" title="html tag" />
      </Helmet>
    );

    const htmlTag = document.getElementsByTagName("html")[0];

    expect(htmlTag.getAttribute("data-amp")).to.equal(null);
    expect(htmlTag.getAttribute("lang")).to.equal("ja");
    expect(htmlTag.getAttribute("id")).to.equal("html-tag");
    expect(htmlTag.getAttribute("title")).to.equal("html tag");
    expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("true");
  });

  it("updates with multiple additions and removals - all new", () => {
    customRender(
      <Helmet>
        <Html lang="en" data-amp />
      </Helmet>,
      <Helmet>
        <Html id="html-tag" title="html tag" />
      </Helmet>
    );

    const htmlTag = document.getElementsByTagName("html")[0];

    expect(htmlTag.getAttribute("amp")).to.equal(null);
    expect(htmlTag.getAttribute("lang")).to.equal(null);
    expect(htmlTag.getAttribute("id")).to.equal("html-tag");
    expect(htmlTag.getAttribute("title")).to.equal("html tag");
    expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("true");
  });

  describe("initialized outside of helmet", () => {
    beforeEach(() => {
      const htmlTag = document.getElementsByTagName("html")[0];
      htmlTag.setAttribute("data-test", "test");
    });

    it("are not cleared", () => {
      customRender(<Helmet />);

      const htmlTag = document.getElementsByTagName("html")[0];

      expect(htmlTag.getAttribute("data-test")).to.equal("test");
      expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(null);
    });

    it("overwritten if specified in helmet", () => {
      customRender(
        <Helmet>
          <Html data-test="helmet-attr" />
        </Helmet>
      );
      const htmlTag = document.getElementsByTagName("html")[0];

      expect(htmlTag.getAttribute("data-test")).to.equal("helmet-attr");
      expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("true");
    });

    it("cleared once it is managed in helmet", () => {
      customRender(
        <Helmet>
          <Html data-test="helmet-attr" />
        </Helmet>,
        <Helmet />
      );

      const htmlTag = document.getElementsByTagName("html")[0];

      expect(htmlTag.getAttribute("data-test")).to.equal(null);
      expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(null);
    });
  });
});
