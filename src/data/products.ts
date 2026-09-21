export interface Product {
  id: string;
  name: string;
  category: 'Fabricated assemblies' | 'Pressed & small parts' | 'Tooling & custom work';
  image: string;
  width: number;
  height: number;
  alt: string;
  description: string;
  requirements: string;
  generated?: boolean;
}
export const products: Product[] = [
  {
    id: 'battery-boxes',
    name: 'Battery boxes',
    category: 'Fabricated assemblies',
    image: 'battery-box',
    width: 345,
    height: 260,
    alt: 'Unit Alfa published photograph of an excavator battery box.',
    description:
      'Formed and fabricated battery enclosures for excavator applications. Share the mounting arrangement and access requirements with your drawing.',
    requirements: 'Envelope · mounting points · lid / access · finish',
  },
  {
    id: 'grease-baths',
    name: 'Grease baths',
    category: 'Fabricated assemblies',
    image: 'grease-bath',
    width: 345,
    height: 260,
    alt: 'Grease bath component from the Unit Alfa product catalogue.',
    description:
      'Fabricated grease-bath components for equipment assemblies. Define the mating geometry and weld requirements for the application.',
    requirements: 'Mating dimensions · weld detail · material · finish',
  },
  {
    id: 'cylinder-mounting-brackets',
    name: 'Cylinder mounting brackets',
    category: 'Fabricated assemblies',
    image: 'cylinder-mounting-bracket-illustrative',
    width: 720,
    height: 540,
    alt: 'Generated illustrative steel cylinder mounting bracket; not a photograph of a Unit Alfa component.',
    description:
      'Mounting brackets developed to the specified interface. Supply the pin bore, mounting pattern and critical dimensions for review.',
    requirements: 'Bore / pin fit · centre distance · plate thickness',
    generated: true,
  },
  {
    id: 'shims-spacers',
    name: 'Shims & spacers',
    category: 'Pressed & small parts',
    image: 'shims-and-spacers-illustrative',
    width: 720,
    height: 540,
    alt: 'Generated illustrative flat steel shims and ring spacers; not Unit Alfa production samples.',
    description:
      'Small pressed components for spacing and adjustment. State the thickness, profile and dimensional requirements for each part number.',
    requirements: 'Thickness · profile · hole pattern · quantity',
    generated: true,
  },
  {
    id: 'seat-adjusters',
    name: 'Seat adjusters / sliders',
    category: 'Pressed & small parts',
    image: 'seat-adjuster',
    width: 345,
    height: 260,
    alt: 'Seat adjuster shown in Unit Alfa’s published product catalogue.',
    description:
      'The published range includes seat adjusters. Share the slider or adjuster drawing to establish the travel, mounting and assembly requirements.',
    requirements: 'Mounting centres · travel · mating parts · finish',
  },
  {
    id: 'latch-assemblies',
    name: 'Latch assemblies',
    category: 'Pressed & small parts',
    image: 'latch-assembly-illustrative',
    width: 720,
    height: 540,
    alt: 'Generated illustrative steel over-centre latch; not a Unit Alfa production sample.',
    description:
      'Latch components and assemblies for industrial applications. Identify the engagement geometry, mounting and functional requirements.',
    requirements: 'Mounting · engagement · assembly · finish',
    generated: true,
  },
  {
    id: 'lamp-guards',
    name: 'Lamp guards & covers',
    category: 'Fabricated assemblies',
    image: 'lamp-guard-cover',
    width: 345,
    height: 260,
    alt: 'Lamp guard and cover from Unit Alfa’s published product photographs.',
    description:
      'Protective guards and covers for equipment assemblies. Send the lamp envelope, clearances and attachment details.',
    requirements: 'Envelope · clearances · fixing details · coating',
  },
  {
    id: 'mufflers',
    name: 'Mufflers',
    category: 'Fabricated assemblies',
    image: 'muffler',
    width: 345,
    height: 260,
    alt: 'Muffler assembly from the Unit Alfa product catalogue.',
    description:
      'Muffler assemblies appear in the published component range. Provide the application drawing and interface specifications for review.',
    requirements: 'Application · inlet / outlet · mounting · material',
  },
  {
    id: 'cabin-joints',
    name: 'Cabin joints',
    category: 'Pressed & small parts',
    image: 'cabin-joint',
    width: 345,
    height: 260,
    alt: 'Cabin joint component shown in Unit Alfa’s product catalogue.',
    description:
      'Cabin joint components made to the required mating geometry. Include the assembly reference and critical fit dimensions.',
    requirements: 'Interface · fit dimensions · material · batch',
  },
  {
    id: 'custom-fabrication',
    name: 'Custom fabrication & tooling',
    category: 'Tooling & custom work',
    image: 'weldtable-ribs',
    width: 720,
    height: 720,
    alt: 'Gloved hands fitting ribs into a Unit Alfa Weldtables modular welding table.',
    description:
      'Small-part development, fabrication, assembly, jigs and fixtures. Share a drawing or sample and the intended production requirement.',
    requirements: 'Drawing / sample · tooling scope · batch · delivery',
  },
];
