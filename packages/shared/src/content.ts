import type { AFRIKACard, AFRIKAPlan } from "./types";

const verifiedAt = "2026-06-12T09:00:00.000Z";

export const featuredCards: AFRIKACard[] = [
  {
    id: "lekki-conservation-centre",
    title: "Lekki Conservation Centre",
    location: "Lekki, Lagos",
    category: "Nature reserve",
    kind: "place",
    tags: ["canopy walk", "wetlands", "family", "weekend"],
    coordinates: { lat: 6.4364, lng: 3.5356 },
    timestamp: "2026-06-12T08:00:00.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/A_pathway_in_the_Lekki_Convention_Center.jpg/1400px-A_pathway_in_the_Lekki_Convention_Center.jpg",
      alt: "A raised pathway inside Lekki Conservation Centre"
    },
    intelligence: {
      summary: "A 78-hectare conservation reserve in Lekki, known for wetlands, boardwalks, birdlife, and one of Lagos's most familiar canopy walks.",
      whyItMatters: "It gives Lagos a rare pocket of quiet nature inside a city better known for speed, traffic, and concrete.",
      nearbyInsights: ["Go early before the boardwalk gets busy", "Pair it with a calm Lekki food stop", "Best for slow mornings, family visits, and first-time Lagos nature days"],
      recommendations: ["Plan a morning visit", "Open the map before leaving", "Save for a weekend reset"],
      comparison: "More nature-first than most Lekki leisure spots, but still easy to reach from the peninsula."
    },
    freshnessScore: 0.92,
    trustScore: 0.88,
    relevanceScore: 0.91,
    decayRate: 0.08,
    lastVerifiedAt: verifiedAt
  },
  {
    id: "nike-art-gallery-lagos",
    title: "Nike Art Gallery",
    location: "Lekki, Lagos",
    category: "Art gallery",
    kind: "culture",
    tags: ["art", "textiles", "craft", "gallery"],
    coordinates: { lat: 6.4315, lng: 3.4819 },
    timestamp: "2026-06-12T08:03:00.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Outside_Nike_Art_Gallery_%284202980259%29.jpg/1400px-Outside_Nike_Art_Gallery_%284202980259%29.jpg",
      alt: "Exterior of Nike Art Gallery in Lagos"
    },
    intelligence: {
      summary: "A major Lagos art gallery founded by Nike Davies-Okundaye, with thousands of works across painting, sculpture, textile, beadwork, and craft.",
      whyItMatters: "For visitors trying to understand Nigerian visual culture quickly, this is one of the city's strongest first stops.",
      nearbyInsights: ["Good before or after Lekki Conservation Centre", "Ask slowly; the building rewards unhurried looking", "Textile and beadwork sections carry deep craft history"],
      recommendations: ["Save for an art route", "Compare with Terra Kulture", "Visit with time to browse"],
      comparison: "More dense and craft-rich than a small white-cube gallery; less performance-led than Terra Kulture."
    },
    freshnessScore: 0.9,
    trustScore: 0.9,
    relevanceScore: 0.89,
    decayRate: 0.07,
    lastVerifiedAt: verifiedAt
  },
  {
    id: "freedom-park-lagos",
    title: "Freedom Park Lagos",
    location: "Lagos Island, Lagos",
    category: "Historic public space",
    kind: "culture",
    tags: ["history", "performance", "public space", "island"],
    coordinates: { lat: 6.4489, lng: 3.3965 },
    timestamp: "2026-06-12T08:06:00.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Tree_Growing_on_Fence_of_Freedom_Park_in_Lagos.jpg/1400px-Tree_Growing_on_Fence_of_Freedom_Park_in_Lagos.jpg",
      alt: "Trees and fencing inside Freedom Park Lagos"
    },
    intelligence: {
      summary: "A memorial and leisure park on the site of the former Broad Street Prison, now used for performances, gatherings, and quiet city breaks.",
      whyItMatters: "It turns a difficult colonial-era site into public memory, performance, and everyday civic life.",
      nearbyInsights: ["Works well with a Lagos Island history walk", "Evenings often feel more alive", "Check programming before going"],
      recommendations: ["Read the site's prison history", "Pair with Brazilian Quarter or Marina", "Save for live music nights"],
      comparison: "More reflective than a standard park, more public and casual than a museum."
    },
    freshnessScore: 0.86,
    trustScore: 0.86,
    relevanceScore: 0.84,
    decayRate: 0.09,
    lastVerifiedAt: verifiedAt
  },
  {
    id: "new-afrika-shrine",
    title: "New Afrika Shrine",
    location: "Ikeja, Lagos",
    category: "Live music venue",
    kind: "culture",
    tags: ["afrobeat", "live music", "nightlife", "felabration"],
    coordinates: { lat: 6.6018, lng: 3.3515 },
    timestamp: "2026-06-12T08:09:00.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Fela_New_Shrine%2C_Lagos_02.jpg/1400px-Fela_New_Shrine%2C_Lagos_02.jpg",
      alt: "Stage area at the New Afrika Shrine in Lagos"
    },
    intelligence: {
      summary: "An open-air entertainment venue in Ikeja connected to Fela Kuti's legacy and known for live music, Felabration, and Afrobeat culture.",
      whyItMatters: "It is one of Lagos's clearest living links between music history, nightlife, politics, and public energy.",
      nearbyInsights: ["Best experienced when music is programmed", "Expect a late-night rhythm", "Arrive with cash and patience for the crowd flow"],
      recommendations: ["Check event timing", "Plan transport before the night gets late", "Save for a Lagos music route"],
      comparison: "Less polished than a club, but much deeper as a cultural signal."
    },
    freshnessScore: 0.88,
    trustScore: 0.86,
    relevanceScore: 0.9,
    decayRate: 0.08,
    lastVerifiedAt: verifiedAt
  },
  {
    id: "terra-kulture-lagos",
    title: "Terra Kulture",
    location: "Victoria Island, Lagos",
    category: "Arts and culture centre",
    kind: "culture",
    tags: ["theatre", "books", "food", "culture"],
    coordinates: { lat: 6.4294, lng: 3.4219 },
    timestamp: "2026-06-12T08:12:00.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/46/Terra_Kulture_logo.jpeg",
      alt: "Terra Kulture identity image"
    },
    intelligence: {
      summary: "A Victoria Island culture centre with theatre, books, food, and regular programming around Nigerian arts and storytelling.",
      whyItMatters: "It is a practical Lagos stop for people who want culture that is accessible without feeling flattened into tourism.",
      nearbyInsights: ["Strong after-work stop from VI or Ikoyi", "Theatre schedules matter", "Good for pairing food with performance"],
      recommendations: ["Check the play calendar", "Build a VI culture evening", "Compare with Nike Art Gallery"],
      comparison: "More performance-led than Nike Art Gallery, more intimate than a large public venue."
    },
    freshnessScore: 0.84,
    trustScore: 0.8,
    relevanceScore: 0.83,
    decayRate: 0.1,
    lastVerifiedAt: verifiedAt
  },
  {
    id: "kwame-nkrumah-memorial-park",
    title: "Kwame Nkrumah Memorial Park",
    location: "Central Accra, Accra",
    category: "Memorial park",
    kind: "culture",
    tags: ["independence", "memorial", "museum", "history"],
    coordinates: { lat: 5.5444, lng: -0.2028 },
    timestamp: "2026-06-12T08:15:00.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Kwame_nkrumah_grave_accra_ghana.jpg/1400px-Kwame_nkrumah_grave_accra_ghana.jpg",
      alt: "Kwame Nkrumah Memorial Park and Mausoleum in Accra"
    },
    intelligence: {
      summary: "A central Accra memorial and mausoleum honoring Kwame Nkrumah, Ghana's first president and a defining figure in African independence politics.",
      whyItMatters: "It anchors Accra's independence memory in a place that is easy to visit, reflect on, and connect to the city's civic core.",
      nearbyInsights: ["Pair with Independence Square", "Best visited before midday heat", "Useful first stop for Ghana history context"],
      recommendations: ["Add to an Accra history route", "Visit the museum section", "Compare with Jamestown's coastal history"],
      comparison: "More formal and national than Jamestown; more reflective than Makola Market."
    },
    freshnessScore: 0.91,
    trustScore: 0.9,
    relevanceScore: 0.88,
    decayRate: 0.07,
    lastVerifiedAt: verifiedAt
  },
  {
    id: "jamestown-lighthouse-accra",
    title: "Jamestown Lighthouse",
    location: "Jamestown, Accra",
    category: "Coastal landmark",
    kind: "place",
    tags: ["coast", "architecture", "old accra", "fishing"],
    coordinates: { lat: 5.5331, lng: -0.2122 },
    timestamp: "2026-06-12T08:18:00.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/James_town_2.jpg/1400px-James_town_2.jpg",
      alt: "Jamestown Lighthouse in Accra"
    },
    intelligence: {
      summary: "A lighthouse in Accra's Jamestown district, replacing an earlier 19th-century structure and still tied to the area's fishing and coastal identity.",
      whyItMatters: "Jamestown shows Accra at street level: old architecture, boxing gyms, murals, fishing life, and coastal memory in one walkable district.",
      nearbyInsights: ["Go with a local guide if possible", "Light is strongest near late afternoon", "Respect residential and fishing spaces"],
      recommendations: ["Pair with Ussher Fort", "Save for a photo walk", "Compare with central Accra memorial sites"],
      comparison: "Less formal than the Nkrumah memorial, but richer for street-level observation."
    },
    freshnessScore: 0.85,
    trustScore: 0.84,
    relevanceScore: 0.87,
    decayRate: 0.1,
    lastVerifiedAt: verifiedAt
  },
  {
    id: "makola-market-accra",
    title: "Makola Market",
    location: "Central Accra, Accra",
    category: "Market district",
    kind: "movement",
    tags: ["market", "commerce", "textiles", "street life"],
    coordinates: { lat: 5.5478, lng: -0.2069 },
    timestamp: "2026-06-12T08:21:00.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Makola_Market_Entrance%2C_Accra%2C_Ghana.JPG/1400px-Makola_Market_Entrance%2C_Accra%2C_Ghana.JPG",
      alt: "Entrance to Makola Market in Accra"
    },
    intelligence: {
      summary: "A major Accra market and shopping district where textiles, produce, household goods, car parts, food, and everyday commerce overlap.",
      whyItMatters: "Makola is not a quiet attraction; it is Accra's working rhythm, especially the women traders who shape its pace.",
      nearbyInsights: ["Go light and move patiently", "Morning is easier than peak afternoon", "Textile routes are strongest with a clear purpose"],
      recommendations: ["Plan a short route", "Keep valuables simple", "Pair with central Accra landmarks"],
      comparison: "More intense than a heritage site, but more honest about daily Accra commerce."
    },
    freshnessScore: 0.89,
    trustScore: 0.86,
    relevanceScore: 0.9,
    decayRate: 0.08,
    lastVerifiedAt: verifiedAt
  },
  {
    id: "karura-forest-nairobi",
    title: "Karura Forest",
    location: "Nairobi, Kenya",
    category: "Urban forest",
    kind: "place",
    tags: ["forest", "walking", "cycling", "waterfall"],
    coordinates: { lat: -1.2403, lng: 36.8236 },
    timestamp: "2026-06-12T08:24:00.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Karura_Forest_Nairobi_05.JPG/1400px-Karura_Forest_Nairobi_05.JPG",
      alt: "Pathway through Karura Forest in Nairobi"
    },
    intelligence: {
      summary: "A large protected urban forest in Nairobi with walking and cycling routes, caves, waterfalls, and quieter green pockets.",
      whyItMatters: "Karura gives Nairobi a calm outdoor layer that works for fitness, thinking, family time, and a break from the city's work intensity.",
      nearbyInsights: ["Best before the day gets hot", "Cycling and walking feel different here", "Carry water and check entry requirements"],
      recommendations: ["Save for a quiet morning", "Compare with Nairobi National Park", "Add to a work-reset plan"],
      comparison: "More everyday and accessible than Nairobi National Park, less wildlife-focused but better for repeat visits."
    },
    freshnessScore: 0.9,
    trustScore: 0.88,
    relevanceScore: 0.89,
    decayRate: 0.08,
    lastVerifiedAt: verifiedAt
  },
  {
    id: "nairobi-national-park",
    title: "Nairobi National Park",
    location: "Nairobi, Kenya",
    category: "National park",
    kind: "place",
    tags: ["wildlife", "safari", "city edge", "morning"],
    coordinates: { lat: -1.3733, lng: 36.8589 },
    timestamp: "2026-06-12T08:27:00.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Lions_of_Kenya_02.jpg/1400px-Lions_of_Kenya_02.jpg",
      alt: "Lions in Nairobi National Park"
    },
    intelligence: {
      summary: "A national park established in 1946 just south of Nairobi, known for wildlife with the city skyline close by.",
      whyItMatters: "Few capitals offer this contrast so directly: wildlife, open grassland, and high-rise Nairobi in the same mental frame.",
      nearbyInsights: ["Early morning game drives are strongest", "Traffic timing can shape the whole visit", "Book with a clear pickup plan"],
      recommendations: ["Plan before sunrise", "Pair with a conservation stop", "Compare with Karura for a calmer green day"],
      comparison: "More dramatic than Karura Forest, but it requires more time and planning."
    },
    freshnessScore: 0.91,
    trustScore: 0.89,
    relevanceScore: 0.9,
    decayRate: 0.07,
    lastVerifiedAt: verifiedAt
  },
  {
    id: "nairobi-work-ecosystem",
    title: "Nairobi Work Ecosystem",
    location: "Kilimani and Westlands, Nairobi",
    category: "Startup and remote work insight",
    kind: "opportunity",
    tags: ["startup", "coworking", "remote work", "founders", "kilimani", "westlands"],
    coordinates: { lat: -1.2899, lng: 36.7898 },
    timestamp: "2026-06-12T08:28:30.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Nairobi_skyline.jpg/1400px-Nairobi_skyline.jpg",
      alt: "Nairobi skyline with commercial towers"
    },
    intelligence: {
      summary:
        "Kilimani and Westlands hold much of Nairobi's visible remote-work and startup rhythm, shaped by coworking spaces, founder meetups, and a reliable stream of cafes used as informal workrooms.",
      whyItMatters:
        "For people choosing where to work, meet, or plug into Nairobi's startup scene, this corridor gives the clearest mix of access, community, and everyday usefulness.",
      nearbyInsights: [
        "Coworking density is stronger on weekdays than weekends",
        "Traffic timing changes the whole experience, especially late afternoon",
        "Good fit for meetings, founder coffees, and repeat work sessions"
      ],
      recommendations: [
        "Pair this with a quiet cafe search",
        "Use it as a base for short work-focused stays",
        "Compare Kilimani's pace with Westlands before choosing a routine"
      ],
      comparison:
        "More work-shaped than a single venue and more flexible than relying on hotel lobbies or one-off cafe stops."
    },
    freshnessScore: 0.9,
    trustScore: 0.86,
    relevanceScore: 0.91,
    decayRate: 0.07,
    lastVerifiedAt: verifiedAt
  },
  {
    id: "kigali-genocide-memorial",
    title: "Kigali Genocide Memorial",
    location: "Gisozi, Kigali",
    category: "Memorial museum",
    kind: "culture",
    tags: ["memory", "history", "reflection", "museum"],
    coordinates: { lat: -1.9306, lng: 30.0605 },
    timestamp: "2026-06-12T08:30:00.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/%D7%90%D7%AA%D7%A8_%D7%94%D7%94%D7%A0%D7%A6%D7%97%D7%94_%D7%9C%D7%A8%D7%A6%D7%97_%D7%94%D7%A2%D7%9D_%D7%91%D7%A8%D7%95%D7%90%D7%A0%D7%93%D7%94_%D7%91%D7%A7%D7%99%D7%92%D7%90%D7%9C%D7%99_12.jpg/1400px-%D7%90%D7%AA%D7%A8_%D7%94%D7%94%D7%A0%D7%A6%D7%97%D7%94_%D7%9C%D7%A8%D7%A6%D7%97_%D7%94%D7%A2%D7%9D_%D7%91%D7%A8%D7%95%D7%90%D7%A0%D7%93%D7%94_%D7%91%D7%A7%D7%99%D7%92%D7%90%D7%9C%D7%99_12.jpg",
      alt: "Grounds of the Kigali Genocide Memorial"
    },
    intelligence: {
      summary: "A memorial in Kigali commemorating the 1994 genocide against the Tutsi, with a visitor centre and burial place for more than 250,000 victims.",
      whyItMatters: "It is a place for serious historical attention, not casual sightseeing; it gives context to Rwanda's present through memory and mourning.",
      nearbyInsights: ["Give yourself enough quiet time", "Avoid rushing into another activity afterward", "Best approached with respect and emotional space"],
      recommendations: ["Read before visiting", "Plan a slower day around it", "Save as a reflective Kigali stop"],
      comparison: "More emotionally demanding than most city museums, and more essential for understanding modern Kigali."
    },
    freshnessScore: 0.93,
    trustScore: 0.92,
    relevanceScore: 0.88,
    decayRate: 0.05,
    lastVerifiedAt: verifiedAt
  },
  {
    id: "stone-town-zanzibar",
    title: "Stone Town",
    location: "Zanzibar City, Tanzania",
    category: "Historic district",
    kind: "neighborhood",
    tags: ["unesco", "architecture", "coast", "history"],
    coordinates: { lat: -6.1624, lng: 39.1913 },
    timestamp: "2026-06-12T08:33:00.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/73/Zanzibar_sultan_palace.jpg",
      alt: "Historic waterfront buildings in Stone Town, Zanzibar"
    },
    intelligence: {
      summary: "The old part of Zanzibar City, known for layered Swahili, Arab, Indian, and European architectural history along the island's coast.",
      whyItMatters: "Stone Town is a compact lesson in trade, migration, religion, colonial history, and coastal African urban life.",
      nearbyInsights: ["Walk early or near sunset", "Doors, alleys, and courtyards matter as much as landmarks", "A guide helps connect the layers"],
      recommendations: ["Build a slow walking route", "Pair with the waterfront", "Save for cultural travel planning"],
      comparison: "More layered than a beach stop; more walkable and atmospheric than a single museum."
    },
    freshnessScore: 0.88,
    trustScore: 0.88,
    relevanceScore: 0.87,
    decayRate: 0.08,
    lastVerifiedAt: verifiedAt
  },
  {
    id: "addis-mercato",
    title: "Addis Mercato",
    location: "Addis Ababa, Ethiopia",
    category: "Open-air market",
    kind: "movement",
    tags: ["market", "commerce", "movement", "street life"],
    coordinates: { lat: 9.0306, lng: 38.7389 },
    timestamp: "2026-06-12T08:36:00.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/MercatoAddisAbeba08.jpg/1400px-MercatoAddisAbeba08.jpg",
      alt: "Street activity in Addis Mercato"
    },
    intelligence: {
      summary: "A large open-air marketplace and neighborhood in Addis Ababa's Addis Ketema district, known for dense movement and everyday trade.",
      whyItMatters: "Mercato shows Addis through exchange, logistics, repair, food, fabric, and constant negotiation.",
      nearbyInsights: ["Go with a purpose or a guide", "Morning is easier to read than peak rush", "Move slowly; the market is a system, not a checklist"],
      recommendations: ["Keep the route short", "Focus on one product area", "Save for urban movement research"],
      comparison: "Similar in intensity to Makola, but with Addis's own rhythm, language, and street structure."
    },
    freshnessScore: 0.86,
    trustScore: 0.84,
    relevanceScore: 0.88,
    decayRate: 0.09,
    lastVerifiedAt: verifiedAt
  },
  {
    id: "zeitz-mocaa-cape-town",
    title: "Zeitz MOCAA",
    location: "V&A Waterfront, Cape Town",
    category: "Contemporary art museum",
    kind: "culture",
    tags: ["contemporary art", "museum", "architecture", "waterfront"],
    coordinates: { lat: -33.9084, lng: 18.423 },
    timestamp: "2026-06-12T08:39:00.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Zeitz_Museum_of_Contemporary_Art_Africa%2C_Cape_Town_%28_1050775%29.jpg/1400px-Zeitz_Museum_of_Contemporary_Art_Africa%2C_Cape_Town_%28_1050775%29.jpg",
      alt: "Exterior of Zeitz Museum of Contemporary Art Africa in Cape Town"
    },
    intelligence: {
      summary: "A public non-profit museum in Cape Town focused on contemporary art from Africa and its diaspora, housed in a converted grain silo.",
      whyItMatters: "It gives African contemporary art a large civic platform while the building itself tells a story about reuse and port-city architecture.",
      nearbyInsights: ["Works well with a Waterfront afternoon", "Leave time for the building interior", "Check exhibitions before going"],
      recommendations: ["Plan a museum half-day", "Compare with smaller gallery districts", "Save for contemporary art routes"],
      comparison: "More institutional than local galleries, but stronger for seeing large-scale contemporary African work."
    },
    freshnessScore: 0.89,
    trustScore: 0.89,
    relevanceScore: 0.86,
    decayRate: 0.08,
    lastVerifiedAt: verifiedAt
  },
  {
    id: "bo-kaap-cape-town",
    title: "Bo-Kaap",
    location: "Cape Town, South Africa",
    category: "Historic neighborhood",
    kind: "neighborhood",
    tags: ["heritage", "cape malay", "streets", "color"],
    coordinates: { lat: -33.9208, lng: 18.4153 },
    timestamp: "2026-06-12T08:42:00.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Cape_Town_%28ZA%29%2C_Wale_Street_--_2024_--_3544.jpg/1400px-Cape_Town_%28ZA%29%2C_Wale_Street_--_2024_--_3544.jpg",
      alt: "Colorful houses on Wale Street in Bo-Kaap"
    },
    intelligence: {
      summary: "A historic Cape Town neighborhood on the slopes of Signal Hill, strongly associated with Cape Malay heritage and colorful streets.",
      whyItMatters: "Bo-Kaap is visually famous, but its deeper value is community memory, religion, food, and the politics of place.",
      nearbyInsights: ["Move respectfully; people live here", "Pair with food history instead of only photos", "Morning light is often cleaner for walking"],
      recommendations: ["Book a local food walk", "Read about Cape Malay history", "Avoid treating homes as props"],
      comparison: "More human and residential than a landmark; more delicate than a photo stop."
    },
    freshnessScore: 0.87,
    trustScore: 0.87,
    relevanceScore: 0.88,
    decayRate: 0.09,
    lastVerifiedAt: verifiedAt
  },
  {
    id: "kirstenbosch-garden",
    title: "Kirstenbosch National Botanical Garden",
    location: "Cape Town, South Africa",
    category: "Botanical garden",
    kind: "place",
    tags: ["garden", "table mountain", "plants", "picnic"],
    coordinates: { lat: -33.9875, lng: 18.4325 },
    timestamp: "2026-06-12T08:45:00.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Kirstenbosch_National_Botanical_Garden_2024_7th_batch_09.jpg/1400px-Kirstenbosch_National_Botanical_Garden_2024_7th_batch_09.jpg",
      videoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/00/Kirstenbosch_National_Botanical_Garden_2018-07-28.webm",
      alt: "Kirstenbosch National Botanical Garden below Table Mountain"
    },
    intelligence: {
      summary: "A botanical garden at the eastern foot of Table Mountain, part of South Africa's national botanical garden network.",
      whyItMatters: "Kirstenbosch makes Cape Town's plant life, mountain geography, and picnic culture feel immediately connected.",
      nearbyInsights: ["Go when the mountain is clear", "The canopy walkway changes the view", "Concert days alter the rhythm"],
      recommendations: ["Plan a slow afternoon", "Pair with Newlands or Constantia", "Save for a low-noise nature day"],
      comparison: "More cultivated than a hike, but more expansive than a city park."
    },
    freshnessScore: 0.9,
    trustScore: 0.9,
    relevanceScore: 0.89,
    decayRate: 0.07,
    lastVerifiedAt: verifiedAt
  },
  {
    id: "jemaa-el-fnaa-marrakech",
    title: "Jemaa el-Fnaa",
    location: "Marrakesh, Morocco",
    category: "Medina square",
    kind: "movement",
    tags: ["market", "storytelling", "food", "night"],
    coordinates: { lat: 31.6258, lng: -7.9894 },
    timestamp: "2026-06-12T08:48:00.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Djemaa_el_Fna.jpg/1400px-Djemaa_el_Fna.jpg",
      videoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Djemaa_el_Fna_Marrakech_Morocco.webm",
      alt: "Jemaa el-Fnaa square in Marrakesh"
    },
    intelligence: {
      summary: "A central square and marketplace in Marrakesh's medina, known for food stalls, performers, crowds, and evening transformation.",
      whyItMatters: "It is one of North Africa's clearest examples of public space becoming theatre, commerce, food, and movement after sunset.",
      nearbyInsights: ["Evening changes everything", "Choose food stalls patiently", "Keep the route simple inside the medina"],
      recommendations: ["Arrive before sunset", "Save for night energy", "Pair with the souks carefully"],
      comparison: "More performative than most markets, more kinetic than a monument."
    },
    freshnessScore: 0.9,
    trustScore: 0.88,
    relevanceScore: 0.91,
    decayRate: 0.08,
    lastVerifiedAt: verifiedAt
  },
  {
    id: "jardin-majorelle",
    title: "Jardin Majorelle",
    location: "Marrakesh, Morocco",
    category: "Garden and design site",
    kind: "place",
    tags: ["garden", "design", "color", "calm"],
    coordinates: { lat: 31.6428, lng: -8.0031 },
    timestamp: "2026-06-12T08:51:00.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Le_jardin_des_majorelle_40.JPG/1400px-Le_jardin_des_majorelle_40.JPG",
      alt: "Blue architecture and plants inside Jardin Majorelle"
    },
    intelligence: {
      summary: "A botanical and artist-designed garden in Marrakesh, known for bold blue architecture, planting, and a calmer pace than the medina.",
      whyItMatters: "It offers a designed counterpoint to Marrakesh's market intensity: color, shade, and controlled quiet.",
      nearbyInsights: ["Book timing matters during busy seasons", "Best as a calm morning stop", "Pair with medina energy later, not before"],
      recommendations: ["Save for a design route", "Visit before peak crowd", "Compare with Jemaa el-Fnaa's night energy"],
      comparison: "More curated and quiet than Jemaa el-Fnaa; less spontaneous but easier to absorb."
    },
    freshnessScore: 0.87,
    trustScore: 0.86,
    relevanceScore: 0.85,
    decayRate: 0.08,
    lastVerifiedAt: verifiedAt
  },
  {
    id: "goree-island-dakar",
    title: "Goree Island",
    location: "Dakar, Senegal",
    category: "Island memory site",
    kind: "culture",
    tags: ["island", "memory", "unesco", "history"],
    coordinates: { lat: 14.6669, lng: -17.3983 },
    timestamp: "2026-06-12T08:54:00.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Ile-de-goree.jpg/1400px-Ile-de-goree.jpg",
      alt: "Buildings on Goree Island near Dakar"
    },
    intelligence: {
      summary: "A small island commune off Dakar, widely visited for its layered memory, colonial architecture, and Atlantic history.",
      whyItMatters: "Goree holds beauty and grief together, making it a place where tourism needs historical seriousness.",
      nearbyInsights: ["Ferry timing shapes the day", "Do not rush the memorial context", "Walk beyond the most photographed areas"],
      recommendations: ["Plan around ferry schedules", "Read before visiting", "Save for a Dakar memory route"],
      comparison: "More emotionally charged than a coastal escape, more compact than a city museum route."
    },
    freshnessScore: 0.88,
    trustScore: 0.88,
    relevanceScore: 0.86,
    decayRate: 0.08,
    lastVerifiedAt: verifiedAt
  },
  {
    id: "khan-el-khalili-cairo",
    title: "Khan el-Khalili",
    location: "Cairo, Egypt",
    category: "Historic bazaar",
    kind: "movement",
    tags: ["bazaar", "craft", "old cairo", "night"],
    coordinates: { lat: 30.0475, lng: 31.2622 },
    timestamp: "2026-06-12T08:57:00.000Z",
    media: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/%D8%AE%D8%A7%D9%86_%D8%A7%D9%84%D8%AE%D9%84%D9%8A%D9%84%D9%8A_1.jpg/1400px-%D8%AE%D8%A7%D9%86_%D8%A7%D9%84%D8%AE%D9%84%D9%8A%D9%84%D9%8A_1.jpg",
      alt: "Khan el-Khalili bazaar in historic Cairo"
    },
    intelligence: {
      summary: "A famous bazaar in historic Cairo with roots in the Mamluk era, still active with craft, trade, cafes, and night movement.",
      whyItMatters: "It shows Cairo as layered commerce: old streets, tourist pressure, local routines, and craft economies sharing one dense district.",
      nearbyInsights: ["Night changes the atmosphere", "Move slowly through side lanes", "Pair with nearby Islamic Cairo landmarks"],
      recommendations: ["Save for an evening route", "Keep shopping expectations realistic", "Use the map to avoid looping"],
      comparison: "More historic and architectural than a modern mall, more negotiated than a curated market."
    },
    freshnessScore: 0.86,
    trustScore: 0.86,
    relevanceScore: 0.87,
    decayRate: 0.09,
    lastVerifiedAt: verifiedAt
  }
];

