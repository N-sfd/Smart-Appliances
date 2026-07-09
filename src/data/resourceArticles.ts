import { SchedulerServiceCategory } from './schedulerPrefill';
import { ResourceCategoryId } from './resourceCategories';

export interface ResourceArticleSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface ResourceArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: ResourceCategoryId;
  /** Target path under public/images/resources/ — falls back to an icon placeholder until a real photo is added. */
  image: string;
  imageAlt: string;
  readingTime: string;
  /** ISO date */
  publishedAt: string;
  /** ISO date — defaults to publishedAt when the guide has not been revised since it went live. */
  updatedAt?: string;
  featured?: boolean;
  /** Shown as a prominent warning banner near the top of the article when present. */
  safetyNotice?: string;
  intro: string;
  sections: ResourceArticleSection[];
  whenToCallPro: string[];
  relatedSlugs: string[];
  serviceCategory: SchedulerServiceCategory | null;
  schedulerProductName: string;
  /** Scheduler `serviceType` query param — defaults to 'R' (repair) when omitted, matching every existing article. */
  schedulerServiceType?: 'R' | 'I' | 'M' | 'E';
  ctaQuestion: string;
  ctaLabel: string;
}

export const GENERAL_DISCLAIMER =
  'This guide provides general informational guidance. Appliance and home-system conditions vary. Stop work and contact a qualified professional if you notice electrical hazards, gas odors, major leaks, fire risk, or unsafe conditions.';

export const ELECTRICAL_SAFETY_WARNING =
  'Electrical work can be dangerous. Turn off power when safe to do so and contact a qualified professional for hazardous or uncertain conditions.';

