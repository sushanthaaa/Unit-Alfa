export interface Product {
  id: string;
  name: string;
  category: 'Enclosures & guards' | 'Formed components' | 'Mechanisms & exhaust' | 'Tooling';
  image: string;
  width: number;
  height: number;
  alt: string;
  description: string;
  detail: string;
  requirements: string[];
  related: string[];
  photoPage?: number;
}
export const products: Product[] = [
  {
    id: 'battery-boxes',
    name: 'Battery box assemblies',
    category: 'Enclosures & guards',
    image: 'profile-battery-box',
    width: 892,
    height: 669,
    alt: 'Unit Alfa battery enclosure with a hinged yellow lid, formed body and ventilation slots.',
    description:
      'Formed enclosures brought together with hinges, access features and mounting details for hydraulic excavators.',
    detail:
      'The enclosure is one part of a larger machine. Its mounting points, lid travel and service access need to work together. Unit Alfa manufactures battery box and case assemblies to the customer’s component and assembly drawings.',
    requirements: [
      'Overall envelope and mounting interfaces',
      'Lid, hinge and latch requirements',
      'Material, thickness and surface finish',
      'Estimated annual quantity and delivery schedule',
    ],
    related: ['Tool cases', 'Battery cases', 'Fabricated enclosures'],
    photoPage: 22,
  },
  {
    id: 'mufflers',
    name: 'Mufflers & exhaust components',
    category: 'Mechanisms & exhaust',
    image: 'profile-muffler',
    width: 1024,
    height: 1170,
    alt: 'Manufactured Unit Alfa muffler with a cylindrical body and upright exhaust outlet.',
    description: 'Muffler assemblies, muffler brackets and U-bolts for equipment applications.',
    detail:
      'Exhaust components bring formed sheet, tubes and mounting interfaces into an assembly. The application drawing defines the inlet and outlet arrangement, clearances, mounting points and any heat-resistant finish requirements.',
    requirements: [
      'Application and approved assembly drawing',
      'Inlet, outlet and mounting geometry',
      'Material and weld requirements',
      'Specified finish and annual quantity',
    ],
    related: ['Muffler brackets', 'U-bolts', 'Exhaust mounting components'],
    photoPage: 26,
  },
  {
    id: 'grease-baths',
    name: 'Grease baths',
    category: 'Formed components',
    image: 'profile-grease-bath',
    width: 999,
    height: 589,
    alt: 'Unpainted circular grease-bath component photographed in the Unit Alfa company profile.',
    description:
      'Formed circular components manufactured to the required mating geometry and assembly details.',
    detail:
      'The profile and mating dimensions govern how the component fits into the equipment assembly. Share the section, interface and finish requirements so the manufacturing route and tooling can be reviewed for the actual part.',
    requirements: [
      'Section and mating diameters',
      'Material grade and thickness',
      'Weld and finish requirements where applicable',
      'Drawing revision and annual quantity',
    ],
    related: ['Formed sheet-metal parts', 'Pressed profiles'],
    photoPage: 23,
  },
  {
    id: 'seat-adjusters',
    name: 'Seat adjusters & sliders',
    category: 'Mechanisms & exhaust',
    image: 'profile-seat-adjuster',
    width: 935,
    height: 526,
    alt: 'Black Unit Alfa seat-adjuster assembly with slide rails and an adjustment lever.',
    description: 'Mechanisms that combine pressed parts, mounting features and moving components.',
    detail:
      'A seat adjuster must be considered as a working assembly. The drawing and functional requirements establish travel, mating components, attachment points and the required checks. Unit Alfa also manufactures hinges and latch assemblies.',
    requirements: [
      'Assembly drawing and mounting centres',
      'Travel and functional requirements',
      'Mating components and finish',
      'Annual demand for each part number',
    ],
    related: ['Hinges', 'Latch assemblies', 'Seat sliders'],
    photoPage: 25,
  },
  {
    id: 'lamp-guards',
    name: 'Lamp guards & covers',
    category: 'Enclosures & guards',
    image: 'profile-lamp-guard-cover',
    width: 892,
    height: 669,
    alt: 'Fabricated lamp guard and metal cover among Unit Alfa component examples.',
    description:
      'Protective fabrications and covers with application-specific clearances and attachment details.',
    detail:
      'Guard and cover geometry depends on the equipment around it. Send the lamp or equipment envelope, clearance requirements and mounting arrangement. Fabrication, joining and the specified finish are reviewed together.',
    requirements: [
      'Protected component envelope',
      'Clearance and access requirements',
      'Fixing details and weld specification',
      'Material, finish and annual quantity',
    ],
    related: ['Protective covers', 'Sheet-metal guards'],
    photoPage: 24,
  },
  {
    id: 'cabin-joints',
    name: 'Cabin joints',
    category: 'Formed components',
    image: 'profile-cabin-joint',
    width: 513,
    height: 514,
    alt: 'Curved formed cabin-joint component from Unit Alfa’s company profile.',
    description: 'Pressed profiles shaped around the interfaces of the larger equipment assembly.',
    detail:
      'Formed joints need a clear definition of the mating geometry and critical fit dimensions. Tooling and the forming route are considered against those requirements, the material and the expected repeat supply.',
    requirements: [
      'Mating geometry and assembly reference',
      'Critical fit dimensions',
      'Material, thickness and finish',
      'Annual quantity and drawing revision',
    ],
    related: ['Pressed components', 'Formed brackets'],
    photoPage: 21,
  },
  {
    id: 'custom-fabrication',
    name: 'Tooling & modular welding tables',
    category: 'Tooling',
    image: 'weldtable-ribs',
    width: 720,
    height: 720,
    alt: 'Gloved hands assembling the ribs of a Unit Alfa Weldtables modular welding table.',
    description:
      'Tools, fixtures and jigs developed around the manufacturing operation. Modular welding tables through Weldtables.',
    detail:
      'Tooling establishes the shape of a pressed part; fixtures locate components during manufacturing and assembly. Unit Alfa designs and manufactures tools, fixtures and jigs, supported by its machine shop and CAD tools. Modular welding tables are presented through the Weldtables product site.',
    requirements: [
      'Component drawing or authorised sample',
      'Operation and locating requirements',
      'Expected annual demand',
      'Tooling development and supply scope',
    ],
    related: ['Press tooling', 'Welding fixtures', 'Jigs', 'Modular welding tables'],
  },
];
export const additionalComponents = [
  'Hydraulic-cylinder clamps and brackets',
  'Tube clamps',
  'Clips',
  'Shims and spacers',
  'Filler necks',
  'Hinges',
  'Latch assemblies',
  'Tool cases',
];
