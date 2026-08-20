// Replace with your Finder/Compare the Market affiliate link
// Earn $30-80 per signup — apply at finder.com.au/affiliates
export default function AffiliateBanner() {
  return (
    <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 rounded-2xl p-6">
      <p className="font-semibold text-slate-900 text-sm">Planning a trip?</p>
      <p className="text-slate-500 text-sm mt-1">Compare travel insurance and save.</p>
      <a
        href="https://www.finder.com.au/travel-insurance"
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-block mt-3 bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
      >
        Compare travel insurance →
      </a>
    </div>
  )
}
