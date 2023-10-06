import {TypedTagsProps} from "../types";
import {createElement, FC, memo, useEffect, useRef, useState} from "react";
import {addTag, getCurrentHeadElement, updateTag} from "./tagUtils";

interface ITagRender {
    tag: TypedTagsProps
}

export const HeadTagRender: FC<ITagRender> = memo(({tag}) => {
    const elementFrom = useRef<Element>();
    const elementTo = useRef<Element>();

    useEffect(() => {
        if (elementFrom.current !== undefined) {
            const currentElement = elementTo.current || getCurrentHeadElement(tag.tagName);
            if (currentElement) {
                return updateTag(elementFrom.current, currentElement, tag.tagName);
            } else {
                return addTag(elementFrom.current, elementTo);
            }
        }
    }, [tag, elementFrom, elementTo, elementTo])


    return createElement(tag.tagName, {ref: elementFrom, ...tag.tagProps, key: tag.id, "data-rh": true});

});

HeadTagRender.displayName = "TagRender";