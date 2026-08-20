import type { Metadata } from 'next'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'EasySplit\'s terms of service — governing law is New South Wales, Australia.',
}

const sections = [
  {
    title: 'About EasySplit',
    content: 'EasySplit is a bill-splitting app operated from New South Wales, Australia. By using EasySplit, you agree to these terms.',
  },
  {
    title: 'Free to use',
    content: 'Expense tracking is free. When transaction settlement via EasySplit Pay launches, a fee of approximately 1.5% will apply to transactions. Expense tracking will remain free forever.',
  },
  {
    title: 'Your responsibilities',
    content: 'Be accurate with expense amounts. Don\'t use EasySplit for illegal activity. Respect other group members\' data and don\'t share trip access codes publicly.',
  },
  {
    title: 'Your data',
    content: 'You own your data. We store it on your behalf to provide the service. We don\'t claim ownership of anything you enter into EasySplit.',
  },
  {
    title: 'No warranty',
    content: 'EasySplit is provided as-is. While we work hard to keep it reliable, we can\'t guarantee 100% uptime. We\'re not liable for losses arising from app downtime or calculation errors — always double-check important financial figures.',
  },
  {
    title: 'Limitation of liability',
    content: 'To the extent permitted by Australian law, EasySplit\'s liability is limited to the amount you\'ve paid us in the past 12 months (which for free users is $0, but we\'re still here to help).',
  },
  {
    title: 'Governing law',
    content: 'These terms are governed by the laws of New South Wales, Australia. Any disputes will be handled in NSW courts.',
  },
  {
    title: 'Changes',
    content: 'We may update these terms. We\'ll notify you by email for significant changes.',
  },
  {
    title: 'Contact',
    content: 'Questions? Email legal@easysplit.com.au.',
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <MarketingNav />

      <div className="pt-24 pb-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Terms of Service</h1>
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
