import PublicLayout from "@/components/public/PublicLayout";
import { Reveal } from "@/components/public/Reveal";
import { Link } from "react-router-dom";

const sections: { title: string; body: string[] }[] = [
  {
    title: "1. Agreement",
    body: [
      "These Terms of Service (“Terms”) govern your use of the Trinity Arrows member application, website, and related services (the “Service”). By creating an account or using the Service, you agree to these Terms.",
    ],
  },
  {
    title: "2. Eligibility",
    body: [
      "You must be a registered member (or authorized administrator) and legally able to enter into this agreement. You are responsible for keeping your login credentials confidential.",
    ],
  },
  {
    title: "3. The Service",
    body: [
      "The Service lets members view assigned packages, wallet balances and history, submit or track payout/redemption requests, and manage profile and bank details.",
      "Package terms, ROI schedules, and payout eligibility are defined by your membership agreement with Trinity Arrows and by settings applied by administrators. The app displays those records; it does not itself create investment advice.",
    ],
  },
  {
    title: "4. Accurate information",
    body: [
      "You agree to provide accurate registration, bank, and KYC information, and to update it promptly. False or incomplete details may delay or block payouts.",
    ],
  },
  {
    title: "5. Acceptable use",
    body: [
      "You will not misuse the Service, attempt unauthorized access, interfere with other users, or use the Service for unlawful purposes.",
    ],
  },
  {
    title: "6. Notifications",
    body: [
      "We may send transactional emails and push notifications about account, package, wallet, and payout events. You can control push notifications in device settings.",
    ],
  },
  {
    title: "7. Intellectual property",
    body: [
      "Trinity Arrows branding, app software, and content remain our property or that of our licensors. You receive a limited license to use the Service for your membership only.",
    ],
  },
  {
    title: "8. Disclaimers",
    body: [
      "The Service is provided “as is”. To the fullest extent permitted by law, we disclaim warranties of uninterrupted availability or error-free operation.",
      "Displayed balances and schedules depend on backend records and administrative actions; contact support if you believe a figure is incorrect.",
    ],
  },
  {
    title: "9. Limitation of liability",
    body: [
      "To the fullest extent permitted by law, Trinity Arrows is not liable for indirect, incidental, or consequential damages arising from use of the Service. Our aggregate liability for claims relating to the Service is limited to fees (if any) you paid us for the Service in the three months before the claim.",
    ],
  },
  {
    title: "10. Termination",
    body: [
      "We may suspend or terminate access for breach of these Terms or for security reasons. You may stop using the Service at any time. Provisions that by nature should survive will survive termination.",
    ],
  },
  {
    title: "11. Changes",
    body: [
      "We may update these Terms. We will post the revised version with a new “Last updated” date. Continued use after changes constitutes acceptance.",
    ],
  },
  {
    title: "12. Contact",
    body: [
      "Questions: support@trinityarrows.com or https://trinityarrows.com/contact",
    ],
  },
];

export default function Terms() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-emerald-50/40 to-white py-20">
        <div className="container max-w-3xl">
          <Reveal>
            <p className="text-emerald-700 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
              Legal
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-3">
              Terms of Service
            </h1>
            <p className="text-neutral-500 mb-10">Last updated: 9 August 2026</p>
          </Reveal>

          <div className="space-y-8">
            {sections.map((s) => (
              <Reveal key={s.title}>
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 mb-3">{s.title}</h2>
                  {s.body.map((p) => (
                    <p key={p.slice(0, 40)} className="text-neutral-600 leading-relaxed mb-3">
                      {p}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-12 text-sm text-neutral-500">
            See also our{" "}
            <Link to="/privacy" className="text-emerald-700 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
