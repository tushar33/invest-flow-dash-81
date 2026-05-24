import PublicLayout from "@/components/public/PublicLayout";
import { Reveal } from "@/components/public/Reveal";
import { Card } from "@/components/ui/card";
import mango from "@/assets/fruit-mango.jpg";
import apple from "@/assets/fruit-apple.jpg";
import grapes from "@/assets/fruit-grapes.jpg";
import citrus from "@/assets/fruit-citrus.jpg";
import pomegranate from "@/assets/fruit-pomegranate.jpg";
import seasonal from "@/assets/fruit-seasonal.jpg";
import dryfruits from "@/assets/fruit-dryfruits.jpg";
import { LANG } from "@/lib/language";

const productImages = [mango, apple, grapes, pomegranate, citrus, seasonal, dryfruits];
const products = LANG.public.catalogProducts.map((p, i) => ({ ...p, img: productImages[i] }));

export default function Products() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-emerald-50/40 to-white py-20">
        <div className="container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="text-emerald-700 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
                {LANG.public.ourCatalog}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-4">{LANG.public.premiumProduce}</h1>
              <p className="text-neutral-600 text-lg">
                {LANG.public.premiumProduceDescription}
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <Card className="group overflow-hidden border-0 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 rounded-2xl">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.name}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-neutral-900">{p.name}</h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
