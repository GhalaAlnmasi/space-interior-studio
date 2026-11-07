export const homeCopy = {
  heroEyebrow: "Interior architecture",
  heroTitleLead: "Design",
  heroTitleEmphasis: "your",
  heroTitleClose: "perspective",
  heroBody: "Proportion, material, and light, composed until a room feels inevitable.",
  explore: "Explore Spaces",
  enter: "Enter Studio",
  plateCaption: "Original spatial study",
  fields: ["Residence", "Work", "Hospitality"],
  philosophyIndex: "01",
  philosophyLabel: "The practice",
  philosophyTitle: "Rooms, held with care.",
  philosophyQuote:
    "A room should hold a person the way good cloth holds a shoulder: closely, and without announcement.",
  philosophyBody: [
    "SPACE studies how a room is entered, where the eye rests, and which surfaces should stay quiet. The work begins with measure, then material, then the smallest number of gestures that make a place feel settled.",
    "Drawings stay spare. Models stay touchable. A study is complete when nothing further asks to be added.",
  ],
  spacesIndex: "02",
  spacesLabel: "Selected studies",
  spacesTitle: "Three rooms, three climates.",
  spacesBody:
    "Each plate is an original drawing for a conceptual residence, workroom, or guest house. These are not built projects, and the drawings are not photographs.",
  studioIndex: "03",
  studioLabel: "The model",
  studioTitle: "A room you can edit.",
  studioBody:
    "Move the sofa, table, and plant. Change the cloth, the floor, and the plaster. Set the light, then keep the view. The model stays one room, built in the browser.",
  studioCapabilities: [
    { label: "Furniture", note: "Select a piece and place it on the floor." },
    { label: "Materials", note: "Cloth, color, timber, and plaster." },
    { label: "Light", note: "Daylight, golden hour, and evening." },
    { label: "Camera", note: "Orbit, three views, and one saved perspective." },
  ],
  principlesIndex: "04",
  principlesLabel: "Principles",
  principlesTitle: "What we refuse to hurry.",
  aboutLink: "Read the studio story",
} as const;

export const principles = [
  {
    index: "01",
    title: "Proportion first",
    body: "Decoration follows the measure of the room. Openings, furniture, and paths share one scale.",
  },
  {
    index: "02",
    title: "Material with memory",
    body: "Stone, timber, lime, and cloth are chosen for how they age in real daylight.",
  },
  {
    index: "03",
    title: "Light as structure",
    body: "Daylight is drawn with the plan. Shade, reflection, and glare are part of the architecture.",
  },
  {
    index: "04",
    title: "Restraint",
    body: "Luxury here is the absence of noise. A few exact gestures, held with care.",
  },
] as const;

export const spacesCopy = {
  index: "02",
  eyebrow: "Selected studies",
  title: "Spaces",
  lede: "Three conceptual studies. Each room is described through drawing, plan, material, and light, and none of them is a commissioned project.",
} as const;

export const aboutCopy = {
  index: "04",
  eyebrow: "The studio",
  title: "About",
  lede: "SPACE is an interior architecture practice for rooms that feel settled from the first threshold.",
  story: [
    "The practice is concerned with domestic and small public rooms: houses, workrooms, and places of brief stay. The question is always the same. How should this room hold the life that will happen in it?",
    "Work starts on paper and in simple models. Palette comes late. A material earns a place only when it clarifies the proportion already drawn.",
    "This site is the public face of that method. The studies are editorial rooms. The studio route is a real model you can turn in the browser.",
  ],
  approachTitle: "How a study proceeds",
  steps: [
    {
      index: "01",
      title: "Listen",
      body: "The life of the room comes before the furniture. Movement, pause, and privacy set the plan.",
    },
    {
      index: "02",
      title: "Compose",
      body: "Plan, section, and daylight are drawn together until the volume feels inevitable.",
    },
    {
      index: "03",
      title: "Refine",
      body: "Materials are reduced until each surface has a reason to be there.",
    },
  ],
} as const;

export const studioPageCopy = {
  index: "03",
  eyebrow: "Interactive model",
  title: "Studio",
  lede: "A plaster room you can furnish, finish, and light. Turn it, come closer, or return to the first glance.",
  contentsTitle: "Inside the model",
  contentsBody: "Walls, furniture, and objects are modeled as solids. Grain, plaster, cloth, and stone are generated in the browser. Nothing is a photographed stand-in.",
} as const;
