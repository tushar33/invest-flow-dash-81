import PublicLayout from "@/components/public/PublicLayout";
import { Reveal } from "@/components/public/Reveal";
import { Card } from "@/components/ui/card";
import { Globe2, Package, Snowflake, Truck, Network } from "lucide-react";

const services = [
  { icon: Globe2, title: "Import & Export", desc: "End-to-end international trade services with seamless customs handling and documentation." },
  { icon: Package, title: "Packaging", desc: "Custom packaging solutions designed to preserve freshness and showcase brand identity." },
  { icon: Snowflake, title: "Cold Storage", desc: "State-of-the-art temperature-controlled warehouses across key strategic locations." },
  { icon: Truck, title: "Logistics", desc: "Reliable cold-chain transport via sea, air, and road networks globally." },
  { icon: Network, title: "Distribution", desc: "Wide distribution network reaching retailers, wholesalers, and HoReCa channels." },
];

export default function Services() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-emerald-50/40 to-white py-20">
        <div className="container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="text-emerald-700 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
                What We Do
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-4">Export Services</h1>
              <p className="text-neutral-600 text-lg">
                Complete supply-chain solutions tailored for the fresh produce industry.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <Card className="group p-8 border-0 bg-gradient-to-br from-white to-emerald-50/50 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <s.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-neutral-900">{s.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{s.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
