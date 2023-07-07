import {FC} from "react";
import {IHelmetState} from "../types";
import {TagRender} from "./TagRender";

interface ITagRenderProps {
    state?: IHelmetState;
}

export const TagsRender: FC<ITagRenderProps> = ({state}) => {
    if (state && state.tags.length > 0) {
        return <>{state.tags.map((tag) => <TagRender key={tag.id} tagType={tag.tagType} {...tag.tagProps}/>)}</> 
    }

    return null;
};
