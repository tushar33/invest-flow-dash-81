import PublicLayout from "@/components/public/PublicLayout";
import { Card } from "@/components/ui/card";

const products = [
  { name: "Apples", emoji: "🍎", desc: "Crisp, juicy apples from premium orchards across Europe and Asia." },
  { name: "Mangoes", emoji: "🥭", desc: "The king of fruits — Alphonso, Kesar, and other premium varieties." },
  { name: "Grapes", emoji: "🍇", desc: "Sweet, seedless grapes available in green, red, and black varieties." },
  { name: "Oranges", emoji: "🍊", desc: "Vitamin-rich citrus sourced from the finest groves worldwide." },
  { name: "Seasonal Fruits", emoji: "🍓", desc: "Berries, stone fruits, melons, and more — fresh in every season." },
];

export default function Products() {
  return (
    <PublicLayout>
      <section className="container py-16 md:py-24">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-lg text-muted-foreground">
            Hand-picked, quality-assured fruits sourced from the world's best growers.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Card
              key={p.name}
              className="p-8 border-0 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="text-7xl mb-4">{p.emoji}</div>
              <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
