import {FC, useInsertionEffect, useMemo} from "react";
import {IHelmetState, TagName} from "../types";
import {TagRender} from "./TagRender";
import {createPortal} from "react-dom";
import {an} from "vitest/dist/types-198fd1d9";

interface ITagRenderProps {
    state?: IHelmetState;
    canUseDOM: boolean
}

const documentMutationCallback = (mutations: MutationRecord[], fragment: DocumentFragment) => {
    console.log(mutations);

    for (const mutation of mutations) {

        mutation.addedNodes.forEach(m => {
            console.log((m as any)["__myProp"]);
        })
        const isRootNode = mutation.target == fragment;

        switch (mutation.type) {
            case "attributes": {
                break;
            }
            case "childList": {
                //processChildList(mutation, isRootNode, tag.tagType);
                break;
            }

            case "characterData": {
                break
            }
        }
    }
}

export const TagsRender: FC<ITagRenderProps> = ({canUseDOM, state}) => {

    const placeHolder = useMemo(() => {
        return document.createDocumentFragment();
    }, []);

    // useInsertionEffect(() => {
    //     const config: MutationObserverInit = {attributes: true, childList: true, subtree: true, characterData: true};
    //
    //     const observer = new MutationObserver((mutations) => documentMutationCallback(mutations, placeHolder));
    //     observer.observe(placeHolder, config);
    //     return () => observer.disconnect();
    // }, [])
    
    if (canUseDOM && state && state.tags.length > 0) {
        const tags = state.tags.map((tag, index) => <TagRender key={tag.id} tag={tag} index={index} />);
        return createPortal(<>{tags}</>, placeHolder)
    }

    return null;
};

