// config.js

// SKUs for screen elements except for screen size
const elementSKUs = {
    frameColor: {
        Gray: 'G',
        Bronze: 'B',
        White: 'W',
    },
    frameType: {
        '5/16 - Box': '5',
        '3/8 - Box': '3',
        '7/16 - Box': '7',
        '7/16 - Lip': 'L',
    },
    splineType: {
        'Gray': 'G',
        'Black': 'B',
    }
};

// Prices for screen types and sizes
const sizePrices = {
    Box: {
        '48': 24.99,
        '72': 34.99,
        '108': 44.99,
        '132': 69.99,
    },
    Lip: {
        '48': 27.99,
        '72': 39.99,
        '108': 49.99,
        '132': 79.99,
    },
};

// Screen Pricing
const screenPricing = [

    {
        label: 'Gray - 24" (633516)',
        sku: '633516',
        price: 1.49,
        description: 'Gray - 24"'
    },
    {
        label: 'Gray - 28" (633613)',
        sku: '633613',
        price: 1.99,
        description: 'Gray - 28"'
    },
    {
        label: 'Gray - 30" (633710)',
        sku: '633710',
        price: 1.99,
        description: 'Gray - 30"'
    },
    {
        label: 'Gray - 32" (633817)',
        sku: '633817',
        price: 1.99,
        description: 'Gray - 32"'
    },
    {
        label: 'Gray - 36" (634010)',
        sku: '634010',
        price: 2.29,
        description: 'Gray - 36"'
    },
    {
        label: 'Gray - 48" (634311)',
        sku: '634311',
        price: 2.49,
        description: 'Gray - 48"'
    },
    {
        label: 'Gray - 60" (634418)',
        sku: '634418',
        price: 2.99,
        description: 'Gray - 60"'
    },
    {
        label: 'Charcoal - 36" (599809)',
        sku: '599809',
        price: 2.29,
        description: 'Charcoal - 36"'
    },
    {
        label: 'Charcoal - 48" (634324)',
        sku: '634324',
        price: 2.49,
        description: 'Charcoal - 48"'
    },
    {
        label: 'Charcoal - 60" (115133)',
        sku: '115133',
        price: 2.99,
        description: 'Charcoal - 60"'
    }
]

const splinePricing = [

    {
        label: 'Black - .115" (153479)',
        sku: '153479',
        price: 0.49,
        description: 'Black - .115"'
    },
    {
        label: 'Black - .135" (729310)',
        sku: '729310',
        price: 0.49,
        description: 'Black - .135"'
    },
    {
        label: 'Black - .145" (158530)',
        sku: '158530',
        price: 0.49,
        description: 'Black - .145"'
    },
    {
        label: 'Black - .165" (155777)',
        sku: '155777',
        price: 0.49,
        description: 'Black - .165"'
    },
    {
        label: 'Black - .185" (268402)',
        sku: '268402',
        price: 0.49,
        description: 'Black - .185"'
    },
    {
        label: 'Black - 7/32" (155780)',
        sku: '155780',
        price: 0.49,
        description: 'Black - 7/32"'
    },
    {
        label: 'Black - 15/64" (155793)',
        sku: '155793',
        price: 0.49,
        description: 'Black - 15/64"'
    },
    {
        label: 'Gray - .135" (153481)',
        sku: '153481',
        price: 0.49,
        description: 'Gray - .135"'
    },
    {
        label: 'Gray - .185" (153478)',
        sku: '153478',
        price: 0.49,
        description: 'Gray - .185"'
    }
]

const spreaderBarPricing = {
    'White': {
        sku: 140627,
        price: 9.99
    },
    'Bronze': {
        sku: 268046,
        price: 9.99
    },
    'Gray': {
        sku: 268800,
        price: 9.99
    }
}

const pullTabPricing = [
        {
            label: 'Loop Pull Tab - Clear (173020)',
            sku: 173020,
            price: 1.49,
            description: 'Loop Pull Tabs - Clear'
        },
        {
            label: 'Pull Tab - Plastic - Black (358671)',
            sku: 358671,
            price: 0.59,
            description: 'Pull Tabs - Plastic - Black'
        }
]

const springPricing = [
    {
        label: 'Tension Spring (410932)',
        sku: 410932,
        price: 0.59,
        description: 'Tension Springs'
    },
]

const spreaderBarClip = [
    {
        label: 'Spreader Bar Clip (268907)',
        sku: 268907,
        price: 0.49,
        description: 'Spreader Bar Clips'
    },
]

const clipSprings = [
    {
        label: 'Clip Spring (268305)',
        sku: 268305,
        price: 1.29,
        description: 'Clip Springs'
    },
]

const screenClips = [
    {
        label: 'Screen Clip - 1/16" - (267908)',
        sku: 267908,
        price: 0.99,
        description: 'Screen Clips - 1/16"'
    },
    {
        label: 'Screen Clip - 3/16" - (176633)',
        sku: 176633,
        price: 0.99,
        description: 'Screen Clips - 3/16"'
    },
    {
        label: 'Screen Clip - 5/16" - (268101)',
        sku: 268101,
        price: 0.99,
        description: 'Screen Clips - 5/16"'
    },
    {
        label: 'Screen Clip - 7/16" - (268208)',
        sku: 268208,
        price: 0.99,
        description: 'Screen Clips - 7/16"'
    }
]

const hawaiiTaxRate = 0.045;

export { elementSKUs, sizePrices, screenPricing, splinePricing, spreaderBarPricing, pullTabPricing, springPricing, spreaderBarClip, clipSprings, screenClips, hawaiiTaxRate };
