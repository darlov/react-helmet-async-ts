import {IHeadAnchorElement, TagName, TagProps, TagPropsMap, TypedTagsProps} from "../types";
import {createElement, FC, memo, useEffect, useRef} from "react";
import {addTag, getCurrentHeadElement, updateTag} from "./tagUtils";

interface ITagRender {
    tag: TypedTagsProps
}

export const DocumentTagRender: FC<ITagRender> = memo(({tag}) => {
    const elementFrom = useRef<Element>();

    useEffect(() => {
        if (elementFrom.current !== undefined) {
            const currentElement = document.querySelector(tag.tagName);
            if (currentElement !== null) {
                return updateTag(elementFrom.current, currentElement, tag.tagName);
            }
        }
    }, [tag, elementFrom])
    
    return createElement("span", {ref: elementFrom, ...tag.tagProps, key: tag.id, "data-rh": true});
});

DocumentTagRender.displayName = "DocumentTagRender";