import Image from 'next/image';
import { CheckSquare } from 'lucide-react';

const MissionSection = () => {
  const missionPoints = [
    "Innovative Solutions",
    "Customer-Centric Approach",
    "Commitment to Excellence",
    "Global Quality Standards",
    "Sustainable Growth",
    "Technical Precision"
  ];

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Overlapping Images (Same as image_93833a.png) */}
        <div className="relative h-[450px] md:h-[550px]">
          {/* Back Image */}
          <div className="absolute top-0 left-0 w-[85%] h-[80%] border-[10px] border-white shadow-lg z-0">
            <Image 
              src="/homepage-images/missionsection.jpg" 
              alt="Our Mission Background"
              fill
              className="object-cover"
            />
          </div>
          
          {/* Front Image */}
          <div className="absolute bottom-0 right-0 w-[75%] h-[75%] border-[10px] border-white shadow-2xl z-10">
            <Image 
              src="/homepage-images/missionsection1.jpg" 
              alt="Our Vision Foreground"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Right Side: Mission & Vision Content */}
        <div className="flex flex-col space-y-7">
          <div className="space-y-4">
            <h4 className="text-blue-600 font-bold tracking-widest uppercase text-sm">
              Our Purpose
            </h4>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] leading-[1.2]">
              Our Mission & Future Vision
            </h2>
          </div>
          
          <p className="text-gray-500 text-lg leading-relaxed">
            Hamara mission hai ki hum technology aur innovation ke zariye apne clients ko best-in-class industrial solutions provide karein. Hum ek aisa future envision karte hain jahan hamari reliability aur quality standards global benchmark banein.
          </p>

          <div className="space-y-2">
             <h3 className="text-xl font-bold text-[#1a1a1a]">Core Objectives:</h3>
             {/* Mission/Vision Checklist */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
               {missionPoints.map((text, idx) => (
                 <div key={idx} className="flex items-center gap-3">
                   <CheckSquare className="w-5 h-5 text-blue-600" />
                   <span className="text-[#333] font-semibold text-base">{text}</span>
                 </div>
               ))}
             </div>
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-10 pt-6">
            {/* Signature or Sub-brand Name */}
            <div className="text-4xl font-serif italic text-gray-400 select-none">
              Jaikvik Team
            </div>
            
            <button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-10 py-4 font-bold flex items-center transition-all group">
              View Vision 
              <span className="ml-3 w-8 h-[2px] bg-white inline-block group-hover:w-12 transition-all"></span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default MissionSection;