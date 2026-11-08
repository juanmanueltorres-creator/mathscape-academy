/**
 * REAL SRTM v3 sampled elevations, San Juan Precordillera.
 * Observed through OpenTopoData's public srtm90m endpoint on 2026-11-08 UTC.
 * Each row is 9 points west-to-east; rows ordered north-to-south.
 * Exact returned integers, no fabricated heights. This is NOT a native GeoTIFF.
 * Reproduce the exact query via demAPIURL() in src/real-dem.ts.
 * Horizontal coordinates: WGS84 EPSG:4326; vertical SRTM EGM96, metres.
 * Source: https://www.opentopodata.org/datasets/srtm/
 * Product: https://www.usgs.gov/centers/eros/science/usgs-eros-archive-digital-elevation-shuttle-radar-topography-mission-srtm
 */
export const SRTM_SNAPSHOT={
 dataset:'srtm90m',
 retrievedAtUTC:'2026-11-08',
 size:9,
 interpolation:'bilinear',
 elevations:[2386,2417,2449,2472,2473,2483,2554,2586,2573,2420,2452,2484,2508,2483,2484,2531,2570,2565,2435,2467,2511,2520,2489,2500,2522,2571,2551,2451,2474,2514,2521,2502,2521,2533,2568,2529,2468,2490,2521,2531,2518,2535,2556,2569,2509,2503,2505,2530,2545,2540,2545,2557,2564,2512,2541,2535,2550,2572,2580,2588,2572,2565,2528,2564,2560,2575,2610,2633,2631,2600,2585,2545,2578,2582,2597,2631,2661,2660,2625,2595,2538]
} as const;
