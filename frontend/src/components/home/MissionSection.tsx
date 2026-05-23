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
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 md:px-12 lg:px-24 lg:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        
        {/* Left Side: Overlapping Images */}
        <div className="relative h-[320px] sm:h-[450px] md:h-[550px]">
          {/* Back Image */}
          <div className="absolute left-0 top-0 z-0 h-[80%] w-[85%] border-[6px] border-white shadow-lg sm:border-[10px]">
            <Image 
              src="/homepage-images/missionsection.jpg" 
              alt="Our Mission Background"
              fill
              className="object-cover"
            />
          </div>
          
          {/* Front Image */}
          <div className="absolute bottom-0 right-0 z-10 h-[75%] w-[75%] border-[6px] border-white shadow-2xl sm:border-[10px]">
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
            <h2 className="text-3xl font-extrabold leading-[1.2] text-[#1a1a1a] sm:text-4xl md:text-5xl">
              What Is Our Mission & Vision?
            </h2>
          </div>
          
          <p className="text-base leading-relaxed text-gray-500 sm:text-lg">
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
          <div className="flex flex-col items-start gap-5 pt-6 sm:flex-row sm:items-center sm:gap-10">
            {/* Brand Name */}
            <div className="select-none font-serif text-3xl italic text-gray-400 sm:text-4xl">
              Radicon Labs
            </div>
            
            <button className="group flex w-full items-center justify-center bg-[#DF1F26] px-8 py-4 font-bold text-white transition-all hover:bg-[#c91b22] hover:shadow-lg hover:shadow-blue-200/50 sm:w-auto sm:px-10">
               
              <span className="ml-3 w-8 h-[2px] bg-white inline-block group-hover:w-12 transition-all"></span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default MissionSection;
