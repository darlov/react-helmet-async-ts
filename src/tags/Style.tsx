import {FC, memo} from "react";
import {StyleProps} from "../types";
import {useScopedHelmetContext} from "../HelmetScopedProvider";
import {CommonTag} from "./CommonTag";

const isValid = (tag: StyleProps) => tag.children !== undefined

const StyleTag: FC<StyleProps> = (props) => {
    const actions = useScopedHelmetContext().styleActions;
    return <CommonTag tagProps={props} actions={actions} isValid={isValid}/>;
}

export const Style = memo(StyleTag);
Style.displayName = "Style";