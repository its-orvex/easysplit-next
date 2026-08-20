import type { Metadata } from 'next'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How EasySplit collects, uses, and protects your personal information under Australian privacy law.',
}

const sections = [
  {
    title: 'Introduction',
    content: 'EasySplit is committed to protecting your privacy. This policy explains what information we collect, how we use it, and your rights under the Australian Privacy Act 1988.',
  },
  {
    title: 'What we collect',
    content: 'We collect your email address when you create an account, the trip names and expense data you enter, and basic usage data to improve the app. We do not collect your banking credentials or account numbers — PayID settlement works by pre-filling your banking app, and EasySplit never sees the actual transfer.',
  },
  {
    title: 'How we use your information',
    content: 'We use your data solely to provide the app\'s functionality — syncing your trips across devices, notifying group members about expenses, and improving the app based on aggregate usage patterns. We never use your data for advertising.',
  },
  {
    title: 'Infrastructure and security',
    content: 'EasySplit uses Google Firebase for data storage, hosted in Australian regions where possible. Data is encrypted in transit (HTTPS) and at rest. We follow security best practices including access controls and regular audits.',
  },
  {
    title: 'Third parties',
    content: 'We do not sell your data to third parties. We do not use third-party advertising networks. Firebase is Google\'s infrastructure product and is governed by Google\'s privacy policies. We use no other third-party data processors.',
  },
  {
    title: 'Your rights',
    content: 'Under the Australian Privacy Act 1988, you have the right to access the personal information we hold about you, correct inaccurate information, and request deletion of your data. To exercise these rights, email privacy@easysplit.com.au.',
  },
  {
    title: 'Data retention',
    content: 'We retain your trip data for as long as your account is active. When you delete your account, all associated data is permanently deleted within 30 days.',
  },
  {
    title: 'Changes to this policy',
    content: 'We may update this policy occasionally. We\'ll notify you by email if we make significant changes.',
  },
  {
    title: 'Contact',
    content: 'Questions about privacy? Email privacy@easysplit.com.au.',
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <MarketingNav />

      <div className="pt-24 pb-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: May 2025</p>
        </div>
      </div>

      <div className="bg-white pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-10">
            {sections.map(({ title, content }) => (
              <div key={title}>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{title}</h2>
                <p className="text-slate-500 leading-relaxed">{content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}
