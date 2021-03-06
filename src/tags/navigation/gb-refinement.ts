import { displayRefinement } from '../../utils';
import { FluxTag } from '../tag';

export interface Refinement extends FluxTag { }

export class Refinement {

  ref: any;
  nav: any;
  toView: typeof displayRefinement;

  init() {
    this._scopeTo('gb-navigation');
    this.toView = displayRefinement;
  }
}

export class AvailableRefinement extends Refinement {
  send() {
    return this._scope.send(this.ref, this.nav);
  }
}

export class SelectedRefinement extends Refinement {
  remove() {
    return this._scope.remove(this.ref, this.nav);
  }
}
