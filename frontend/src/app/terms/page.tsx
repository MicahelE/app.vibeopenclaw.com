import type { Metadata } from 'next';
import { MarketingShell, Breadcrumbs } from '@/components/marketing/Shell';
import { H2, P, JsonLd } from '@/components/marketing/blocks';
import { breadcrumbLd, jsonLd } from '@/components/marketing/schema';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.vibeopenclaw.com';
const PATH = '/terms';

export const metadata: Metadata = {
  title: 'Terms of Service | VibeOpenClaw',
  description: 'The terms that govern use of VibeOpenClaw’s managed AI agent hosting.',
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}${PATH}`,
    title: 'Terms of Service | VibeOpenClaw',
    description: 'The terms that govern use of VibeOpenClaw’s managed AI agent hosting.',
  },
};

export default function TermsPage() {
  return (
    <MarketingShell width={760}>
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Terms of Service' }]} />

      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>
          Terms of Service
        </h1>
        <p className="text-sm text-[#5a6480]">Last updated: July 23, 2026</p>
      </header>

      <P>
        These terms govern your use of VibeOpenClaw (&quot;the service&quot;), a managed hosting platform for
        OpenClaw and Hermes AI agents. By creating an account, you agree to them.
      </P>

      <H2>The service</H2>
      <P>
        VibeOpenClaw provisions and runs Docker-isolated containers on your behalf, running the OpenClaw or Hermes
        agent software you choose, and connects them to model providers and messaging channels you configure. We
        operate the infrastructure; we don&apos;t author or control the OpenClaw or Hermes open-source projects.
      </P>

      <H2>Accounts</H2>
      <P>
        You&apos;re responsible for the security of your account credentials and for all activity under your
        account. You must provide a valid email address and be legally able to enter into these terms.
      </P>

      <H2>Acceptable use</H2>
      <P>
        You may not use VibeOpenClaw to deploy agents for illegal activity, to send spam or abusive content through
        connected messaging channels, to attempt to access another user&apos;s agent or data, or to circumvent the
        resource limits of your plan. We may suspend or terminate accounts that violate this.
      </P>

      <H2>Bring your own keys</H2>
      <P>
        VibeOpenClaw uses a bring-your-own-key (BYOK) model: you supply your own model-provider API keys and
        messaging-channel tokens. You&apos;re responsible for your relationship with those providers, including
        their pricing, rate limits, and terms of service. We are not a party to your agreement with your model
        provider.
      </P>

      <H2>Billing</H2>
      <P>
        Subscriptions are billed monthly through our payment processor, Polar.sh. Plans renew automatically until
        cancelled. You can cancel at any time from your account; cancellation takes effect at the end of the
        current billing period.
      </P>

      <H2>Disclaimers &amp; limitation of liability</H2>
      <P>
        The service is provided &quot;as is,&quot; without warranties of any kind. To the maximum extent permitted
        by law, VibeOpenClaw is not liable for indirect, incidental, or consequential damages arising from your
        use of the service, including from the behavior of agents you deploy or the actions of third-party model
        providers or messaging platforms.
      </P>

      <H2>Changes to these terms</H2>
      <P>
        We may update these terms as the service evolves. Material changes will be reflected by updating the
        &quot;Last updated&quot; date above.
      </P>

      <H2>Contact</H2>
      <P>
        Questions about these terms:{' '}
        <a href="mailto:support@vibeopenclaw.com" className="text-[#00e5cc] hover:underline">support@vibeopenclaw.com</a>
      </P>

      <JsonLd
        data={jsonLd(
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Terms of Service', path: PATH }]),
        )}
      />
    </MarketingShell>
  );
}
