export enum TAG_PROPERTIES {
  CHARSET = 'charSet',
  CSS_TEXT = 'cssText',
  HREF = 'href',
  HTTPEQUIV = 'http-equiv',
  INNER_HTML = 'innerHTML',
  ITEM_PROP = 'itemprop',
  NAME = 'name',
  PROPERTY = 'property',
  REL = 'rel',
  SRC = 'src'
}

export enum ATTRIBUTE_NAMES {
  BODY = 'bodyAttributes',
  HTML = 'htmlAttributes',
  TITLE = 'titleAttributes',
}

export enum TAG_NAMES {
  BASE = 'base',
  BODY = 'body',
  HEAD = 'head',
  HTML = 'html',
  LINK = 'link',
  META = 'meta',
  NOSCRIPT = 'noscript',
  SCRIPT = 'script',
  STYLE = 'style',
  TITLE = 'title',
  FRAGMENT = 'Symbol(react.fragment)'
}

export const SEO_PRIORITY_TAGS = {
  link: {rel: ['amphtml', 'canonical', 'alternate']},
  script: {type: ['application/ld+json']},
  meta: {
    charset: '',
    name: ['generator', 'robots', 'description'],
    property: [
      'og:type',
      'og:title',
      'og:url',
      'og:image',
      'og:image:alt',
      'og:description',
      'twitter:url',
      'twitter:title',
      'twitter:description',
      'twitter:image',
      'twitter:image:alt',
      'twitter:card',
      'twitter:site',
    ],
  },
} as const;

export const VALID_TAG_NAMES = Object.values(TAG_NAMES);

export const REACT_TAG_MAP = {
  accesskey: 'accessKey',
  charset: 'charSet',
  class: 'className',
  contenteditable: 'contentEditable',
  contextmenu: 'contextMenu',
  'http-equiv': 'httpEquiv',
  itemprop: 'itemProp',
  tabindex: 'tabIndex',
} as const;

export const HTML_TAG_MAP = Object.entries(REACT_TAG_MAP).reduce((obj, [key, value]) => {
  obj[value] = key;
  return obj;
}, {} as {[key in typeof REACT_TAG_MAP[keyof typeof REACT_TAG_MAP]] : string});

export const HELMET_ATTRIBUTE = 'data-rh';
