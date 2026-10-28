/**
 * Geometry for the schematic anterior-view circulation plate.
 *
 * Coordinate system: 1280 × 860 (the SVG viewBox is offset by −40 on x so the
 * 1200-wide anatomy sits optically centred). All paths use the same 1200 × 860
 * anatomical frame; the renderer applies no extra transform.
 *
 * The illustration is deliberately schematic: it is an anterior, cut-away
 * teaching plate, not a to-scale anatomical reconstruction.
 */

export type BloodTone = "venous" | "arterial";
export type Circuit = "pulmonary" | "systemic";

export interface VesselPath {
  d: string;
  width: number;
}

export interface VesselDefinition {
  id: string;
  paths: VesselPath[];
  tone: BloodTone;
  circuit: Circuit | "both";
}

export interface ValveDefinition {
  id: string;
  x: number;
  y: number;
  rx: number;
  ry: number;
  rotate: number;
  tone: BloodTone;
  label: {
    x: number;
    y: number;
    anchor: "start" | "middle" | "end";
    leader?: { x1: number; y1: number; x2: number; y2: number };
  };
}

export interface RoutePiece {
  /** Matches a CirculationStepDefinition id (and a key of CIRCULATION_INSPECTABLES). */
  stepId: string;
  d: string;
  tone: BloodTone;
  circuit: Circuit;
  /** Show a direction arrow at the end of this piece. */
  arrow?: boolean;
}

export interface StepAnchor {
  x: number;
  y: number;
}

/* ─────────────────────────────────────────────────────────────
   LUNGS
   ───────────────────────────────────────────────────────────── */

/** Patient RIGHT lung (viewer left) — three lobes. */
export const RIGHT_LUNG_PATH =
  "M 295 90 C 275 90, 255 108, 242 138 C 224 180, 208 240, 200 300 " +
  "C 194 344, 192 380, 198 404 C 204 414, 240 392, 280 388 " +
  "C 310 385, 334 386, 352 392 C 364 386, 368 374, 368 358 " +
  "L 368 240 C 366 200, 354 158, 334 126 " +
  "C 320 104, 308 90, 295 90 Z";

export const RIGHT_LUNG_FISSURES = [
  "M 240 200 C 280 194, 320 196, 350 204",
  "M 200 310 C 250 290, 320 250, 360 220",
];

/** Patient LEFT lung (viewer right) — two lobes and a cardiac impression. */
export const LEFT_LUNG_PATH =
  "M 1005 90 C 1025 90, 1045 108, 1058 138 C 1076 180, 1092 240, 1100 300 " +
  "C 1106 344, 1108 380, 1102 404 C 1098 412, 1080 398, 1058 394 " +
  "C 1020 388, 980 388, 948 392 C 936 386, 932 374, 932 358 " +
  "C 932 344, 936 334, 936 324 C 936 312, 926 302, 908 296 " +
  "C 908 280, 908 268, 910 254 C 914 218, 924 178, 940 146 " +
  "C 954 118, 984 92, 1005 90 Z";

export const LEFT_LUNG_FISSURE =
  "M 930 324 C 980 292, 1030 252, 1075 220";

/** Branching bronchial tree, drawn faintly inside each lung. */
export const RIGHT_LUNG_BRONCHI = [
  "M 368 252 C 330 248, 296 226, 276 198",
  "M 368 270 C 334 280, 304 306, 290 340",
  "M 330 248 C 318 232, 310 224, 300 220",
  "M 334 280 C 322 294, 314 302, 304 308",
];

export const LEFT_LUNG_BRONCHI = [
  "M 908 252 C 946 248, 980 226, 1000 198",
  "M 908 270 C 942 280, 972 306, 986 340",
  "M 946 248 C 958 232, 966 224, 976 220",
  "M 942 280 C 954 294, 962 302, 972 308",
];

/* ─────────────────────────────────────────────────────────────
   HEART
   ───────────────────────────────────────────────────────────── */

