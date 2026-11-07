"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { ConfiguratorPanel } from "@/components/ui/ConfiguratorPanel";
import { cn } from "@/lib/cn";
import {
  browserBookmarkStorage,
  clearCameraBookmark,
  isRestorablePose,
  readCameraBookmarkSnapshot,
  rememberCameraBookmark,
  writeCameraBookmark,
} from "@/lib/camera-bookmark";
import { commitHistory, createHistory, redoHistory, undoHistory, type DesignHistory, type StudioDesign } from "@/lib/history";
import {
  commandForPose,
  commandForPreset,
  commandForReset,
  studioCopy,
  type CameraCommand,
  type CameraPose,
  type CameraPresetId,
} from "@/lib/studio";
import {
  browserDesignStorage,
  configuratorCopy,
  randomConfiguration,
  withConfigurationOption,
  type StudioConfiguration,
} from "@/lib/studio-config";
import {
  defaultDesign,
  designWithConfiguration,
  designWithLayout,
  readDesignSnapshot,
  rememberStoredStudio,
  serverDesignSnapshot,
  writeStudioDesign,
} from "@/lib/studio-design";
import {
  editorCopy,
  nudgeFurniture,
  placeVariant,
  samePosition,
  type FurnitureId,
  type FurnitureLayout,
  type MoveDirection,
  type PlantVariant,
  type SofaVariant,
  type TableVariant,
} from "@/lib/spatial";
import { detectWebGL } from "@/lib/webgl";
import type { RoomCanvasHandle } from "@/components/three/RoomCanvas";

const RoomCanvas = dynamic(() => import("@/components/three/RoomCanvas"), {
  ssr: false,
  loading: () => <StudioSkeleton />,
});

type Support = "pending" | "ready" | "unsupported";

function subscribeToNothing() {
  return () => {};
}

