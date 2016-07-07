searchandiser({
    customerId: 'schoolspecialty',
    collection: 'schoolspecialty1products10206',
    area: 'Dev',
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

searchandiser.attach('available-navigation', '#search-page-facets div.facets div.section:nth-child(2)');