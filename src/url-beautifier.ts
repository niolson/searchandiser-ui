import { Query, SelectedRefinement, SelectedValueRefinement, SelectedRangeRefinement } from 'groupby-api';
import URI = require('urijs');

export class UrlBeautifier {

  config: BeautifierConfig = {
    refinementMapping: [],
    extraRefinementsParam: 'refinements',
    queryToken: 'q',
    suffix: ''
  };
  private generator: UrlGenerator = new UrlGenerator(this);
  private parser: UrlParser = new UrlParser(this);

  constructor(config: BeautifierConfig = {}) {
    Object.assign(this.config, config);
  }

  parse(url: string) {
    return this.parser.parse(url);
  }

  build(query: Query) {
    return this.generator.build(query);
  }
}

export class UrlGenerator {

  config: BeautifierConfig;

  constructor({ config }: UrlBeautifier) {
    this.config = config;
  }

  build(query: Query): string {
    const request = query.build();
    const uri = {
      path: [],
      query: ''
    };
    // let url = '';
    const origRefinements = Array.of(...request.refinements);
    const { map, keys } = this.generateRefinementMap(origRefinements);

    // add query
    if (request.query) {
      uri.path.push(request.query);
    }

    // add refinements
    for (let key of keys) {
      uri.path.push((<SelectedRefinement[]>map[key].map(this.convertRefinement)).join('~'));
    }

    // add reference key
    if (keys.length || request.query) {
      uri.path.push(`${request.query ? this.config.queryToken : ''}${keys.join('')}`);
    }

    // add remaining refinements
    if (origRefinements.length) {
      uri.query = origRefinements
        .sort((lhs, rhs) => lhs.navigationName.localeCompare(rhs.navigationName))
        .map(this.stringifyRefinement)
        .join('~');
    }

    let url = `/${uri.path.map((path) => encodeURIComponent(path)).join('/')}`;
    if (this.config.suffix) url += `/${this.config.suffix.replace(/^\/+/, '')}`;
    if (uri.query) url += `?${this.config.extraRefinementsParam}=${encodeURIComponent(uri.query)}`;

    return url.replace(/\s|%20/g, '+');
  }

  private generateRefinementMap(refinements: SelectedRefinement[]): { map: any, keys: string[] } {
    let refinementMap = {};
    let refinementKeys = [];
    for (let mapping of this.config.refinementMapping) {
      let key = Object.keys(mapping)[0];
      let matchingRefinements = refinements.filter((refinement) => refinement.navigationName === mapping[key]);
      if (matchingRefinements.length) {
        refinementKeys.push(key);
        refinementMap[key] = matchingRefinements;
        matchingRefinements.forEach((ref) => refinements.splice(refinements.indexOf(ref), 1));
      }
    }
    return { map: refinementMap, keys: refinementKeys };
  }

  private convertRefinement(refinement: SelectedRefinement): string {
    if (refinement.type === 'Value') {
      return (<SelectedValueRefinement>refinement).value;
    } else {
      throw new Error('cannot map range refinements');
    }
  }

  private stringifyRefinement(refinement: SelectedRefinement): string {
    let name = refinement.navigationName;
    if (refinement.type === 'Value') {
      return `${name}=${(<SelectedValueRefinement>refinement).value}`;
    } else {
      return `${name}:${(<SelectedRangeRefinement>refinement).low}..${(<SelectedRangeRefinement>refinement).high}`;
    }
  }
}

export class UrlParser {

  config: BeautifierConfig;
  suffixRegex: RegExp;

  constructor({ config }: UrlBeautifier) {
    this.config = config;
    this.suffixRegex = new RegExp(`^${this.config.suffix}`);
  }

  parse(rawUrl: string): Query {
    const url = URI.parse(rawUrl);
    const paths = url.path.split('/').filter((val) => val);

    if (paths[paths.length - 1] === this.config.suffix) paths.pop();

    const keys = (paths.pop() || '').split('');
    const map = this.generateRefinementMapping();
    const query = new Query();

    if (paths.length !== keys.length) throw new Error('token reference is invalid');

    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === this.config.queryToken) {
        query.withQuery(this.decode(paths[i]));
      } else {
        query.withSelectedRefinements(...this.extractRefinements(paths[i], map[keys[i]]));
      }
    }

    const unmappedRefinements = URI.parseQuery(url.query)[this.config.extraRefinementsParam];
    if (unmappedRefinements) query.withSelectedRefinements(...this.extractUnmapped(unmappedRefinements));

    return query;
  }

  private generateRefinementMapping() {
    return this.config.refinementMapping.reduce((map, mapping) => Object.assign(map, mapping), {});
  }

  private extractRefinements(refinementString: string, navigationName: string): SelectedValueRefinement[] {
    const refinementStrings = refinementString.split('~');

    return <SelectedValueRefinement[]>refinementStrings.map((value) => ({ navigationName, type: 'Value', value: this.decode(value) }));
  }

  private extractUnmapped(refinementString: string): Array<SelectedValueRefinement | SelectedRangeRefinement> {
    const refinementStrings = refinementString.split('~');
    return refinementStrings
      .map(this.decode)
      .map((refinement) => {
        const [navigationName, value] = refinement.split(/=|:/);
        if (value.indexOf('..') >= 0) {
          const [low, high] = value.split('..');
          return <SelectedRangeRefinement>{ navigationName, low: Number(low), high: Number(high), type: 'Range' }
        } else {
          return <SelectedValueRefinement>{ navigationName, value, type: 'Value' };
        }
      });
  }

  private decode(value: string): string {
    return decodeURIComponent(value.replace('+', ' '));
  }
}

export interface BeautifierConfig {
  refinementMapping?: any[];
  extraRefinementsParam?: string;
  queryToken?: string;
  suffix?: string;
}
