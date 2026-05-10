import PublicLayout from "@/components/public/PublicLayout";
import { Card } from "@/components/ui/card";
import { Globe, ShieldCheck, Award, Users } from "lucide-react";

export default function About() {
  return (
    <PublicLayout>
      <section className="container py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About FreshHarvest</h1>
          <p className="text-lg text-muted-foreground mb-4">
            FreshHarvest is a leading global fruit import and export company connecting growers,
            distributors, and retailers across continents. With a foundation built on trust,
            quality, and reliability, we deliver the best of nature to markets worldwide.
          </p>
          <p className="text-lg text-muted-foreground">
            From sun-ripened mangoes in India to crisp apples from Europe, our network ensures
            every shipment arrives fresh, on time, and to specification.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <div className="aspect-video rounded-3xl bg-gradient-to-br from-emerald-200 to-orange-200 flex items-center justify-center text-9xl">
            🌍
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Global Network</h2>
            <p className="text-muted-foreground mb-4">
              We source from over 50 countries and supply to retailers, wholesalers, and food
              service providers across the world. Our extensive logistics partnerships ensure
              cold-chain integrity from farm to destination.
            </p>
            <p className="text-muted-foreground">
              Whether it's a single container or year-round programs, we deliver consistency.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mt-16">
          {[
            { icon: Globe, label: "50+ Countries" },
            { icon: Users, label: "200+ Partners" },
            { icon: Award, label: "ISO Certified" },
            { icon: ShieldCheck, label: "Quality Guaranteed" },
          ].map((s) => (
            <Card key={s.label} className="p-6 text-center border-0 shadow-md">
              <s.icon className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <div className="font-semibold">{s.label}</div>
            </Card>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
