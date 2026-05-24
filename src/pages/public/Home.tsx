import { Link } from "react-router-dom";
import PublicLayout from "@/components/public/PublicLayout";
import { Reveal } from "@/components/public/Reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Globe2,
  Package,
  Snowflake,
  Truck,
  Network,
  ShieldCheck,
  Award,
  Leaf,
  Quote,
  Star,
} from "lucide-react";
import heroImg from "@/assets/hero-fruits.jpg";
import mango from "@/assets/fruit-mango.jpg";
import apple from "@/assets/fruit-apple.jpg";
import grapes from "@/assets/fruit-grapes.jpg";
import citrus from "@/assets/fruit-citrus.jpg";
import pomegranate from "@/assets/fruit-pomegranate.jpg";
import seasonal from "@/assets/fruit-seasonal.jpg";
import dryfruits from "@/assets/fruit-dryfruits.jpg";
import { LANG } from "@/lib/language";

const productImages = [mango, apple, grapes, pomegranate, citrus, seasonal, dryfruits];
const products = LANG.public.featuredProducts.map((p, i) => ({ ...p, img: productImages[i] }));

const serviceIcons = [Globe2, Package, Snowflake, Truck, Network];
const services = LANG.public.serviceItemsShort.map((s, i) => ({ ...s, icon: serviceIcons[i] }));

const featureIcons = [ShieldCheck, Globe2, Award, Truck];
const whyChooseFeatures = LANG.public.whyChooseFeatures.map((f, i) => ({ ...f, icon: featureIcons[i] }));

export default function Home() {
  return (
    <PublicLayout transparentTop>
      {/* HERO */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        <img
          src={heroImg}
          alt={LANG.brand.heroImageAlt}
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-emerald-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        <div className="container relative pt-32 pb-20 z-10">
          <div className="max-w-3xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium mb-6">
                <Leaf className="w-3.5 h-3.5 text-orange-300" />
                {LANG.public.heroBadge}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
                {LANG.public.heroTitlePrefix}{" "}
                <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                  {LANG.public.heroTitleHighlight}
                </span>{" "}
                {LANG.public.heroTitleSuffix}
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-lg md:text-xl text-white/85 max-w-2xl mb-10 leading-relaxed">
                {LANG.public.heroDescription}
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="flex flex-wrap gap-4">
                <Link to="/login">
                  <Button
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 h-14 text-base font-semibold shadow-2xl shadow-orange-500/40 hover:scale-105 transition-transform"
                  >
                    {LANG.common.joinUs} <ArrowRight className="ml-1 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 h-14 text-base font-semibold border-white/40 bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-emerald-900 transition-all"
                  >
                    {LANG.common.exploreProducts}
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-white/80 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-emerald-950 text-white py-16">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8">
          {LANG.public.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent mb-2">
                  {s.value}
                </div>
                <div className="text-sm text-white/70 uppercase tracking-wider">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED FRUITS */}
      <section className="py-24 bg-gradient-to-b from-white to-emerald-50/40">
        <div className="container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="text-emerald-700 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
                {LANG.public.ourProduce}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">{LANG.public.featuredFruits}</h2>
              <p className="text-neutral-600 text-lg">
                {LANG.public.featuredFruitsDescription}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {products.map((p, i) => (
              <Reveal key={p.name} delay={i * 60}>
                <Card className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 rounded-2xl cursor-pointer">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.name}
                      loading="lazy"
                      width={800}
                      height={800}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                      <h3 className="font-bold text-lg leading-tight">{p.name}</h3>
                      <p className="text-xs text-white/80 mt-0.5">{p.tag}</p>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-white">
        <div className="container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="text-emerald-700 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
                {LANG.public.whatWeDo}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">{LANG.public.exportServices}</h2>
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

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-emerald-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,white,transparent_40%),radial-gradient(circle_at_80%_80%,#fb923c,transparent_40%)]" />
        <div className="container relative grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div>
              <div className="text-orange-300 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
                {LANG.public.whyChoose}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {LANG.public.whyChooseTitle}{" "}
                <span className="text-orange-400">{LANG.public.whyChooseHighlight}</span>
              </h2>
              <p className="text-white/75 text-lg mb-8 leading-relaxed">
                {LANG.public.whyChooseDescription}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/about">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-7 h-12">
                    {LANG.common.learnMore} <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-5">
            {whyChooseFeatures.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-300 flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                  <p className="text-sm text-white/70">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GLOBAL REACH */}
      <section className="py-24 bg-white">
        <div className="container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="text-emerald-700 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
                {LANG.public.globalReach}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                {LANG.public.globalReachTitle}
              </h2>
              <p className="text-neutral-600 text-lg">
                {LANG.public.globalReachDescription}
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 to-orange-50 p-10 md:p-16">
              <svg
                viewBox="0 0 1000 500"
                className="w-full h-auto opacity-30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                aria-hidden
              >
                <g className="text-emerald-700">
                  <ellipse cx="500" cy="250" rx="450" ry="220" />
                  <ellipse cx="500" cy="250" rx="350" ry="170" />
                  <ellipse cx="500" cy="250" rx="250" ry="120" />
                  <line x1="50" y1="250" x2="950" y2="250" />
                  <line x1="500" y1="30" x2="500" y2="470" />
                  <path d="M 100 250 Q 300 100 500 250 T 900 250" />
                  <path d="M 100 250 Q 300 400 500 250 T 900 250" />
                </g>
                {/* Markers */}
                {[
                  [200, 180], [320, 200], [450, 170], [550, 190], [680, 210],
                  [780, 240], [250, 320], [400, 350], [600, 330], [750, 360],
                  [180, 240], [870, 280],
                ].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="6" className="fill-orange-500 stroke-orange-500" />
                ))}
              </svg>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-8">
                {LANG.public.regions.map((r, i) => (
                  <Reveal key={r} delay={i * 30}>
                    <div className="px-4 py-3 rounded-xl bg-white shadow-sm border border-emerald-100 text-sm font-medium text-neutral-800 hover:border-orange-300 hover:shadow-md transition-all">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 mr-2" />
                      {r}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-gradient-to-b from-emerald-50/40 to-white">
        <div className="container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="text-emerald-700 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
                {LANG.public.testimonialsSection}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                {LANG.public.testimonialsTitle}
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {LANG.public.testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <Card className="p-8 border-0 shadow-md hover:shadow-xl transition-shadow rounded-2xl bg-white h-full flex flex-col">
                  <Quote className="w-8 h-8 text-orange-400 mb-4" />
                  <p className="text-neutral-700 leading-relaxed mb-6 flex-1">"{t.quote}"</p>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900">{t.name}</div>
                    <div className="text-sm text-neutral-500">{t.role}</div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="container py-24">
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 p-12 md:p-20 text-center text-white">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,#fb923c,transparent_50%),radial-gradient(circle_at_70%_70%,#fbbf24,transparent_50%)]" />
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
                {LANG.public.ctaTitle}
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-10 text-lg">
                {LANG.public.ctaDescription}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/login">
                  <Button
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 h-14 text-base font-semibold shadow-2xl shadow-orange-500/40"
                  >
                    {LANG.common.joinUs} <ArrowRight className="ml-1 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 h-14 text-base font-semibold border-white/40 bg-transparent text-white hover:bg-white hover:text-emerald-900"
                  >
                    {LANG.common.contactSales}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </PublicLayout>
  );
}
