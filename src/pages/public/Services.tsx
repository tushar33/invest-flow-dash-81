import PublicLayout from "@/components/public/PublicLayout";
import { Card } from "@/components/ui/card";
import { Globe2, Package, Snowflake, Truck, Network } from "lucide-react";

const services = [
  { icon: Globe2, title: "Import & Export", desc: "End-to-end international trade services with seamless customs handling." },
  { icon: Package, title: "Packaging", desc: "Custom packaging solutions designed to preserve freshness and brand identity." },
  { icon: Snowflake, title: "Cold Storage", desc: "State-of-the-art temperature-controlled warehouses across key locations." },
  { icon: Truck, title: "Logistics", desc: "Reliable cold-chain transport via sea, air, and road globally." },
  { icon: Network, title: "Distribution", desc: "Wide distribution network reaching retailers, wholesalers, and HoReCa." },
];

export default function Services() {
  return (
    <PublicLayout>
      <section className="container py-16 md:py-24">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg text-muted-foreground">
            Complete supply-chain solutions tailored for the fresh produce industry.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <Card key={s.title} className="p-6 border-0 shadow-md hover:shadow-xl transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <s.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