export const HEART_OUTLINE_PATH =
  "M 508 306 C 470 320, 446 360, 442 410 " +
  "C 438 470, 462 535, 506 585 " +
  "C 550 632, 620 672, 690 684 " +
  "C 712 688, 734 670, 754 644 " +
  "C 788 600, 806 540, 810 478 " +
  "C 812 418, 800 360, 774 326 " +
  "C 748 294, 706 284, 668 292 " +
  "C 638 298, 614 308, 592 318 " +
  "C 562 300, 532 298, 508 306 Z";

export interface ChamberDefinition {
  id: string;
  d: string;
  tone: BloodTone;
  /** Compact label for the reduced-label mode. */
  abbreviation: string;
  label: { x: number; y: number };
  saturation?: { x: number; y: number };
}

export const CHAMBERS: ChamberDefinition[] = [
  {
    id: "right-atrium",
    d:
      "M 486 318 C 462 332, 458 392, 470 430 " +
      "C 488 448, 542 450, 564 434 " +
      "C 578 410, 570 366, 548 346 " +
      "C 526 330, 506 328, 486 318 Z",
    tone: "venous",
    abbreviation: "RA",
    label: { x: 514, y: 356 },
    saturation: { x: 514, y: 372 },
  },
  {
    id: "left-atrium",
    d:
      "M 706 312 C 686 326, 678 362, 686 400 " +
      "C 706 416, 748 418, 780 404 " +
      "C 794 384, 792 350, 776 332 " +
      "C 758 318, 730 308, 706 312 Z",
    tone: "arterial",
    abbreviation: "LA",
    label: { x: 742, y: 346 },
    saturation: { x: 742, y: 362 },
  },
  {
    id: "right-ventricle",
    d:
      "M 492 458 C 482 500, 500 552, 532 588 " +
      "C 554 612, 582 630, 606 636 " +
      "C 616 600, 606 550, 594 506 " +
      "C 586 474, 576 454, 566 444 " +
      "C 540 448, 516 452, 492 458 Z",
    tone: "venous",
    abbreviation: "RV",
    label: { x: 550, y: 548 },
    saturation: { x: 550, y: 564 },
  },
  {
    id: "left-ventricle",
    d:
      "M 620 448 C 632 500, 650 555, 670 600 " +
      "C 682 632, 696 652, 708 662 " +
      "C 734 648, 754 618, 768 580 " +
      "C 780 542, 780 494, 772 452 " +
      "C 756 434, 730 430, 704 434 " +
      "C 674 438, 644 440, 620 448 Z",
    tone: "arterial",
    abbreviation: "LV",
    label: { x: 705, y: 544 },
    saturation: { x: 705, y: 560 },
  },
];

/** Muscular interventricular septum. */
export const SEPTUM_PATH =
  "M 600 438 C 610 486, 622 542, 642 590 C 654 620, 668 640, 686 650";

/** Right-ventricular outflow tract (conus arteriosus) up to the pulmonary valve. */
export const RV_OUTFLOW_PATH =
  "M 568 440 C 574 400, 584 360, 592 322 L 612 326 C 602 365, 592 405, 586 442 Z";

/** Left-ventricular outflow tract up to the aortic valve. */
export const LV_OUTFLOW_PATH =
  "M 664 432 C 664 395, 664 360, 666 326 L 686 330 C 682 365, 680 400, 680 436 Z";

export const VALVES: ValveDefinition[] = [
  {
    id: "tricuspid-valve",
    x: 546,
    y: 445,
    rx: 26,
    ry: 8,
    rotate: -8,
    tone: "venous",
    label: {
      x: 512,
      y: 486,
      anchor: "middle",
      leader: { x1: 528, y1: 480, x2: 544, y2: 452 },
    },
  },
  {
    id: "mitral-valve",
    x: 720,
    y: 424,
    rx: 26,
    ry: 8,
    rotate: 8,
    tone: "arterial",
    label: {
      x: 726,
      y: 466,
      anchor: "start",
      leader: { x1: 724, y1: 460, x2: 722, y2: 430 },
    },
  },
  {
    id: "pulmonary-valve",
    x: 600,
    y: 340,
    rx: 16,
    ry: 6,
    rotate: 0,
    tone: "venous",
    label: {
      x: 575,
      y: 302,
      anchor: "end",
      leader: { x1: 578, y1: 306, x2: 596, y2: 334 },
    },
  },
  {
    id: "aortic-valve",
    x: 670,
    y: 340,
    rx: 16,
    ry: 6,
    rotate: 0,
    tone: "arterial",
    label: {
      x: 704,
      y: 290,
      anchor: "start",
      leader: { x1: 702, y1: 294, x2: 676, y2: 334 },
    },
  },
];