function subscribeToMotion(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function subscribeToViewport(onChange: () => void) {
  const media = window.matchMedia("(max-width: 767px)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function readReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readCompact() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function readWebGLSupport(): Support {
  return detectWebGL() ? "ready" : "unsupported";
}

const initialCommand: CameraCommand = { presetId: "overview", nonce: 0, immediate: true };

export function StudioStage() {
  const support = useSyncExternalStore(subscribeToNothing, readWebGLSupport, () => "pending" as const);
  const reduceMotion = useSyncExternalStore(subscribeToMotion, readReducedMotion, () => false);
  const compact = useSyncExternalStore(subscribeToViewport, readCompact, () => false);
  const storedDesign = useSyncExternalStore(subscribeToNothing, readDesignSnapshot, () => serverDesignSnapshot);
  const storedBookmark = useSyncExternalStore(subscribeToNothing, readCameraBookmarkSnapshot, () => null);
  const [command, setCommand] = useState<CameraCommand>(initialCommand);
  const [activePreset, setActivePreset] = useState<CameraPresetId | null>("overview");
  const [followCommand, setFollowCommand] = useState(true);
  const [history, setHistory] = useState<DesignHistory | null>(null);
  const [bookmarkOverride, setBookmarkOverride] = useState<CameraPose | null | undefined>(undefined);
  const [selected, setSelected] = useState<FurnitureId | null>(null);
  const [notice, setNotice] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const canvasRef = useRef<RoomCanvasHandle>(null);
  const draggingRef = useRef(false);
  const design = history?.present ?? storedDesign.design;
  const designRef = useRef(design);
  const historyRef = useRef(history);
  const selectedRef = useRef(selected);
  const bookmark = bookmarkOverride === undefined ? storedBookmark : bookmarkOverride;

  useEffect(() => {
    designRef.current = design;
    historyRef.current = history;
    selectedRef.current = selected;
  });
  const canControl = support === "ready";

  const commitDesign = useCallback((next: StudioDesign) => {
    setHistory((current) => commitHistory(current ?? createHistory(designRef.current), next));
  }, []);

  const undo = useCallback(() => {
    if (draggingRef.current) return;
    const current = historyRef.current;
    if (!current || current.past.length === 0) return;
    setHistory(undoHistory(current));
    setNotice(editorCopy.undone);
  }, []);

  const redo = useCallback(() => {
    if (draggingRef.current) return;
    const current = historyRef.current;
    if (!current || current.future.length === 0) return;
    setHistory(redoHistory(current));
    setNotice(editorCopy.redone);
  }, []);

  const nudge = useCallback(
    (direction: MoveDirection) => {
      const id = selectedRef.current;
      if (!id || draggingRef.current) return;
      const next = nudgeFurniture(designRef.current.layout, id, direction);
      if (next === designRef.current.layout) {
        setNotice(editorCopy.blocked);
        return;
      }
      commitDesign(designWithLayout(designRef.current, next));
      setNotice("");
    },
    [commitDesign],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("input, textarea, select, [contenteditable='true']")) return;
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
        return;
      }
      if (meta || event.altKey) return;
      const direction = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "window", ArrowDown: "opening" }[event.key] as
        | MoveDirection
        | undefined;
      if (!direction || !selectedRef.current) return;
      event.preventDefault();
      nudge(direction);
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nudge, redo, undo]);

  const handleUserOrbit = useCallback(() => {
    setActivePreset(null);
    setFollowCommand(false);
  }, []);

  function selectPreset(presetId: CameraPresetId) {
    setCommand((current) => commandForPreset(presetId, current.nonce + 1, reduceMotion));
    setActivePreset(presetId);
    setFollowCommand(true);
  }

  function resetView() {
    setCommand((current) => commandForReset(current.nonce + 1));
    setActivePreset("overview");
    setFollowCommand(true);
  }

  function selectOption<Key extends keyof StudioConfiguration>(key: Key, value: StudioConfiguration[Key]) {
    const nextConfiguration = withConfigurationOption(designRef.current.configuration, key, value);
    if (!nextConfiguration) return;
    commitDesign(designWithConfiguration(designRef.current, nextConfiguration));
    setNotice("");
  }

  function saveDesign() {
    const saved = writeStudioDesign(browserDesignStorage(), designRef.current);
    if (saved) rememberStoredStudio(designRef.current);
    setNotice(saved ? configuratorCopy.saved : configuratorCopy.unavailable);
  }

  function resetDesign() {
    commitDesign(defaultDesign);
    setNotice(configuratorCopy.resetNote);
  }

  function randomizeDesign() {
    commitDesign(designWithConfiguration(designRef.current, randomConfiguration(designRef.current.configuration)));
    setNotice(configuratorCopy.randomNote);
  }

  function changeVariant(id: FurnitureId, variant: string) {
    const layout = designRef.current.layout;
    const next = variantLayout(layout, id, variant);
    if (!next) {
      setNotice(editorCopy.variantReject);
      return;
    }
    const moved = !samePosition(next[id].position, layout[id].position);
    commitDesign(designWithLayout(designRef.current, next));
    setNotice(moved ? editorCopy.variantFit : "");
  }

  function commitMove(id: FurnitureId, position: { x: number; z: number }) {
    const layout = designRef.current.layout;
    if (samePosition(layout[id].position, position)) return;
    commitDesign(designWithLayout(designRef.current, { ...layout, [id]: { ...layout[id], position } }));
    setNotice("");
  }

  function savePerspective() {
    const pose = canvasRef.current?.getPose();
    if (!pose || !isRestorablePose(pose)) {
      setNotice(editorCopy.perspectiveInvalid);
      return;
    }
    const saved = writeCameraBookmark(browserBookmarkStorage(), pose);
    if (!saved) {
      setNotice(editorCopy.perspectiveUnavailable);
      return;
    }
    rememberCameraBookmark(pose);
    setBookmarkOverride(pose);
    setNotice(editorCopy.perspectiveSaved);
  }

  function restorePerspective() {
    if (!bookmark) {
      setNotice(editorCopy.perspectiveEmpty);
      return;
    }
    setCommand((current) => commandForPose(bookmark, current.nonce + 1, reduceMotion));
    setActivePreset(null);
    setFollowCommand(true);
    setNotice(editorCopy.perspectiveRestored);
  }

  function clearPerspective() {
    if (!clearCameraBookmark(browserBookmarkStorage())) {
      setNotice(editorCopy.perspectiveUnavailable);
      return;
    }
    rememberCameraBookmark(null);
    setBookmarkOverride(null);
    setNotice(editorCopy.perspectiveCleared);
  }

  const status =
    notice || (history === null && storedDesign.restored ? (storedDesign.migrated ? editorCopy.migrated : configuratorCopy.restored) : "");

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <div className="min-w-0 border border-charcoal/15 bg-ivory">
        <div
          className="relative h-[62vh] min-h-[420px] min-w-0 overflow-hidden lg:h-[78vh]"
          role="region"
          aria-label={studioCopy.label}
          aria-describedby="studio-help"
        >
          {support === "pending" ? <StudioSkeleton /> : null}
          {support === "unsupported" ? <WebGLFallback /> : null}
          {support === "ready" ? (
            <RoomCanvas
              ref={canvasRef}
              command={command}
              configuration={design.configuration}
              layout={design.layout}
              selected={selected}
              compact={compact}
              reduceMotion={reduceMotion}
              applyFrame={followCommand}
              onUserOrbit={handleUserOrbit}
              onSelect={setSelected}
              onCommit={commitMove}
              onDragActive={(active) => {
                draggingRef.current = active;
              }}
            />
          ) : null}
        </div>
        <p id="studio-help" className="border-t border-charcoal/10 px-4 py-4 text-sm leading-relaxed text-ink-soft sm:px-5">
          {studioCopy.help}
        </p>
      </div>
      <div>
        <button
          type="button"
          className="mb-3 min-h-11 w-full border border-charcoal/20 px-4 text-[11px] font-medium uppercase tracking-[0.18em] lg:hidden"
          aria-expanded={panelOpen}
          onClick={() => setPanelOpen((open) => !open)}
        >
          {panelOpen ? configuratorCopy.close : configuratorCopy.open}
        </button>
        <div className={cn(panelOpen ? "block" : "hidden", "lg:block")}>
          <ConfiguratorPanel
            configuration={design.configuration}
            layout={design.layout}
            selected={selected}
            disabled={!canControl}
            activePreset={activePreset}
            notice={status}
            canUndo={(history?.past.length ?? 0) > 0}
            canRedo={(history?.future.length ?? 0) > 0}
            hasBookmark={bookmark !== null}
            onOption={selectOption}
            onPreset={selectPreset}
            onResetView={resetView}
            onSave={saveDesign}
            onResetDesign={resetDesign}
            onRandomize={randomizeDesign}
            onSelectFurniture={setSelected}
            onVariant={changeVariant}
            onNudge={nudge}
            onUndo={undo}
            onRedo={redo}
            onSavePerspective={savePerspective}
            onRestorePerspective={restorePerspective}
            onClearPerspective={clearPerspective}
          />
        </div>
      </div>
    </div>
  );
}

