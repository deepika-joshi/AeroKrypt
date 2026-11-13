/**
 * AEROKRYPT - Student & Public Planetary Learning Centre Data
 * 
 * Accessible, scientifically grounded educational modules, concept explainers,
 * planetary terrain guides, and simplified research case studies for school students,
 * university undergraduates, and general science enthusiasts.
 */

export const LEARNING_AUDIENCES = [
  { id: 'ALL', label: 'All Levels' },
  { id: 'beginner', label: 'School Students & Beginners' },
  { id: 'intermediate', label: 'College & Undergraduates' },
  { id: 'enthusiast', label: 'General Space Enthusiasts' },
]

export const EDUCATIONAL_MODULES = [
  {
    id: 'edu-intro-terrains',
    title: 'Introduction to Mars & Moon Terrains',
    audience: 'beginner',
    readTime: '6 min read',
    icon: '🪐',
    summary: 'Discover how the surfaces of Mars and the Moon differ fundamentally from Earth, from ancient impact craters to colossal volcanoes.',
    sections: [
      {
        heading: 'Why Are Mars and the Moon Different from Earth?',
        content:
          'Earth is a living, active geological world shaped by plate tectonics, running water, plant life, and weather. In contrast, the Moon has had no atmosphere, no liquid water, and no active plate tectonics for billions of years. Mars had ancient lakes and rivers over 3.5 billion years ago, but today it is a freezing, hyper-arid desert with an atmosphere 160 times thinner than Earth’s.',
      },
      {
        heading: 'The Lunar Surface: Regolith and Maria',
        content:
          'The Moon’s surface is covered by a fine powdery dust called "regolith," created by billions of years of meteorite collisions pulverizing rock. The bright areas are the ancient lunar highlands, made of anorthosite rock. The dark patches, called "maria" (Latin for seas), are vast plains of basaltic lava that flowed into gigantic impact basins billions of years ago.',
      },
      {
        heading: 'The Martian Surface: Volcanoes and Ancient Deltas',
        content:
          'Mars hosts Olympus Mons, the largest volcano in the Solar System—three times taller than Mount Everest—and Valles Marineris, a canyon system that stretches across the width of the United States. Its reddish hue comes from iron oxide (rust) in the soil. Ancient river deltas, such as Jezero Crater where NASA’s Perseverance rover operates, prove liquid water once flowed across its plains.',
      },
    ],
    funFact: 'Because the Moon has no wind or rain, the footprints left by Apollo astronauts in 1969 will remain intact for millions of years!',
    quizQuestion: {
      question: 'Why does Mars appear reddish-orange from Earth?',
      options: ['Active red volcanic magma flows', 'Iron oxide (rust) covering its surface rocks', 'Reflected red light from the Sun', 'Atmospheric oxygen gas'],
      correctAnswer: 1,
      explanation: 'Mars is rich in iron minerals that oxidized over billions of years, creating iron oxide (rust) that dust storms scatter globally.',
    },
  },
  {
    id: 'edu-what-are-analogues',
    title: 'What Are Earth Analogue Locations?',
    audience: 'beginner',
    readTime: '5 min read',
    icon: '🌍',
    summary: 'Learn why planetary scientists travel to the most extreme, remote deserts, polar valleys, and volcanoes on Earth to study outer space.',
    sections: [
      {
        heading: 'The Concept of Planetary Analogues',
        content:
          'Sending missions to Mars or the Moon costs billions of dollars and takes years of preparation. If a rover wheel slips, a drill jams, or a sensor misidentifies a rock on Mars, scientists cannot fly out to repair it. An "analogue site" is an environment on Earth that shares specific physical, chemical, or geological traits with a location on another world.',
      },
      {
        heading: 'Testing Before Launching',
        content:
          'Scientists use Earth analogues as natural testing grounds. For example, before sending the Phoenix lander to Mars to dig into polar permafrost, engineers tested the drill in Antarctica’s McMurdo Dry Valleys. If the drill works in Antarctic ice-cemented soil at -20°C without breaking, it has a high chance of working on Mars.',
      },
      {
        heading: 'Key Analogue Categories',
        content:
          'Analogues are classified by the domain they replicate: Geochemical analogues replicate minerals (like acidic Río Tinto replicating Martian hematite); Geomorphological analogues replicate landforms (like impact craters at Haughton replicating lunar crater rims); and Astrobiological analogues replicate extreme survival limits (like the ultra-dry Atacama Desert).',
      },
    ],
    funFact: 'Astronauts on the Apollo missions trained in the volcanic basalt flows of Hawaii and Arizona to learn how to identify lunar rocks before flying to the Moon!',
    quizQuestion: {
      question: 'Which of the following CANNOT be replicated by an Earth analogue site?',
      options: ['Sub-zero permafrost soil', 'Volcanic lava tubes', 'Reduced Martian gravity (0.38G)', 'Acidic iron-sulfate minerals'],
      correctAnswer: 2,
      explanation: 'Every Earth analogue site is subject to Earth’s full 1.0G gravity (9.81 m/s²). Scientists must account for gravity divergence using physics models.',
    },
  },
  {
    id: 'edu-terrain-comparison-methods',
    title: 'How Are Planetary Terrain Comparisons Performed?',
    audience: 'intermediate',
    readTime: '8 min read',
    icon: '🔬',
    summary: 'A step-by-step scientific explanation of how satellite altimetry and field surveys are evaluated without making unproven assumptions.',
    sections: [
      {
        heading: '1. Topographic Elevation & Datum Differences',
        content:
          'On Earth, elevation is measured relative to sea level (the geoid). But the Moon and Mars have no oceans! On Mars, scientists define an artificial zero-elevation reference surface called the "MOLA Areoid," which is a gravitational equipotential surface (U₀ = 12,637,273 m²/s²) whose average equatorial radius is 3,396.0 km. Note that this gravitational areoid is distinct from the historical 1970s Viking atmospheric pressure datum (610 Pascals, the triple point of water). On the Moon, elevation is measured from a sphere with a radius of 1,737.4 km. Because reference surfaces differ, scientists never compare raw elevation numbers; instead, they measure local relief—the height difference between a valley floor and its surrounding ridges.',
      },
      {
        heading: '2. Slope Gradient Envelopes',
        content:
          'Planetary rovers have mechanical safety limits. Most robotic rovers (like Curiosity or Perseverance) can safely traverse typical slopes between 5° and 12°, but slopes above 15° cause dangerous wheel slippage, and slopes above 30° risk catastrophic tipping. Slope comparison evaluates whether the field site matches the planetary destination’s typical traverse corridors and hazard zones.',
      },
      {
        heading: '3. Surface Roughness & The Sub-Meter Data Gap',
        content:
          'Orbiting satellites can map large mountains easily, but rover wheels are small (50 cm diameter). An orbital satellite map with 30-meter resolution cannot see a 40-cm boulder that could flip a rover! This is called the "sub-meter roughness gap." Scientists must use drone photogrammetry or ground-based LiDAR at Earth analogue sites to measure millimeter-to-meter roughness.',
      },
      {
        heading: '4. Structural Gating (The Lava Tube Test)',
        content:
          'A planetary feature like a lunar skylight requires subterranean hollow pyroduct conduits. If an Earth candidate site has identical basaltic chemistry but lacks underground hollow tubes, it fails the structural gate for cave exploration, regardless of its chemical similarity.',
      },
    ],
    funFact: 'The Mars Orbiter Laser Altimeter (MOLA) fired laser pulses 10 times per second from 400 km above Mars, measuring elevation with an accuracy of approximately 1 meter!',
    quizQuestion: {
      question: 'Why can scientists NOT directly subtract Earth elevation from Mars elevation?',
      options: ['Earth is larger than Mars', 'There is no sea level on Mars; reference datums are fundamentally different', 'Elevation changes daily due to tides', 'Satellite lasers do not work on Mars'],
      correctAnswer: 1,
      explanation: 'Earth uses sea level (WGS 84 geoid), whereas Mars uses the MOLA Areoid equipotential datum. Comparisons must focus on local relief scale (Δh).',
    },
  },
  {
    id: 'edu-lava-tubes-discovery',
    title: 'Lava Tubes: Nature’s Underground Space Bases',
    audience: 'enthusiast',
    readTime: '7 min read',
    icon: '🌋',
    summary: 'Why hollow volcanic tunnels on the Moon and Mars could be the safest places for future human astronauts to build cities.',
    sections: [
      {
        heading: 'How Do Lava Tubes Form?',
        content:
          'When basaltic lava flows across a planetary surface, its exposed outer crust cools and solidifies into a hard rock roof while molten lava continues flowing underneath. When the volcanic eruption stops, the liquid lava drains out, leaving behind a massive hollow stone tunnel called a "pyroduct" or lava tube.',
      },
      {
        heading: 'The Perils of the Lunar Surface',
        content:
          'The surface of the Moon is hazardous: temperatures swing from +120°C in the day to -130°C at night, solar and cosmic radiation damages human DNA, and micrometeorites travel at 20 km/s. Building a habitat on the surface requires heavy, expensive lead shielding and massive thermal insulation.',
      },
      {
        heading: 'Natural Shields Beneath the Regolith',
        content:
          'Inside a lunar lava tube under 10 meters of solid basalt, the temperature remains constant at roughly -20°C, and cosmic radiation is 99.9% blocked. Because lunar gravity is one-sixth of Earth’s, lunar lava tubes can be hundreds of meters wide—large enough to fit a skyscraper or an entire subterranean base.',
      },
    ],
    funFact: 'In 2009, Japan’s SELENE/Kaguya spacecraft spotted a 65-meter-wide hole in the Marius Hills region of the Moon—the first confirmed roof collapse (skylight) opening into a lunar lava tube!',
    quizQuestion: {
      question: 'What is the primary advantage of a lunar lava tube over a surface habitat?',
      options: ['Abundant liquid drinking water', 'Natural shielding from cosmic radiation, temperature extremes, and micrometeorites', 'Earth-normal gravity inside the cave', 'Oxygen atmosphere trapped inside'],
      correctAnswer: 1,
      explanation: 'Thick basaltic cave roofs provide comprehensive natural shielding against ionizing radiation, micrometeorite strikes, and 250°C thermal swings.',
    },
  },
]

