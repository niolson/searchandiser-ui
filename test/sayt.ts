/// <reference path="../typings/index.d.ts" />

import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mockFlux } from './fixtures';
import '../src/tags/sayt/gb-sayt.tag';

const TAG = 'gb-sayt';

describe('gb-sayt tag???????', () => {
  let html: Element;
  beforeEach(() => document.body.appendChild(html = document.createElement(TAG)));
  afterEach(() => document.body.removeChild(html));

  it('mounts tag????????', () => {
    // console.log('test');
    const tag = mount();
    // console.log(tag);
    expect(tag).to.be.ok;
    expect(html.querySelector(`div.${TAG}`)).to.be.ok;
  });

});

function mount(options: any = {}): Riot.Tag.Instance {
  return riot.mount('gb-sayt-target', { flux: mockFlux(options) })[0];
}