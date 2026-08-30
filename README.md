# taxconv

A mobile-first CAD ($ CA) 🇨🇦 to EUR (€) 🇪🇺 converter that lets European travellers quickly include the general sales tax in Ontario, Quebec, or British Columbia before converting a price to euros.

## Why?

While I was shopping in Quebec, not being used to adding taxes to displayed prices, I found myself constantly adding taxes and then converting the total to euros. This app makes that calculation instant and now supports British Columbia, Ontario, and Quebec.

The app uses the general combined rates for most purchases: 12% in British Columbia, 13% in Ontario, and 14.975% in Quebec. Exemptions and product-specific rates are intentionally out of scope.

The default calculation uses the general rate. Tax can be switched off for tax-free or tax-inclusive prices. An explicit restaurant checkbox applies the meal rate and reveals an optional 15–20% pre-tax tip. A short province-specific note explains the most useful food exceptions.

## Development

Run `npm run dev` to serve the static files locally and `npm test` to check the tax calculations. Netlify serves the repository directly without a build step.