function variantLayout(layout: FurnitureLayout, id: FurnitureId, variant: string): FurnitureLayout | null {
  if (id === "sofa" && (variant === "modern" || variant === "rounded")) {
    return placeVariant(layout, id, variant as SofaVariant);
  }
  if (id === "coffee-table" && (variant === "rectangular" || variant === "sculptural")) {
    return placeVariant(layout, id, variant as TableVariant);
  }
  if (id === "plant" && (variant === "tall" || variant === "compact")) {
    return placeVariant(layout, id, variant as PlantVariant);
  }
  return null;
}

function StudioSkeleton() {
  return (
    <div className="flex h-full min-h-[420px] flex-col justify-between bg-ivory-deep p-6 sm:p-8" role="status" aria-live="polite">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-sage-deep">{studioCopy.preparing}</p>
      <div className="mx-auto w-full max-w-sm flex-1 py-8">
        <div className="h-full min-h-40 border border-charcoal/15 motion-safe:animate-pulse" />
      </div>
      <p className="text-sm text-ink-soft">{studioCopy.loading}</p>
    </div>
  );
}

function WebGLFallback() {
  return (
    <div className="flex h-full min-h-[420px] flex-col justify-end bg-ivory-deep p-6 sm:p-10">
      <h2 className="max-w-md font-display text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">{studioCopy.fallbackTitle}</h2>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft">{studioCopy.fallbackBody}</p>
      <div className="mt-6">
        <Button href="/spaces">{studioCopy.fallbackAction}</Button>
      </div>
    </div>
  );
}
