// The ten challenges that used to be hardcoded in HackathonGrid.jsx. They live
// here only so the admin panel can seed them into `hackathonChallenges` on a
// fresh database; once seeded, Firestore is the source of truth and editing
// this file changes nothing on the site.

const brief = (summary) => `## The challenge

${summary}

## What good looks like

Describe the outcome a winning team would deliver, and how you would know it
worked for people in Liverpool City Region.

## Data and resources

List the datasets, services, and contacts teams can draw on.

## Who should take this on

Say which backgrounds suit this challenge. No prior health experience required.

_This brief is a starting point — edit it in the admin panel._`;

export const DEFAULT_CHALLENGES = [
  ["healthier-starts", "Healthier starts", "rose", "Design a data-informed service that helps families access early-years, maternity, nutrition, or vaccination support."],
  ["mental-health-earlier", "Mental health, earlier", "violet", "Pitch a safe, inclusive tool that helps students and young adults find timely mental-health support and community connection."],
  ["cardiovascular-prevention", "Cardiovascular prevention", "red", "Create a solution that makes blood-pressure checks, risk reduction, or cardiac rehabilitation easier to access and sustain."],
  ["healthy-weight-healthy-places", "Healthy weight, healthy places", "lime", "Use local food, activity, transport, or school data to help children and families make healthier choices."],
  ["cleaner-air-healthier-lungs", "Cleaner air, healthier lungs", "sky", "Build a product or service that turns air-quality data into practical protection for people with asthma and respiratory disease."],
  ["cancer-screening-without-barriers", "Cancer screening without barriers", "fuchsia", "Reduce practical, informational, or cultural barriers to screening and earlier cancer diagnosis."],
  ["safer-antimicrobial-use", "Safer antimicrobial use", "amber", "Develop a One Health solution that supports infection prevention, antimicrobial stewardship, or public understanding of AMR."],
  ["ageing-well-at-home", "Ageing well at home", "teal", "Pitch technology that supports independence, reduces falls, or connects older residents with care and their communities."],
  ["healthy-sleep-and-recovery", "Healthy sleep and recovery", "indigo", "Create an evidence-aware approach to improve sleep, stress management, and recovery for young people and shift workers."],
  ["prepared-communities", "Prepared communities", "orange", "Design an accessible system for community organisations to spot and respond to infectious-disease risks and health misinformation."],
].map(([id, title, accent, summary], index) => ({
  id,
  title,
  accent,
  summary,
  index,
  published: true,
  audience: "Open to undergraduates and the public",
  markdown_content: brief(summary),
}));