export const CASE_STUDIES_SIMPLIFIED = [
  {
    id: 'case-yungay-subsurface-radar',
    title: 'Subsurface Geophysical Mapping: Yungay Basin GPR & EMI Field Campaigns',
    targetBody: 'Mars',
    mission: 'Planetary Radar & Subsurface Geophysics (e.g. RIMFAX Groundwork)',
    analogueSite: 'Yungay Basin, Atacama Desert (Chile)',
    planetaryTarget: 'Martian Hyper-Arid Regolith & Layered Deposits',
    difficulty: 'Introductory',
    heroQuestion: 'How do planetary geophysicists test subsurface radar tools in desiccated desert soils?',
    theStory:
      'Planetary geophysicists conducted ground-penetrating radar (GPR) and electromagnetic induction (EMI) surveys in the hyper-arid core of the Atacama Desert near Yungay. Because Yungay receives almost no precipitation, the soil contains virtually no liquid pore water, creating dielectric permittivity properties that closely match desiccated Martian regolith. The field campaigns demonstrated that high-frequency radar pulses can penetrate several meters into hyper-arid nitrate and chloride salt horizons to map buried palaeosol boundaries. These terrestrial field surveys establish the dielectric baselines required to interpret subsurface radar sounding instruments (such as RIMFAX on Mars), without claiming that flight rovers or instruments physically operated in Chile.',
    keyTakeaway: 'Hyper-arid terrestrial geophysical surveys establish the dielectric calibration benchmarks needed to interpret subsurface radar sounding on Mars.',
  },
  {
    id: 'case-haughton-rover-testbed',
    title: 'Autonomous Mobility Testbeds: Devon Island Rover Navigation Field Trials',
    targetBody: 'Mars & Moon',
    mission: 'Planetary Rover Autonomous Navigation & Visual Odometry Development',
    analogueSite: 'Haughton Impact Structure (Devon Island, Canadian High Arctic)',
    planetaryTarget: 'Rocky Impact Basins & Unconsolidated Regolith',
    difficulty: 'Intermediate',
    heroQuestion: 'How do roboticists validate autonomous navigation algorithms without risking flight hardware?',
    theStory:
      'Rather than operating flight rovers in harsh terrestrial environments, roboticists from NASA Ames, the Mars Institute, and research universities deployed prototype analogue testbeds (such as the K10 and Nomad rovers) to Devon Island in the Canadian High Arctic. Documented in peer-reviewed robotics literature (e.g., Furgale et al., 2012; Lee et al., 2012), these autonomous rover testbeds navigated multi-kilometer traverses through unconsolidated dolomite impact breccia and boulder fields. Researchers measured wheel slip, sinkage, and stereo-vision visual odometry drift under true polar desert conditions. The resulting datasets directly validated computer vision, Sun-sensor localization, and slip-compensation algorithms that protect planetary flight rovers, without the flight vehicles ever visiting the terrestrial analogue.',
    keyTakeaway: 'Terrestrial robotic testbeds validate autonomous navigation and slip compensation algorithms under harsh field conditions before flight software deployment.',
  },
]

