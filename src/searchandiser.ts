import { Query, BrowserBridge, Results, FluxCapacitor, Events } from 'groupby-api';
import { pluck } from './utils';
import riot = require('riot');

export function InitSearchandiser() {
  return function configure(config: SearchandiserConfig & any = {}) {
    const flux = new FluxCapacitor(config.customerId, pluck(config, 'collection', 'area', 'language', 'pageSize'));
    Object.assign(flux, Events);
    Object.assign(configure, new Searchandiser(flux, config));
  }
}

class Searchandiser {

  constructor(public flux: FluxCapacitor, public config: SearchandiserConfig) { }

  attach = (tagName: Component, cssSelector: string = `.${tagName}`, options: any = {}, handler?: (tag) => void) => {
    const tag = riot.mount(cssSelector, `gb-${tagName}`, Object.assign(options, this));
    if (handler && tag.length) handler(tag[0]);
  };

  template = (templateName: string, cssSelector: string, options: any = {}) => {
    this.attach('template', cssSelector, Object.assign(options, { templateName }));
  };

  search = (query?: string) => this.flux.search(query);

  style = () => this.config.stylish ? 'gb-stylish' : '';
}

export type Component = 'query' |
  'didYouMean' |
  'relatedSearches' |
  'selectedNavigation' |
  'availableNavigation' |
  'paging' |
  'results' |
  'template';

export interface SearchandiserConfig {
  customerId: string,
  area?: string;
  collection?: string;
  language?: string;
  pageSize?: number;
  stylish?: boolean;

  structure?: {
    title?: string;
    imagePrefix?: string;
    image?: string;
    imageSuffix?: string;
    description?: string;
  };
}
