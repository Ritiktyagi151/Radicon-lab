import Image from 'next/image';
import { CheckSquare } from 'lucide-react';

const MissionSection = () => {
  const missionPoints = [
    "Best Quality Medicines",
    "Affordable Healthcare",
    "Global Standards",
    "Patient Well-being",
    "Ethical Practices",
    "Sustainable Innovation"
  ];

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Overlapping Images */}
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
              GROW WITH US
            </h4>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] leading-[1.2]">
              What Is Our Mission & Vision?
            </h2>
          </div>
          
          <p className="text-gray-500 text-lg leading-relaxed">
            At Radicon Laboratories Ltd, our mission is to improve the quality of health life of every citizen by providing Best Quality Medicines at Affordable Cost.
          </p>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-[#1a1a1a]">Our Mission</h3>
            <p className="text-gray-600 text-base leading-relaxed">
              At Radicon Laboratories Ltd, our mission is to improve global healthcare by delivering safe, high-quality, and innovative pharmaceutical solutions. We are committed to partnering with healthcare providers and pharmaceutical companies to enhance patient well-being through the development, manufacturing, and distribution of pharmaceutical products that meet the highest standards of quality, efficacy, and sustainability.
            </p>
          </div>

          <div className="space-y-2">
             <h3 className="text-xl font-bold text-[#1a1a1a]">Our Promise:</h3>
             <p className="text-gray-600 text-base leading-relaxed">
               Our promise is to continue making a positive impact on global health by providing high-quality, accessible, and affordable pharmaceuticals. We pledge to prioritize patient well-being and contribute to a healthier world.
             </p>
             
             {/* Core Values Checklist */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 pt-4">
               {missionPoints.map((text, idx) => (
                 <div key={idx} className="flex items-center gap-3">
                   <CheckSquare className="w-5 h-5 text-blue-500" />
                   <span className="text-[#333] font-semibold text-base">{text}</span>
                 </div>
               ))}
             </div>
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-10 pt-6">
            {/* Brand Name */}
            <div className="text-4xl font-serif italic text-gray-400 select-none">
              Radicon Labs
            </div>
            
            <button className="bg-[#DF1F26] hover:bg-[#c91b22] text-white px-10 py-4 font-bold flex items-center transition-all hover:shadow-lg hover:shadow-blue-200/50 group">
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