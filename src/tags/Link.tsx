import {FC, memo, useEffect} from "react";
import {LinkProps, primaryLinkAttributes} from "../types";
import {useScopedHelmetContext} from "../HelmetScopedProvider";
import {CommonTag} from "./CommonTag";

const isValid = (link: LinkProps) => primaryLinkAttributes.every(attr => link[attr] !== undefined)

const LinkTag: FC<LinkProps> = (props) => {
  const actions = useScopedHelmetContext().linkActions;
  return <CommonTag tagProps={props} actions={actions} isValid={isValid}/>;
}

export const Link = memo(LinkTag);
Link.displayName = "Link";