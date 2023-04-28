import { FC, memo, useEffect } from "react";
import { HtmlProps } from "../types";
import { useScopedHelmetContext } from "../HelmetScopedProvider";
import { _ } from "../utils";

const isValid = (tag: HtmlProps) => !_.isEmpty(tag);

const HtmlTag: FC<HtmlProps> = props => {
  const actions = useScopedHelmetContext().htmlActions;

  useEffect(() => {
    if (isValid(props)) {
      actions.add(props);
      return () => actions.remove(props);
    }
  }, [props, actions.add, actions.remove]);

  return null;
};

export const Html = memo(HtmlTag);
Html.displayName = "Html";