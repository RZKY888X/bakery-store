import Image from "next/image";

interface AchievementProps {
  title: string;
  text: string;
  img: string;
  reverse?: boolean;
}

export default function AchievementCard({
  title,
  text,
  img,
  reverse = false,
}: AchievementProps) {
  return (
    <div
      className={`flex flex-col ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      } gap-6 items-center`}
    >
      <div className="relative w-full md:w-1/3 h-[160px] md:h-[180px]">
        <Image src={img} alt={title} fill className="object-cover rounded-lg" />
      </div>

      <div className="md:w-2/3 text-black">
        <h3 className="font-display font-bold mb-2">{title}</h3>
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
