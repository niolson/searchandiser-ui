import { Query, SelectedRefinement, SelectedValueRefinement, SelectedRangeRefinement } from 'groupby-api';

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
      const refinementString = origRefinements.map(this.stringifyRefinement).join('~');
      uri.query = origRefinements.map(this.stringifyRefinement).join('~');
    }

    let url = `/${uri.path.map((path) => encodeURIComponent(path)).join('/')}`;
    if (uri.query) url += `?${this.config.extraRefinementsParam}=${encodeURIComponent(uri.query)}`;

    return url.replace(/\s|%20/, '+');
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

  constructor({ config }: UrlBeautifier) {
    this.config = config;
  }

  parse(url: string): Query {


    return null;
  }
}

export interface BeautifierConfig {
  refinementMapping?: any[];
  extraRefinementsParam?: string;
  queryToken?: string;
  suffix?: string;
}
