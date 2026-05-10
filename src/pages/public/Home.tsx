import { Link } from "react-router-dom";
import PublicLayout from "@/components/public/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe, ShieldCheck, Truck, Leaf, ArrowRight } from "lucide-react";

const products = [
  { name: "Apples", emoji: "🍎" },
  { name: "Mangoes", emoji: "🥭" },
  { name: "Grapes", emoji: "🍇" },
  { name: "Oranges", emoji: "🍊" },
];

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-background to-orange-50" />
        <div className="container relative py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium mb-6">
              <Leaf className="w-3.5 h-3.5" /> Trusted by 200+ global partners
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
              Global Fruit Import & Export Solutions
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Delivering quality produce worldwide. Farm-fresh fruits sourced from the best orchards
              and shipped to your doorstep.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8">
                  Join Us <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  View Products
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-emerald-200 to-orange-200 p-8 flex items-center justify-center text-[12rem] shadow-2xl">
              🍎
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <div className="text-4xl">🥭</div>
              <div>
                <div className="font-bold">50+ Countries</div>
                <div className="text-xs text-muted-foreground">Export network</div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <div className="text-4xl">🍇</div>
              <div>
                <div className="font-bold">100% Fresh</div>
                <div className="text-xs text-muted-foreground">Quality assured</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="container py-20">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About FreshHarvest</h2>
          <p className="text-muted-foreground text-lg">
            With decades of expertise in agriculture trade, we connect growers and buyers across the
            globe — ensuring every fruit reaches you fresh, on time, and at the highest quality.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Globe, title: "Global Sourcing", desc: "Network spanning 50+ countries with trusted growers." },
            { icon: ShieldCheck, title: "Quality Assurance", desc: "Rigorous quality checks at every step of the supply chain." },
            { icon: Truck, title: "Reliable Logistics", desc: "Cold-chain shipping ensuring peak freshness on arrival." },
          ].map((f) => (
            <Card key={f.title} className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Products preview */}
      <section className="bg-muted/30 py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Products</h2>
            <p className="text-muted-foreground">Hand-picked fruits sourced from the finest orchards.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => (
              <Card key={p.name} className="p-8 text-center border-0 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="text-6xl mb-3">{p.emoji}</div>
                <h3 className="font-semibold text-lg">{p.name}</h3>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/products">
              <Button variant="outline" className="rounded-full px-8">
                View all products <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-800 p-12 md:p-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to grow with us?</h2>
          <p className="mb-8 opacity-90 max-w-xl mx-auto">
            Join our network of trusted partners and access fresh produce from around the world.
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-white text-emerald-700 hover:bg-white/90 rounded-full px-8">
              Join Us
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
