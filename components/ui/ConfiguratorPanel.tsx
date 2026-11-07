"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { cameraPresets, studioCopy, type CameraPresetId } from "@/lib/studio";
import {
  configuratorCopy,
  floorFinishes,
  lightingModes,
  sofaColors,
  sofaFabrics,
  wallFinishes,
  type StudioConfiguration,
} from "@/lib/studio-config";
import { editorCopy, furnitureCatalog, type FurnitureId, type FurnitureLayout, type MoveDirection } from "@/lib/spatial";

type ConfiguratorPanelProps = {
  configuration: StudioConfiguration;
  layout: FurnitureLayout;
  selected: FurnitureId | null;
  disabled: boolean;
  activePreset: CameraPresetId | null;
  notice: string;
  canUndo: boolean;
  canRedo: boolean;
  hasBookmark: boolean;
  onOption: <Key extends keyof StudioConfiguration>(key: Key, value: StudioConfiguration[Key]) => void;
  onPreset: (presetId: CameraPresetId) => void;
  onResetView: () => void;
  onSave: () => void;
  onResetDesign: () => void;
  onRandomize: () => void;
  onSelectFurniture: (id: FurnitureId | null) => void;
  onVariant: (id: FurnitureId, variant: string) => void;
  onNudge: (direction: MoveDirection) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSavePerspective: () => void;
  onRestorePerspective: () => void;
  onClearPerspective: () => void;
};

