import PublicLayout from "@/components/public/PublicLayout";
import { Reveal } from "@/components/public/Reveal";
import { Card } from "@/components/ui/card";
import { Globe2, Package, Snowflake, Truck, Network } from "lucide-react";
import { LANG } from "@/lib/language";

const serviceIcons = [Globe2, Package, Snowflake, Truck, Network];
const services = LANG.public.serviceItems.map((s, i) => ({ ...s, icon: serviceIcons[i] }));

export default function Services() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-emerald-50/40 to-white py-20">
        <div className="container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="text-emerald-700 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
                {LANG.public.whatWeDo}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-4">{LANG.public.exportServices}</h1>
              <p className="text-neutral-600 text-lg">
                {LANG.public.exportServicesDescription}
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
