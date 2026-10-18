// Company-supplied profile, pages 3–5. Unconfirmed working envelopes are intentionally omitted.
export const machines = [
  ['Laser cutting', '1.5 kW', 'Blank and profile preparation'],
  [
    'Presses',
    '5 · 10 · 20 · 25 · 50 · 75 · 80 · 100 · 300 T',
    'Pressing and forming; rating depends on the machine',
  ],
  ['Machine shop', 'Basic toolroom equipment', 'Tools, fixtures, jigs and component machining'],
  ['CO₂ welding', '7 machines', 'Manual welded fabrication'],
  ['Automated welding', '5-axis Cartesian welding machine', 'Programmed welding operations'],
  ['Nut welding', '3-axis nut-welding machine', 'Nut attachment operations'],
  ['Robotic welding', '1 robotic welding machine', 'Repeat welding operations'],
  [
    'Resistance welding',
    'Spot and capacitor-discharge projection welding',
    'Sheet joining and projection welding',
  ],
  [
    'Special-purpose drilling',
    'Co-axial horizontal drilling machine',
    'Dedicated drilling operations',
  ],
  ['Painting', 'Paint booth with oven', 'Painting and curing'],
  [
    'Inspection support',
    'Measuring instruments and surface plates',
    'Checks against the agreed drawing',
  ],
];
export const process = [
  {
    name: 'Cut',
    sub: 'Prepare the profile.',
    text: 'Fibre laser cutting prepares the blank for the next operation. Material grade, thickness and geometry are reviewed against the drawing.',
    equipment: '1.5 kW laser cutting machine',
  },
  {
    name: 'Form',
    sub: 'Develop the geometry.',
    text: 'Pressing and bending turn a flat blank into a component. The forming route and tooling depend on the features and material.',
    equipment: 'Mechanical and hydraulic presses · press-brake forming',
  },
  {
    name: 'Join',
    sub: 'Locate. Weld. Assemble.',
    text: 'Fixtures locate components for manual, automated or robotic welding. Hinges, nuts and mating parts become part of the assembly.',
    equipment: 'Manual · Cartesian · robotic · nut and spot welding',
  },
  {
    name: 'Finish',
    sub: 'Complete the surface.',
    text: 'Painting is supported by a paint booth and oven. Other specified finishes are discussed during technical review to establish the required supply route.',
    equipment: 'Paint booth with oven',
  },
  {
    name: 'Check',
    sub: 'Review the part and the pack.',
    text: 'Drawing requirements guide inspection. The packing system supports checks before dispatch, alongside component and quantity information.',
    equipment: 'Measuring instruments · surface plates · packing checks',
  },
];
