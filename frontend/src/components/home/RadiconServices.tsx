'use client';

import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TabId = 'contract' | 'thirdParty' | 'generic' | 'certified';

export default function RadiconServices() {
  const [activeTab, setActiveTab] = useState<TabId>('contract');

  const tabs = [
    { id: 'contract', label: 'What Is Contract Manufacturing?' },
    { id: 'thirdParty', label: 'What Is Third Party Manufacturing?' },
    { id: 'generic', label: 'What Are Generic Drugs?' },
    { id: 'certified', label: 'Best Certified Manufacturer' }
  ] satisfies Array<{ id: TabId; label: string }>;

  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.2 } }
  };

  const content: Record<TabId, ReactNode> = {
    contract: (
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.25 }}
        className="grid gap-6 md:grid-cols-2 md:gap-8 md:items-center"
      >
        <motion.div variants={fadeInUp} className="space-y-6">
          <p className="text-gray-700 leading-relaxed text-lg">
            Contract manufacturing is a business arrangement in which one company, often referred to as the contract manufacturer, provides manufacturing services to another company, known as the client or brand owner. In this partnership, the contract manufacturer is responsible for producing goods or products on behalf of the client based on the client&apos;s specifications, designs, and requirements.
          </p>
          
          <div className="space-y-4">
            <motion.div variants={fadeInUp}>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-800">Quality Assurance</span>
                <span className="font-bold text-slate-600">95%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '95%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="bg-slate-500 h-3 rounded-full"
                ></motion.div>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-800">Contract Manufacturing</span>
                <span className="font-bold text-slate-600">90%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '90%' }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  className="bg-slate-500 h-3 rounded-full"
                ></motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          variants={fadeInUp}
          className="relative h-60 bg-gradient-to-br from-[#F0F8FF] to-[#E8E8E8] rounded-lg overflow-hidden shadow-inner sm:h-72 md:h-80"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">💊</div>
              <h3 className="text-2xl font-bold text-slate-700">Contract Manufacturing</h3>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    ),
    thirdParty: (
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.25 }}
        className="space-y-8"
      >
        <motion.div variants={fadeInUp} className="text-gray-700 leading-relaxed text-lg">
          We take pride in our extensive production capacity and wide range of products. With over 400 approved products and 600+ branded generics in the market, we strive to meet the diverse needs of our customers. Our annual production capacity speaks volumes about our dedication to delivering high-quality pharmaceuticals.
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -8, rotateX: 3, rotateY: -3 }}
            className="bg-gradient-to-br from-slate-700 to-slate-900 text-white p-5 rounded-xl shadow-lg sm:p-8"
          >
            <h3 className="text-xl font-bold mb-6 border-b border-white/20 pb-3">ANNUAL PRODUCTION CAPACITY</h3>
            <div className="space-y-5">
              {[
                { val: '360M', label: 'Tablets', icon: '💊' },
                { val: '180M', label: 'Capsules', icon: '💊' },
                { val: '100M', label: 'Ointment', icon: '🧴' }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex justify-between items-center"
                >
                  <div>
                    <div className="text-3xl font-bold">{item.val}</div>
                    <div className="text-gray-300 text-sm">{item.label}</div>
                  </div>
                  <div className="text-5xl opacity-50">{item.icon}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            variants={fadeInUp}
            className="bg-white border-2 border-[#E8E8E8] p-5 rounded-xl sm:p-8"
          >
            <h4 className="font-bold text-slate-700 mb-4 text-lg">Product Forms</h4>
            <ul className="space-y-3 text-gray-700">
              {['Tablets & Capsules', 'Ointments & Creams', 'Syrups & Injectables', 'Oral Strips'].map((text, i) => (
                <motion.li key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="flex items-center">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mr-3"></span>
                  {text}
                </motion.li>
              ))}
            </ul>
            
            <h4 className="font-bold text-slate-700 mt-6 mb-4 text-lg">Packaging Options</h4>
            <ul className="space-y-3 text-gray-700">
              {['Blister Strips (Alu-Alu)', 'PET & HDPE Bottles', 'Tubes & Paper Back Blister'].map((text, i) => (
                <motion.li key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: (i+4) * 0.1 }} className="flex items-center">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mr-3"></span>
                  {text}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    ),
    generic: (
      <motion.div 
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.25 }}
        className="grid gap-6 md:grid-cols-2 md:gap-8 md:items-center"
      >
        <motion.div 
          variants={{
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
          }}
          className="order-2 md:order-1"
        >
          <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white p-6 rounded-2xl shadow-xl sm:p-10">
            <motion.div 
              animate={{ rotateY: 360 }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-7xl mb-6 text-center"
            >
              💊
            </motion.div>
            <h3 className="text-3xl font-bold text-center mb-4">Generic Drugs</h3>
            <p className="text-gray-300 text-center">Affordable Healthcare Solutions</p>
          </div>
        </motion.div>
        
        <motion.div variants={fadeInUp} className="order-1 md:order-2">
          <div className="bg-[#F0F8FF] border-l-4 border-[#E8E8E8] p-5 rounded-lg sm:p-6">
            <h4 className="font-bold text-slate-700 mb-3 text-xl">What are Generic Drugs?</h4>
            <p className="text-gray-700 leading-relaxed text-lg">
              A generic drug is a pharmaceutical product that is essentially the same as a brand-name medication in terms of its active ingredients, dosage form, strength, and intended use. However, generic drugs are typically marketed under their chemical or generic name rather than a brand name.
            </p>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.06, y: -5, rotateX: 4 }} className="bg-white p-4 rounded-lg shadow-md border border-[#E8E8E8] [transform-style:preserve-3d]">
              <div className="text-slate-600 text-3xl font-bold">Same</div>
              <div className="text-sm text-gray-600">Active Ingredients</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.06, y: -5, rotateX: 4 }} className="bg-white p-4 rounded-lg shadow-md border border-[#E8E8E8] [transform-style:preserve-3d]">
              <div className="text-slate-600 text-3xl font-bold">Same</div>
              <div className="text-sm text-gray-600">Quality Standards</div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    ),
    certified: (
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.25 }}
        className="space-y-8"
      >
        <motion.div 
          variants={fadeInUp}
            className="bg-gradient-to-r from-slate-700 to-slate-900 text-white p-5 rounded-2xl shadow-xl sm:p-8"
        >
          <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center">
            <motion.div 
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-6xl"
            >
              🏆
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold">AWARDS FOR THE BEST PHARMA MANUFACTURER</h3>
              <p className="text-gray-300">Distribution of the Year - 2022</p>
            </div>
          </div>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            variants={fadeInUp}
            className="bg-[#F0F8FF] p-5 rounded-xl border-2 border-[#E8E8E8] sm:p-6"
          >
            <h4 className="text-slate-700 font-bold mb-4 text-lg">Recognition Highlights</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our esteemed pharmaceutical company was honored with the prestigious <span className="font-semibold text-slate-700">&quot;Best Pharma Manufacturer and Distributor of the Year&quot;</span> award in 2022 by Six Sigma Healthcare.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <span className="font-bold text-slate-700">Radicon Laboratories</span> has consistently demonstrated its ability to uphold stringent quality control measures, ensuring the production of safe and effective medications.
            </p>
          </motion.div>
          
          <motion.div 
            variants={fadeInUp}
            className="bg-white p-5 rounded-xl border-2 border-[#E8E8E8] sm:p-6"
          >
            <h4 className="text-slate-700 font-bold mb-4 text-lg">Our Commitment</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              This accolade serves as an inspiration for us to continue striving for excellence in all aspects of our operations. Radicon Laboratories remains committed to advancing healthcare by developing innovative pharmaceutical solutions.
            </p>
            <p className="text-gray-700 leading-relaxed">
              With our steadfast dedication, cutting-edge research, and customer-centric approach, we are confident that <span className="font-bold text-slate-700">Radicon Laboratories</span> will continue to contribute significantly to healthcare advancement.
            </p>
          </motion.div>
        </div>
      </motion.div>
    )
  };

  return (
    <div className="w-full overflow-hidden px-4 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <p className="text-gray-500 text-sm uppercase tracking-wider mb-3 font-semibold">
            ABOUT OUR SERVICES
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            TOP PHARMACEUTICAL MANUFACTURER COMPANY
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Manufacturing Quality Medicines for a Healthier Future
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.35 }}
          whileHover={{ y: -5, rotateX: 2 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-[#E8E8E8] [transform-style:preserve-3d] sm:mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-4 text-sm md:py-5 md:text-base font-semibold transition-all duration-300 relative ${
                  activeTab === tab.id
                    ? 'bg-slate-700 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-[#F0F8FF]'
                } ${index !== tabs.length - 1 ? 'md:border-r border-gray-200' : ''}`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-white"
                  ></motion.div>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Area with Transition */}
        <motion.div
          whileHover={{ y: -6, rotateX: 1.5, rotateY: -1.5 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-12 border border-[#E8E8E8] min-h-[360px] md:min-h-[500px] [transform-style:preserve-3d]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              {content[activeTab]}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
