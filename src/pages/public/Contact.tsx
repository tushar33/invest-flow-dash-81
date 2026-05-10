import { useState } from "react";
import PublicLayout from "@/components/public/PublicLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
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
      <section className="container py-16 md:py-24">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Have a question, inquiry, or partnership opportunity? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-4 lg:col-span-1">
            {[
              { icon: Mail, label: "Email", value: "info@freshharvest.com" },
              { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
              { icon: MapPin, label: "Office", value: "123 Trade Avenue, Mumbai, India" },
            ].map((c) => (
              <Card key={c.label} className="p-5 border-0 shadow-md flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <c.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">{c.label}</div>
                  <div className="font-medium">{c.value}</div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-8 border-0 shadow-md lg:col-span-2">
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
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8">
                Send Inquiry
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
