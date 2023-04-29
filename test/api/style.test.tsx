import { customRender } from "./utils";
import { Helmet, Style, HELMET_ATTRIBUTE } from "../../src";

describe("style tags", () => {
  describe("Declarative API", () => {
    it("updates style tags", () => {
      const cssText1 = `
            body {
                background-color: green;
            }
        `;
      const cssText2 = `
            p {
                font-size: 12px;
            }
        `;

      customRender(
        <Helmet>
          <Style type="text/css">{cssText1}</Style>
          <Style>{cssText2}</Style>
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll<HTMLStyleElement>(
        `style[${HELMET_ATTRIBUTE}]`
      );
      const existingTags = [...tagNodes];

      const [firstTag, secondTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute("type")).toBe("text/css");
      expect(firstTag.innerHTML).toEqual(cssText1);
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.innerHTML).toEqual(cssText2);
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it("clears all style tags if none are specified", () => {
      const cssText = `
            body {
                background-color: green;
            }
        `;
      customRender(
        <Helmet>
          <Style type="text/css">{cssText}</Style>
        </Helmet>,
        <Helmet />
      );

      const existingTags = document.head.querySelectorAll<HTMLStyleElement>(
        `style[${HELMET_ATTRIBUTE}]`
      );

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags without 'cssText' are not accepted", () => {
      customRender(
        <Helmet>
          <Style property="won't work" />
        </Helmet>
      );

      const existingTags = document.head.querySelectorAll<HTMLStyleElement>(
        `style[${HELMET_ATTRIBUTE}]`
      );

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("does not render tag when primary attribute is null", () => {
      customRender(
        <Helmet>
          <Style>{undefined}</Style>
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll<HTMLStyleElement>(
        `style[${HELMET_ATTRIBUTE}]`
      );
      const existingTags = [...tagNodes];

      expect(existingTags).toHaveLength(0);
    });
  });
});
