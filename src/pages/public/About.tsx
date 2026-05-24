import PublicLayout from "@/components/public/PublicLayout";
import { Reveal } from "@/components/public/Reveal";
import { Card } from "@/components/ui/card";
import { Globe, ShieldCheck, Award, Users, Leaf, Target } from "lucide-react";
import heroImg from "@/assets/hero-fruits.jpg";
import { LANG } from "@/lib/language";

const valueIcons = [Leaf, Target, ShieldCheck];
const aboutValues = LANG.public.aboutValues.map((v, i) => ({ ...v, icon: valueIcons[i] }));

const statIcons = [Globe, Users, Award, ShieldCheck];
const aboutStats = LANG.public.aboutStats.map((s, i) => ({ ...s, icon: statIcons[i] }));

export default function About() {
  return (
    <PublicLayout>
      <section className="relative bg-emerald-950 text-white py-24 overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/70 to-emerald-950" />
        <div className="container relative">
          <Reveal>
            <div className="max-w-3xl">
              <div className="text-orange-300 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
                {LANG.public.aboutUs}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                {LANG.public.aboutHeroPrefix}{" "}
                <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                  {LANG.public.aboutHeroHighlight}
                </span>
              </h1>
              <p className="text-lg text-white/80 leading-relaxed">
                {LANG.public.aboutHeroDescription}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div>
              <div className="text-emerald-700 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
                {LANG.public.ourStory}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-5 text-neutral-900">
                {LANG.public.ourStoryTitle}
              </h2>
              <p className="text-neutral-600 mb-4 leading-relaxed">
                {LANG.public.ourStoryP1}
              </p>
              <p className="text-neutral-600 leading-relaxed">
                {LANG.public.ourStoryP2}
              </p>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-emerald-200 via-orange-100 to-yellow-100 flex items-center justify-center text-9xl shadow-2xl">
              🌍
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-emerald-50/40 py-24">
        <div className="container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-neutral-900">
                {LANG.public.ourValues}
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {aboutValues.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <Card className="p-8 border-0 shadow-md hover:shadow-xl transition-shadow rounded-2xl bg-white">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center mb-5">
                    <v.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">{v.title}</h3>
                  <p className="text-neutral-600">{v.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-24">
        <div className="grid md:grid-cols-4 gap-6">
          {aboutStats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <Card className="p-8 text-center border-0 shadow-md rounded-2xl">
                <s.icon className="w-9 h-9 text-emerald-700 mx-auto mb-3" />
                <div className="font-bold text-neutral-900">{s.label}</div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