/* ─────────────────────────────────────────────────────────────
   GREAT VESSELS
   ───────────────────────────────────────────────────────────── */

/**
 * Draw order matters for the overpasses:
 * aorta (posterior) → pulmonary veins → pulmonary arteries → vena cava (anterior).
 */
export const VESSELS: VesselDefinition[] = [
  {
    id: "aorta",
    tone: "arterial",
    circuit: "systemic",
    paths: [
      {
        d:
          "M 670 342 C 670 300, 700 252, 726 216 C 748 178, 796 158, 832 176 " +
          "C 862 191, 878 224, 878 268 C 878 352, 874 470, 870 580 " +
          "C 868 660, 860 715, 848 748",
        width: 26,
      },
      { d: "M 748 184 C 744 152, 740 122, 736 94", width: 9 },
      { d: "M 780 168 C 780 140, 782 114, 782 90", width: 9 },
      { d: "M 812 164 C 816 138, 820 114, 824 92", width: 9 },
    ],
  },
  {
    id: "pulmonary-veins",
    tone: "arterial",
    circuit: "pulmonary",
    paths: [
      { d: "M 908 288 C 878 312, 830 340, 790 362", width: 11 },
      { d: "M 908 302 C 876 328, 826 352, 784 376", width: 11 },
      { d: "M 368 288 C 470 326, 590 352, 700 372", width: 11 },
      { d: "M 368 302 C 480 342, 600 368, 710 386", width: 11 },
    ],
  },
  {
    id: "pulmonary-arteries",
    tone: "venous",
    circuit: "pulmonary",
    paths: [
      { d: "M 601 342 C 598 300, 598 268, 602 244 C 604 235, 606 229, 610 224", width: 21 },
      { d: "M 610 224 C 680 208, 800 206, 908 232", width: 16 },
      { d: "M 610 224 C 540 206, 460 208, 368 232", width: 16 },
    ],
  },
  {
    id: "vena-cava",
    tone: "venous",
    circuit: "systemic",
    paths: [
      { d: "M 468 86 C 470 152, 476 246, 492 342", width: 22 },
      { d: "M 492 760 C 486 660, 482 560, 490 470 C 491 450, 492 442, 496 438", width: 22 },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────
   CONTINUOUS CIRCULATION ROUTE
   Pieces meet end-to-start in circulation order.
   ───────────────────────────────────────────────────────────── */

export const ROUTE_PIECES: RoutePiece[] = [
  {
    stepId: "right-atrium",
    circuit: "pulmonary",
    tone: "venous",
    d: "M 496 438 C 500 420, 508 408, 520 400",
  },
  {
    stepId: "right-ventricle",
    circuit: "pulmonary",
    tone: "venous",
    d: "M 520 400 C 524 418, 532 436, 542 447 C 552 468, 558 492, 560 520",
    arrow: true,
  },
  {
    stepId: "pulmonary-arteries",
    circuit: "pulmonary",
    tone: "venous",
    d:
      "M 560 520 C 572 490, 584 450, 590 412 C 594 382, 596 356, 600 340 " +
      "C 600 300, 600 272, 604 248 C 606 238, 608 230, 610 224 " +
      "C 680 208, 800 206, 908 232",
    arrow: true,
  },
  {
    // Deoxygenated blood entering the alveolar capillary bed.
    stepId: "lungs",
    circuit: "pulmonary",
    tone: "venous",
    d: "M 908 232 C 950 240, 995 252, 1025 275 C 1045 291, 1042 310, 1020 320",
    arrow: true,
  },
  {
    // Oxygenated blood leaving the alveolar capillary bed.
    stepId: "lungs",
    circuit: "pulmonary",
    tone: "arterial",
    d: "M 1020 320 C 995 340, 955 350, 925 340 C 908 333, 896 312, 908 288",
    arrow: true,
  },
  {
    stepId: "left-atrium",
    circuit: "pulmonary",
    tone: "arterial",
    d: "M 908 288 C 884 312, 840 338, 804 356 C 790 364, 778 370, 766 376",
    arrow: true,
  },
  {
    stepId: "left-ventricle",
    circuit: "systemic",
    tone: "arterial",
    d: "M 766 376 C 742 388, 720 406, 706 424 C 712 452, 716 482, 720 510",
    arrow: true,
  },
  {
    stepId: "aorta",
    circuit: "systemic",
    tone: "arterial",
    d:
      "M 720 510 C 716 480, 700 448, 688 412 C 678 380, 674 356, 670 340 " +
      "C 670 300, 700 252, 726 216 C 748 178, 796 158, 832 176 " +
      "C 862 191, 878 224, 878 268 C 878 352, 874 470, 870 580 " +
      "C 868 660, 860 715, 848 748",
    arrow: true,
  },
  {
    // Arterial blood entering the systemic capillary bed.
    stepId: "body-tissues",
    circuit: "systemic",
    tone: "arterial",
    d: "M 848 748 C 820 770, 790 720, 760 748 C 730 776, 700 720, 670 748",
    arrow: true,
  },
  {
    // Venous blood leaving the systemic capillary bed.
    stepId: "body-tissues",
    circuit: "systemic",
    tone: "venous",
    d: "M 670 748 C 640 776, 610 720, 580 748 C 550 776, 520 720, 490 748",
    arrow: true,
  },
  {
    stepId: "vena-cava",
    circuit: "systemic",
    tone: "venous",
    d: "M 490 748 C 486 680, 484 600, 488 520 C 490 485, 492 462, 496 438",
    arrow: true,
  },
];

/** Position of the numbered step marker, chosen to sit on the route. */
export const STEP_ANCHORS: Record<string, StepAnchor> = {
  "right-atrium": { x: 512, y: 420 },
  "right-ventricle": { x: 570, y: 512 },
  "pulmonary-arteries": { x: 612, y: 250 },
  lungs: { x: 1012, y: 310 },
  "left-atrium": { x: 788, y: 352 },
  "left-ventricle": { x: 700, y: 500 },
  aorta: { x: 878, y: 420 },
  "body-tissues": { x: 670, y: 748 },
  "vena-cava": { x: 486, y: 620 },
};

/** Systemic capillary-bed region. */
export const BODY_BED_PATH =
  "M 330 720 C 368 700, 418 736, 468 716 C 518 696, 558 736, 608 716 " +
  "C 658 696, 698 736, 748 716 C 798 696, 838 734, 888 714 " +
  "C 922 702, 950 716, 950 738 L 950 812 " +
  "C 950 830, 938 840, 918 840 L 362 840 C 342 840, 330 830, 330 812 Z";

export const BODY_CAPILLARIES = [
  "M 360 760 C 390 738, 420 782, 450 760 C 480 738, 510 782, 540 760",
  "M 480 746 C 510 724, 540 768, 570 746 C 600 724, 630 768, 660 746",
  "M 600 764 C 630 742, 660 786, 690 764 C 720 742, 750 786, 780 764",
  "M 720 748 C 750 726, 780 770, 810 748 C 840 726, 870 770, 900 748",
  "M 420 774 C 450 752, 480 796, 510 774",
  "M 750 774 C 780 752, 810 796, 840 774",
];

/** Directional flow guide on the head / upper-limb arterial branches. */
export const HEAD_BRANCH_CAP = "M 728 88 L 832 88";
