import { useState } from "react";
import PublicLayout from "@/components/public/PublicLayout";
import { Reveal } from "@/components/public/Reveal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { appDownload } from "@/lib/api";
import { LANG } from "@/lib/language";

type DownloadLinks = {
  message: string;
  androidUrl: string | null;
  iosUrl: string | null;
};

const infoItems = [
  {
    title: LANG.public.downloadAndroidTitle,
    hint: LANG.public.downloadAndroidHint,
  },
  {
    title: LANG.public.downloadIosTitle,
    hint: LANG.public.downloadIosHint,
  },
];

export default function Download() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [links, setLinks] = useState<DownloadLinks | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await appDownload.request({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone,
      });
      setLinks(result);
      toast({
        title: LANG.toast.downloadReady,
        description: result.message || LANG.toast.downloadReadyDescription,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : LANG.common.error;
      toast({
        title: LANG.common.error,
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-emerald-50/40 to-white py-20">
        <div className="container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="text-emerald-700 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
                {LANG.public.downloadEyebrow}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-4">
                {LANG.public.downloadTitle}
              </h1>
              <p className="text-neutral-600 text-lg">{LANG.public.downloadSubtitle}</p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-4 lg:col-span-1">
              {infoItems.map((item, i) => (
                <Reveal key={item.title} delay={i * 80}>
                  <Card className="p-5 border-0 shadow-md flex items-start gap-4 rounded-2xl">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center shrink-0">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">{item.title}</div>
                      <p className="text-sm text-neutral-500 mt-1">{item.hint}</p>
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>

            <Reveal delay={150} className="lg:col-span-2">
              <Card className="p-8 border-0 shadow-md rounded-2xl">
                {links ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900">
                        {LANG.toast.downloadReady}
                      </h2>
                      <p className="text-neutral-600 mt-2">
                        {links.message || LANG.toast.downloadReadyDescription}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {links.androidUrl && (
                        <a href={links.androidUrl} rel="noopener noreferrer">
                          <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 h-12 font-semibold shadow-lg shadow-orange-500/30">
                            {LANG.public.downloadAndroidButton}
                          </Button>
                        </a>
                      )}
                      {links.iosUrl && (
                        <a href={links.iosUrl} rel="noopener noreferrer">
                          <Button
                            variant="outline"
                            className="rounded-full px-8 h-12 font-semibold"
                          >
                            {LANG.public.downloadIosButton}
                          </Button>
                        </a>
                      )}
                    </div>
                    <button
                      type="button"
                      className="text-sm text-emerald-700 hover:underline"
                      onClick={() => setLinks(null)}
                    >
                      {LANG.public.downloadAgain}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{LANG.common.name}</Label>
                        <Input
                          id="name"
                          required
                          maxLength={120}
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{LANG.common.email}</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          maxLength={254}
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 max-w-sm">
                      <Label htmlFor="phone">{LANG.common.phone}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        required
                        pattern="[0-9]{10}"
                        maxLength={10}
                        placeholder={LANG.public.downloadPhoneHint}
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                        }
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 h-12 font-semibold shadow-lg shadow-orange-500/30"
                    >
                      {submitting ? LANG.common.submitting : LANG.public.downloadSubmit}
                    </Button>
                  </form>
                )}
              </Card>
            </Reveal>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
