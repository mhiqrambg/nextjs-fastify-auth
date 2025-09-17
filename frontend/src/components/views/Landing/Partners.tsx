import Image from "next/image";
import { usePartners } from "./usePatners";

export default function Partners() {
  const partners = usePartners();

  return (
    <section className="bg-[#F2F5FA] py-12 text-center text-black">
      <h2 className="mb-6 text-xl font-semibold">
        We collaborate with the best educational institutions and brands
      </h2>
      <div className="mx-auto flex max-w-screen-lg flex-wrap justify-center gap-3">
        {partners.map((partner) => (
          <div key={partner.name} className="h-15 w-15">
            <Image
              src={partner.logo}
              alt={partner.name}
              width={150}
              height={80}
              className="h-auto w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
