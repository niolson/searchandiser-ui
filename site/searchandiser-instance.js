searchandiser({
    customerId: 'schoolspecialty',
    collection: 'schoolspecialty1products10206',
    pageSize: 20,
    structure: {
        title: 'title',
        description: 'description',
        itemNum: 'ITEM_NUMBER',
        image: 'PRIMARY_IMAGE_ID',
        listPrice: 'Tier1_PRICE',
        webPrice: 'Tier2_PRICE',
        productLink: 'PRODUCT_LINK',
        freeShippingEligible: 'FREE_SHIPPING_ELIGIBLE',
        taxonomyLevel1: 'TAXONOMY_LEV1',
        taxonomyLevel2: 'TAXONOMY_LEV2',
        taxonomyLevel3: 'TAXONOMY_LEV3',
        //Pens
        brand: 'Brand',
        features: 'FEATURES',
        gradeLevel: 'Grade_Level',
        sellingUom: 'Selling_UOM',
        shipMethod: 'Ship_Method',
        invoiceDescription: 'EBS_DESCRIPTION',
        certifications: 'Certifications',
        allergens: 'Allergens',
        color: 'Color',
        pencilLeadDiameter: 'Pencil_Lead_Diameter',
        //Table
        environmentallyFriendly: 'Environmentally_Friendly',
        safety: 'Safety',
        frameMaterial: 'Frame_Material',
        productDimensions: 'Product_Dimensions',
        productLength: 'Product_Length',
        productHeight: 'Product_Height',
        productWidth: 'Product_Width',
        vinylColor: 'Vinyl_Color', // test case has a bug here....
        weightCapacity: 'Weight_Capacity',
        //Ball
        diameter: 'Diameter',
        material: 'Material'
    },
    sayt: {
        products: 4,
        queries: 5
    },
    stylish: false
});

searchandiser.search('');

searchandiser.attach('raw-query', '#searchText', {
    autoSearch: true
});

searchandiser.attach('results', 'div.grid.margin-top10');

searchandiser.attach('paging', 'ul.paging', {
    showPages: true
});

$('.gb-paging__link.first').text('1');
// Rename "LAST" to number of last page
searchandiser.flux.on(searchandiser.flux.RESULTS,
        () => {
            const totalNoPages = searchandiser.flux.page.total + 1;
            $('.gb-paging__link.last').text(totalNoPages);

            /*
            Hide FIRST if 1 is present.
            Hide LAST if last page is present.
            Hide PREV if on first page.
            Hide NEXT if on last page.
            */

            $('ul.gb-paging__pages a').each((index, element) => {
                if ($(element).text() == '1' || $(element).text() == totalNoPages) {
                    $(element).addClass('school-specialty-hidden-paging-link');
                    return false;
                }
            });



        });
