// components/TeamMember.tsx
import Image from "next/image";

interface TeamMemberProps {
  name: string;
  role?: string;
  description: string;
  imageUrl?: string;
}

const TeamMember = ({ name, role, description, imageUrl }: TeamMemberProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:shadow-xl hover:-translate-y-1">
      <div className="flex flex-col md:flex-row gap-6">
        {imageUrl ? (
          <div className="md:w-1/3">
            <div className="relative w-32 h-32 md:w-full md:h-48 rounded-lg overflow-hidden mx-auto">
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="md:w-1/3">
            <div className="w-32 h-32 md:w-full md:h-48 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto">
              <span className="text-4xl font-display font-bold text-primary">
                {name.charAt(0)}
              </span>
            </div>
          </div>
        )}
        <div className="md:w-2/3">
          <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">
            {name}
          </h3>
          {role && (
            <p className="text-primary font-semibold mb-4">{role}</p>
          )}
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default TeamMember;