import { FluxTag } from '../tag';
import { Events, Record } from 'groupby-api';
import { getPath } from '../../utils'

export interface Results extends FluxTag {
  parent: Riot.Tag.Instance & { struct: any };
}

export class Results {

  records: Record[];
  struct: any;
  getPath: typeof getPath;

  init() {
    this.struct = this.parent ? this.parent.struct : this.config.structure;
    this.getPath = getPath;
    this.flux.on(Events.RESULTS, ({ records }) => this.updateRecords(records));
  }

  updateRecords(records) {
    this.update({ records });
  }

  userStyle(key: string) {
    return this.opts.css ? this.opts.css[key] : '';
  }
}
