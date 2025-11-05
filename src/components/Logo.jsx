import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex justify-center mb-4">
      <Image
        src="/logo.png"
        alt="Logo"
        width={1480}
        height={140}
        className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-md"
        priority
      />
    </div>
  );
}
