import Hero from "./Hero";
import Partners from "./Partners";

// export biar bisa diimport satu-satu
export { Hero, Partners };

// export default kalau mau langsung 1 halaman gabungan
export default function LandingView() {
  return (
    <>
      <Hero />
      <Partners />
    </>
  );
}
