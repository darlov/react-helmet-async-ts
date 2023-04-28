import {FC, memo, useEffect} from "react";
import {StyleProps} from "../types";
import {useScopedHelmetContext} from "../HelmetScopedProvider";

const isValid = (tag: StyleProps) => tag.children !== undefined

const StyleTag: FC<StyleProps> = (props) => {
    const actions = useScopedHelmetContext().styleActions;

    useEffect(() => {
        if (isValid(props)) {
            actions.add(props);
            return () => actions.remove(props);
        }
    }, [props, actions.add, actions.remove])

    return null;
}

export const Style = memo(StyleTag);
Style.displayName = "Style";