export interface NutritionalInfo {
  energy?: string;
  carbohydrate?: string;
  protein?: string;
  totalFat?: string;
  vitaminC?: string;
  iron?: string;
  calcium?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  name: string;
  variant?: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  stockStatus?: "In Stock" | "Out of Stock" | "Low Stock";
  sku?: string;
  productCode?: string;
  shortIntroduction?: string;
  description: string;
  benefits: string[];
  ingredients?: string;
  nutritionalInfo?: NutritionalInfo;
  contents?: string[];
  directions?: string[];
  dosage?: string;
  storage?: string;
  precautions?: string;
  suitableFor?: string[];
  certifications?: string[];
  manufacturing?: {
    manufacturer?: string;
    marketedBy?: string;
    countryOfOrigin?: string;
    mfgLicNo?: string;
    shelfLife?: string;
    mfgDate?: string;
    batchNumber?: string;
  };
  packaging?: {
    netWeight?: string;
    netQuantity?: string;
    dimensions?: string;
    packagingType?: string;
    form?: string;
  };
  faq?: { question: string; answer: string }[];
  claims?: string[];
  additionalNotes?: string;
  images?: string[];
}

export const products: Product[] = [
  {
    id: "blood-purifier-juice",
    name: "Blood Purifier Juice",
    brand: "Vedique Nutrition",
    category: "Juices & Tonics",
    price: 999,
    originalPrice: 1299,
    badge: "100% Natural",
    sku: "VN-BPJ-250",
    stockStatus: "In Stock",
    shortIntroduction: "Pure Blood. Healthy Body. Better Life.",
    description: "Give your body the gift of clean, healthy blood with Vedique Nutrition's Blood Purifier Juice — a powerful Ayurvedic blend crafted from time-tested herbs to help flush out toxins, revitalize your skin, and boost your natural energy from within. Formulated for the modern lifestyle, this natural blood cleanser works to support liver detoxification, clearer skin, stronger immunity, and better digestion, so you feel lighter, more energetic, and radiant every single day.",
    benefits: [
      "Purifies Blood – helps remove toxins and impurities from the bloodstream",
      "Improves Skin Health – helps reduce acne and pimples for clear, glowing skin",
      "Boosts Immunity – strengthens the body's natural defence system",
      "Supports Digestion – improves digestion and helps detoxify the liver",
      "Increases Energy – fights fatigue and keeps you active all day",
      "100% Natural – made with pure Ayurvedic herbs, no harmful chemicals"
    ],
    ingredients: "Neem, Manjistha, Guduchi, Amla, Giloy, Haridra, Daruharidra, Triphala, Tulsi, Shuddhi, Vasa/Yashtimadhu and other proprietary Ayurvedic herbs (each 10 ml serving contains a proprietary blend — see label for full composition)",
    directions: ["Take 15–20 ml twice daily with water, preferably after meals, or as directed by your healthcare professional.", "Shake well before use."],
    dosage: "15–20 ml twice daily",
    storage: "Keep in a cool, dry place, away from direct sunlight",
    suitableFor: ["All age groups"],
    certifications: ["GMP Certified", "ISO 9001:2015", "AYUSH Certified", "FSSAI Approved", "100% Natural"],
    claims: ["No added sugar", "No artificial colour", "No harmful chemicals", "Safe and effective for all age groups"],
    manufacturing: {
      marketedBy: "SK Holdings, Mumbai, Maharashtra, India"
    },
    packaging: {
      netQuantity: "250 ml",
      form: "Liquid / Juice"
    },
    additionalNotes: "This is an Ayurvedic proprietary product. Please consult your healthcare professional before use if you have an existing medical condition.",
    images: ["/images/placeholder-main.jpg"]
  },
  {
    id: "cellogen",
    name: "Cellogen",
    variant: "Premium Antioxidant Herbal Juice",
    brand: "Vedique Nutrition",
    category: "Juices & Tonics",
    price: 3449,
    originalPrice: 3999,
    badge: "Best Seller",
    sku: "VN-CEL-1000",
    stockStatus: "In Stock",
    shortIntroduction: "Nature's Power in Every Drop. 108 Herbs. One Powerful Formula.",
    description: "Cellogen is a premium antioxidant herbal tonic powered by the strength of 108 authentic Ayurvedic herbs, thoughtfully combined to support cellular wellness, natural immunity, and everyday vitality. This 100% natural, sugar-free formula is designed for adults who want to fight fatigue, support liver and kidney health, and feel recharged — one delicious dose at a time.",
    benefits: [
      "Supports natural immunity and the body's defence system",
      "Helps boost energy & stamina throughout the day",
      "Supports cellular wellness and antioxidant protection",
      "Helps reduce weakness & fatigue",
      "Supports healthy metabolism and natural detoxification",
      "Supports daily vitality & recovery",
      "Supports liver wellness and kidney health",
      "Supports respiratory wellness and heart health"
    ],
    ingredients: "108 Ayurvedic herbs including Amla, Ashwagandha, Giloy, Tulsi, Aloe Vera, Shatavari, Gokhru, Punarnava, Brahmi, Moringa, Noni, Pippali, Haritaki, Baheda, Vibhitaki, Triphala, Dalchini, Kali Mirch, Mulethi, Adrak, Giloy Satva, Kutki, Neem, Haldi, Bringaraj, Arjun Chhal, Safed Musli, Vidarikand, Shankhpushpi, Yashtimadhu and more",
    nutritionalInfo: {
      "Energy": "40.70 kcal",
      "Carbohydrate": "10.32 g",
      "Protein": "2.2 g",
      "Total Fat": "0.0 g",
      "Vitamin C": "200 mg",
      "Iron": "8.44 mg",
      "Calcium": "21.14 mg"
    },
    directions: ["Shake well before use."],
    dosage: "Adults: 15–20 ml, twice daily, or as directed by your healthcare professional.",
    storage: "Store in a cool, dry place away from direct sunlight.",
    precautions: "Not intended for children, pregnant or breastfeeding women unless advised by a healthcare professional",
    suitableFor: ["Adults above 18 years"],
    certifications: ["HACCP", "ISO", "GMP", "IGMP", "Make in India"],
    claims: ["108 authentic Ayurvedic herbs", "Sugar-free", "100% natural"],
    manufacturing: {
      shelfLife: "18 months from date of manufacturing",
      marketedBy: "SK Holdings, Mumbai, Maharashtra, India",
      manufacturer: "Fantastica4 Herbs Pvt. Ltd., Jaipur, Rajasthan"
    },
    packaging: {
      netQuantity: "1000 ml"
    },
    additionalNotes: "This is a dietary food supplement and is not intended to diagnose, treat, cure, or prevent any disease. For adults above 18 years only.",
    images: ["/images/placeholder-1.jpg", "/images/placeholder-2.jpg"]
  },
  {
    id: "calcium-k2-capsules",
    name: "Calcium K2+ Capsules",
    brand: "Satvam Wellness",
    category: "Capsules & Supplements",
    price: 899,
    originalPrice: 1099,
    sku: "SW-CAL-30",
    stockStatus: "In Stock",
    shortIntroduction: "Capsules for Real Joints — 70+ Years of Manufacturing Trust.",
    description: "Satvam Wellness Calcium K2+ is a handcrafted Ayurvedic capsule formula designed to help maintain healthy calcium levels, support strong joints and muscles, and improve overall bone density — naturally and without side effects. Backed by over 70 years of manufacturing trust and formulated with pure, original herbs in the proper combination, this supplement is perfect for anyone looking to strengthen their bones and joints as part of their daily wellness routine.",
    benefits: [
      "Maintains healthy calcium levels in the body",
      "Supports joint health and mobility",
      "Supports muscle health and strength",
      "Improves bone density over time"
    ],
    directions: ["Take as directed on the label or as advised by a certified healthcare professional."],
    suitableFor: ["Joint, bone & muscle health support"],
    certifications: ["Lab Tested", "Certified & Curated by Doctors", "100% Natural Ayurvedic"],
    claims: ["70+ years of manufacturing trust", "100% natural Ayurvedic formula with no side effects", "Handcrafted using pure, original herbs"],
    packaging: {
      netQuantity: "30 Capsules",
      form: "Capsule"
    },
    additionalNotes: "Please consult your healthcare professional before starting any new supplement, especially if you have an existing medical condition or are on medication.",
    images: ["/images/placeholder-main.jpg"]
  },
  {
    id: "kidney-care-juice",
    name: "Kidney Care Juice",
    brand: "Vedique Nutrition",
    category: "Juices & Tonics",
    price: 2499,
    sku: "VN-KCJ-1000",
    stockStatus: "In Stock",
    shortIntroduction: "Helps in Removal of Kidney Stones — Natural. Safe. Effective.",
    description: "Vedique Nutrition's Kidney Care Juice is a 100% natural Ayurvedic formula crafted to support healthy kidney function, help dissolve kidney stones, and cleanse the urinary tract — so you can feel comfortable, light, and worry-free. Made with time-honoured herbal ingredients, this juice is designed to reduce urine irritation, detoxify the urinary system, and promote long-term kidney wellness as part of your daily health routine.",
    benefits: [
      "Helps in dissolving kidney stones",
      "Reduces urine irritation",
      "Supports overall kidney health",
      "Detoxifies & cleanses the urinary tract",
      "Improves overall kidney function"
    ],
    directions: ["Shake well before use. Take as directed on the label or as advised by your healthcare professional."],
    certifications: ["FSSAI", "GMP", "ISO", "100% Natural Ingredients"],
    claims: ["100% natural ingredients with no added sugar", "Pure Ayurvedic formula, safe and effective"],
    manufacturing: {
      shelfLife: "18 months from date of manufacturing",
      marketedBy: "SK Holdings, Mumbai, Maharashtra, India"
    },
    packaging: {
      netQuantity: "1000 ml"
    },
    additionalNotes: "This is a dietary food supplement and is not intended to diagnose, treat, cure, or prevent any disease. Please consult a doctor if you have a diagnosed kidney condition.",
    images: ["/images/placeholder-main.jpg"]
  },
  {
    id: "luxe-hair-oil",
    name: "Luxe Hair",
    variant: "Herbal Hair Oil (Hair Nourishment Formula)",
    brand: "L'Aveira",
    category: "Hair & Personal Care",
    price: 780,
    badge: "New",
    sku: "LA-LHO-100",
    stockStatus: "In Stock",
    shortIntroduction: "Effortless Beauty, Everyday. For Strong, Thick, Healthy, Shiny Hair.",
    description: "L'Aveira Luxe Hair Herbal Oil is a comprehensive Ayurvedic proprietary hair oil enriched with potent herbs like Brahmi, Bhringraj, Shankhpushpi, Jyotishmati, Charilla, Tagar, Nagarmotha, and Neem — crafted to nourish the scalp, strengthen hair follicles, and promote thicker, healthier hair growth. More than just a hair oil, Luxe Hair offers a calming head-massage ritual that soothes the scalp, reduces stress, and helps prevent premature greying — bringing together beauty and wellness in every drop.",
    benefits: [
      "Reduces hair fall and strengthens hair roots",
      "Promotes thicker hair growth",
      "Improves overall scalp health",
      "Acts as an antifungal and antibacterial agent for the scalp",
      "Prevents premature greying of hair",
      "Strengthens brain function & calms the nerves through scalp massage"
    ],
    ingredients: "Base oils (per 10 ml): Nariyal Oil 38.6 ml, Mustard Oil 20 ml, Badam Oil 0.62 ml, Neem Oil 0.31 ml, Jyotishmati Oil 0.12 ml, Til Oil q.s. Processed in Sesame/Til Oil with: Amla, Brahmi, Tulsi, Bhringraj, Nimbu Patra, Shankh Pushpi, Harar, Bahera, Black Cardamom, Charilla, Talispatra, Jatamansi, Safed Chandan, Nagarmotha, Khas, Agar, Tagar, Gulab, Kapoor Kachri, Mehandi, Panari",
    directions: [
      "Take a sufficient quantity of oil and apply evenly on the scalp and hair roots.",
      "Massage gently with fingertips for 5–10 minutes.",
      "Leave for at least 30 minutes or overnight, then wash off with a mild shampoo or as directed by a physician."
    ],
    suitableFor: ["All hair types"],
    certifications: ["ISO", "GMP", "Made in India"],
    claims: ["70+ years of manufacturing trust", "100% natural Ayurvedic formula with no side effects", "Free from harmful chemicals"],
    manufacturing: {
      mfgLicNo: "771 Ay-Pb",
      manufacturer: "Dharamvir Ayurveda Pvt. Ltd., Mohali, Punjab",
      marketedBy: "SK Holdings Pvt. Ltd., Mumbai, Maharashtra, India"
    },
    packaging: {
      netQuantity: "100 ml"
    },
    precautions: "For external use only. Discontinue use and consult a physician in case of irritation.",
    images: ["/images/placeholder-main.jpg"]
  },
  {
    id: "salon-hold-pro",
    name: "Salon Hold Pro",
    variant: "Hair Care Spray (Professional Herbal Formula)",
    brand: "L'Aveira",
    category: "Hair & Personal Care",
    price: 780,
    sku: "LA-SHP-100",
    stockStatus: "In Stock",
    shortIntroduction: "Effortless Beauty, Everyday. Professional Care, Naturally.",
    description: "L'Aveira Salon Hold Pro is an advanced herbal hair care spray formulated with potent Ayurvedic distillates to strengthen hair follicles, minimize breakage, and enhance overall hair texture — bringing salon-quality care home. Lightweight, non-sticky, and easy to use, this daily spray is designed to support healthy hair vitality while nourishing strands from root to tip, leaving your hair smooth, manageable, and full of life.",
    benefits: [
      "Strengthens hair — fortified with potent herbs that strengthen hair follicles and reduce hair fall",
      "Minimizes breakage — helps reduce visible hair breakage and prevents damage",
      "Improves texture — enhances hair texture, leaving hair smooth, manageable and healthy",
      "Professional care — advanced herbal formula that supports healthy hair vitality",
      "Easy to use — lightweight, non-sticky spray safe for all hair types"
    ],
    ingredients: "Herbal distillate per 100 ml: Manjistha 338.4 mg, Rakta Chandan 338.4 mg, Ushira 338.4 mg, Henna 338.4 mg, Vidanga 169.2 mg, Maricha 169.2 mg, Jatamansi 169.2 mg, Bhringraj 3.4 gm, Amla 1.7 gm, Lemon Grass 0.2 ml, Prasanna 40 ml",
    directions: [
      "Spray twice a day on dry hair, or as directed by your physician.",
      "Do not wipe after spraying — let the scalp absorb the ingredients."
    ],
    storage: "Keep away from direct sunlight and out of the reach of children.",
    precautions: "Avoid contact with eyes. For external use only. If irritation occurs, discontinue use and contact customer care immediately.",
    certifications: ["ISO", "GMP", "Made in India"],
    claims: ["100% natural Ayurvedic formula with no side effects"],
    manufacturing: {
      mfgLicNo: "771 Ay-Pb",
      manufacturer: "Dharamvir Ayurveda Pvt. Ltd., Mohali, Punjab",
      marketedBy: "SK Holdings Pvt. Ltd., Mumbai, Maharashtra, India"
    },
    packaging: {
      netQuantity: "100 ml"
    },
    images: ["/images/placeholder-main.jpg"]
  },
  {
    id: "multi-vitamin-capsule",
    name: "Multi Vitamin Capsule",
    brand: "Vedique Nutrition",
    category: "Capsules & Supplements",
    price: 1199,
    originalPrice: 1499,
    sku: "VN-MVC-60",
    stockStatus: "In Stock",
    shortIntroduction: "Complete Nutrition. Better Health. Better Life.",
    description: "Vedique Nutrition Multi Vitamin Capsule is a powerful blend of essential vitamins and minerals designed to support your daily nutritional needs, helping you stay active, healthy, and strong every single day. Whether you're managing a busy lifestyle or simply want to fill nutritional gaps, this complete daily multivitamin supports immunity, energy, brain function, bone strength, and overall wellbeing in one easy-to-take capsule.",
    benefits: [
      "Supports immunity — strengthens the body's natural defence system",
      "Boosts energy — helps fight fatigue and keeps you active all day",
      "Supports brain health — helps improve memory, focus and mental clarity",
      "Strong bones & teeth — supports calcium absorption and bone health",
      "Improves overall health — helps in the proper functioning of the body",
      "Supports metabolism — helps convert food into energy",
      "Healthy skin, hair & nails — nourishes from within",
      "Maintains heart health — supports cardiovascular health and function"
    ],
    ingredients: "Each capsule contains (approx.): Vitamin A, Vitamin C, Vitamin D3, Vitamin E, Vitamin B1, B2, B3, B6, Folic Acid, Vitamin B12, Biotin, Calcium, Iron, Zinc, Magnesium, Selenium, Copper, Manganese, Iodine",
    dosage: "1 capsule daily after meal",
    directions: ["Take 1 capsule daily after a meal, or as directed by your healthcare professional."],
    suitableFor: ["All age groups"],
    certifications: ["GMP Certified", "ISO 9001:2015", "AYUSH Certified", "FSSAI Approved", "Lab Tested", "100% Natural"],
    claims: ["100% vegetarian, no animal ingredients", "No added sugar, no artificial colour, no harmful chemicals"],
    packaging: {
      netQuantity: "60 Capsules",
      form: "Capsule"
    },
    additionalNotes: "Food supplements should not be used as a substitute for a varied and balanced diet. Consult your healthcare professional before use.",
    images: ["/images/placeholder-main.jpg"]
  },
  {
    id: "ortho-care-juice",
    name: "Ortho Care Juice",
    brand: "Vedique Nutrition",
    category: "Juices & Tonics",
    price: 2499,
    sku: "VN-OCJ-1000",
    stockStatus: "In Stock",
    shortIntroduction: "A Revolutionary Herbal Formula for Pain Relief & Better Joint Mobility.",
    description: "Vedique Nutrition's Ortho Care Juice is a revolutionary Ayurvedic herbal formula crafted to relieve joint and muscular pain while supporting better flexibility, mobility, and long-term bone strength. Packed with powerful anti-inflammatory herbs, this juice supports faster recovery and regeneration, making it an ideal daily companion for anyone dealing with joint discomfort or looking to stay active and mobile at every age.",
    benefits: [
      "Helps relieve joint & muscular pain",
      "Supports flexibility & mobility",
      "Supports bone strength & density",
      "Powerful anti-inflammatory support",
      "Supports faster recovery & regeneration"
    ],
    ingredients: "Each 10 ml contains: Hadjod (Cissus quadrangularis) 1.0 ml, Kurchi (Holarrhena antidysenterica) 0.5 ml, Sunthi (Zingiber officinale) 1.0 ml, Ashwagandha (Withania somnifera) 1.0 ml, Moringa (Moringa oleifera) 1.0 ml, Nirgundi (Vitex negundo) 0.5 ml, Gandhapura tail (Gaultheria fragrantissima) 1.0 ml, Baal chhal (Mimusops elengi) 2.0 ml, Ama haldi (Curcuma amada) 1.0 ml, Erand mul (Ricinus communis) 1.0 ml",
    nutritionalInfo: {
      "Energy": "11.84 kcal",
      "Carbohydrate": "2.38 g",
      "Protein": "0.0 g",
      "Total Fat": "0.0 g",
      "Vitamin C": "5.89 mg",
      "Iron": "0.18 mg",
      "Calcium": "9.20 mg"
    },
    directions: ["Shake well before use. Take as directed on the label or as advised by your healthcare professional."],
    certifications: ["HACCP", "ISO", "GMP", "AYUSH", "Make in India"],
    claims: ["100% natural ingredients, no added sugar", "Ayurvedic proprietary medicine"],
    manufacturing: {
      shelfLife: "18 months from date of manufacturing",
      marketedBy: "SK Holdings, Mumbai, Maharashtra, India",
      manufacturer: "Fantastica Herbs Pvt. Ltd., Jaipur, Rajasthan"
    },
    packaging: {
      netQuantity: "1000 ml"
    },
    additionalNotes: "This is an Ayurvedic proprietary medicine. Please consult your healthcare professional before use if you have an existing joint or bone condition.",
    images: ["/images/placeholder-main.jpg"]
  },
  {
    id: "sandhiveda-oil",
    name: "Sandhiveda Orthocare Oil",
    brand: "Satvam Wellness",
    category: "Oils & Topicals",
    price: 349,
    sku: "SW-SO-100",
    stockStatus: "In Stock",
    shortIntroduction: "Power of Ayurveda — Care for Your Joints.",
    description: "Satvam Wellness Sandhiveda Orthocare Oil is a doctor-curated Ayurvedic joint care formula designed to relieve joint and muscular pain, ease stiffness, and support long-term joint health through regular herbal massage. Enriched with traditional herbs like Nirgundi, Hadjod, Haldi, and Mahanarayan Oil, this lightweight, non-sticky oil absorbs easily and is trusted for daily use by people managing arthritis, sprains, gout, and general joint discomfort — backed by over 70 years of manufacturing trust.",
    benefits: [
      "Supports joint comfort — helps reduce discomfort and stiffness in joints",
      "Helps improve mobility — supports better flexibility and range of movement",
      "Supports joint strength — nourishes joints and muscles for better strength",
      "Supports joint health — promotes overall joint health and function"
    ],
    ingredients: "Each 100 ml contains: Nirgundi 666 mg, Sitab 666 mg, Maida Wood 666 mg, Saunth 666 mg, Vacha 666 mg, Lehsun 666 mg, Hadjod 666 mg, Haldi 666 mg, Ajwain 333 mg, Kapoor 10 mg, Menthol 5 mg, Kuchla 1.8 mg, Sendha Namak 1.8 mg, Vatsnabh 1.6 mg, Madar 1.3 mg, Sirish 1.3 mg, Dhatura 1.3 mg. Oil base: Mahanarayan Oil 20 ml, Mahavishgarbh Oil 20 ml, Wintergreen Oil 10 ml, Mustard Oil 8 ml, Alsi 3 ml, Pine Oil 2 ml, Til Oil 2 ml, Castor Oil 2 ml, Eucalyptus 2 ml, Capsicum 1 ml, Oil base q.s.",
    directions: ["Take sufficient quantity of oil and gently massage on the affected joints and surrounding area.", "For best results, use twice daily or as directed by the physician."],
    certifications: ["GMP", "ISO", "Made in India", "Ayurvedic Formula", "Safe & Effective"],
    claims: ["70+ years of manufacturing trust", "100% natural Ayurvedic formula with no side effects", "Doctor recommended"],
    manufacturing: {
      mfgLicNo: "771 Ay-Pb",
      manufacturer: "Dharamvir Ayurveda Pvt. Ltd., Mohali, Punjab",
      marketedBy: "SK Holdings Pvt. Ltd., Mumbai, Maharashtra, India"
    },
    packaging: {
      netQuantity: "100 ml"
    },
    precautions: "For external use only. Avoid contact with eyes, mucous membranes, or broken skin. Shake well before use and keep away from children. Discontinue and consult a physician if irritation occurs.",
    images: ["/images/placeholder-main.jpg"]
  },
  {
    id: "sandhiveda-capsules",
    name: "Sandhiveda Orthocare Capsules",
    brand: "Satvam Wellness",
    category: "Capsules & Supplements",
    price: 549,
    sku: "SW-SC-30",
    stockStatus: "In Stock",
    shortIntroduction: "Ayurvedic Joint Care Formula — Supports Joint Comfort & Strength.",
    description: "Satvam Wellness Sandhiveda Orthocare Capsules bring the same trusted joint-care formula from the Sandhiveda range into a convenient capsule form — supporting joint comfort, mobility, and strength from within. Formulated with pure, original Ayurvedic herbs and backed by 70+ years of manufacturing trust, these capsules are ideal for anyone looking to complement topical joint care with an internal wellness routine.",
    benefits: [
      "Supports joint comfort",
      "Helps improve mobility",
      "Supports joint strength",
      "Supports joint health"
    ],
    directions: ["Take as directed on the label or as advised by a certified healthcare professional."],
    suitableFor: ["Joint comfort, mobility & strength support"],
    certifications: ["ISO", "GMP", "Lab Tested", "100% Natural Ayurvedic"],
    claims: ["70+ years of manufacturing trust", "100% natural Ayurvedic formula with no side effects"],
    packaging: {
      netQuantity: "30 Capsules",
      form: "Capsule"
    },
    additionalNotes: "Please consult your healthcare professional before starting any new supplement, especially if you have an existing medical condition or are on medication.",
    images: ["/images/placeholder-main.jpg"]
  },
  {
    id: "piles-care-juice",
    name: "Piles Care Juice",
    brand: "Vedique Nutrition",
    category: "Juices & Tonics",
    price: 2499,
    sku: "VN-PCJ-1000",
    stockStatus: "In Stock",
    shortIntroduction: "A Revolutionary Herbal Formula Made From Powerful Herbs — Natural Relief. Healthy You.",
    description: "Vedique Nutrition Piles Care Juice is a powerful Ayurvedic formula crafted with 108 potent herbs to provide natural relief from piles (hemorrhoids), easing pain, burning, swelling, and irritation associated with dry and bleeding piles. This revolutionary herbal blend helps treat both internal and external hemorrhoids, supports soft and easy bowel movement, and promotes overall digestive and intestinal health — helping you feel comfortable and confident again.",
    benefits: [
      "Helps relieve pain, swelling, and burning from piles (hemorrhoids)",
      "Helps ease bleeding piles and external growths/lumps",
      "Helps in soft and easy bowel movement, providing relief from constipation",
      "Supports healthy intestines and digestive system",
      "Helps detoxify the body by removing toxins",
      "Boosts immunity for improved overall health"
    ],
    ingredients: "Each 10 ml contains: Amla (Emblica officinalis) 2.0 ml, Aloe Vera (Aloe barbadensis miller) 1.0 ml, Triphala (Terminalia chebula) 1.0 ml, Haritaki (Terminalia chebula) 0.5 ml, Baheda (Terminalia bellirica) 0.5 ml, Kutaj (Holarrhena antidysenterica) 0.5 ml, Giloy (Tinospora cordifolia) 0.5 ml, Neem (Azadirachta indica) 0.5 ml, Mulethi (Glycyrrhiza glabra) 0.2 ml, Nagkesar (Mesua ferrea) 0.2 ml",
    nutritionalInfo: {
      "Energy": "15.77 kcal",
      "Carbohydrate": "3.81 g",
      "Protein": "0.33 g",
      "Total Fat": "0.09 g",
      "Vitamin C": "30.35 mg",
      "Iron": "0.54 mg",
      "Calcium": "34.55 mg"
    },
    dosage: "Adults: 10–20 ml, twice daily, or as directed by your healthcare professional.",
    directions: ["Shake well before use."],
    certifications: ["HACCP", "ISO", "GMP", "108 Ayurvedic Herbs", "No Added Sugar"],
    claims: ["100% natural ingredients", "Ayurvedic proprietary medicine, safe & effective"],
    manufacturing: {
      shelfLife: "18 months from date of manufacturing",
      marketedBy: "SK Holdings, Mumbai, Maharashtra, India",
      manufacturer: "Fantastica4 Herbs Pvt. Ltd., Jaipur, Rajasthan"
    },
    packaging: {
      netQuantity: "1000 ml"
    },
    additionalNotes: "This is a dietary food supplement and is not intended to diagnose, treat, cure, or prevent any disease. Please consult a doctor for severe or persistent hemorrhoid symptoms.",
    images: ["/images/placeholder-main.jpg"]
  },
  {
    id: "zero-pain-plus",
    name: "Zero Pain+",
    variant: "Advanced Pain Relief Formula",
    brand: "Satvam Wellness",
    category: "Oils & Topicals",
    price: 499,
    badge: "Fast Relief",
    sku: "SW-ZP-60",
    stockStatus: "In Stock",
    shortIntroduction: "Fast Relief. Extra Strength. Muscle & Joint Care.",
    description: "Satvam Wellness Zero Pain+ is an advanced pain relief formula designed for fast, effective relief from joint pain, muscle pain, backache, sprains, strains, and inflammation. Formulated with potent extracts like Gaultheria fragrans, Boswellia serrata, Withania somnifera (Ashwagandha), and Curcuma longa (Turmeric), Zero Pain+ delivers extra-strength relief for people dealing with everyday aches or more persistent muscle and joint discomfort.",
    benefits: [
      "Fast relief from pain and discomfort",
      "Extra strength formula for tougher pain relief needs",
      "Supports muscle & joint care",
      "Helpful in joint pain, muscle pain, backache, sprains, strains and inflammation"
    ],
    ingredients: "Each 60 ml contains extracts of: Gaultheria fragrans 10 mg, Boswellia serrata 10 mg, Withania somnifera 4 mg, Curcuma longa 4 mg, Zingiber officinale 2 mg, Mentha arvensis 2 mg, Capsaicin 60 mcg",
    dosage: "As directed by the physician",
    directions: ["For external use only.", "Shake well before use."],
    storage: "Store in a cool, dry place.",
    certifications: ["Ayurveda Inspired Wellness Solutions"],
    manufacturing: {
      manufacturer: "Satvam Wellness Pvt. Ltd."
    },
    packaging: {
      netQuantity: "60 ml"
    },
    precautions: "For external use only. Keep out of reach of children. Discontinue use and consult a physician if irritation occurs.",
    images: ["/images/placeholder-main.jpg"]
  },
  {
    id: "sea-buckthorn-juice",
    name: "Sea Buckthorn Juice",
    brand: "Vedique Nutrition",
    category: "Juices & Tonics",
    price: 1899,
    originalPrice: 2199,
    sku: "VN-SBJ-500",
    stockStatus: "In Stock",
    shortIntroduction: "Trusted. Certified. Natural. — Premium Nano Curcumin Enriched Antioxidant Powerhouse.",
    description: "Vedique Nutrition Sea Buckthorn Juice is a premium antioxidant powerhouse enriched with Nano Curcumin for increased absorption, combining the goodness of Omega 3, 6, 7, and 9 fatty acids to support immunity, skin radiance, joint health, and overall vitality. Made with pure sea buckthorn berries and natural herbs, this juice is a delicious daily addition for anyone seeking a natural way to fight free radicals, support heart health, and boost everyday energy and stamina.",
    benefits: [
      "Supports immunity — strengthens the body's natural defence system",
      "Powerful antioxidant — helps fight free radicals and reduces oxidative stress",
      "Promotes healthy skin & hair — supports skin radiance and nourishes hair from within",
      "Supports joint & bone health — helps maintain flexibility and strengthens bones",
      "Aids digestion — supports healthy digestion and improves nutrient absorption",
      "Boosts energy & stamina — helps reduce fatigue and keeps you active all day",
      "Supports heart health — helps maintain healthy cholesterol levels and heart function",
      "Detoxifies the body — helps remove toxins and supports liver health"
    ],
    ingredients: "Made with pure Sea Buckthorn berries and herbs, enriched with Nano Curcumin for increased absorption. Contains Omega 3, 6, 7, and 9 fatty acids. No added sugar.",
    directions: ["Take 20–30 ml daily before meals, or as directed by your healthcare professional."],
    certifications: ["GMP Certified", "ISO 9001:2015", "AYUSH Certified", "FSSAI Approved", "Lab Tested", "100% Natural"],
    claims: ["No added sugar", "No artificial colour", "No harmful chemicals"],
    packaging: {
      netQuantity: "500 ml"
    },
    additionalNotes: "Food supplements should not be used as a substitute for a varied and balanced diet. Consult your healthcare professional before use.",
    images: ["/images/placeholder-main.jpg"]
  },
  {
    id: "himalayan-shilajit",
    name: "Himalayan Shilajit",
    brand: "URMLIFE",
    category: "Resins & Speciality",
    price: 1999,
    originalPrice: 2499,
    badge: "100% Pure",
    sku: "UL-HS-20",
    stockStatus: "In Stock",
    shortIntroduction: "Trusted. Certified. Pure. — 100% Pure & Authentic Himalayan Shilajit.",
    description: "URMLIFE Himalayan Shilajit is a 100% pure and natural resin sourced directly from the Himalayas, containing 75% Fulvic Acid to support strength, stamina, brain health, immunity, and overall vitality. An authentic Ayurvedic medicine, this potent resin is crafted for those seeking a powerful, natural boost to physical performance, energy levels, and men's health — backed by purity and certification you can trust.",
    benefits: [
      "Boosts strength & stamina — enhances physical performance and endurance",
      "Supports brain health — improves memory, focus & cognitive function",
      "Strengthens immunity — helps the body fight illness and infections",
      "Fights fatigue & stress — reduces tiredness and increases energy levels",
      "Supports men's health — improves vitality, libido & overall reproductive health",
      "100% natural & safe — pure, natural and free from harmful additives"
    ],
    ingredients: "100% pure and natural Himalayan Shilajit resin containing 75% Fulvic Acid.",
    directions: ["As directed by your healthcare professional. An Ayurvedic medicine intended for regular wellness support."],
    certifications: ["GMP Certified", "ISO Certified", "100% Natural"],
    claims: ["Contains 75% Fulvic Acid", "100% pure and natural resin sourced from the Himalayas"],
    packaging: {
      netQuantity: "20 g",
      form: "Resin"
    },
    additionalNotes: "This is an Ayurvedic medicine. Please consult your healthcare professional before use if you have an existing medical condition or are on medication.",
    images: ["/images/placeholder-main.jpg"]
  },
  {
    id: "swarn-rasayan-chyawanprash",
    name: "Swarn Rasayan Chyawanprash",
    brand: "Vedique Nutrition",
    category: "Resins & Speciality",
    price: 1200,
    sku: "VN-SRC-250",
    stockStatus: "In Stock",
    shortIntroduction: "The Royal Ayurvedic Rejuvenator — Ancient Ayurveda. Modern Wellness.",
    description: "Vedique Nutrition Swarn Rasayan Chyawanprash is a royal Ayurvedic rejuvenator enriched with Swarn Bhasma, Abhrak Bhasma, Rajat Bhasma, Ajwain, and pure Desi Ghee, combined with over 60 rare Ayurvedic herbs to deliver complete immunity, strength, energy, and mental clarity. Rooted in ancient Ayurvedic wisdom and crafted for modern wellness needs, this premium Chyawanprash supports respiratory health, digestion, memory, and overall rejuvenation — making it an ideal daily ritual for adults and the elderly alike.",
    benefits: [
      "Boosts immunity — helps strengthen the body's natural defence system",
      "Enhances energy & stamina — helps fight fatigue and keeps you active all day",
      "Improves memory & concentration — supports brain health and mental clarity",
      "Supports respiratory health — helps maintain healthy respiratory function",
      "Aids digestion & nutrition absorption — supports healthy digestion and nutrient absorption",
      "Promotes overall wellness — rejuvenates the body and supports overall well-being"
    ],
    ingredients: "Enriched with Swarn Bhasma, Abhrak Bhasma, Rajat Bhasma, Ajwain, and pure Desi Ghee, combined with 60+ rare Ayurvedic herbs.",
    dosage: "1–2 teaspoons (10–12g) twice daily",
    directions: ["Recommended usage: 1–2 teaspoons (10–12g) twice daily, or as directed by your healthcare professional."],
    suitableFor: ["Adults & elderly — daily health & immunity, long-term use"],
    certifications: ["GMP Certified", "ISO 9001:2015", "AYUSH Certified", "FSSAI Approved", "Lab Tested", "No Added Sugar"],
    claims: ["60+ rare Ayurvedic herbs crafted using ancient Ayurvedic wisdom", "No artificial colours, no preservatives — 100% natural & safe"],
    manufacturing: {
      marketedBy: "Vedique Nutrition"
    },
    packaging: {
      netWeight: "250 g"
    },
    additionalNotes: "This is an Ayurvedic wellness formula and is not intended to diagnose, treat, cure, or prevent any disease. Please consult your healthcare professional before use.",
    images: ["/images/placeholder-main.jpg"]
  }
];
