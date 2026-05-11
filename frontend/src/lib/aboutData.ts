export type AboutPageContent = {
  title: string
  slug: string
  eyebrow: string
  description: string
  hero: string
  images: string[]
  sections: {
    heading: string
    body: string
    points?: string[]
  }[]
  highlights: string[]
}

const aboutPages: AboutPageContent[] = [
  {
    title: 'Who We Are',
    slug: '',
    eyebrow: 'About Us',
    description: 'Improving Healthcare Healing Lives',
    hero: 'Radicon is a specialty pharmaceutical company incorporated in the year 2007 by Late Mr. Rakesh Kumar Khaneja, whose passion fuelled the company growth. Radicon is engaged in manufacturing and marketing quality finished dosage forms for healthcare needs worldwide.',
    images: [
      'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
    ],
    sections: [
      {
        heading: 'Overview',
        body: 'We produce a comprehensive range of specialty products targeting different therapeutic segments for treatment of patients, customized to each market we are present in. We clearly understand our customer needs and use cutting edge technology to present innovative solutions. Our business includes branded generics in emerging markets of Asia and several Gulf countries.',
      },
      {
        heading: 'Our Mission',
        body: 'At Radicon Laboratories Ltd, our mission is to improve global healthcare by delivering safe, high-quality, and innovative pharmaceutical solutions. We collaborate with healthcare providers and pharmaceutical companies to enhance patient well-being through development, manufacturing, and distribution of pharmaceutical products that meet high standards of quality, efficacy, and sustainability.',
      },
      {
        heading: 'Our Commitment',
        body: 'Our relentless pursuit of excellence and dedication to ethical practices drive us to make a positive impact on the health and lives of people worldwide.',
      },
    ],
    highlights: ['Best Quality', 'Professional', 'Environment Friendly', 'Healthcare focused'],
  },
  {
    title: 'At A Glance',
    slug: 'at-a-glance',
    eyebrow: 'About Us',
    description: 'Leaders in Pharmaceutical Excellence',
    hero: 'Radicon Laboratories Limited was established in the year 2007 and has carved a niche for itself in the pharmaceutical sector globally.',
    images: [
      'https://images.unsplash.com/photo-1581093458791-9f3c3900df7b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1200&q=80',
    ],
    sections: [
      {
        heading: 'Pharmaceutical Excellence',
        body: 'Our manifesto of working is to procure pure quality of drugs. We are a reputed manufacturer, exporter, trader, and marketing agent with a range of hygienic and efficacious life-saving medicines. Radicon product portfolio includes prescription medicines and vaccines.',
      },
      {
        heading: 'Manufacturing Strength',
        body: 'Radicon has a large scale manufacturing unit in India, located at Greater Noida industrial area. The state-of-the-art plant is technically designed according to WHO-GMP guidelines, giving us an added advantage in procuring better and safe drugs.',
      },
      {
        heading: 'Ensuring Availability and Enhancing Lives',
        body: 'Being one of the leaders brings responsibility towards the community in which we operate. At Radicon, our CSR program works towards fulfilling basic healthcare, education, and other development needs of underserved populations.',
      },
      {
        heading: 'Global Market Reach',
        body: 'Radicon operates in domestic and global markets, with production exported to regions including Afghanistan, Iraq, CIS countries, African countries, Uzbekistan, Tajikistan, Ghana, Nigeria, Myanmar, Russia, and Vietnam.',
      },
    ],
    highlights: ['Established in 2007', 'WHO-GMP aligned plant', 'Export House Status', 'Domestic and global markets'],
  },
  {
    title: 'Our Company',
    slug: 'our-company',
    eyebrow: 'Company Profile',
    description: 'Radicon Laboratories Ltd',
    hero: 'Radicon Laboratories Ltd, a leading pharmaceutical company in India, offers a wide range of pharmaceutical finished formulations under various therapeutic categories.',
    images: [
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=1200&q=80',
    ],
    sections: [
      {
        heading: 'Finished Formulations',
        body: 'The company offers tablets, capsules, ointment, syrup, injectable, and oral strips across different therapeutic categories. Finished products are offered in primary packaging formats including blister, strip, Alu Alu, pet bottles or jars, HDPE bottles or jars, tubes, and paper back blister.',
        points: ['Blister', 'Strip', 'Alu Alu', 'Pet Bottles/Jar', 'HDPE Bottles/Jar', 'Tubes', 'Paper back Blister'],
      },
      {
        heading: 'Company Details',
        body: 'Founder: Mr. Rakesh Kumar Khaneja. Established as Ltd. Co.: 2007. Manufacturing established: 2008. Status: Public Limited Company (Non Listed). Business line: Pharmaceutical finished products.',
        points: ['400 product approvals', '600+ branded generics in market', 'Tablets 360+ Million', 'Capsules 180+ Million', 'Ointment 100+ Million'],
      },
      {
        heading: 'Annual Production Capacity',
        body: 'Radicon has developed strong manufacturing capacity for finished formulations across major dosage forms.',
        points: ['Tablets: 360 Million', 'Capsules: 180 Million', 'Ointment: 100 Million'],
      },
    ],
    highlights: ['Public Limited Company', 'Pharmaceutical Finished Products', '400 product approvals', '600+ branded generics'],
  },
  {
    title: 'Code Of Conduct',
    slug: 'code-of-conduct',
    eyebrow: 'Ethics & Responsibility',
    description: 'Code of Conduct',
    hero: 'At Radicon Laboratories Ltd, we are committed to the highest standards of ethical conduct and integrity in all our business activities.',
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    ],
    sections: [
      {
        heading: 'Ethical Standards',
        body: 'This Code of Conduct outlines the principles and expectations that guide how we operate as a company, interact with stakeholders, and uphold compliance with laws, regulations, and internal policies.',
      },
      {
        heading: 'Core Principles',
        body: 'Employees and partners are expected to adhere to these standards in everything they do to support Radicon mission of quality, trust, and ethical leadership in pharmaceutical manufacturing.',
        points: [
          'Integrity: We act honestly and transparently in all business dealings.',
          'Compliance: We follow applicable laws, industry regulations, and internal policies.',
          'Respect: We treat employees, customers, partners, and communities with fairness.',
          'Safety and Quality: We maintain uncompromising standards for product safety and quality.',
          'Confidentiality: We protect company, client, and patient information.',
        ],
      },
    ],
    highlights: ['Integrity', 'Compliance', 'Respect', 'Safety and Quality'],
  },
  {
    title: 'Board Of Directors',
    slug: 'board-of-directors',
    eyebrow: 'Leadership',
    description: 'Strategic leadership and oversight for Radicon Laboratories Ltd.',
    hero: 'Our Board of Directors provides strategic leadership and oversight for Radicon Laboratories Ltd. Committed to excellence, the Board shapes the vision, values, and long-term growth strategy of the company.',
    images: [
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80',
    ],
    sections: [
      {
        heading: 'Board Members',
        body: 'Sagar Khaneja serves as Chairman & Managing Director, guiding Radicon Laboratories with a focus on quality, growth, and ethical excellence.',
      },
      {
        heading: 'Vision',
        body: 'The Board works to drive global healthcare impact through innovation, quality, and ethical excellence while enhancing Radicon scientific capabilities and accelerating product development.',
        points: [
          'Drive global healthcare impact through innovation and quality.',
          'Enhance scientific capabilities and accelerate product development.',
          'Ensure quality assurance and regulatory compliance in manufacturing functions.',
        ],
      },
    ],
    highlights: ['Strategic leadership', 'Ethical excellence', 'Scientific capability', 'Regulatory compliance'],
  },
  {
    title: 'CSR',
    slug: 'csr',
    eyebrow: 'Social Responsibility',
    description: 'Empowering Communities and Transforming Lives',
    hero: 'We follow the rationale that we are linked closely to the communities in which we operate locally, nationally, and globally. We cannot exist in isolation.',
    images: [
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    ],
    sections: [
      {
        heading: 'Our CSR Philosophy',
        body: 'All our actions are focused around the feeling of being centered in the community. Our mission is to exceed customer expectations in quality, delivery, cost efficiency, continuous improvement, and customer interaction while making positive contributions to the communities in which we operate.',
      },
      {
        heading: 'Our Core Value - We Care',
        body: 'Being a premier pharmaceutical company, Radicon core value is to be a good corporate citizen. We support the community through social development initiatives and invest in society through projects in alliance with not-for-profit organizations in rural and urban areas.',
      },
      {
        heading: 'Focus Areas',
        body: 'Our initiatives primarily focus on women, children, and senior citizens in the areas of health, education, and livelihood. The organization facilitates education on good practices of healthy living.',
        points: ['Health', 'Education', 'Livelihood', 'Healthy living awareness'],
      },
      {
        heading: 'CSR Purpose - What We Do',
        body: 'We provide donations in the form of medicines, monetary terms, time, and equipment to non-profit organizations to help improve health and education for underserved communities. We focus on programs that are innovative, sustainable, and deliver meaningful benefits to those who need them most.',
      },
    ],
    highlights: ['Women, children and senior citizens', 'Health and education', 'Sustainable community programs', 'Medicine and equipment support'],
  },
  {
    title: 'FAQ',
    slug: 'faq',
    eyebrow: 'Common Questions',
    description: 'Frequently Asked Questions',
    hero: 'Find answers to common questions about Radicon Laboratories role, quality practices, certifications, manufacturing unit, and market reach.',
    images: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&w=1200&q=80',
    ],
    sections: [
      {
        heading: 'What is Radicon Laboratories role in the pharmaceutical sector?',
        body: 'Radicon Laboratories is a reputed pharmaceutical company that operates globally, manufacturing and exporting a wide range of high-quality and affordable drugs. The company is known for leadership in therapeutic categories and commitment to life-saving medicines.',
      },
      {
        heading: 'How does Radicon Laboratories ensure quality and safety?',
        body: 'Radicon Laboratories follows revised WHO-GMP guidelines and adheres to Good Manufacturing Practices to ensure high quality standards. Manufacturing facilities are designed according to these guidelines and key operations are overseen by qualified professionals.',
      },
      {
        heading: 'What certifications has Radicon Laboratories obtained?',
        body: 'Radicon Laboratories follows revised WHO GMP guidelines and has been certified and accredited for Good Manufacturing Practices. The company has also been accorded Export House Status by the Ministry of Commerce, Government of India.',
      },
      {
        heading: 'Where is the manufacturing unit located?',
        body: 'Radicon Laboratories has a large-scale manufacturing unit located in the Greater Noida industrial area of India. The plant is designed in accordance with WHO-GMP guidelines.',
      },
      {
        heading: 'What is the market reach of Radicon products?',
        body: 'Radicon Laboratories operates in domestic and global markets. More than 75% of total production is exported to countries such as Afghanistan, Iraq, CIS countries, African countries, Uzbekistan, Tajikistan, Ghana, Nigeria, Myanmar, Russia, and Vietnam.',
      },
    ],
    highlights: ['Global operations', 'WHO-GMP practices', 'Export House Status', '75%+ export production'],
  },
]

export function getAboutPages() {
  return aboutPages
}

export function getAboutPageBySlug(slug = '') {
  return aboutPages.find((page) => page.slug === slug) || null
}

export function getAboutPath(slug = '') {
  return slug ? `/about/${slug}` : '/about'
}
