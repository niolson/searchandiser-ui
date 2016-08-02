/// <reference path="../typings/index.d.ts" />

import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mockFlux } from './fixtures';
import '../src/tags/query/gb-raw-query.tag';

const TAG = 'gb-raw-query';
const ENTER_KEY = 13;

describe('gb-raw-query tag', () => {
  let html: HTMLInputElement;
  beforeEach(() => {
    document.body.appendChild(html = document.createElement('input'));
    html.type = 'text';
    html.value = 'original';
  });
  afterEach(() => document.body.removeChild(html));

  it('mounts tag', () => {
    const tag = mount();
    expect(tag).to.be.ok;
    expect(html).to.be.ok;
    expect(html.type).to.eq('text');
    expect(html.value).to.eq('original');
  });

  it('should register for rewrite_query', (done) => {
    mount({
      on: (event) => {
        expect(event).to.eq(Events.REWRITE_QUERY);
        done();
      }
    });
  });

  it('should rewrite query on rewrite_query', (done) => {
    mount({ on: (event, cb) => cb('rewritten') })
      .on('updated', () => {
        expect(html.value).to.eq('rewritten');
        done();
      });
  });

  it('should register for input', (done) => {
    sinon.stub(html, 'addEventListener', (event, cb) => {
      expect(event).to.eq('input');
      cb();
    });
    mount({
      reset: (query) => {
        expect(query).to.eq('original');
        done();
      }
    });
  });


  describe('redirect when autoSearch off', () => {
    beforeEach(() => sinon.stub(html, 'addEventListener', (event, cb) => {
      expect(event).to.eq('keydown');
      cb({ keyCode: 13 });
    }));

    it('should register for keydown', (done) => {
      sinon.stub(window.location, 'replace', (url) => {
        expect(url).to.eq('search?q=original');
        done();
      });
      mount({
        reset: (query) => {
          expect(query).to.eq('original');
          done();
        }
      }, { sayt: false, autoSearch: false });
    });

    it('should customise search URL', (done) => {
      sinon.stub(window.location, 'replace', (url) => {
        expect(url).to.eq('/productSearch?query=original');
        done();
      });
      mount({
        reset: (query) => {
          expect(query).to.eq('original');
          done();
        }
      }, { sayt: false, autoSearch: false, searchUrl: '/productSearch', queryParam: 'query' });
    });
  });

  it('should emit autocomplete when there is input', (done) => {
    //TODO: Mock out sayt object in gb-sayt.tag in order to emulate search results
    // That way we could check the appearance of search results in the DOM
    //For now, assume groupby/sayt and gb-sayt.tag work
    const flux = mockFlux({})
    flux.on('autocomplete', () => {
      done();
    });

    const tag = riot.mount('input', TAG, {
       flux: Object.assign(mockFlux({}), {
         emit: (eventName: string) => {
           if (eventName === 'autocomplete') {
             done();
           }
         }
       }),
       config: {
         sayt: {
           minimumCharacters: 1
         }
       }
    })[0];

    const searchBox:HTMLInputElement = <HTMLInputElement>(tag.root);
    searchBox.value = "foo";

    const inputEvent = document.createEvent("HTMLEvents");
    inputEvent.initEvent('input', true, false);
    searchBox.dispatchEvent(inputEvent);
  });

  it('should emit autocomplete:hide when enter is pressed', (done) => {
    const SAYT_MINIMUM_CHARACTERS = 1;
    let autocompleteHappened = false;

    const tag = riot.mount('input', TAG, {
       flux: Object.assign(mockFlux({}), {
         emit: (eventName: string) => {
           if (eventName === 'autocomplete') {
             autocompleteHappened = true;

             // Press Enter key
             const e = new Event('keydown');
             Object.assign(e, { keyCode: ENTER_KEY });
             document.querySelector('input').dispatchEvent(e);
           }
           else if (eventName === 'autocomplete:hide') {
             expect(autocompleteHappened).to.be.true;
             done();
           }
         }
       }),
       config: {
         sayt: {
           minimumCharacters: SAYT_MINIMUM_CHARACTERS
         }
       }
    })[0];
    const searchBox:HTMLInputElement = <HTMLInputElement>(tag.root);
    // Create a string of length (SAYT_MINIMUM_CHARACTERS + 1)
    searchBox.value = new Array((SAYT_MINIMUM_CHARACTERS+1)+1).join('@');

    const inputEvent = document.createEvent("HTMLEvents");
    inputEvent.initEvent('input', true, false);
    document.querySelector('input').dispatchEvent(inputEvent);
  });
});

function mount(options: any = {}, overrides: { sayt?: boolean, autoSearch?: boolean, searchUrl?: string, queryParam?: string } = { sayt: false }): Riot.Tag.Instance {
  return riot.mount('input', TAG, Object.assign({ flux: mockFlux(options) }, overrides))[0];
}
