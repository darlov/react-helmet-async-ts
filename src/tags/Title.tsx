import {FC, memo, useEffect} from "react";
import {useScopedHelmetContext} from "../HelmetScopedProvider";
import {TitleProps} from "../types";
import {_} from "../utils";

const TitleTag: FC<TitleProps> = (props) => {
    const actions = useScopedHelmetContext().titleActions;

    useEffect(() => {
        if (_.isEmpty(props)) {
            props = {children: ""}
        }
        actions.add(props);
        return () => actions.remove(props);
    }, [props, actions.add, actions.remove])

    return null;
}

export const Title = memo(TitleTag);
Title.displayName = "Title";