import { LANG } from "@/lib/language";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{LANG.errors.blankAppTitle}</h1>
        <p className="text-xl text-muted-foreground">{LANG.errors.blankAppDescription}</p>
      </div>
    </div>
  );
};

export default Index;
