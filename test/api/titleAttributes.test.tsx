import { render } from "./utils";
import { Helmet, Title, HELMET_ATTRIBUTE } from "../../src";

describe("title attributes", () => {
  beforeEach(() => {
    document.head.innerHTML = `<title>Test Title</title>`;
  });

  describe("API", () => {
    it("updates title attributes", () => {
      render(
        <Helmet>
          <Title itemProp="name" />
        </Helmet>
      );

      const titleTag = document.getElementsByTagName("title")[0];

      expect(titleTag.getAttribute("itemprop")).toBe("name");
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toBe("true");
    });

    it("sets attributes based on the deepest nested component", () => {
      render(
        <div>
          <Helmet>
            <Title lang="en" hidden />
          </Helmet>
          <Helmet>
            <Title lang="ja" />
          </Helmet>
        </div>
      );

      const titleTag = document.getElementsByTagName("title")[0];

      expect(titleTag.getAttribute("lang")).toBe("ja");
      expect(titleTag.getAttribute("hidden")).toBe("");
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toBe("true");
    });

    it("handles valueless attributes", () => {
      render(
        <Helmet>
          <Title hidden />
        </Helmet>
      );

      const titleTag = document.getElementsByTagName("title")[0];

      expect(titleTag.getAttribute("hidden")).toBe("");
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toBe("true");
    });

    it("clears title attributes that are handled within helmet", () => {
      render(
        <Helmet>
          <Title lang="en" hidden />
        </Helmet>,
        <Helmet />
      );

      const titleTag = document.getElementsByTagName("title")[0];

      expect(titleTag.getAttribute("lang")).toBeNull();
      expect(titleTag.getAttribute("hidden")).toBeNull();
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toBe("true");
    });
  });
});
