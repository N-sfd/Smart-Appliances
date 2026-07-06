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
