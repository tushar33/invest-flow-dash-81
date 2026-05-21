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

const products = [
  { name: "Mangoes", img: mango, desc: "Premium Alphonso, Kesar, and Banganapalli varieties — sweet, aromatic, and export-grade." },
  { name: "Apples", img: apple, desc: "Crisp red and green apples sourced from premium orchards across Europe and Asia." },
  { name: "Grapes", img: grapes, desc: "Seedless green, red, and black grape varieties, vine-ripened to perfection." },
  { name: "Pomegranate", img: pomegranate, desc: "Ruby-red, antioxidant-rich pomegranates with sweet, juicy arils — export-grade Bhagwa variety." },
  { name: "Citrus Fruits", img: citrus, desc: "Vitamin-rich oranges, lemons, and mandarins from the finest groves worldwide." },
  { name: "Seasonal Produce", img: seasonal, desc: "Berries, stone fruits, melons, and more — fresh in every season." },
  { name: "Dry Fruits", img: dryfruits, desc: "Premium almonds, cashews, pistachios, walnuts, raisins, and dates — sourced and packed for global markets." },
];

export default function Products() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-emerald-50/40 to-white py-20">
        <div className="container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="text-emerald-700 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
                Our Catalog
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-4">Premium Produce</h1>
              <p className="text-neutral-600 text-lg">
                Hand-picked, quality-assured fruits sourced from the world's best growers.
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
