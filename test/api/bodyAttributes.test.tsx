import { HELMET_ATTRIBUTE, Helmet, Body } from "../../src";
import { render } from "./utils";
import { BodyProps } from "../../src/types";

type BodyExtendedProps = BodyProps & {"data-animal-type": string, "data-dropzone": string}

type BodyPropKey = keyof BodyExtendedProps;
type AttributeTestData<T extends BodyPropKey> = {
  name: Exclude<T, number>;
  value: BodyExtendedProps[T];
  htmlName?: keyof HTMLBodyElement | string;
  expectedValue?: string;
};

type AttributeTestDataMap = {
  [Property in BodyPropKey]: AttributeTestData<Property>;
};
type AttributeTest<T extends BodyPropKey> = AttributeTestDataMap[T];

describe("body attributes", () => {
  describe("valid attributes", () => {
    it.each<AttributeTest<BodyPropKey>>([
      { name: "accessKey", value: "c" },
      { name: "className", value: "test" },
      { name: "contentEditable", value: true, expectedValue: "true" },
      { name: "contextMenu", value: "mymenu" },
      { name: "data-animal-type", value: "lion" },
      { name: "dir", value: "rtl" },
      { name: "draggable", value: true, expectedValue: "true" },
      { name: "data-dropzone", value: "copy" },
      { name: "hidden", value: true },
      { name: "id", value: "test" },
      { name: "lang", value: "fr" },
      { name: "spellCheck", value: true, expectedValue: "true" },
      { name: "style", value: { color: "green" }, expectedValue: "color:green" },
      { name: "tabIndex", value: -1, expectedValue: "-1" },
      { name: "title", value: "test" },
      { name: "translate", value: "no" },
    ])(`$name`, ({ name, value, htmlName, expectedValue }) => {
      const attr = {
        [name]: value,
      };

      render(
        <Helmet>
          <Body {...attr} />
        </Helmet>
      );

      const bodyTag = document.body;
      const nameToGet = htmlName || name;

      expect(bodyTag.getAttribute(nameToGet) || bodyTag[nameToGet as keyof HTMLElement]).toEqual(
        expectedValue === undefined ? value : expectedValue
      );

      expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toEqual("true");
    });
  });

  it("updates multiple body attributes", () => {
    render(
      <Helmet>
        <Body className="myClassName" tabIndex={-1} />
      </Helmet>
    );

    const bodyTag = document.body;

    expect(bodyTag.getAttribute("class")).toBe("myClassName");
    expect(bodyTag.getAttribute("tabindex")).toBe("-1");
    expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe("true");
  });

  it("sets attributes based on the deepest nested component", () => {
    render(
      <div>
        <Helmet>
          <Body lang="en" />
        </Helmet>
        <Helmet>
          <Body lang="ja" />
        </Helmet>
      </div>
    );

    const bodyTag = document.body;

    expect(bodyTag.getAttribute("lang")).toBe("ja");
    expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe("true");
  });

  it("handles valueless attributes", () => {
    render(
      <Helmet>
        <Body hidden />
      </Helmet>
    );

    const bodyTag = document.body;

    expect(bodyTag.getAttribute("hidden")).toBe("");
    expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe("true");
  });

  it("clears body attributes that are handled within helmet", () => {
    render(
        <Helmet>
          <Body lang="en" hidden />
        </Helmet>,
        <Helmet />
    );

    const bodyTag = document.body;

    expect(bodyTag.getAttribute("lang")).toBeNull();
    expect(bodyTag.getAttribute("hidden")).toBeNull();
    expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
  });

  it("updates with multiple additions and removals - overwrite and new", () => {
    render(
      <>
        <Helmet>
          <Body lang="en" hidden />
        </Helmet>
        <Helmet>
          <Body lang="ja" id="body-tag" title="body tag" />
        </Helmet>
      </>
    );

    const bodyTag = document.body;

    expect(bodyTag.getAttribute("hidden")).toBeNull();
    expect(bodyTag.getAttribute("lang")).toBe("ja");
    expect(bodyTag.getAttribute("id")).toBe("body-tag");
    expect(bodyTag.getAttribute("title")).toBe("body tag");
    expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe("true");
  });

  it("updates with multiple additions and removals - all new", () => {
    render(
      <>
        <Helmet>
          <Body lang="en" hidden />
        </Helmet>
        <Helmet>
          <Body id="body-tag" title="body tag" />
        </Helmet>
      </>
    );

    const bodyTag = document.body;

    expect(bodyTag.getAttribute("hidden")).toBeNull();
    expect(bodyTag.getAttribute("lang")).toBeNull();
    expect(bodyTag.getAttribute("id")).toBe("body-tag");
    expect(bodyTag.getAttribute("title")).toBe("body tag");
    expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe("true");
  });

  describe("initialized outside of helmet", () => {
    beforeEach(() => {
      const bodyTag = document.body;
      bodyTag.setAttribute("data-test", "test");
    });

    it("attributes are not cleared", () => {
      render(<Helmet />);

      const bodyTag = document.body;

      expect(bodyTag.getAttribute("data-test")).toBe("test");
      expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
    });

    it("attributes are overwritten if specified in helmet", () => {
      render(
        <Helmet>
          <Body data-test="helmet-attr" />
        </Helmet>
      );

      const bodyTag = document.body;
      expect(bodyTag.getAttribute("data-test")).toBe("helmet-attr");
      expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe("true");
    });

    it("attributes are cleared once managed in helmet", () => {
     render(
        <Helmet>
          <Body data-test="helmet-attr" />
        </Helmet>,
        <Helmet />
      );
     
      const bodyTag = document.body;

      expect(bodyTag.getAttribute("data-test")).toBeNull();
      expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
    });
  });
});