export const PLANETARY_GLOSSARY = [
  { term: 'Areoid', definition: 'The theoretical reference surface of Mars defined by a gravitational equipotential surface (U₀ = 12,637,273 m²/s²) whose average equatorial radius is 3,396.0 km. This gravitational datum is distinct from the historical 1970s Viking atmospheric pressure datum (610 Pascals, the triple point of water).' },
  { term: 'Analogue Site', definition: 'A terrestrial location that exhibits geological, environmental, or operational similarities to an extraterrestrial planetary body.' },
  { term: 'Regolith', definition: 'A layer of loose, heterogeneous superficial deposits covering solid rock, produced by impact gardening and space weathering on the Moon and Mars.' },
  { term: 'Pyroduct (Lava Tube)', definition: 'A natural subterranean conduit formed by flowing lava underneath the hardened surface of a basaltic lava flow.' },
  { term: 'Sub-meter Roughness', definition: 'Topographic roughness measured at scales smaller than 1 meter (gravel, cobbles, boulders) critical for rover wheel mobility but invisible to orbital satellites.' },
  { term: 'MOLA', definition: 'Mars Orbiter Laser Altimeter, an instrument aboard NASA’s Mars Global Surveyor that mapped the global topographic elevation of Mars.' },
  { term: 'LOLA', definition: 'Lunar Orbiter Laser Altimeter, an instrument on NASA’s Lunar Reconnaissance Orbiter that mapped the Moon’s topography with laser pulses.' },
]

