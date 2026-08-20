import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

export const metadata: Metadata = {
  title: 'Install EasySplit — Add to Home Screen',
  description: 'Install EasySplit as a PWA directly from your browser. No App Store needed. Works on iPhone (Safari) and Android (Chrome).',
}

const iphoneSteps = [
  { icon: '🌐', step: 'Open easysplit.com.au in Safari', note: 'Must use Safari, not Chrome or Firefox' },
  { icon: '📤', step: 'Tap the Share button', note: 'The box with an arrow pointing up in the bottom toolbar' },
  { icon: '➕', step: 'Tap "Add to Home Screen"', note: 'Scroll down in the share sheet to find it' },
  { icon: '✅', step: 'Tap Add', note: 'EasySplit will appear on your home screen like a native app' },
]

const androidSteps = [
  { icon: '🌐', step: 'Open easysplit.com.au in Chrome', note: 'Must use Chrome, not Samsung Internet or Firefox' },
  { icon: '⋮', step: 'Tap the menu (three dots)', note: 'Top right corner of Chrome' },
  { icon: '➕', step: 'Tap "Add to Home Screen"', note: 'Or Chrome may show a banner at the bottom automatically' },
  { icon: '✅', step: 'Tap Add', note: 'EasySplit will appear in your app drawer and home screen' },
]

export default function DownloadPage() {
  return (
    <div className="min-h-screen">
      <MarketingNav />

      <div className="pt-24 pb-16 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            Install EasySplit on your phone
          </h1>
          <p className="text-xl text-slate-500 mt-4 leading-relaxed">
            No App Store. No Play Store. Install directly from your browser in two taps.
          </p>
        </div>
      </div>

      <div className="bg-white pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* iPhone */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl">🍎</div>
                <h2 className="text-2xl font-bold text-slate-900">iPhone</h2>
              </div>
              <div className="space-y-4">
                {iphoneSteps.map(({ icon, step, note }, i) => (
                  <div key={i} className="flex gap-4 bg-slate-50 rounded-2xl p-5">
                    <div className="text-xl flex-shrink-0 w-8 text-center">{icon}</div>
                    <div>
                      <p className="font-semibold text-slate-900">{step}</p>
                      <p className="text-sm text-slate-500 mt-1">{note}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mockup */}
              <div className="mt-8 bg-slate-900 rounded-2xl p-5">
                <div className="bg-white rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2 flex items-center gap-2">
                    <div className="flex-1 bg-white rounded-lg px-3 py-1.5 text-xs text-slate-400 text-center">
                      easysplit.com.au
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="h-24 bg-teal-50 rounded-xl flex items-center justify-center mb-3">
                      <span className="text-teal-600 font-semibold text-sm">EasySplit</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 px-4 py-3 bg-slate-50">
                    <div className="flex justify-around">
                      <span className="text-xs text-slate-400">⬅</span>
                      <span className="text-xs text-teal-600 font-semibold">📤 Share</span>
                      <span className="text-xs text-slate-400">⬡</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Android */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl">🤖</div>
                <h2 className="text-2xl font-bold text-slate-900">Android</h2>
              </div>
              <div className="space-y-4">
                {androidSteps.map(({ icon, step, note }, i) => (
                  <div key={i} className="flex gap-4 bg-slate-50 rounded-2xl p-5">
                    <div className="text-xl flex-shrink-0 w-8 text-center">{icon}</div>
                    <div>
                      <p className="font-semibold text-slate-900">{step}</p>
                      <p className="text-sm text-slate-500 mt-1">{note}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mockup */}
              <div className="mt-8 bg-slate-900 rounded-2xl p-5">
                <div className="bg-white rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2 flex items-center gap-2">
                    <div className="flex-1 bg-white rounded-lg px-3 py-1.5 text-xs text-slate-400 text-center">
                      easysplit.com.au
                    </div>
                    <span className="text-slate-400 font-bold">⋮</span>
                  </div>
                  <div className="p-4">
                    <div className="h-24 bg-teal-50 rounded-xl flex items-center justify-center mb-3">
                      <span className="text-teal-600 font-semibold text-sm">EasySplit</span>
                    </div>
                    <div className="bg-teal-500 rounded-xl py-2 text-center">
                      <span className="text-white text-xs font-semibold">Add to Home screen</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why PWA */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Why a PWA instead of an app?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: '⚡',
                title: 'Instant updates',
                desc: 'No waiting for App Store approval. Updates ship the moment we push them.',
              },
              {
                icon: '📱',
                title: 'Same experience',
                desc: 'Works offline, sends notifications, and feels like a native app on your home screen.',
              },
              {
                icon: '🔒',
                title: 'No account required',
                desc: 'Use it without an account. No App Store sign-in, no permissions to grant.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-slate-100 text-center">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-teal-600 py-16 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Or just use it in your browser</h2>
          <p className="opacity-80 text-lg mb-8">No install required. Works on any device with a modern browser.</p>
          <Link
            href="/app"
            className="inline-block bg-white text-teal-600 font-semibold rounded-full px-8 py-4 text-lg hover:bg-teal-50 transition-colors"
          >
            Open EasySplit in browser
          </Link>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}
