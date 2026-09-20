import Image from "next/image";

/**
 * Mansourko mark — distressed gold monogram on a torn noir disc.
 * Fills its wrapper, so callers control size with width classes.
 */
export default function MansourkoLogo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/assets/ui/logo.png"
      alt="Mansourko"
      width={350}
      height={350}
      priority
      className={`h-auto w-full drop-shadow-logo-glow ${className}`}
    />
  );
}
