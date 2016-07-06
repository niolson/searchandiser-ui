searchandiser({
  customerId: 'golfsmith',
  pageSize: 20,
  pageSizes: [10, 25, 50],

  structure: {
    title: 'title',
    image: 'Image_URL',
    price: 'Regular_Price',
    manufacturer: 'Mfr_Name',
    salePrice: 'Sale_Price',
    buyUrl: 'Buy_URL' 
  },
  sayt: {
  products: 12,
  queries: 8,
  // autoSearch: false,
  // highlight: false,
  categoryField: 'QtopRatedType',
  navigationNames: {
  brand: 'Brand'
  },
  allowedNavigations: ['brand']
  },
  stylish: false
});

searchandiser.search('');


searchandiser.attach('raw-results', '#ctl00_wpm_SearchPage_ctl09_ProductList');
searchandiser.attach('raw-query', '#ctl00_wpm_SearchPage_ctl04_SearchPhrase', {
    autoSearch: false
});
searchandiser.attach('available-navigation', '.searchFilterBody');