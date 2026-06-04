export interface TriageResult {
  urgencyLevel: 'Low' | 'Normal' | 'High' | 'Emergency';
  priorityScore: 1 | 2 | 3 | 4;
  possibleIssue: string;
  recommendedTechnicianType: string;
  estimatedDuration: string;
  safetyNotes: string;
}

export function generateTriageResult(data: {
  serviceCategory: string;
  serviceType: string;
  issueDescription: string;
  hasSafetyConcern: boolean;
  applianceStillRunning: boolean | null;
  servicePriority: 'regular' | 'emergency';
}): TriageResult {
  const desc = data.issueDescription.toLowerCase();
  const category = data.serviceCategory.toLowerCase();

  // Emergency keywords
  const emergencyKeywords = [
    'smoke', 'burning', 'fire', 'gas', 'electrical hazard', 'spark', 'shock',
    'flood', 'major leak', 'overheating',
  ];
  // High urgency keywords
  const highKeywords = [
    'completely stopped', 'not cooling', 'no heat', 'not working at all', 'no hot water',
  ];
  // Normal urgency keywords
  const normalKeywords = [
    'not draining', 'not heating', 'not spinning', 'loud noise', 'leaking',
  ];

  const isEmergency =
    data.servicePriority === 'emergency' ||
    data.hasSafetyConcern ||
    emergencyKeywords.some((kw) => desc.includes(kw));

  const isHigh = !isEmergency && highKeywords.some((kw) => desc.includes(kw));
  const isNormal = !isEmergency && !isHigh && normalKeywords.some((kw) => desc.includes(kw));

  let urgencyLevel: 'Low' | 'Normal' | 'High' | 'Emergency';
  let priorityScore: 1 | 2 | 3 | 4;

  if (isEmergency) {
    urgencyLevel = 'Emergency';
    priorityScore = 4;
  } else if (isHigh) {
    urgencyLevel = 'High';
    priorityScore = 3;
  } else if (isNormal) {
    urgencyLevel = 'Normal';
    priorityScore = 2;
  } else {
    urgencyLevel = 'Low';
    priorityScore = 1;
  }

  // Determine technician type
  let recommendedTechnicianType: string;
  if (category.includes('hvac')) {
    recommendedTechnicianType = 'HVAC Technician';
  } else if (category.includes('plumbing')) {
    recommendedTechnicianType = 'Licensed Plumber';
  } else if (category.includes('electrical')) {
    recommendedTechnicianType = 'Licensed Electrician';
  } else {
    recommendedTechnicianType = 'Appliance Repair Technician';
  }

  // Determine possible issue based on service type and description
  const serviceType = data.serviceType.toLowerCase();
  let possibleIssue: string;
  if (isEmergency) {
    possibleIssue = 'Critical safety issue — immediate attention required';
  } else if (serviceType.includes('refrigerator') || desc.includes('refrigerator') || desc.includes('not cooling')) {
    possibleIssue = 'Possible compressor, thermostat, or refrigerant issue';
  } else if (serviceType.includes('washer') || desc.includes('not draining') || desc.includes('not spinning')) {
    possibleIssue = 'Possible pump, belt, or motor issue';
  } else if (serviceType.includes('dryer') || desc.includes('not heating')) {
    possibleIssue = 'Possible heating element or thermostat failure';
  } else if (serviceType.includes('dishwasher')) {
    possibleIssue = 'Possible pump, spray arm, or drainage issue';
  } else if (serviceType.includes('hvac') || serviceType.includes('ac') || serviceType.includes('heat')) {
    possibleIssue = 'Possible compressor, refrigerant, or electrical component issue';
  } else if (serviceType.includes('plumbing') || serviceType.includes('leak') || serviceType.includes('drain')) {
    possibleIssue = 'Possible pipe, seal, or drain blockage issue';
  } else if (serviceType.includes('electrical') || serviceType.includes('outlet') || serviceType.includes('breaker')) {
    possibleIssue = 'Possible wiring, circuit breaker, or component failure';
  } else if (serviceType.includes('oven') || serviceType.includes('stove')) {
    possibleIssue = 'Possible igniter, heating element, or control board issue';
  } else {
    possibleIssue = 'Requires diagnostic inspection to determine root cause';
  }

  // Estimated duration
  let estimatedDuration: string;
  if (isEmergency) {
    estimatedDuration = '1–3 hours (emergency response)';
  } else if (priorityScore === 3) {
    estimatedDuration = '2–4 hours';
  } else if (priorityScore === 2) {
    estimatedDuration = '1–3 hours';
  } else {
    estimatedDuration = '1–2 hours';
  }

  // Safety notes
  const safetyNotes =
    isEmergency || data.hasSafetyConcern
      ? 'Turn off the appliance immediately. If you smell gas or see smoke, evacuate and call 911.'
      : '';

  return {
    urgencyLevel,
    priorityScore,
    possibleIssue,
    recommendedTechnicianType,
    estimatedDuration,
    safetyNotes,
  };
}
