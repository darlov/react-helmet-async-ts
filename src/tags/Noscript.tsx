import {FC, memo, useEffect} from "react";
import {NoscriptProps} from "../Types";
import {useScopedHelmetContext} from "../HelmetScopedProvider";

const isValid = (tag: NoscriptProps) => tag.children !== undefined

const NoscriptTag: FC<NoscriptProps> = (props) => {
    const actions = useScopedHelmetContext().noscriptActions;

    useEffect(() => {
        if (isValid(props)) {
            actions.add(props);
            return () => actions.remove(props);
        }
    }, [props, actions.add, actions.remove])

    return null;
}

export const Noscript = memo(NoscriptTag);
Noscript.displayName = "Noscript";