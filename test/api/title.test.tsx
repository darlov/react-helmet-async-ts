import { render } from "./utils";
import { Helmet, Meta, Title } from "../../src";
import { FC } from "react";

const TextComponent: FC<{ valueLeft: string; valueRight: string }> = ({
  valueLeft,
  valueRight,
}) => (
  <>
    {valueLeft} {valueRight}
  </>
);

describe("title", () => {
  describe("API", () => {
    it("updates page title", () => {
      render(
        <Helmet defaultTitle="Fallback">
          <Title>Test Title</Title>
        </Helmet>
      );

      expect(document.title).toMatchSnapshot();
    });

    it("updates page title and allows children containing expressions", () => {
      const someValue = "Some Great Title";

      render(
        <Helmet>
          <Title>Title: {someValue}</Title>
        </Helmet>
      );

      expect(document.title).toMatchSnapshot();
    });

    it("updates page title with multiple children", () => {
      render(
        <div>
          <Helmet>
            <Title>Test Title</Title>
          </Helmet>
          <Helmet>
            <Title>Child One Title</Title>
          </Helmet>
          <Helmet>
            <Title>Child Two Title</Title>
          </Helmet>
        </div>
      );

      expect(document.title).toMatchSnapshot();
    });

    it("sets title based on deepest nested component", () => {
      render(
        <div>
          <Helmet>
            <Title>Main Title</Title>
          </Helmet>
          <Helmet>
            <Title>Nested Title</Title>
          </Helmet>
        </div>
      );

      expect(document.title).toMatchSnapshot();
    });

    it("sets title using deepest nested component with a defined title", () => {
      render(
        <div>
          <Helmet>
            <Title>Main Title</Title>
          </Helmet>
          <Helmet />
        </div>
      );

      expect(document.title).toMatchSnapshot();
    });

    it("does not encode all characters with HTML character entity equivalents", () => {
      const chineseTitle = "膣膗 鍆錌雔";

      render(
        <Helmet>
          <Title>{chineseTitle}</Title>
        </Helmet>
      );

      expect(document.title).toMatchSnapshot();
    });

    it("uses defaultTitle if no title is defined", () => {
      render(<Helmet defaultTitle="Fallback" />);

      expect(document.title).toMatchSnapshot();
    });

    it("uses defaultTitle component if no title is defined", () => {
      render(
        <Helmet
          defaultTitle={<TextComponent valueLeft={"LeftFallback"} valueRight={"RightFallback"} />}
        />
      );

      expect(document.title).toMatchSnapshot();
    });

    it("page title with prop itemProp", () => {
      render(
        <Helmet defaultTitle={"Fallback"}>
          <Title itemProp="name">Test Title with itemProp</Title>
        </Helmet>
      );

      const title = document.getElementsByTagName("title")[0];

      expect(document.title).toMatchSnapshot();
      expect(title.getAttribute("itemprop")).toBe("name");
    });

    it("retains existing title tag when no title tag is defined", () => {
      document.head.innerHTML = `<title>Existing Title</title>`;

      render(
        <Helmet>
          <Meta name="keywords" content="stuff" />
        </Helmet>
      );

      expect(document.title).toMatchSnapshot();
    });

    it("clears title tag if empty title is defined", () => {
      render(
        <>
          <Helmet>
            <Title>Existing Title</Title>
            <Meta name="keywords" content="stuff" />
          </Helmet>
          <Helmet>
            <Title />
            <Meta name="keywords" content="stuff" />
          </Helmet>
        </>
      );
      expect(document.title).toBe("");
    });

    it("does not encode all characters with HTML character", () => {
      render(
        <Helmet>
          <Title dangerouslySetInnerHTML={{__html: "“New Post”"}} />
        </Helmet>
      );

      expect(document.title).toMatchSnapshot();
    });
  });
});
