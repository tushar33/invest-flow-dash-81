import { useState } from "react";
import PublicLayout from "@/components/public/PublicLayout";
import { Reveal } from "@/components/public/Reveal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { contact as contactApi } from "@/lib/api";
import { LANG } from "@/lib/language";

const contactItems = [
  { icon: Mail, label: LANG.common.email, value: LANG.public.contactEmail },
  { icon: MapPin, label: LANG.common.office, value: LANG.public.contactAddress },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await contactApi.submitInquiry(form);
      toast({
        title: LANG.toast.inquirySent,
        description: result.message || LANG.toast.inquirySentDescription,
      });
      setForm({ name: "", email: "", subject: "", message: "" });
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
                {LANG.public.contactUs}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-4">{LANG.public.getInTouchTitle}</h1>
              <p className="text-neutral-600 text-lg">
                {LANG.public.contactSubtitle}
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-4 lg:col-span-1">
              {contactItems.map((c, i) => (
                <Reveal key={c.label} delay={i * 80}>
                  <Card className="p-5 border-0 shadow-md flex items-start gap-4 rounded-2xl hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center shrink-0">
                      <c.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 uppercase tracking-wide mb-0.5">
                        {c.label}
                      </div>
                      <div className="font-semibold text-neutral-900">{c.value}</div>
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>

            <Reveal delay={150} className="lg:col-span-2">
              <Card className="p-8 border-0 shadow-md rounded-2xl">
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{LANG.common.name}</Label>
                      <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{LANG.common.email}</Label>
                      <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">{LANG.common.subject}</Label>
                    <Input id="subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">{LANG.common.message}</Label>
                    <Textarea id="message" rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 h-12 font-semibold shadow-lg shadow-orange-500/30"
                  >
                    {submitting ? LANG.common.submitting : LANG.common.sendInquiry}
                  </Button>
                </form>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
