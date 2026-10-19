import PublicLayout from "@/components/public/PublicLayout";
import { Reveal } from "@/components/public/Reveal";
import { Link } from "react-router-dom";

const sections: { title: string; body: string[] }[] = [
  {
    title: "1. Who we are",
    body: [
      "Trinity Arrows (“we”, “us”, “our”) provides the Trinity Arrows member application and related web services for registered members to view packages, wallet activity, and payout requests.",
      "Contact: support@trinityarrows.com · Website: https://trinityarrows.com",
    ],
  },
  {
    title: "2. Information we collect",
    body: [
      "Account details: name, email, phone number, username, and authentication credentials.",
      "KYC / payout details: bank account information, IFSC, and documents you upload (such as PAN) when required for verification or payouts.",
      "Device and app data: device push notification tokens, app version, and basic diagnostic logs needed to operate the service.",
      "Optional profile photo you choose to upload on your device.",
      "Biometric or device-lock data is processed on your device by the operating system for app unlock; we do not receive your fingerprint or Face ID templates.",
    ],
  },
  {
    title: "3. How we use information",
    body: [
      "To create and secure your account, and to provide member features (packages, wallet, payouts, profile).",
      "To verify bank/KYC details and process payout or redemption requests.",
      "To send transactional notifications (email and push) about account, package, wallet, and payout events.",
      "To maintain security, prevent fraud, and improve reliability of the service.",
      "We do not sell your personal information.",
    ],
  },
  {
    title: "4. Sharing",
    body: [
      "Service providers that help us host the app, send email/push notifications, or store files, under appropriate contracts.",
      "Authorities when required by applicable law.",
      "We do not share your data with third parties for their independent marketing.",
    ],
  },
  {
    title: "5. Retention",
    body: [
      "We retain account and transaction records for as long as your membership is active and as needed to meet legal, accounting, and dispute-resolution requirements. You may request deletion subject to those obligations.",
    ],
  },
  {
    title: "6. Security",
    body: [
      "We use industry-standard measures including HTTPS encryption in transit and access controls. No method of transmission or storage is 100% secure.",
    ],
  },
  {
    title: "7. Your choices",
    body: [
      "You can update profile and bank details in the app or web portal where available.",
      "You can disable push notifications in your device settings.",
      "You can contact us to request access, correction, or deletion of personal data where applicable law allows.",
    ],
  },
  {
    title: "8. Children",
    body: [
      "The service is intended for adults who are eligible members. It is not directed to children under 18.",
    ],
  },
  {
    title: "9. Changes",
    body: [
      "We may update this Privacy Policy from time to time. The “Last updated” date at the top of this page will change when we do. Continued use of the service after changes means you accept the updated policy.",
    ],
  },
  {
    title: "10. Contact",
    body: [
      "Questions about privacy: support@trinityarrows.com or via our Contact page.",
    ],
  },
];

export default function Privacy() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-emerald-50/40 to-white py-20">
        <div className="container max-w-3xl">
          <Reveal>
            <p className="text-emerald-700 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
              Legal
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-3">Privacy Policy</h1>
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
            <Link to="/terms" className="text-emerald-700 hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
