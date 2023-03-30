import React, {Children, FC, ReactElement} from 'react';

import { Context } from './Provider';

import {Dispatcher} from './Dispatcher';
import { TAG_NAMES, VALID_TAG_NAMES, HTML_TAG_MAP } from './constants';
import { HelmetNode, HelmetProps, toEntries } from "./types";

const mapChildrenToProps = (children: HelmetNode, newProps: HelmetProps) => {
  let arrayTypeChildren = {};

  Children.forEach(children, child => {
    if (!child || !child.type) {
      return;
    }

    const { children: nestedChildren, ...childProps } = child.props;

    let { type } = child;
    if (typeof child.type === 'symbol') {
      type = type.toString();
    } else {
      warnOnInvalidChildren(child, nestedChildren as HelmetNode);
    }

    switch (type) {
      case TAG_NAMES.FRAGMENT:
        newProps = mapChildrenToProps(nestedChildren as HelmetNode, newProps);
        break;

      case TAG_NAMES.LINK:
      case TAG_NAMES.META:
      case TAG_NAMES.NOSCRIPT:
      case TAG_NAMES.SCRIPT:
      case TAG_NAMES.STYLE:
        arrayTypeChildren = flattenArrayTypeChildren(
          child,
          arrayTypeChildren,
          childProps,
          nestedChildren as HelmetNode,
        );
        break;

      default:
        newProps = mapObjectTypeChildren(
          child,
          newProps,
          childProps,
          nestedChildren as HelmetNode,
        );
        break;
    }
  });

  return mapArrayTypeChildrenToProps(arrayTypeChildren, newProps);
}
const mapObjectTypeChildren = ( child: ReactElement, newProps: HelmetProps, newChildProps: any, nestedChildren: HelmetNode ) => {
  switch (child.type) {
    case TAG_NAMES.TITLE:
      return {
        ...newProps,
        [child.type as string]: nestedChildren,
        titleAttributes: { ...newChildProps },
      };

    case TAG_NAMES.BODY:
      return {
        ...newProps,
        bodyAttributes: { ...newChildProps },
      };

    case TAG_NAMES.HTML:
      return {
        ...newProps,
        htmlAttributes: { ...newChildProps },
      };
    default:
      return {
        ...newProps,
        [child.type as string]: { ...newChildProps },
      };
  }
}

const flattenArrayTypeChildren = (child: ReactElement, arrayTypeChildren: any, newChildProps : any, nestedChildren: HelmetNode) => {
  return {
    ...arrayTypeChildren,
    [child.type as string]: [
      ...(arrayTypeChildren[child.type as string] || []),
      {
        ...newChildProps,
        ...mapNestedChildrenToProps(child, nestedChildren),
      },
    ],
  };
}

const mapNestedChildrenToProps = (child: ReactElement, nestedChildren: HelmetNode) => {
  if (!nestedChildren) {
    return null;
  }

  switch (child.type) {
    case TAG_NAMES.SCRIPT:
    case TAG_NAMES.NOSCRIPT:
      return {
        innerHTML: nestedChildren,
      };

    case TAG_NAMES.STYLE:
      return {
        cssText: nestedChildren,
      };
    default:
      throw new Error(
        `<${child.type} /> elements are self-closing and can not contain children. Refer to our API for more information.`
      );
  }
}

const mapArrayTypeChildrenToProps = (arrayTypeChildren: any, newProps: any) => {
  let newFlattenedProps = { ...newProps };

  Object.keys(arrayTypeChildren).forEach(arrayChildName => {
    newFlattenedProps = {
      ...newFlattenedProps,
      [arrayChildName]: arrayTypeChildren[arrayChildName],
    };
  });

  return newFlattenedProps;
}

const warnOnInvalidChildren = (child:ReactElement, nestedChildren: HelmetNode) => {
  if(!VALID_TAG_NAMES.some(name => child.type === name)) {
    typeof child.type === 'function'
      ? `You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.`
      : `Only elements types ${ VALID_TAG_NAMES.join(
        ', '
      ) } are allowed. Helmet does not support rendering <${
        child.type
      }> elements. Refer to our API for more information.`
  } 
}


export const Helmet: FC<HelmetProps & {children?: HelmetNode}> = (inputProps) => {

  const {children, ...props} = inputProps;
  let newProps = {...props};
  let {helmetData} = props;

  if (children) {
    newProps = mapChildrenToProps(children, newProps);
  }

  // if (helmetData && !(helmetData instanceof HelmetData)) {
  //   helmetData = new HelmetData(helmetData.context, helmetData.instances);
  // }

  return helmetData ? (
    <Dispatcher { ...newProps } context={ helmetData.value } helmetData={ undefined }/>
  ) : (
    <Context.Consumer>
      { (
        context // eslint-disable-next-line react/jsx-props-no-spreading
      ) => <Dispatcher { ...newProps } context={ context }/> }
    </Context.Consumer>
  )
};
