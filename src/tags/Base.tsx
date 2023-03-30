import { FC, memo, useEffect } from "react";
import {BaseProps} from "../Types";
import { useScopedHelmetContext } from "../HelmetScopedProvider";

const isValid = (tag: BaseProps) => tag.href !== undefined

const BaseTag: FC<BaseProps> = (props) => {
    const actions = useScopedHelmetContext().baseActions;

    useEffect(() => {
        if (isValid(props)) {
            actions.add(props);
            return () => actions.remove(props);
        }
    }, [props, actions.add, actions.remove])

    return null;
}

export const Base = memo(BaseTag);
Base.displayName = "Base";