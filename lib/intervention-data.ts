export interface InterventionDetails {
  name: string
  type: "Medication" | "Lifestyle" | "Therapy" | "Other"
  dimensionIds: string[]
  linkedGoals: string[]
  startDate: string
  status: "active" | "completed"
  details: {
    details: string
    provider: string
    instructions: string
  }
}

const interventionDataMap: Record<string, Omit<InterventionDetails, "linkedGoals">> = {
  "Sertraline 75mg": {
    name: "Sertraline 75mg",
    type: "Medication",
    dimensionIds: ["mental"],
    startDate: "2025-01-01",
    status: "active",
    details: {
      details: "Dosage: 75mg, Frequency: Daily, oral",
      provider: "Dr. Anderson",
      instructions: "Take once daily in the morning with food. May take 4-6 weeks to see full effects."
    }
  },
  "CBT Sessions": {
    name: "CBT Sessions",
    type: "Therapy",
    dimensionIds: ["mental"],
    startDate: "2025-01-01",
    status: "active",
    details: {
      details: "Frequency: Weekly sessions",
      provider: "Lisa Chen, LCSW",
      instructions: "Weekly 50-minute sessions focused on cognitive behavioral therapy techniques."
    }
  },
  "Mindfulness Meditation": {
    name: "Mindfulness Meditation",
    type: "Lifestyle",
    dimensionIds: ["mental"],
    startDate: "2025-01-01",
    status: "active",
    details: {
      details: "Duration: 10 minutes daily",
      provider: "Lisa Chen, LCSW",
      instructions: "Practice daily mindfulness meditation using guided app or online resources."
    }
  },
  "Sleep Hygiene Practice": {
    name: "Sleep Hygiene Practice",
    type: "Lifestyle",
    dimensionIds: ["sleep"],
    startDate: "2025-01-01",
    status: "active",
    details: {
      details: "Daily routine establishment",
      provider: "Dr. Anderson",
      instructions: "Lights off by 10pm, no screens 1 hour before bed, maintain cool room temperature."
    }
  },
  "Community Food Bank Access": {
    name: "Community Food Bank Access",
    type: "Other",
    dimensionIds: ["sdoh"],
    startDate: "2025-01-01",
    status: "active",
    details: {
      details: "Community resource connection",
      provider: "Care Coordinator",
      instructions: "Access community food bank services. Contact info and hours provided separately."
    }
  },
  "30-Minute Daily Walks": {
    name: "30-Minute Daily Walks",
    type: "Lifestyle",
    dimensionIds: ["physical"],
    startDate: "2025-01-01",
    status: "active",
    details: {
      details: "Exercise: 30 minutes, 5 days/week",
      provider: "Dr. Williams",
      instructions: "Moderate-intensity walking for at least 30 minutes per day, 5 days per week."
    }
  },
  "Meal Planning and Prep": {
    name: "Meal Planning and Prep",
    type: "Lifestyle",
    dimensionIds: ["diet"],
    startDate: "2025-01-01",
    status: "active",
    details: {
      details: "Weekly meal planning",
      provider: "Nutritionist",
      instructions: "Plan and prepare healthy meals each Sunday. Focus on whole foods, reduce processed items."
    }
  },
  "Pain Tracking Log": {
    name: "Pain Tracking Log",
    type: "Other",
    dimensionIds: ["pain"],
    startDate: "2025-01-01",
    status: "active",
    details: {
      details: "Daily pain documentation",
      provider: "Dr. Rodriguez",
      instructions: "Document pain levels (1-10), location, duration, and activities affecting pain."
    }
  },
  "Multimodal pain management": {
    name: "Multimodal pain management",
    type: "Therapy",
    dimensionIds: ["pain"],
    startDate: "2025-01-01",
    status: "active",
    details: {
      details: "Comprehensive pain treatment",
      provider: "Dr. Rodriguez",
      instructions: "Combined approach including physical therapy, medication, and lifestyle modifications."
    }
  },
  "Financial Counseling Services": {
    name: "Financial Counseling Services",
    type: "Other",
    dimensionIds: ["cost"],
    startDate: "2025-01-01",
    status: "active",
    details: {
      details: "Financial assistance support",
      provider: "Patient Advocate",
      instructions: "Work with financial counselor to explore payment assistance and hardship options."
    }
  }
}

export function getInterventionDetailsByName(interventionName: string, linkedGoals: string[] = []): InterventionDetails | null {
  const baseData = interventionDataMap[interventionName]
  if (!baseData) {
    return null
  }

  return {
    ...baseData,
    linkedGoals
  }
}

export function getInterventionDetailsForGoal(interventionNames: string[], goalDescription: string): InterventionDetails[] {
  return interventionNames
    .map(name => getInterventionDetailsByName(name, [goalDescription]))
    .filter((intervention): intervention is InterventionDetails => intervention !== null)
}
