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

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Inquiry sent", description: "Thanks! We'll get back to you shortly." });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-emerald-50/40 to-white py-20">
        <div className="container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="text-emerald-700 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
                Contact Us
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-4">Get in Touch</h1>
              <p className="text-neutral-600 text-lg">
                Have an inquiry or partnership opportunity? We'd love to hear from you.
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-4 lg:col-span-1">
              {[
                { icon: Mail, label: "Email", value: "info@trinityarrows.com" },
                { icon: MapPin, label: "Office", value: "123 Trade Avenue, Mumbai, India" },
              ].map((c, i) => (
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
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  </div>
                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 h-12 font-semibold shadow-lg shadow-orange-500/30"
                  >
                    Send Inquiry
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
