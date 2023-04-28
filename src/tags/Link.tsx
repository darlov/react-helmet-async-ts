import { FC, memo, useEffect } from "react";
import { LinkProps, primaryLinkAttributes } from "../types";
import { useScopedHelmetContext } from "../HelmetScopedProvider";

const isLinkValid = (link: LinkProps) => primaryLinkAttributes.every(attr => link[attr] !== undefined)

const LinkTag: FC<LinkProps> = (props) => {
  const actions = useScopedHelmetContext().linkActions;

  useEffect(() => {
    if (isLinkValid(props)) {
      actions.add(props);
      return () => actions.remove(props);
    }
  }, [props, actions.add, actions.remove])

  return null;
}

export const Link = memo(LinkTag);
Link.displayName = "Link";