<gb-sayt>
  <div class="gb-sayt { opts.style() }" name="saytNode" if={ queries }>
    <ul class="gb-sayt__autocomplete" name="autocompleteList">
      <li class="gb-autocomplete__item" each={ query in categoryResults } data-value={ query.value } data-refinement={ query.category } data-field={ categoryField }>
        <a class="gb-autocomplete__link" href="#" onclick={ searchCategory }>
          <raw content={ enhanceCategoryQuery(query) }></raw>
        </a>
      </li>
      <div if={ queries && categoryResults.length } class="gb-autocomplete__divider"></div>
      <li class="gb-autocomplete__item" each={ queries } data-value={ value }>
        <a class="gb-autocomplete__link" href="#" onclick={ search }>
          <raw content={ enhanceQuery(value) }></raw>
        </a>
      </li>
      <div if={ queries && navigations } class="gb-autocomplete__divider"></div>
      <virtual each={ navigations }>
        <h4 class="gb-navigation__title">{ displayName }</h4>
        <li class="gb-autocomplete__item" each={ value in values } data-value="{ displayName }: { value }" data-refinement={ value } data-field={ name }>
          <a class="gb-autocomplete__link" href="#" onclick={ searchRefinement }>
            <raw content="{ enhanceQuery(value) }"></raw>
          </a>
        </li>
      </virtual>
    </ul>
    <ul if={ products } class="gb-sayt__products">
      <li each="{ products }">
        <gb-product></gb-product>
      </li>
    </ul>
  </div>

  <script>
    require('../gb-product.tag');
    require('../gb-raw.tag');
    const sayt = require('sayt');
    const autocomplete = require('./autocomplete');
    const defaultConfig = {
      products: 4,
      queries: 5,
      autoSearch: true,
      highlight: true,
      navigationNames: {},
      allowedNavigations: []
    };
    const saytConfig = Object.assign(defaultConfig, opts.config.sayt);
    this.categoryField = saytConfig.categoryField;
    this.struct = Object.assign({}, opts.config.structure, { image: 'image_url' });

    sayt.configure({
      subdomain: opts.config.customerId,
      collection: opts.config.collection,
      autocomplete: { numSearchTerms: saytConfig.queries },
      productSearch: { area: opts.config.area, numProducts: saytConfig.products }
    });

    this.search = event => {
      let node = event.target;
      while(node.tagName !== 'LI') node = node.parentNode;
      opts.flux.rewrite(node.getAttribute('data-value'));
    };
    const refine = (node, query) => {
      while(node.tagName !== 'LI') node = node.parentNode;
      opts.flux.refine({ navigationName: node.getAttribute('data-field'), type: 'Value', value: node.getAttribute('data-refinement') })
        .then(() => opts.flux.rewrite(query))
    };
    this.searchRefinement = event => refine(event.target, '');
    this.searchCategory = event => refine(event.target, this.originalQuery);
    this.enhanceQuery = query => saytConfig.highlight ? query.replace(this.originalQuery, '<b>$&</b>') : query;
    this.enhanceCategoryQuery = query => {
      if (saytConfig.categoryField) {
        return `<b>${query.value}</b> in <span class="gb-category-query">${query.category}</span>`;
      } else {
        return query.value;
      }
    };

    const searchProducts = query => {
      if (saytConfig.products) {
        sayt.productSearch(query)
          .then(res => this.update({ products: res.result.products }));
      }
    };
    const notifier = query => {
      if (saytConfig.autoSearch) searchProducts(query);
      opts.flux.emit(opts.flux.REWRITE_QUERY, query);
    };
    this.on('before-mount', () => autocomplete.init(this.root, this.autocompleteList, notifier));

    const processResults = result => {
      let categories = [];
      if (result.searchTerms && result.searchTerms[0].value === this.originalQuery) {
        const categoryQuery = result.searchTerms[0];
        result.searchTerms.splice(0, 1);

        if (this.categoryField && categoryQuery.additionalInfo[this.categoryField]) {
          categories = categoryQuery.additionalInfo[this.categoryField]
            .map(value => ({ category: value, value: categoryQuery.value })).slice(0, 3);
          categories.unshift({ category: 'All Departments', value: categoryQuery.value });
        }
      }
      const navigations = result.navigations ? result.navigations
        .map(nav => Object.assign(nav, { displayName: saytConfig.navigationNames[nav.name] ? saytConfig.navigationNames[nav.name] : nav.name }))
        .filter(nav => saytConfig.allowedNavigations.includes(nav.name)) : [];
      this.update({ results: result, navigations, queries: result.searchTerms, categoryResults: categories });
    };
    opts.flux.on('autocomplete', query => sayt.autocomplete(query)
      .then(res => {
        this.update({ originalQuery: query });
        processResults(res.result);
        if (this.queries) searchProducts(this.queries[0].value);
      })
      .catch(err => console.error(err)));
    opts.flux.on('autocomplete:hide', () => {
      autocomplete.reset();
      this.update({ queries: null });
    });
  </script>

  <style scoped>
    .gb-stylish.gb-sayt {
      display: flex;
    }
    .gb-stylish ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .gb-stylish .gb-category-query {
      font-weight: bold;
      color: darkorange;
    }
    .gb-stylish .gb-autocomplete__divider {
      margin: 3px 10%;
      border-top: 1px solid #777;
    }
    .gb-stylish .gb-sayt__autocomplete {
      min-width: 210px;
    }
    .gb-stylish .gb-autocomplete__link {
      padding: 5px 15px;
      text-decoration: none;
      display: block;
    }
    .gb-stylish .gb-autocomplete__item:hover,
    .gb-stylish .gb-autocomplete__item.active {
      background-color: #f1f1f1;
    }
    .gb-stylish .gb-navigation__title {
      margin: 4px;
    }
    .gb-stylish .gb-sayt__products {
      min-width: 300px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      align-items: center;
    }
    .gb-stylish .gb-sayt__products .gb-product__image {
      vertical-align: bottom;
      width: 80px;
    }
    .gb-stylish .gb-sayt__products .gb-product__info-link {
      display: none;
    }
    .gb-stylish .gb-sayt__products .gb-product:hover {
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    }
  </style>
</gb-sayt>