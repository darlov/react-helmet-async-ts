import { FC, memo, useEffect } from "react";
import { BodyProps } from "../types";
import { useScopedHelmetContext } from "../HelmetScopedProvider";
import { _ } from "../utils";

const isValid = (tag: BodyProps) => !_.isEmpty(tag);

const BodyTag: FC<BodyProps> = props => {
  const actions = useScopedHelmetContext().bodyActions;

  useEffect(() => {
    if (isValid(props)) {
      actions.add(props);
      return () => actions.remove(props);
    }
  }, [props, actions.add, actions.remove]);

  return null;
};

export const Body = BodyTag;
Body.displayName = "Body";