export function ConfiguratorPanel({
  configuration,
  layout,
  selected,
  disabled,
  activePreset,
  notice,
  canUndo,
  canRedo,
  hasBookmark,
  onOption,
  onPreset,
  onResetView,
  onSave,
  onResetDesign,
  onRandomize,
  onSelectFurniture,
  onVariant,
  onNudge,
  onUndo,
  onRedo,
  onSavePerspective,
  onRestorePerspective,
  onClearPerspective,
}: ConfiguratorPanelProps) {
  return (
    <div className="max-h-[78vh] overflow-y-auto border border-charcoal/15 bg-ivory" aria-label={configuratorCopy.panelLabel}>
      <div className="border-b border-charcoal/10 px-4 py-4 sm:px-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-sage-deep">{studioCopy.label}</p>
        <p className="mt-2 font-display text-3xl tracking-[-0.03em]">{studioCopy.roomTitle}</p>
      </div>
      <div className="space-y-6 px-4 py-5 sm:px-5">
        <OptionGroup label={configuratorCopy.fabric}>
          {sofaFabrics.map((option) => (
            <ChoiceButton
              key={option.id}
              label={option.label}
              description={option.description}
              swatch={option.swatch}
              pressed={configuration.sofaFabric === option.id}
              disabled={disabled}
              onClick={() => onOption("sofaFabric", option.id)}
            />
          ))}
        </OptionGroup>
        <OptionGroup label={configuratorCopy.color}>
          {sofaColors.map((option) => (
            <ChoiceButton
              key={option.id}
              label={option.label}
              description={option.description}
              swatch={option.swatch}
              pressed={configuration.sofaColor === option.id}
              disabled={disabled}
              onClick={() => onOption("sofaColor", option.id)}
            />
          ))}
        </OptionGroup>
        <OptionGroup label={configuratorCopy.floor}>
          {floorFinishes.map((option) => (
            <ChoiceButton
              key={option.id}
              label={option.label}
              description={option.description}
              swatch={option.swatch}
              pressed={configuration.floorFinish === option.id}
              disabled={disabled}
              onClick={() => onOption("floorFinish", option.id)}
            />
          ))}
        </OptionGroup>
        <OptionGroup label={configuratorCopy.walls}>
          {wallFinishes.map((option) => (
            <ChoiceButton
              key={option.id}
              label={option.label}
              description={option.description}
              swatch={option.swatch}
              pressed={configuration.wallFinish === option.id}
              disabled={disabled}
              onClick={() => onOption("wallFinish", option.id)}
            />
          ))}
        </OptionGroup>
        <OptionGroup label={configuratorCopy.light}>
          {lightingModes.map((option) => (
            <ChoiceButton
              key={option.id}
              label={option.label}
              description={option.description}
              swatch={option.swatch}
              pressed={configuration.lightingMode === option.id}
              disabled={disabled}
              onClick={() => onOption("lightingMode", option.id)}
            />
          ))}
        </OptionGroup>
        <FurnitureSection
          layout={layout}
          selected={selected}
          disabled={disabled}
          canUndo={canUndo}
          canRedo={canRedo}
          onSelectFurniture={onSelectFurniture}
          onVariant={onVariant}
          onNudge={onNudge}
          onUndo={onUndo}
          onRedo={onRedo}
        />
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-sage-deep">{configuratorCopy.camera}</p>
          <div role="group" aria-label={studioCopy.viewsLabel} className="mt-3 flex flex-wrap gap-2">
            {cameraPresets.map((preset) => {
              const selected = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={selected}
                  disabled={disabled}
                  onClick={() => onPreset(preset.id)}
                  className={cn(
                    "min-h-11 border px-3 text-[11px] font-medium uppercase tracking-[0.16em] disabled:cursor-not-allowed disabled:opacity-40",
                    selected ? "border-bronze bg-ivory-deep" : "border-charcoal/20 hover:border-bronze",
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={onResetView} disabled={disabled}>
              {studioCopy.reset}
            </Button>
            <Button variant="secondary" onClick={onSavePerspective} disabled={disabled}>
              {editorCopy.perspectiveSave}
            </Button>
            <Button variant="secondary" onClick={onRestorePerspective} disabled={disabled || !hasBookmark}>
              {editorCopy.perspectiveRestore}
            </Button>
            <Button variant="secondary" onClick={onClearPerspective} disabled={disabled || !hasBookmark}>
              {editorCopy.perspectiveClear}
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-charcoal/10 pt-5">
          <Button onClick={onSave} disabled={disabled}>
            {configuratorCopy.save}
          </Button>
          <Button variant="secondary" onClick={onResetDesign} disabled={disabled}>
            {configuratorCopy.resetDesign}
          </Button>
          <Button variant="secondary" onClick={onRandomize} disabled={disabled}>
            {configuratorCopy.randomize}
          </Button>
        </div>
        <p className="text-sm leading-relaxed text-ink-soft">{configuratorCopy.resetNote}</p>
        <p className="text-sm leading-relaxed text-ink-soft">{configuratorCopy.randomNote}</p>
        <p role="status" aria-live="polite" className="min-h-5 text-sm leading-relaxed text-charcoal">
          {notice}
        </p>
      </div>
    </div>
  );
}

function FurnitureSection({
  layout,
  selected,
  disabled,
  canUndo,
  canRedo,
  onSelectFurniture,
  onVariant,
  onNudge,
  onUndo,
  onRedo,
}: {
  layout: FurnitureLayout;
  selected: FurnitureId | null;
  disabled: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onSelectFurniture: (id: FurnitureId | null) => void;
  onVariant: (id: FurnitureId, variant: string) => void;
  onNudge: (direction: MoveDirection) => void;
  onUndo: () => void;
  onRedo: () => void;
}) {
  const piece = selected ? furnitureCatalog[selected] : null;
  const selectedVariant = selected ? layout[selected].variant : null;
  const directions: { id: MoveDirection; label: string }[] = [
    { id: "window", label: editorCopy.window },
    { id: "left", label: editorCopy.left },
    { id: "right", label: editorCopy.right },
    { id: "opening", label: editorCopy.opening },
  ];

  return (
    <div className="border border-charcoal/10 bg-ivory-deep px-3 py-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-sage-deep">{editorCopy.furniture}</p>
      <div role="group" aria-label={editorCopy.furniture} className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(furnitureCatalog) as FurnitureId[]).map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={selected === id}
            disabled={disabled}
            onClick={() => onSelectFurniture(id)}
            className={cn(
              "min-h-11 border px-3 text-[11px] font-medium uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:opacity-40",
              selected === id ? "border-bronze bg-ivory-deep" : "border-charcoal/20 hover:border-bronze",
            )}
          >
            {furnitureCatalog[id].label}
          </button>
        ))}
      </div>
      <p className="mt-3 flex items-center gap-2 text-sm text-charcoal" aria-live="polite">
        <span aria-hidden="true" className={cn("size-1.5 shrink-0", selected ? "bg-bronze" : "bg-charcoal/25")} />
        {selected && piece ? `${editorCopy.selected}: ${piece.label}` : editorCopy.none}
      </p>
      {selected && piece ? (
        <div role="group" aria-label={`${piece.label} form`} className="mt-3 flex flex-wrap gap-2">
          {piece.variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              title={variant.description}
              aria-pressed={selectedVariant === variant.id}
              disabled={disabled}
              onClick={() => onVariant(selected, variant.id)}
              className={cn(
                "min-h-11 border px-3 text-left text-[11px] font-medium uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:opacity-40",
                selectedVariant === variant.id ? "border-bronze bg-ivory-deep" : "border-charcoal/20 hover:border-bronze",
              )}
            >
              {variant.label}
            </button>
          ))}
        </div>
      ) : null}
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{editorCopy.dragHint}</p>
      <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label={editorCopy.nudge}>
        <span />
        <NudgeButton label={directions[0].label} direction={directions[0].id} disabled={disabled || !selected} onNudge={onNudge} selected={selected} />
        <span />
        <NudgeButton label={directions[1].label} direction={directions[1].id} disabled={disabled || !selected} onNudge={onNudge} selected={selected} />
        <button
          type="button"
          disabled={disabled || !selected}
          onClick={() => onSelectFurniture(null)}
          className="min-h-11 border border-charcoal/20 px-2 text-[11px] font-medium uppercase tracking-[0.12em] hover:border-bronze disabled:cursor-not-allowed disabled:opacity-40"
        >
          {editorCopy.clearSelection}
        </button>
        <NudgeButton label={directions[2].label} direction={directions[2].id} disabled={disabled || !selected} onNudge={onNudge} selected={selected} />
        <span />
        <NudgeButton label={directions[3].label} direction={directions[3].id} disabled={disabled || !selected} onNudge={onNudge} selected={selected} />
        <span />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={disabled || !canUndo}
          aria-keyshortcuts="Control+Z Meta+Z"
          className="min-h-11 border border-charcoal/20 px-3 text-[11px] font-medium uppercase tracking-[0.16em] hover:border-bronze disabled:cursor-not-allowed disabled:opacity-40"
        >
          {editorCopy.undo}
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={disabled || !canRedo}
          aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z"
          className="min-h-11 border border-charcoal/20 px-3 text-[11px] font-medium uppercase tracking-[0.16em] hover:border-bronze disabled:cursor-not-allowed disabled:opacity-40"
        >
          {editorCopy.redo}
        </button>
      </div>
    </div>
  );
}

function NudgeButton({
  label,
  direction,
  disabled,
  selected,
  onNudge,
}: {
  label: string;
  direction: MoveDirection;
  disabled: boolean;
  selected: FurnitureId | null;
  onNudge: (direction: MoveDirection) => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={selected ? `Move ${furnitureCatalog[selected].label} ${label}` : label}
      onClick={() => onNudge(direction)}
      className="min-h-11 border border-charcoal/20 px-2 text-[11px] font-medium uppercase tracking-[0.12em] hover:border-bronze disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label}
    </button>
  );
}

function OptionGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-sage-deep">{label}</p>
      <div role="group" aria-label={label} className="mt-3 flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
}

function ChoiceButton({
  label,
  description,
  swatch,
  pressed,
  disabled,
  onClick,
}: {
  label: string;
  description: string;
  swatch: string;
  pressed: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      title={description}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 border px-3 text-left text-[11px] font-medium uppercase tracking-[0.14em] transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        pressed ? "border-bronze bg-ivory-deep" : "border-charcoal/20 hover:border-bronze",
      )}
    >
      <span aria-hidden="true" className="size-4 shrink-0 border border-charcoal/25" style={{ backgroundColor: swatch }} />
      {label}
    </button>
  );
}