export const RESOURCE_ARTICLES: ResourceArticle[] = [
  {
    slug: 'refrigerator-not-cooling',
    title: 'Why Is My Refrigerator Not Cooling?',
    excerpt: 'A warm refrigerator usually comes down to one of a handful of common causes — here is what to check before you call for service.',
    category: 'appliance-care',
    image: '/images/resources/refrigerator-not-cooling.webp',
    imageAlt: 'Thermometer resting inside a refrigerator interior next to stored food',
    readingTime: '5 min read',
    publishedAt: '2026-01-12',
    featured: true,
    intro: 'A refrigerator that is running but not keeping food cold is one of the most common service calls we get. Before you assume the worst, a few quick checks can often point to the cause — and sometimes to a fix you can handle yourself.',
    sections: [
      {
        heading: 'Start with the temperature settings',
        paragraphs: [
          'It sounds obvious, but settings get bumped more often than you would think — by a child leaning on the control panel, a recent cleaning, or a power outage that reset the unit to a default.',
        ],
        bullets: [
          'Refrigerator compartment should read between 35–38°F',
          'Freezer compartment should read at or below 0°F',
          'Give the unit 24 hours to stabilize after any setting change',
        ],
      },
      {
        heading: 'Check the condenser coils',
        paragraphs: [
          'The condenser coils release the heat pulled out of your food compartment. When they are coated in dust, pet hair, or kitchen grease, the refrigerator has to work much harder — and often cannot keep up.',
          'Coils are usually located behind a lower front grille or on the back of the unit. Unplug the refrigerator, then vacuum or brush away visible buildup.',
        ],
      },
      {
        heading: 'Look for blocked vents',
        paragraphs: [
          'Cold air travels from the freezer to the refrigerator compartment through internal vents. Overpacked shelves, large containers pressed against the wall, or items blocking the vent covers can all restrict that airflow and cause uneven cooling.',
        ],
      },
      {
        heading: 'Inspect the door seals',
        paragraphs: [
          'A worn, torn, or sticky door gasket lets warm air leak in continuously, forcing the compressor to run nonstop without ever catching up. Run your hand along the seal to feel for gaps, or close the door on a piece of paper — if it slides out easily, the seal may need replacing.',
        ],
      },
    ],
    safetyNotice: undefined,
    whenToCallPro: [
      'The compressor runs constantly but the interior stays warm',
      'You notice pooling water, unusual odors, or a burning smell near the unit',
      'Coils and vents are clean but cooling has not improved after 24 hours',
      'Food has been at unsafe temperatures for more than two hours',
    ],
    relatedSlugs: ['freezer-frost-buildup', 'appliance-repair-or-replace', 'dishwasher-not-draining'],
    serviceCategory: 'Appliance',
    schedulerProductName: 'Refrigerator Repair',
    ctaQuestion: 'Still having refrigerator problems?',
    ctaLabel: 'Book Refrigerator Service',
  },
  {
    slug: 'washer-making-noise',
    title: 'Why Is My Washing Machine Making Noise?',
    excerpt: 'Banging, grinding, or squealing during a wash cycle usually has a specific cause — here is how to narrow it down.',
    category: 'appliance-care',
    image: '/images/resources/washer-noise.webp',
    imageAlt: 'Front-loading washing machine drum viewed from the open door',
    readingTime: '4 min read',
    publishedAt: '2026-01-26',
    intro: 'Every washing machine makes some noise, but loud banging, grinding, or squealing is your washer telling you something specific is wrong. Matching the sound to the likely cause can save you a diagnostic visit.',
    sections: [
      {
        heading: 'Unbalanced load',
        paragraphs: [
          'A heavy, lopsided banging during the spin cycle is almost always an unbalanced load — bedding and towels are common culprits. Pause the cycle, redistribute the items evenly around the drum, and restart.',
        ],
      },
      {
        heading: 'Foreign objects',
        paragraphs: [
          'Coins, buttons, or an underwire from a bra can work their way between the drum and the outer tub, causing a rattling or clanking sound. Check pockets before washing, and if the noise persists, the item may need to be retrieved by a technician.',
        ],
      },
      {
        heading: 'An unlevel machine',
        paragraphs: [
          'If the washer rocks or "walks" during spin, it may not be sitting level on the floor. Use a level to check side-to-side and front-to-back, and adjust the leveling feet as needed.',
        ],
      },
      {
        heading: 'Drain pump warning signs',
        paragraphs: [
          'A loud grinding or buzzing specifically during the drain portion of the cycle often points to a failing drain pump or an object caught in it — this is one of the more common reasons washers need professional service.',
        ],
      },
    ],
    whenToCallPro: [
      'The noise is a consistent grinding or squealing rather than an occasional bang',
      'You have already checked for an unbalanced load and unlevel feet',
      'The machine vibrates or moves significantly during spin',
      'You suspect an object is lodged in the pump or drum',
    ],
    relatedSlugs: ['dryer-taking-too-long', 'appliance-repair-or-replace'],
    serviceCategory: 'Appliance',
    schedulerProductName: 'Washer Repair',
    ctaQuestion: 'Washer still not sounding right?',
    ctaLabel: 'Book Washer Service',
  },
  {
    slug: 'dryer-taking-too-long',
    title: 'Why Is My Dryer Taking Too Long to Dry Clothes?',
    excerpt: 'A dryer that needs two or three cycles to finish a load is usually fighting restricted airflow — and it is a fire-safety issue worth taking seriously.',
    category: 'appliance-care',
    image: '/images/resources/dryer-vent.webp',
    imageAlt: 'Flexible dryer vent hose being cleaned of built-up lint',
    readingTime: '5 min read',
    publishedAt: '2026-02-09',
    safetyNotice: 'Lint buildup in dryer vents is a leading cause of household fires. If clothes are taking noticeably longer to dry, or the dryer feels hot to the touch on the outside, stop using it and inspect the vent before running another cycle.',
    intro: 'A dryer that used to finish a load in 40 minutes and now needs an hour and a half is not just an inconvenience — it is usually a sign of restricted airflow, and that has real fire-safety implications.',
    sections: [
      {
        heading: 'Clean the lint filter every load',
        paragraphs: [
          'This is the simplest and most overlooked step. A lint filter that is even partially coated reduces airflow significantly. Clean it before every single load, not just when it looks full.',
        ],
      },
      {
        heading: 'Check for vent blockage',
        paragraphs: [
          'Lint that gets past the filter collects in the exhaust duct over time, especially at bends and near the outside vent flap. A professional dryer vent cleaning once a year is a good habit for most households.',
        ],
      },
      {
        heading: 'Do not overload the drum',
        paragraphs: [
          'Large or mixed loads (heavy items with lightweight ones) dry unevenly and take longer. Split oversized loads into two smaller ones when possible.',
        ],
      },
      {
        heading: 'Heating element issues',
        paragraphs: [
          'If the vent is clear and loads are reasonably sized but drying time is still long, the heating element itself may be underperforming — this typically requires a technician to diagnose safely.',
        ],
      },
    ],
    whenToCallPro: [
      'The dryer feels unusually hot on the outside or the exhaust smells hot/burnt',
      'You have cleaned the filter and checked the vent but drying time has not improved',
      'The vent hose is crushed, kinked, or longer than recommended for your model',
      'You notice lint accumulating around the dryer itself',
    ],
    relatedSlugs: ['washer-making-noise', 'appliance-repair-or-replace'],
    serviceCategory: 'Appliance',
    schedulerProductName: 'Dryer Repair',
    ctaQuestion: 'Dryer still running hot or slow?',
    ctaLabel: 'Book Dryer Service',
  },
  {
    slug: 'dishwasher-not-draining',
    title: 'Why Is My Dishwasher Not Draining?',
    excerpt: 'Standing water at the bottom of the tub after a cycle almost always traces back to one of a few blockage points.',
    category: 'appliance-care',
    image: '/images/resources/dishwasher-drain.webp',
    imageAlt: 'Dishwasher filter basket being lifted out for cleaning',
    readingTime: '4 min read',
    publishedAt: '2026-02-23',
    intro: 'Opening the dishwasher to find an inch of cloudy water sitting in the bottom is frustrating, but the cause is usually a blockage somewhere along the drain path rather than a failed pump.',
    sections: [
      {
        heading: 'Clean the filter basket',
        paragraphs: [
          'Most modern dishwashers have a removable filter at the bottom of the tub that traps food particles. If it has not been cleaned in a while, this is the most likely cause of poor drainage. Twist it out, rinse it under running water, and scrub away buildup.',
        ],
      },
      {
        heading: 'Check the drain hose for kinks',
        paragraphs: [
          'The drain hose that runs from the dishwasher to the garbage disposal or drain line can develop a kink, especially after the unit has been moved for cleaning or a countertop project.',
        ],
      },
      {
        heading: 'Look at the garbage disposal connection',
        paragraphs: [
          'If your dishwasher drains through the garbage disposal, a clogged disposal — or one that was never had its knockout plug removed on a new installation — will back water up into the dishwasher.',
        ],
      },
      {
        heading: 'Inspect the air gap or high loop',
        paragraphs: [
          'Under-sink air gaps and high-loop drain hoses prevent backflow, but they can also become a blockage point if debris collects there.',
        ],
      },
    ],
    whenToCallPro: [
      'The filter, drain hose, and disposal connection are all clear but water still stands',
      'You hear the drain pump running but water does not move',
      'Water is backing up into the sink during the dishwasher cycle',
      'The issue recurs shortly after you have cleared a blockage',
    ],
    relatedSlugs: ['prevent-plumbing-leaks', 'refrigerator-not-cooling'],
    serviceCategory: 'Appliance',
    schedulerProductName: 'Dishwasher Repair',
    ctaQuestion: 'Dishwasher still not draining?',
    ctaLabel: 'Book Dishwasher Service',
  },
  {
    slug: 'freezer-frost-buildup',
    title: 'What Causes Freezer Frost Buildup?',
    excerpt: 'A light frost is normal — a thick layer of ice usually means air is getting in somewhere it should not be.',
    category: 'appliance-care',
    image: '/images/resources/freezer-frost.webp',
    imageAlt: 'Frost and ice buildup along the interior wall of a freezer compartment',
    readingTime: '4 min read',
    publishedAt: '2026-03-09',
    intro: 'Some frost inside a freezer is completely normal, especially in older or manual-defrost models. But when ice starts building up thickly on the walls, shelves, or around the door, it is usually a sign that warm, humid air is getting inside more than it should.',
    sections: [
      {
        heading: 'Door seal problems',
        paragraphs: [
          'Just like with refrigerators, a worn or dirty freezer door gasket lets humid air in continuously, and that moisture freezes on contact with the cold interior surfaces.',
        ],
      },
      {
        heading: 'Frequent or prolonged door openings',
        paragraphs: [
          'Every time the door opens, warm air rushes in. Frequent opening, or leaving the door ajar even briefly, adds up to noticeably more frost over time.',
        ],
      },
      {
        heading: 'A failing defrost system',
        paragraphs: [
          'Frost-free freezers use a heating element on a timer to melt away small amounts of frost automatically. If that defrost heater, timer, or thermostat fails, ice can build up quickly and unevenly.',
        ],
      },
      {
        heading: 'Overpacking and blocked vents',
        paragraphs: [
          'Items pressed directly against the back wall or blocking internal vents can trap moist air in one spot, leading to a concentrated patch of ice.',
        ],
      },
    ],
    whenToCallPro: [
      'Frost returns heavily within a day or two of manually defrosting',
      'The door seal looks intact but frost is still building up quickly',
      'You hear clicking or buzzing from the back panel that was not there before',
      'Ice is affecting how well the door closes',
    ],
    relatedSlugs: ['refrigerator-not-cooling', 'appliance-repair-or-replace'],
    serviceCategory: 'Appliance',
    schedulerProductName: 'Refrigerator Repair',
    ctaQuestion: 'Freezer frost keeps coming back?',
    ctaLabel: 'Book Refrigerator Service',
  },
  {
    slug: 'appliance-repair-or-replace',
    title: 'Should You Repair or Replace Your Appliance?',
    excerpt: 'A simple way to weigh age, repair cost, and reliability before you decide.',
    category: 'repair-or-replace',
    image: '/images/resources/repair-or-replace.webp',
    imageAlt: 'Side-by-side comparison of an older appliance and a newer replacement model',
    readingTime: '5 min read',
    publishedAt: '2026-03-23',
    intro: 'When an appliance breaks down, the question is rarely just "can this be fixed" — it is usually "does fixing this actually make sense." A few practical factors can help you decide with more confidence.',
    sections: [
      {
        heading: 'The 50% rule of thumb',
        paragraphs: [
          'A common guideline: if the repair cost is more than 50% of the price of a new comparable unit, replacement is usually the better value — especially for an appliance already past the midpoint of its expected lifespan.',
        ],
      },
      {
        heading: 'Consider the appliance’s age',
        paragraphs: [
          'Typical lifespans vary widely: refrigerators and washers often run 10–13 years, dishwashers around 9–10 years, and dryers 10–13 years with regular maintenance. An appliance nearing or past that range is a better candidate for replacement when a major component fails.',
        ],
        bullets: [
          'Refrigerators: roughly 10–13 years',
          'Washers: roughly 10–13 years',
          'Dryers: roughly 10–13 years',
          'Dishwashers: roughly 9–10 years',
        ],
      },
      {
        heading: 'Factor in efficiency and running cost',
        paragraphs: [
          'Older appliances, particularly refrigerators and HVAC equipment, often use meaningfully more energy than current models. Lower monthly utility costs can offset some of the price difference over time.',
        ],
      },
      {
        heading: 'Weigh repair history',
        paragraphs: [
          'One isolated repair on an otherwise reliable unit is very different from a second or third significant repair within a couple of years. A pattern of failures is a stronger signal to replace.',
        ],
      },
    ],
    whenToCallPro: [
      'You are not sure whether the issue is a minor part or a major component failure',
      'The appliance is under warranty and repair cost estimates are needed',
      'You want a professional opinion before committing to a repair or a new purchase',
    ],
    relatedSlugs: ['refrigerator-not-cooling', 'dryer-taking-too-long', 'hvac-filter-guide'],
    serviceCategory: 'Appliance',
    schedulerProductName: 'Appliance Diagnostic',
    ctaQuestion: 'Not sure if it is worth repairing?',
    ctaLabel: 'Book a Diagnostic Visit',
  },
  {
    slug: 'electrical-safety-diy-or-pro',
    title: 'Electrical Safety: When to Call a Professional Instead of DIY',
    excerpt: 'Some electrical fixes are simple. Others are genuinely dangerous. Here is how to tell the difference.',
    category: 'electrical-safety',
    image: '/images/resources/electrical-safety.webp',
    imageAlt: 'Close-up of a residential electrical panel with labeled circuit breakers',
    readingTime: '6 min read',
    publishedAt: '2026-04-06',
    featured: true,
    safetyNotice: ELECTRICAL_SAFETY_WARNING,
    intro: 'Home electrical work sits at the intersection of "very doable" and "genuinely dangerous," and the line between the two is not always obvious. This guide focuses on the warning signs that mean it is time to stop and call a licensed professional.',
    sections: [
      {
        heading: 'Warning signs that mean stop immediately',
        paragraphs: [
          'The following conditions are not do-it-yourself territory. If you notice any of them, treat the situation as urgent.',
        ],
        bullets: [
          'A burning smell near an outlet, switch, or the electrical panel',
          'Visible sparks when plugging in or using a device',
          'Outlets, switches, or cover plates that feel warm to the touch',
          'A breaker that trips repeatedly, even after resetting',
          'Lights that flicker across multiple rooms, not just one bulb',
          'Exposed, frayed, or chewed wiring anywhere in the home',
          'Water pooling or dripping near outlets, panels, or fixtures',
        ],
      },
      {
        heading: 'Tasks that are generally lower-risk',
        paragraphs: [
          'Replacing a light bulb, resetting a tripped breaker once, or swapping a lamp cord are typically manageable for most homeowners with the power off. If you are ever uncertain, it is always safer to treat a task as higher-risk.',
        ],
      },
      {
        heading: 'Why panels and wiring are different',
        paragraphs: [
          'Anything involving the breaker panel, whole-circuit wiring, or connections behind walls carries a real risk of shock, arc flash, or fire if done incorrectly — and mistakes are not always obvious until much later. This work should be handled by a licensed electrician.',
        ],
      },
    ],
    whenToCallPro: [
      'Any burning smell, sparking, or scorch marks near electrical components',
      'Outlets or switches that feel warm, buzz, or spark when used',
      'A breaker that trips repeatedly or will not reset',
      'Flickering lights across more than one fixture or room',
      'Any exposed wiring or signs of rodent damage to cables',
      'Water intrusion anywhere near electrical equipment',
    ],
    relatedSlugs: ['smart-thermostat-benefits', 'garage-door-maintenance'],
    serviceCategory: 'Electrical',
    schedulerProductName: 'Electrical Inspection',
    ctaQuestion: 'Concerned about an electrical issue?',
    ctaLabel: 'Book Electrical Service',
  },
  {
    slug: 'lower-heating-bill',
    title: 'Simple Ways to Lower Your Heating Bill',
    excerpt: 'Small, low-cost changes that can noticeably reduce heating costs without sacrificing comfort.',
    category: 'hvac-energy',
    image: '/images/resources/lower-heating-cost.webp',
    imageAlt: 'Digital thermostat mounted on a wall showing heating controls',
    readingTime: '5 min read',
    publishedAt: '2026-04-20',
    featured: true,
    intro: 'Heating is typically one of the largest line items on a winter utility bill, but you do not need a system overhaul to bring it down. A handful of small habits and one-time fixes can add up to a meaningful difference.',
    sections: [
      {
        heading: 'Dial in your thermostat settings',
        paragraphs: [
          'Lowering your thermostat by even a few degrees while you are asleep or away can meaningfully reduce heating costs over a season. A programmable or smart thermostat makes this effortless.',
        ],
      },
      {
        heading: 'Replace your air filter on schedule',
        paragraphs: [
          'A clogged filter forces your system to work harder and run longer to reach the same temperature. This is one of the cheapest, highest-impact things you can do — see our filter guide for a full schedule.',
        ],
      },
      {
        heading: 'Seal obvious drafts',
        paragraphs: [
          'Gaps around windows, doors, and where pipes or cables enter the home let conditioned air escape. Weatherstripping and caulk are inexpensive and can be applied in an afternoon.',
        ],
      },
      {
        heading: 'Use sunlight and window coverings strategically',
        paragraphs: [
          'Open curtains on sun-facing windows during the day to bring in free heat, then close them at night to add an extra layer of insulation against the cold glass.',
        ],
      },
      {
        heading: 'Reverse your ceiling fans',
        paragraphs: [
          'Most ceiling fans have a switch to reverse the blade direction. Running them clockwise at low speed in winter gently pushes warm air (which naturally rises) back down into the room.',
        ],
      },
      {
        heading: 'Keep up with HVAC maintenance',
        paragraphs: [
          'A system that has not been serviced in a while often runs less efficiently. Routine maintenance helps catch small issues before they turn into bigger, more expensive ones.',
        ],
      },
    ],
    whenToCallPro: [
      'Your heating bill has increased noticeably without a change in usage',
      'One or more rooms are consistently colder than the rest of the home',
      'The system runs constantly but struggles to reach the set temperature',
      'It has been more than a year since your last HVAC maintenance visit',
    ],
    relatedSlugs: ['hvac-filter-guide', 'smart-thermostat-benefits'],
    serviceCategory: 'HVAC',
    schedulerProductName: 'HVAC Maintenance',
    ctaQuestion: 'Need help improving your heating system?',
    ctaLabel: 'Book HVAC Service',
  },
  {
    slug: 'hvac-filter-guide',
    title: 'How Often Should You Replace Your HVAC Filter?',
    excerpt: 'The right replacement schedule depends on your filter type, household, and system usage.',
    category: 'hvac-energy',
    image: '/images/resources/hvac-filter.webp',
    imageAlt: 'HVAC air filter being removed from a return air vent',
    readingTime: '4 min read',
    publishedAt: '2026-05-04',
    intro: 'A dirty HVAC filter is one of the most common — and most avoidable — causes of reduced efficiency and premature system wear. The right replacement interval depends on a few factors specific to your home.',
    sections: [
      {
        heading: 'General guidelines by filter type',
        paragraphs: [
          'Manufacturers publish ranges rather than a single number because usage varies so much household to household.',
        ],
        bullets: [
          'Basic fiberglass filters: about every 30 days',
          'Pleated filters (1–3 inch): roughly every 60–90 days',
          'High-efficiency (4–5 inch media) filters: roughly every 6–12 months',
        ],
      },
      {
        heading: 'What shortens the interval',
        paragraphs: [
          'Homes with pets, allergy sufferers, ongoing renovation dust, or heavy system usage during extreme weather should check filters more frequently than the general guideline — sometimes monthly regardless of filter type.',
        ],
      },
      {
        heading: 'How to check without guessing',
        paragraphs: [
          'Hold the filter up to a light source. If light struggles to pass through evenly, it is time to replace it, even if it has not reached the "typical" interval yet.',
        ],
      },
      {
        heading: 'Why it matters beyond air quality',
        paragraphs: [
          'A clogged filter restricts airflow, which makes your system run longer to reach the target temperature, increases energy use, and adds wear to the blower motor over time.',
        ],
      },
    ],
    whenToCallPro: [
      'You are unsure which filter size or type your system requires',
      'Airflow feels weak even with a fresh filter installed',
      'The system is unusually loud after a filter change',
      'It has been longer than a year since a full HVAC maintenance visit',
    ],
    relatedSlugs: ['lower-heating-bill', 'appliance-repair-or-replace'],
    serviceCategory: 'HVAC',
    schedulerProductName: 'HVAC Maintenance',
    ctaQuestion: 'Need a hand with HVAC maintenance?',
    ctaLabel: 'Book HVAC Service',
  },
  {
    slug: 'prevent-plumbing-leaks',
    title: 'Simple Ways to Prevent Common Plumbing Leaks',
    excerpt: 'Most household leaks are preventable with a few minutes of routine checking.',
    category: 'plumbing',
    image: '/images/resources/plumbing-leaks.webp',
    imageAlt: 'Technician inspecting a pipe connection under a kitchen sink',
    readingTime: '4 min read',
    publishedAt: '2026-05-18',
    intro: 'Plumbing leaks rarely start as a dramatic burst pipe — most begin small, slow, and easy to miss until they cause real damage. A short routine can catch problems early.',
    sections: [
      {
        heading: 'Check under-sink connections',
        paragraphs: [
          'Supply lines and P-traps under kitchen and bathroom sinks are common leak points. Feel around fittings for dampness every few months, and look for water stains or warped cabinet flooring.',
        ],
      },
      {
        heading: 'Watch appliance supply hoses',
        paragraphs: [
          'Washing machine and dishwasher supply hoses degrade over time, especially rubber ones. Braided stainless-steel replacements last longer and are worth the small upgrade cost.',
        ],
      },
      {
        heading: 'Monitor your water pressure',
        paragraphs: [
          'Consistently high water pressure stresses pipe joints, fittings, and appliance connections. A pressure regulator can help if your home’s pressure runs above the recommended range.',
        ],
      },
      {
        heading: 'Address slow drips right away',
        paragraphs: [
          'A dripping faucet or a toilet that runs intermittently is not just wasted water — it is often an early sign of a worn valve or seal that will get worse without attention.',
        ],
      },
      {
        heading: 'Know where your main shutoff is',
        paragraphs: [
          'In the event of a real leak, knowing how to shut off your home’s main water supply quickly can prevent minor damage from becoming a major one.',
        ],
      },
    ],
    whenToCallPro: [
      'You find water stains, warped flooring, or a musty smell with no obvious source',
      'Water pressure has dropped noticeably in part of the home',
      'A leak is active and you cannot locate or stop it at a fixture shutoff',
      'You suspect a leak inside a wall or under a slab',
    ],
    relatedSlugs: ['dishwasher-not-draining', 'electrical-safety-diy-or-pro'],
    serviceCategory: 'Plumbing',
    schedulerProductName: 'Leak Inspection',
    ctaQuestion: 'Noticed a leak or water damage?',
    ctaLabel: 'Book Plumbing Service',
  },
  {
    slug: 'smart-thermostat-benefits',
    title: 'Is a Smart Thermostat Worth It?',
    excerpt: 'What smart thermostats actually do differently, and who benefits most from installing one.',
    category: 'smart-home',
    image: '/images/resources/smart-thermostat.webp',
    imageAlt: 'Smart thermostat display mounted on an interior wall',
    readingTime: '4 min read',
    publishedAt: '2026-06-01',
    intro: 'Smart thermostats have moved well beyond a novelty. For a lot of households they pay for themselves through energy savings alone — but they are not automatically the right fit for everyone.',
    sections: [
      {
        heading: 'Learning your schedule automatically',
        paragraphs: [
          'Instead of relying on you to program a schedule, many smart thermostats learn your routine over the first couple of weeks and adjust automatically — reducing heating and cooling when no one is likely to be home.',
        ],
      },
      {
        heading: 'Remote control and alerts',
        paragraphs: [
          'App-based control means you can adjust the temperature from anywhere, and many models will alert you to unusual temperature swings that could indicate a system problem.',
        ],
      },
      {
        heading: 'Energy usage reporting',
        paragraphs: [
          'Detailed usage history helps you spot patterns — like a system running longer than usual — that can be an early signal something needs maintenance.',
        ],
      },
      {
        heading: 'Where it makes the most sense',
        paragraphs: [
          'Households with variable schedules, larger homes, or an interest in tracking energy use tend to see the most benefit. If your schedule is highly consistent and you already keep a fixed setting, the savings will be smaller.',
        ],
      },
    ],
    whenToCallPro: [
      'You are unsure whether your existing wiring is compatible with a smart thermostat',
      'Your HVAC system uses multiple stages or zones and needs compatibility confirmed',
      'You want the thermostat professionally installed and configured',
    ],
    relatedSlugs: ['lower-heating-bill', 'hvac-filter-guide'],
    serviceCategory: 'Smart Home',
    schedulerProductName: 'Smart Thermostat Installation',
    ctaQuestion: 'Thinking about upgrading your thermostat?',
    ctaLabel: 'Book Smart Thermostat Installation',
  },
  {
    slug: 'garage-door-maintenance',
    title: 'Essential Garage Door Maintenance Tips',
    excerpt: 'A few minutes of routine care keeps your garage door running smoothly and safely.',
    category: 'garage-door',
    image: '/images/resources/garage-door-maintenance.webp',
    imageAlt: 'Close-up of garage door rollers and track hardware',
    readingTime: '4 min read',
    publishedAt: '2026-06-15',
    intro: 'Your garage door is one of the largest moving parts in your home, and it gets used more often than most people realize. A simple maintenance routine goes a long way toward preventing breakdowns and keeping it safe to operate.',
    sections: [
      {
        heading: 'Look and listen',
        paragraphs: [
          'Watch the door move through a full open-and-close cycle every few months. It should move smoothly and quietly. Grinding, jerking, or uneven movement are early warning signs worth addressing.',
        ],
      },
      {
        heading: 'Lubricate rollers, hinges, and tracks',
        paragraphs: [
          'A light coat of garage-door-specific lubricant on rollers, hinges, and tracks a couple of times a year reduces wear and noise significantly. Avoid heavy grease, which attracts dirt.',
        ],
      },
      {
        heading: 'Test the auto-reverse safety feature',
        paragraphs: [
          'Place a roll of paper towels in the door’s path and close it. The door should reverse immediately on contact. If it does not, this is a safety issue that needs prompt attention.',
        ],
      },
      {
        heading: 'Check the weatherstripping',
        paragraphs: [
          'The rubber seal along the bottom of the door keeps out drafts, moisture, and pests. Replace it if it is cracked, torn, or no longer sealing evenly against the floor.',
        ],
      },
      {
        heading: 'Never touch the springs',
        paragraphs: [
          'Torsion and extension springs are under extremely high tension and are one of the leading causes of serious garage door injuries. Spring adjustment and replacement should always be left to a trained technician.',
        ],
      },
    ],
    whenToCallPro: [
      'The door reverses inconsistently or fails the auto-reverse safety test',
      'You notice a visibly stretched, gapped, or broken spring',
      'The door is significantly off-balance or hangs unevenly when disconnected from the opener',
      'Cables, rollers, or tracks show visible damage or rust',
    ],
    relatedSlugs: ['electrical-safety-diy-or-pro', 'appliance-repair-or-replace'],
    serviceCategory: 'Garage Door',
    schedulerProductName: 'Garage Door Repair',
    ctaQuestion: 'Garage door not working like it should?',
    ctaLabel: 'Book Garage Door Service',
  },
  // ── Handyman ──────────────────────────────────────────────────────────────
  {
    slug: 'handyman-small-home-projects',
    title: 'Common Small Home Projects a Handyman Can Help With',
    excerpt: 'From furniture assembly to drywall patching, here is a look at the small home projects a handyman handles most often — and when it makes sense to book help.',
    category: 'handyman',
    image: '/images/resources/articles/handyman-small-home-projects.webp',
    imageAlt: 'Handyman completing a small home repair project',
    readingTime: '5 min read',
    publishedAt: '2026-02-09',
    featured: true,
    intro: 'Not every home project needs a specialist — a lot of the small jobs that pile up on a to-do list fall squarely into "handyman" territory. Here is a rundown of the most common requests we see, so you know what to expect before booking.',
    sections: [
      {
        heading: 'Furniture assembly',
        paragraphs: [
          'Flat-pack furniture is affordable and convenient to order, but assembly can eat up an entire afternoon — especially for larger pieces like wardrobes, bed frames, and sectional shelving.',
        ],
        bullets: ['Bookshelves, dressers, and wardrobes', 'Bed frames and headboards', 'Desks and office furniture', 'TV stands and media consoles'],
      },
      {
        heading: 'Wall hanging and shelf installation',
        paragraphs: [
          'Mirrors, shelves, curtain rods, and wall art all need to be mounted securely — which means finding the right anchor point for the wall type and weight involved.',
        ],
      },
      {
        heading: 'Drywall patching and minor repairs',
        paragraphs: [
          'Small nail holes, minor dents, and hairline cracks are common after moving furniture or taking down old décor. Left alone, they are mostly cosmetic — but a clean patch job makes a real difference before painting.',
        ],
      },
      {
        heading: 'Curtain rods and other quick fixes',
        paragraphs: [
          'Curtain rod installation, loose door hinges, sticking cabinet doors, and other five-minute annoyances are exactly the kind of small jobs worth batching into a single handyman visit.',
        ],
      },
      {
        heading: 'When it makes sense to book help',
        paragraphs: [
          'If a project involves heavy or wall-mounted items, multiple pieces of furniture, or you simply do not have the time or tools on hand, booking a handyman visit is usually faster and safer than tackling it solo.',
        ],
      },
    ],
    whenToCallPro: [
      'The project involves a heavy or wall-mounted item (TV, large mirror, cabinetry)',
      'You are assembling multiple furniture pieces in one visit',
      'A repair involves structural framing rather than a small patch',
      'You are unsure what type of wall anchor a job requires',
    ],
    relatedSlugs: ['tv-wall-mounting-checklist', 'wall-hanging-guide', 'drywall-repair-basics'],
    serviceCategory: 'Handyman',
    schedulerProductName: 'General Handyman Service',
    schedulerServiceType: 'I',
    ctaQuestion: 'Have a small home project on your list?',
    ctaLabel: 'Book Handyman Service',
  },
  {
    slug: 'furniture-assembly-tips',
    title: 'Furniture Assembly Tips Before Booking Help',
    excerpt: 'A little prep before your handyman arrives makes furniture assembly faster and smoother for everyone.',
    category: 'handyman',
    image: '/images/resources/articles/furniture-assembly-tips.webp',
    imageAlt: 'Flat-pack furniture parts and tools laid out before assembly',
    readingTime: '4 min read',
    publishedAt: '2026-02-11',
    intro: 'Furniture assembly usually goes quickly once a technician is on site — but a few minutes of preparation beforehand can save real time during the visit.',
    sections: [
      {
        heading: 'Check that all parts are present',
        paragraphs: [
          'Before your appointment, open the box and compare the contents against the parts list in the instructions. Missing hardware is one of the most common causes of assembly delays, and it is much easier to reorder a part beforehand than mid-appointment.',
        ],
      },
      {
        heading: 'Keep the instructions and hardware together',
        paragraphs: [
          'Keep the manual, the small parts bag, and any included tools in one place. If the original packaging is gone, a labeled bag or box works fine — just make sure nothing gets swept up and thrown out.',
        ],
      },
      {
        heading: 'Clear the work area',
        paragraphs: [
          'Assembly needs open floor space — clear a section of the room roughly the size of the finished piece, plus extra room to maneuver panels and tools.',
        ],
      },
      {
        heading: 'Estimate the number of items in advance',
        paragraphs: [
          'When booking, give an accurate count of how many pieces need assembly. A single bookshelf and a five-piece bedroom set call for very different amounts of time on site.',
        ],
        bullets: ['Note any heavy items (dressers, wardrobes)', 'Flag anything that will be wall-mounted once assembled', 'Mention if multiple rooms are involved'],
      },
    ],
    whenToCallPro: [
      'Parts appear missing, damaged, or mislabeled',
      'The piece will be mounted to a wall once assembled',
      'You are assembling several large items in one visit',
      'The manufacturer instructions call for two people',
    ],
    relatedSlugs: ['tv-wall-mounting-checklist', 'wall-hanging-guide', 'drywall-repair-basics'],
    serviceCategory: 'Handyman',
    schedulerProductName: 'General Handyman Service',
    schedulerServiceType: 'I',
    ctaQuestion: 'Ready to get that furniture assembled?',
    ctaLabel: 'Book Handyman Service',
  },
  {
    slug: 'wall-hanging-guide',
    title: 'Wall Hanging Guide: Pictures, Shelves, Mirrors, and Décor',
    excerpt: 'Hanging something securely comes down to knowing your wall type, the item’s weight, and using the right anchor — here is what to check first.',
    category: 'handyman',
    image: '/images/resources/articles/wall-hanging-guide.webp',
    imageAlt: 'Level and wall anchor hardware used for hanging a picture frame',
    readingTime: '5 min read',
    publishedAt: '2026-02-13',
    intro: 'A picture frame and a heavy mirror do not hang the same way. Getting wall hanging right is mostly about matching the anchor to the wall type and the weight of the item.',
    sections: [
      {
        heading: 'Identify your wall type first',
        paragraphs: [
          'Drywall, plaster, brick, and concrete all require different hardware. A stud finder can also tell you whether there is a wood or metal stud behind the surface, which is usually the strongest anchor point available.',
        ],
      },
      {
        heading: 'Match the anchor to the weight',
        paragraphs: [
          'Light frames can often use simple picture hooks, but anything heavier — mirrors, floating shelves, larger art — needs a weight-rated anchor or, ideally, a mounting point directly into a stud.',
        ],
        bullets: ['Picture hooks: lightweight frames only', 'Plastic or metal drywall anchors: moderate weight', 'Toggle bolts: heavier items without a stud', 'Direct stud mounting: heaviest and safest option'],
      },
      {
        heading: 'Level placement matters',
        paragraphs: [
          'A level placed against the frame or shelf before marking anchor points avoids the frustrating rehang. For multiple items, measuring and marking all points first keeps spacing even.',
        ],
      },
      {
        heading: 'When professional installation is the safer call',
        paragraphs: [
          'Heavy mirrors, floating shelves meant to hold real weight, and anything mounted above a bed or seating area are worth having installed professionally — the anchor has to be right the first time.',
        ],
      },
    ],
    whenToCallPro: [
      'The item is heavy, oversized, or mounted above a bed or seating area',
      'You are unsure what is behind the wall (electrical, plumbing, brick, concrete)',
      'A floating shelf needs to hold real weight, not just décor',
      'You are hanging multiple items and want them evenly leveled',
    ],
    relatedSlugs: ['tv-wall-mounting-checklist', 'drywall-repair-basics', 'handyman-small-home-projects'],
    serviceCategory: 'Handyman',
    schedulerProductName: 'General Handyman Service',
    schedulerServiceType: 'I',
    ctaQuestion: 'Want it hung level and secure the first time?',
    ctaLabel: 'Book Handyman Service',
  },
  {
    slug: 'drywall-repair-basics',
    title: 'Drywall Repair Basics: Small Holes, Cracks, and Patches',
    excerpt: 'Most small drywall damage is a straightforward patch job — here is how to tell the difference between a quick fix and something bigger.',
    category: 'handyman',
    image: '/images/resources/articles/drywall-repair-basics.webp',
    imageAlt: 'Drywall patch being smoothed over a small wall repair',
    readingTime: '4 min read',
    publishedAt: '2026-02-16',
    intro: 'Small nail holes, dents, and hairline cracks are some of the most common drywall issues in any home, and most are simple to patch cleanly before painting.',
    sections: [
      {
        heading: 'Small nail holes and dents',
        paragraphs: [
          'Small holes from picture hooks or minor dents from moved furniture are typically filled with lightweight spackle, sanded smooth, and ready to paint the same day.',
        ],
      },
      {
        heading: 'Hairline cracks',
        paragraphs: [
          'Cracks along corners or above doorways are common as a house settles. These are usually cosmetic, but recurring cracks in the same spot can point to a settling issue worth a closer look.',
        ],
      },
      {
        heading: 'Patching larger areas',
        paragraphs: [
          'Holes larger than a couple of inches typically need a patch piece and mesh tape rather than spackle alone, followed by a couple of thin coats of joint compound to blend with the surrounding wall.',
        ],
      },
      {
        heading: 'Painting after the repair',
        paragraphs: [
          'A patched area can look slightly different from the surrounding wall until it is primed and painted to match — texture matching is part of getting a clean, invisible repair.',
        ],
      },
      {
        heading: 'When larger damage needs a professional',
        paragraphs: [
          'Water-stained drywall, damage near electrical boxes, or holes larger than about a foot across usually call for a professional to make sure the repair is structurally sound, not just cosmetic.',
        ],
      },
    ],
    whenToCallPro: [
      'The damage is larger than a small patch (more than a few inches across)',
      'You notice water staining, soft spots, or a musty smell near the damage',
      'The repair is close to an outlet, switch, or other electrical fixture',
      'Cracks keep reappearing in the same location',
    ],
    relatedSlugs: ['tv-wall-mounting-checklist', 'wall-hanging-guide', 'handyman-small-home-projects'],
    serviceCategory: 'Handyman',
    schedulerProductName: 'General Handyman Service',
    schedulerServiceType: 'I',
    ctaQuestion: 'Got drywall damage that needs patching?',
    ctaLabel: 'Book Handyman Service',
  },
  // ── TV Mounting ───────────────────────────────────────────────────────────
  {
    slug: 'tv-mounting-cost-guide',
    title: 'TV Mounting Cost Guide: What Affects the Final Price?',
    excerpt: 'TV mounting pricing depends on more than just the TV itself — here is what actually factors into the final quote.',
    category: 'tv-mounting',
    image: '/images/resources/articles/tv-mounting-cost-guide.webp',
    imageAlt: 'Wall-mounted television setup in a living room',
    readingTime: '5 min read',
    publishedAt: '2026-02-18',
    featured: true,
    intro: 'TV mounting looks simple from the outside, but the final price depends on several factors specific to your setup. Here is what actually goes into a quote, so there are no surprises before work begins.',
    sections: [
      {
        heading: 'TV size and weight',
        paragraphs: [
          'Larger, heavier televisions need a more robust bracket and, in some cases, additional wall reinforcement — both of which affect the scope of the job compared to a smaller, lighter TV.',
        ],
      },
      {
        heading: 'Wall type and mount type',
        paragraphs: [
          'Drywall over wood studs is the most straightforward mounting surface. Brick, concrete, plaster, or a wall without a conveniently placed stud all require different hardware and more time.',
        ],
        bullets: ['Fixed mounts: simplest installation', 'Tilting mounts: added viewing-angle adjustment', 'Full-motion mounts: most flexible, most involved install'],
      },
      {
        heading: 'Wire concealment and outlet location',
        paragraphs: [
          'A clean, wire-free look usually means routing cables through an in-wall kit or a surface channel. If there is no outlet near the mounting height, that adds another step to the job.',
        ],
      },
      {
        heading: 'Soundbar setup and number of TVs',
        paragraphs: [
          'Adding a soundbar, connecting additional devices, or mounting more than one TV in a single visit all add to the scope — and the price — of the appointment.',
        ],
      },
      {
        heading: 'Getting a final quote before work begins',
        paragraphs: [
          'Final pricing varies by TV size, wall type, mount type, wire concealment, and installation complexity. Your technician reviews your specific setup and confirms pricing before any work starts, so you know what to expect.',
        ],
      },
    ],
    whenToCallPro: [
      'You are unsure what mount type is compatible with your TV',
      'The wall is brick, concrete, tile, or otherwise non-standard',
      'You want a completely wire-free look with in-wall concealment',
      'You are mounting more than one TV or adding a soundbar in the same visit',
    ],
    relatedSlugs: ['wall-hanging-guide', 'wire-concealment-guide', 'smart-thermostat-benefits'],
    serviceCategory: 'TV Mounting',
    schedulerProductName: 'TV Mounting',
    schedulerServiceType: 'I',
    ctaQuestion: 'Ready to get a quote for your TV mounting?',
    ctaLabel: 'Book TV Mounting',
  },
  {
    slug: 'tv-wall-mounting-checklist',
    title: 'TV Wall Mounting Checklist Before Your Appointment',
    excerpt: 'A few details ready ahead of time make your TV mounting appointment faster and help your technician arrive with the right hardware.',
    category: 'tv-mounting',
    image: '/images/resources/articles/tv-wall-mounting-checklist.webp',
    imageAlt: 'Checklist for a TV wall mounting appointment in a living room',
    readingTime: '4 min read',
    publishedAt: '2026-02-20',
    intro: 'A little preparation before your TV mounting appointment helps things go smoothly — here is what to have ready.',
    sections: [
      {
        heading: 'Know your TV size and have the mount ready',
        paragraphs: [
          'Confirm your TV’s screen size and VESA mounting-hole pattern (found in the manual or on the back of the TV). If you have already purchased a mount, have the box and hardware on hand; if not, your technician can recommend a compatible option.',
        ],
      },
      {
        heading: 'Check the wall type and preferred height',
        paragraphs: [
          'Think about how high you want the TV and which wall it is going on. If you know the wall is brick, concrete, or plaster rather than standard drywall, mention it when booking.',
        ],
      },
      {
        heading: 'Note the outlet location and cable plans',
        paragraphs: [
          'Look at where your nearest power outlet is relative to the planned mounting height — this affects whether cables run along the surface or through the wall.',
        ],
        bullets: ['Outlet location relative to the TV', 'Cable/satellite box or streaming device placement', 'Whether a soundbar is part of the setup', 'Furniture that needs to move out of the way'],
      },
      {
        heading: 'Clear the furniture placement',
        paragraphs: [
          'Move any furniture away from the wall ahead of time so your technician has clear access to the mounting area from floor to ceiling.',
        ],
      },
    ],
    whenToCallPro: [
      'You are not sure if your existing mount is compatible with your TV',
      'The wall is not standard drywall over wood studs',
      'You want wires fully concealed inside the wall',
      'You are mounting a very large or heavy TV',
    ],
    relatedSlugs: ['wall-hanging-guide', 'wire-concealment-guide', 'smart-thermostat-benefits'],
    serviceCategory: 'TV Mounting',
    schedulerProductName: 'TV Mounting',
    schedulerServiceType: 'I',
    ctaQuestion: 'Ready to book your TV mounting appointment?',
    ctaLabel: 'Book TV Mounting',
  },
  {
    slug: 'wire-concealment-guide',
    title: 'Wire Concealment for TV Mounting: What to Know',
    excerpt: 'A clean, wire-free look is one of the most requested add-ons for TV mounting — here is how it works and what to consider.',
    category: 'tv-mounting',
    image: '/images/resources/articles/wire-concealment-guide.webp',
    imageAlt: 'Concealed wiring behind a wall-mounted television',
    readingTime: '4 min read',
    publishedAt: '2026-02-23',
    intro: 'Visible cables hanging beneath a mounted TV are one of the most common complaints after a DIY install. Wire concealment solves it — here is what the options actually involve.',
    sections: [
      {
        heading: 'Surface wire covers',
        paragraphs: [
          'A paintable surface channel runs along the wall and can be matched to your paint color for a low-profile, budget-friendly option that does not require opening the wall.',
        ],
      },
      {
        heading: 'In-wall concealment considerations',
        paragraphs: [
          'Running cables inside the wall gives the cleanest possible look, but it depends on the wall type, what is already inside it, and local electrical code for how power cables can be routed in-wall.',
        ],
      },
      {
        heading: 'Outlet availability',
        paragraphs: [
          'If there is no outlet near the TV’s mounting height, your technician can discuss options such as an in-wall power relocation kit or a surface-mounted outlet extension.',
        ],
      },
      {
        heading: 'Safety comes first',
        paragraphs: [
          'Not every cable is rated to run inside a wall cavity, and power cables in particular need to be handled according to code. Your technician will confirm what is safe for your specific setup before starting.',
        ],
      },
    ],
    whenToCallPro: [
      'You want an in-wall power outlet added near the mounting height',
      'You are unsure whether your walls have insulation, blocking, or other obstructions',
      'The setup involves multiple devices and cable types',
      'You want the cleanest possible entertainment setup with no visible wiring',
    ],
    relatedSlugs: ['wall-hanging-guide', 'smart-thermostat-benefits', 'tv-mounting-cost-guide'],
    serviceCategory: 'TV Mounting',
    schedulerProductName: 'TV Mounting',
    schedulerServiceType: 'I',
    ctaQuestion: 'Want your wires completely out of sight?',
    ctaLabel: 'Book TV Mounting',
  },
  // ── Phone Repair ──────────────────────────────────────────────────────────
  {
    slug: 'phone-screen-repair-guide',
    title: 'Phone Screen Repair Guide: Cracks, Touch Issues, and Display Problems',
    excerpt: 'A cracked screen is not always just cosmetic — here is how to tell when a repair is urgent and what to do before your appointment.',
    category: 'phone-repair',
    image: '/images/resources/articles/phone-screen-repair-guide.webp',
    imageAlt: 'Smartphone repair on a technician workbench',
    readingTime: '4 min read',
    publishedAt: '2026-02-25',
    featured: true,
    intro: 'Screen damage ranges from a small cosmetic crack to a display that is no longer usable. Knowing the difference helps you decide how quickly to book a repair.',
    sections: [
      {
        heading: 'Cracked glass',
        paragraphs: [
          'A cracked but still-responsive screen is usually safe to keep using short-term, though the crack can spread over time and small glass shards along the edge are a cutting risk — a case or screen protector can help in the meantime.',
        ],
      },
      {
        heading: 'Touch not responding',
        paragraphs: [
          'Areas of the screen that do not register taps, or a touchscreen that registers phantom taps on its own, usually point to damage in the digitizer layer beneath the glass and typically need a full screen replacement.',
        ],
      },
      {
        heading: 'Display lines or a black screen',
        paragraphs: [
          'Colored lines, flickering, or areas that have gone completely black usually indicate damage to the display panel itself or its connection, rather than something fixable with a restart.',
        ],
      },
      {
        heading: 'When to stop using the device',
        paragraphs: [
          'Stop using the phone and book a repair promptly if you see glass separating from the frame, the screen is non-responsive, or you notice heat, swelling, or a burning smell — those go beyond a routine screen issue.',
        ],
      },
      {
        heading: 'Back up your device first',
        paragraphs: [
          'Before any repair, back up your photos and data through your phone’s standard cloud or computer backup. We do not need your passcode, IMEI, or account credentials to complete a screen repair.',
        ],
      },
    ],
    whenToCallPro: [
      'Touch is unresponsive or registers phantom input',
      'You see display lines, flickering, or a partially black screen',
      'Glass is separating from the frame or shedding shards',
      'The device shows any heat, swelling, or unusual smell',
    ],
    relatedSlugs: ['phone-battery-replacement-signs', 'charging-port-repair-guide', 'phone-repair-or-replace'],
    serviceCategory: 'Phone Repair',
    schedulerProductName: 'Screen Replacement',
    ctaQuestion: 'Dealing with a cracked or unresponsive screen?',
    ctaLabel: 'Book Phone Repair',
  },
  {
    slug: 'phone-battery-replacement-signs',
    title: 'Signs Your Phone Battery May Need Replacement',
    excerpt: 'A phone battery that drains fast, shuts off unexpectedly, or feels warm is telling you something — here are the signs worth paying attention to.',
    category: 'phone-repair',
    image: '/images/resources/articles/phone-battery-replacement-signs.webp',
    imageAlt: 'Phone battery icon representing battery health and replacement signs',
    readingTime: '4 min read',
    publishedAt: '2026-02-27',
    safetyNotice: 'If a battery is swollen, hot, leaking, or smells unusual, stop using the device immediately and seek professional help. Do not attempt to charge or puncture a swollen battery.',
    intro: 'Phone batteries naturally degrade over time, and the signs are usually gradual before they become impossible to ignore. Here is what to watch for.',
    sections: [
      {
        heading: 'Battery drains quickly',
        paragraphs: [
          'If your phone needs charging noticeably more often than it used to, even with similar usage habits, battery capacity has likely declined — most phones show battery health in their settings menu.',
        ],
      },
      {
        heading: 'Phone shuts off unexpectedly',
        paragraphs: [
          'A phone that powers off suddenly while showing 20-30% battery remaining is a classic sign of a battery that can no longer deliver consistent power under load.',
        ],
      },
      {
        heading: 'Overheating during normal use',
        paragraphs: [
          'Some warmth during charging or heavy use is normal, but a phone that gets hot during light, everyday tasks may have a battery working harder than it should.',
        ],
      },
      {
        heading: 'Charging problems',
        paragraphs: [
          'Charging that stalls, slows dramatically near the end, or never quite reaches 100% can point to the battery as well as the charging port — a technician can help pinpoint which one.',
        ],
      },
      {
        heading: 'The swelling warning sign',
        paragraphs: [
          'A swollen battery can cause the screen to lift or the back panel to bulge. This is a safety issue, not just a performance one — stop using the device and have it inspected as soon as possible.',
        ],
      },
    ],
    whenToCallPro: [
      'The phone shuts off well before it reaches 0% battery',
      'The device or battery feels swollen, hot, or emits an unusual smell',
      'Charging has become unreliable or unusually slow',
      'Battery health reporting in your settings shows significant degradation',
    ],
    relatedSlugs: ['charging-port-repair-guide', 'phone-repair-or-replace', 'phone-screen-repair-guide'],
    serviceCategory: 'Phone Repair',
    schedulerProductName: 'Screen Replacement',
    ctaQuestion: 'Noticing signs your battery is wearing out?',
    ctaLabel: 'Book Phone Repair',
  },
  {
    slug: 'charging-port-repair-guide',
    title: 'Charging Port Problems: Cable, Dirt, or Repair Needed?',
    excerpt: 'A phone that will not charge is not always a repair issue — here is how to rule out the simple causes first.',
    category: 'phone-repair',
    image: '/images/resources/articles/charging-port-repair-guide.webp',
    imageAlt: 'Close-up of a smartphone charging port during inspection',
    readingTime: '4 min read',
    publishedAt: '2026-03-02',
    intro: 'Before assuming the worst about a phone that will not charge, a few quick checks can rule out the most common — and easiest to fix — causes.',
    sections: [
      {
        heading: 'Check the cable',
        paragraphs: [
          'Frayed or damaged charging cables are one of the most common causes of charging problems. Try a different cable you know works before assuming the port itself is the issue.',
        ],
      },
      {
        heading: 'Check the adapter and outlet',
        paragraphs: [
          'Test a different wall adapter or outlet, and check for a low-power warning message on screen — some fast chargers are not compatible with every device.',
        ],
      },
      {
        heading: 'Look for debris in the port',
        paragraphs: [
          'Lint and dust build up in charging ports over time and can block a solid connection. A dry, soft brush or a can of compressed air can clear light debris — avoid metal objects, which can damage the internal pins.',
        ],
      },
      {
        heading: 'A loose or damaged port',
        paragraphs: [
          'If the cable only charges at a certain angle, or feels loose when plugged in, the port connector itself may be damaged and typically needs professional repair rather than cleaning.',
        ],
      },
      {
        heading: 'Moisture warning',
        paragraphs: [
          'If the phone has been exposed to moisture, do not attempt to charge it until it has been inspected — charging a wet port raises the risk of a short circuit.',
        ],
      },
    ],
    whenToCallPro: [
      'A different cable and adapter do not resolve the issue',
      'The port looks physically damaged, bent, or loose',
      'The phone was recently exposed to moisture or liquid',
      'Charging only works at a specific angle or intermittently',
    ],
    relatedSlugs: ['phone-battery-replacement-signs', 'phone-repair-or-replace', 'phone-screen-repair-guide'],
    serviceCategory: 'Phone Repair',
    schedulerProductName: 'Screen Replacement',
    ctaQuestion: 'Charging port acting up?',
    ctaLabel: 'Book Phone Repair',
  },
  {
    slug: 'phone-repair-or-replace',
    title: 'Should You Repair or Replace Your Phone?',
    excerpt: 'Repair cost, battery health, and how long you plan to keep the device all factor into whether a repair or a new phone makes more sense.',
    category: 'phone-repair',
    image: '/images/resources/articles/phone-repair-or-replace.webp',
    imageAlt: 'Older and newer smartphone compared side by side',
    readingTime: '5 min read',
    publishedAt: '2026-03-05',
    intro: 'A cracked screen or failing battery does not automatically mean it is time for a new phone. Here is how to think through the decision.',
    sections: [
      {
        heading: 'Age of the device',
        paragraphs: [
          'Phones generally see the best value from repairs within their first two to three years. Beyond that, software support and replacement-part availability both start to decline.',
        ],
      },
      {
        heading: 'Repair cost versus replacement cost',
        paragraphs: [
          'A single, common repair like a screen or battery replacement is almost always less expensive than a new device. Multiple simultaneous issues change that math quickly.',
        ],
      },
      {
        heading: 'Battery health and performance',
        paragraphs: [
          'A phone that otherwise runs well but has a weak battery is usually a great repair candidate. A phone that is also slow, low on storage, or struggling with current apps may not be worth further investment.',
        ],
      },
      {
        heading: 'Warranty and insurance coverage',
        paragraphs: [
          'Check whether your device is still under manufacturer warranty or covered by phone insurance before paying out of pocket — coverage can make repair the clear choice.',
        ],
      },
      {
        heading: 'Back up your data either way',
        paragraphs: [
          'Whether you repair or replace, back up your photos, contacts, and files first. We never need your passcode, full serial number, or account credentials to complete a repair.',
        ],
      },
    ],
    whenToCallPro: [
      'You are unsure whether a repair is cost-effective for your specific device',
      'Multiple issues are affecting the phone at the same time',
      'You want a professional diagnostic before deciding',
      'You are not sure if warranty or insurance coverage applies',
    ],
    relatedSlugs: ['phone-battery-replacement-signs', 'charging-port-repair-guide', 'phone-screen-repair-guide'],
    serviceCategory: 'Phone Repair',
    schedulerProductName: 'Screen Replacement',
    ctaQuestion: 'Not sure whether to repair or replace?',
    ctaLabel: 'Book Phone Repair',
  },
];

export function getResourceArticle(slug: string): ResourceArticle | undefined {
  return RESOURCE_ARTICLES.find((a) => a.slug === slug);
}

export function getFeaturedArticles(): ResourceArticle[] {
  return RESOURCE_ARTICLES.filter((a) => a.featured);
}

export function getArticlesByCategory(category: ResourceCategoryId): ResourceArticle[] {
  return RESOURCE_ARTICLES.filter((a) => a.category === category);
}

export function getRelatedArticles(article: ResourceArticle): ResourceArticle[] {
  return article.relatedSlugs
    .map((slug) => getResourceArticle(slug))
    .filter((a): a is ResourceArticle => Boolean(a));
}

/** Scheduler booking URL for an article's CTA — prefilled with its service category and product name when known. */
export function getArticleBookingHref(article: ResourceArticle): string {
  return article.serviceCategory
    ? `/scheduler?serviceType=${article.schedulerServiceType ?? 'R'}&serviceCategory=${encodeURIComponent(article.serviceCategory)}&productName=${encodeURIComponent(article.schedulerProductName)}`
    : '/scheduler';
}