export const samplePlans: AFRIKAPlan[] = [
  {
    id: "lagos-culture-morning",
    title: "Lagos Culture Morning",
    type: "places to visit",
    items: [
      { id: "p1", title: "Start with Nike Art Gallery", cardId: "nike-art-gallery-lagos" },
      { id: "p2", title: "Slow down at Lekki Conservation Centre", cardId: "lekki-conservation-centre" },
      { id: "p3", title: "End with a performance if Terra Kulture has a show", cardId: "terra-kulture-lagos" }
    ]
  },
  {
    id: "accra-memory-and-market",
    title: "Accra Memory and Market Walk",
    type: "weekend plan",
    items: [
      { id: "p4", title: "Kwame Nkrumah Memorial Park", cardId: "kwame-nkrumah-memorial-park" },
      { id: "p5", title: "Makola Market with a clear shopping route", cardId: "makola-market-accra" },
      { id: "p6", title: "Late afternoon in Jamestown", cardId: "jamestown-lighthouse-accra" }
    ]
  },
  {
    id: "cape-town-calm-art-day",
    title: "Cape Town Calm Art Day",
    type: "trip",
    items: [
      { id: "p7", title: "Morning at Kirstenbosch", cardId: "kirstenbosch-garden" },
      { id: "p8", title: "Afternoon at Zeitz MOCAA", cardId: "zeitz-mocaa-cape-town" },
      { id: "p9", title: "Respectful Bo-Kaap walk", cardId: "bo-kaap-cape-town" }
    ]
  }
];
