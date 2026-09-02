import React from "react";
import { notFound } from "next/navigation";
import { VISUALIZATION_REGISTRY, getVisualizationById } from "@/lib/registry";
import DNAReplication from "@/app/components/dna/DNAReplication";
import OsmosisView from "@/app/components/osmosis/OsmosisView";
import ActionPotentialView from "@/app/components/action-potential/ActionPotentialView";
import EnzymeKineticsView from "@/app/components/enzyme/EnzymeKineticsView";
import ProteinSynthesisView from "@/app/components/protein/ProteinSynthesisView";
import VisualizationShell from "@/app/components/shared/VisualizationShell";
import { GenericPreview } from "@/app/components/landing/CardPreviews";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return VISUALIZATION_REGISTRY.map((item) => ({
    id: item.id,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const item = getVisualizationById(id);
  if (!item) return { title: "Visualization Not Found" };
  return {
    title: `${item.title} — Interactive Biology Atlas`,
    description: item.description,
  };
}

export default async function DynamicVisualizationPage({ params }: PageProps) {
  const { id } = await params;
  const item = getVisualizationById(id);

  if (!item) {
    notFound();
  }

  // Route directly to custom interactive views for available models
  if (id === "dna-replication") {
    return <DNAReplication />;
  }
  if (id === "osmosis") {
    return <OsmosisView />;
  }
  if (id === "action-potential") {
    return <ActionPotentialView />;
  }
  if (id === "enzyme-kinetics") {
    return <EnzymeKineticsView />;
  }
  if (id === "protein-synthesis") {
    return <ProteinSynthesisView />;
  }

  // Specimen preview sheet for in-development visualizations
  return (
    <VisualizationShell
      metadata={item}
      sidebar={
        <div className="p-6 font-mono text-xs space-y-4">
          <div className="text-[10px] text-muted uppercase tracking-widest font-semibold">
            Scientific Specimen Registry
          </div>

          <div>
            <div className="text-[9px] uppercase tracking-wider text-muted mb-1">Catalog Number</div>
            <div className="font-bold text-foreground text-sm">{item.categoryCode}</div>
          </div>

          <div>
            <div className="text-[9px] uppercase tracking-wider text-muted mb-1">Primary Variable Parameters</div>
            <div className="flex flex-wrap gap-1">
              {item.primaryVariables.map((v, i) => (
                <span key={i} className="px-2 py-0.5 bg-gray-100 border border-gray-200 text-foreground text-[10px]">
                  {v}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[9px] uppercase tracking-wider text-muted mb-1">Literature Foundation</div>
            <div className="text-muted text-[11px] leading-relaxed italic">{item.citation}</div>
          </div>

          <div className="pt-4 border-t border-border">
            <Link
              href="/"
              className="block w-full text-center px-4 py-2 bg-foreground text-background font-semibold hover:bg-gray-800 transition-colors uppercase tracking-wider text-[11px]"
            >
              ← Return to Library Gallery
            </Link>
          </div>
        </div>
      }
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gray-50/50 text-center font-mono">
        <div className="max-w-xl p-8 bg-white border border-border shadow-xs space-y-4">
          <div className="inline-block px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] uppercase tracking-widest font-semibold">
            In Development · Architectural Pipeline
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground">
            {item.title}
          </h2>

          <p className="text-xs text-muted leading-relaxed">
            {item.description}
          </p>

          <div className="h-36 w-full border border-border bg-slate-50 relative overflow-hidden">
            <GenericPreview previewType={item.previewType} />
          </div>

          <div className="text-left bg-gray-50 p-4 border border-border space-y-2">
            <div className="text-[10px] text-muted uppercase tracking-widest font-bold">
              Core Biophysical Principles under Validation:
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-foreground">
              {item.keyPrinciples.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </VisualizationShell>
  );
}
