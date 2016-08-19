import { Query, BrowserBridge, Results, FluxCapacitor, Events, Sort } from 'groupby-api';
import { RootTag } from './tags/tag';
import { checkNested } from './utils';
import riot = require('riot');

export const CONFIGURATION_MASK = '{collection,area,language,pageSize,sort,fields}';

export function initSearchandiser() {
  return function configure(config: SearchandiserConfig & any = {}) {
    const finalConfig = Object.assign({ initialSearch: true }, config);
    const flux = initCapacitor(finalConfig);
    Object.assign(flux, Events);
    riot.mixin(RootTag(flux, finalConfig));
    Object.assign(configure, { flux, config: finalConfig }, new Searchandiser()['__proto__']);
  }
}

export function initCapacitor(config: SearchandiserConfig) {
  if (config.pageSizes) config.pageSize = config.pageSizes[0];
  if (checkNested(config, 'tags', 'sort', 'options')) config.sort = config.tags.sort.options.map(val => val.value)[0];
  return new FluxCapacitor(config.customerId, config, CONFIGURATION_MASK);
}

export class Searchandiser {

  flux: FluxCapacitor;
  config: SearchandiserConfig;

  init() {
    if (this.config.initialSearch) this.search();
  }

  attach(tagName: string, opts: any);
  attach(tagName: string, cssSelector: string, opts: any);
  attach(tagName: string, selectorOrOpts?: any, options?: any) {
    let tag;
    if (typeof selectorOrOpts === 'string') {
      tag = this.cssAttach(tagName, selectorOrOpts, options);
    } else {
      tag = this.simpleAttach(tagName, selectorOrOpts);
    }
    if (tag) {
      return tag.length === 1 ? tag[0] : tag;
    } else {
      return null;
    }
  }

  compile() {
    riot.compile(() => null);
  }

  private simpleAttach(tagName: string, options: any = {}) {
    return riot.mount(this.riotTagName(tagName), options);
  }

  private cssAttach(tagName: string, cssSelector: string = `.${tagName}`, options: any = {}) {
    return riot.mount(cssSelector, this.riotTagName(tagName), options);
  }

  private riotTagName(tagName: string) {
    return tagName.startsWith('gb-') ? tagName : `gb-${tagName}`;
  }

  template(templateName: string, cssSelector: string, options: any = {}) {
    this.attach('template', cssSelector, Object.assign(options, { templateName }));
  }

  search(query?: string) {
    return this.flux.search(query)
      .then(res => this.flux.emit(Events.PAGE_CHANGED, { pageIndex: 0, finalPage: this.flux.page.finalPage }));
  }
}

export interface ProductStructure {
  title?: string;
  image?: string;
  description?: string;
  url?: string;
  variants?: string;
  _transform?: (original: any) => any;
  _variantStructure?: ProductStructure;
}

export interface SearchandiserConfig {
  customerId: string;
  area?: string;
  collection?: string;
  language?: string;
  pageSize?: number;
  pageSizes?: number[];
  sort?: Sort[];
  tags: {
    sort?: {
      options?: any[];
    };
    sayt?: {
      structure?: ProductStructure;
      products?: number;
      queries?: number;
      autoSearch?: boolean;
      highlight?: boolean;
      categoryField?: string;
      navigationNames?: any;
      allowedNavigations?: string[];
      minimumCharacters?: number;
      delay?: number;
    };
    collections?: {
      options?: string[]
    };
  };
  stylish?: boolean;
  initialSearch?: boolean;
  structure?: ProductStructure;
}
