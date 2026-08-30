// Curated owner-shared photo galleries.
// House 1 = Le Sève; House 2 = Le Bois. Shared outdoor views are intentionally
// included in both galleries to show the setting without mixing interiors.

const SHARED_OUTDOOR = [
  "/manus-storage/foto-133_c0c3d406.jpg", // wide view of both cottages
  "/manus-storage/foto-135_c95b74fd.jpg", // exterior with vehicle / parking context
  "/manus-storage/foto-140_dd41d1f5.jpg", // clear approach and landscape
  "/manus-storage/foto-142_410c5bc4.jpg", // wide driveway and cottages
  "/manus-storage/foto-147_a0f66544.jpg", // alternate wide site view
];

export const HERMAN_COTTAGE1_IMAGES = {
  hero: [
    ...SHARED_OUTDOOR,
    "/manus-storage/foto-039_79c67c88.jpg",
    "/manus-storage/foto-041_f0fe8e62.jpg",
    "/manus-storage/foto-001_5432d2d9.jpg",
    "/manus-storage/foto-006_cf2fe93b.jpg",
    "/manus-storage/foto-007_8249725a.jpg",
    "/manus-storage/foto-016_4f968fc9.jpg",
  ],
  outdoor: [
    ...SHARED_OUTDOOR,
    "/manus-storage/foto-039_79c67c88.jpg", // House 1 terrace / exterior
    "/manus-storage/foto-041_f0fe8e62.jpg", // House 1 exterior
    "/manus-storage/foto-044_552965b3.jpg", // House 1 exterior angle
  ],
  livingRoom: [
    "/manus-storage/foto-001_5432d2d9.jpg",
    "/manus-storage/foto-006_cf2fe93b.jpg",
    "/manus-storage/foto-007_8249725a.jpg",
    "/manus-storage/foto-048_8e399522.jpg",
  ],
  kitchen: [
    "/manus-storage/foto-046_78d558e2.jpg",
    "/manus-storage/foto-054_a70c3246.jpg",
  ],
  bedrooms: [
    "/manus-storage/foto-016_4f968fc9.jpg",
    "/manus-storage/foto-022_bd3c49cc.jpg",
  ],
  bathrooms: [
    "/manus-storage/foto-024_7d9a3f90.jpg",
    "/manus-storage/foto-025_09712b9c.jpg",
    "/manus-storage/foto-026_ae0e9c4a.jpg",
    "/manus-storage/foto-027_6dc1112e.jpg",
    "/manus-storage/foto-028_1bf0b403.jpg",
    "/manus-storage/foto-029_a462eb10.jpg",
    "/manus-storage/foto-062_19394b75.jpg",
    "/manus-storage/foto-063_b654bdfa.jpg",
    "/manus-storage/foto-064_710747e7.jpg",
    "/manus-storage/foto-065_a62078d8.jpg",
  ],
  all: [] as string[],
};

export const HERMAN_COTTAGE2_IMAGES = {
  hero: [
    ...SHARED_OUTDOOR,
    "/manus-storage/foto-087_e198b868.jpg",
    "/manus-storage/foto-089_579b62fa.jpg",
    "/manus-storage/foto-093_62f812b8.jpg",
    "/manus-storage/foto-073_4272a21c.jpg",
  ],
  outdoor: [
    ...SHARED_OUTDOOR,
    "/manus-storage/foto-128_6d2980d8.jpg", // House 2 exterior / approach
    "/manus-storage/foto-130_03b83cf2.jpg", // House 2 exterior angle
  ],
  livingRoom: [
    "/manus-storage/foto-087_e198b868.jpg",
    "/manus-storage/foto-089_579b62fa.jpg",
    "/manus-storage/foto-093_62f812b8.jpg",
    "/manus-storage/foto-121_28436653.jpg",
  ],
  kitchen: [
    "/manus-storage/foto-097_3eee1ba2.jpg",
    "/manus-storage/foto-100_0bff7f85.jpg",
    "/manus-storage/foto-118_00668534.jpg",
  ],
  bedrooms: [
    "/manus-storage/foto-073_4272a21c.jpg",
    "/manus-storage/foto-076_7afa5756.jpg",
    "/manus-storage/foto-104_b25f0087.jpg",
  ],
  bathrooms: [
    "/manus-storage/foto-078_0917b079.jpg",
    "/manus-storage/foto-079_ae6afb8d.jpg",
    "/manus-storage/foto-080_372233c9.jpg",
    "/manus-storage/foto-081_0a51d28b.jpg",
    "/manus-storage/foto-082_0b7bbac5.jpg",
    "/manus-storage/foto-083_3f0fc49d.jpg",
    "/manus-storage/foto-123_91e3094d.jpg",
  ],
  all: [] as string[],
};

// Keep the full gallery order explicit: outdoor first, then living room,
// kitchen, bedrooms, and bathroom images.
HERMAN_COTTAGE1_IMAGES.all = [
  ...HERMAN_COTTAGE1_IMAGES.outdoor,
  ...HERMAN_COTTAGE1_IMAGES.livingRoom,
  ...HERMAN_COTTAGE1_IMAGES.kitchen,
  ...HERMAN_COTTAGE1_IMAGES.bedrooms,
  ...HERMAN_COTTAGE1_IMAGES.bathrooms,
];
HERMAN_COTTAGE2_IMAGES.all = [
  ...HERMAN_COTTAGE2_IMAGES.outdoor,
  ...HERMAN_COTTAGE2_IMAGES.livingRoom,
  ...HERMAN_COTTAGE2_IMAGES.kitchen,
  ...HERMAN_COTTAGE2_IMAGES.bedrooms,
  ...HERMAN_COTTAGE2_IMAGES.bathrooms,
];
