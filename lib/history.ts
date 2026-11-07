import { sameConfiguration, type StudioConfiguration } from "@/lib/studio-config";
import { samePosition, type FurnitureLayout } from "@/lib/spatial";

export const HISTORY_LIMIT = 10;

export type StudioDesign = {
  configuration: StudioConfiguration;
  layout: FurnitureLayout;
};

export type DesignHistory = {
  past: StudioDesign[];
  present: StudioDesign;
  future: StudioDesign[];
};

export function copyDesign(design: StudioDesign): StudioDesign {
  return {
    configuration: { ...design.configuration },
    layout: {
      sofa: { variant: design.layout.sofa.variant, position: { ...design.layout.sofa.position } },
      "coffee-table": {
        variant: design.layout["coffee-table"].variant,
        position: { ...design.layout["coffee-table"].position },
      },
      plant: { variant: design.layout.plant.variant, position: { ...design.layout.plant.position } },
    },
  };
}

export function sameDesign(left: StudioDesign, right: StudioDesign): boolean {
  return sameConfiguration(left.configuration, right.configuration) && sameLayout(left.layout, right.layout);
}

export function sameLayout(left: FurnitureLayout, right: FurnitureLayout): boolean {
  return (
    left.sofa.variant === right.sofa.variant &&
    samePosition(left.sofa.position, right.sofa.position) &&
    left["coffee-table"].variant === right["coffee-table"].variant &&
    samePosition(left["coffee-table"].position, right["coffee-table"].position) &&
    left.plant.variant === right.plant.variant &&
    samePosition(left.plant.position, right.plant.position)
  );
}

export function createHistory(present: StudioDesign): DesignHistory {
  return { past: [], present: copyDesign(present), future: [] };
}

export function commitHistory(history: DesignHistory, next: StudioDesign): DesignHistory {
  if (sameDesign(history.present, next)) return history;
  return {
    past: [...history.past, copyDesign(history.present)].slice(-HISTORY_LIMIT),
    present: copyDesign(next),
    future: [],
  };
}

export function undoHistory(history: DesignHistory): DesignHistory {
  const previous = history.past[history.past.length - 1];
  if (!previous) return history;
  return {
    past: history.past.slice(0, -1),
    present: copyDesign(previous),
    future: [copyDesign(history.present), ...history.future],
  };
}

export function redoHistory(history: DesignHistory): DesignHistory {
  const next = history.future[0];
  if (!next) return history;
  return {
    past: [...history.past, copyDesign(history.present)].slice(-HISTORY_LIMIT),
    present: copyDesign(next),
    future: history.future.slice(1),
  };
}
