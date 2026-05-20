import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { CosmicNode, CosmicLink } from "../types";
import { EN_TRANSLATIONS } from "../translations";

interface ConstellationGraphProps {
  nodes: CosmicNode[];
  selectedId: string | null;
  hoveredNodeId: string | null;
  onSelectNode: (id: string) => void;
  searchQuery: string;
  lang: "cn" | "en";
}

export function ConstellationGraph({
  nodes,
  selectedId,
  hoveredNodeId,
  onSelectNode,
  searchQuery,
  lang,
}: ConstellationGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });
  const simulationRef = useRef<d3.Simulation<CosmicNode, undefined> | null>(null);

  // Synchronize size updates
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width || 600,
          height: entry.contentRect.height || 600,
        });
      }
    });
    
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || nodes.length === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgEl);

    // Clear previous elements
    svg.selectAll("*").remove();

    // Setup zoom/pan container
    const mainGroup = svg.append("g").attr("class", "main-group");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        mainGroup.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Deep copy nodes for stable D3 manipulation without modifying the source React states direct
    const localNodes: CosmicNode[] = nodes.map(n => ({
      ...n,
      // Retain coordinate states if simulation was already running to prevent jumping!
      x: n.x ?? (width / 2 + (Math.random() - 0.5) * 160),
      y: n.y ?? (height / 2 + (Math.random() - 0.5) * 160),
    }));

    // Generate links
    const localLinks: { source: string; target: string }[] = [];
    localNodes.forEach((n) => {
      if (n.linked_to) {
        n.linked_to.forEach((linkedId) => {
          // Double-check target node actually exists in our current dataset
          if (localNodes.some(x => x.id === linkedId)) {
            // Avoid duplicate links
            const exists = localLinks.some(
              l => (l.source === n.id && l.target === linkedId) || (l.source === linkedId && l.target === n.id)
            );
            if (!exists) {
              localLinks.push({ source: n.id, target: linkedId });
            }
          }
        });
      }
    });

    // Create D3 Force simulation
    const simulation = d3.forceSimulation<CosmicNode>(localNodes)
      .force("link", d3.forceLink<any, any>(localLinks).id((d) => d.id).distance(140))
      .force("charge", d3.forceManyBody().strength(-240))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50))
      .alphaDecay(0.025);

    simulationRef.current = simulation;

    // Filters for beautiful glowing stars
    const defs = svg.append("defs");
    
    // Very soft blur filter for making the glow auras extremely misty and organic
    const filterSoftBlur = defs.append("filter").attr("id", "soft-blur");
    filterSoftBlur.append("feGaussianBlur")
      .attr("stdDeviation", "10") // high deviation for luxurious 1:1 foggy falloff
      .attr("result", "blur");

    // Glow Gradient 1: Normal Unselected Star Halo
    const glowNormal = defs.append("radialGradient")
      .attr("id", "glow-normal")
      .attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
    glowNormal.append("stop").attr("offset", "0%").attr("stop-color", "#ffd43b").attr("stop-opacity", "1");
    glowNormal.append("stop").attr("offset", "15%").attr("stop-color", "#fcc419").attr("stop-opacity", "0.8");
    glowNormal.append("stop").attr("offset", "45%").attr("stop-color", "#e2a114").attr("stop-opacity", "0.22");
    glowNormal.append("stop").attr("offset", "80%").attr("stop-color", "#b57a05").attr("stop-opacity", "0.04");
    glowNormal.append("stop").attr("offset", "100%").attr("stop-color", "#000000").attr("stop-opacity", "0");

    // Glow Gradient 2: Selected Star Halo (brighter, wider, white-gold core)
    const glowSelected = defs.append("radialGradient")
      .attr("id", "glow-selected")
      .attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
    glowSelected.append("stop").attr("offset", "0%").attr("stop-color", "#ffffff").attr("stop-opacity", "1");
    glowSelected.append("stop").attr("offset", "12%").attr("stop-color", "#fff3bf").attr("stop-opacity", "0.95");
    glowSelected.append("stop").attr("offset", "35%").attr("stop-color", "#fcc419").attr("stop-opacity", "0.4");
    glowSelected.append("stop").attr("offset", "70%").attr("stop-color", "#e2a114").attr("stop-opacity", "0.08");
    glowSelected.append("stop").attr("offset", "100%").attr("stop-color", "#000000").attr("stop-opacity", "0");

    // Glow Gradient 3: Searched Target Star Halo
    const glowSearch = defs.append("radialGradient")
      .attr("id", "glow-search")
      .attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
    glowSearch.append("stop").attr("offset", "0%").attr("stop-color", "#ffffff").attr("stop-opacity", "1");
    glowSearch.append("stop").attr("offset", "20%").attr("stop-color", "#ffd43b").attr("stop-opacity", "0.95");
    glowSearch.append("stop").attr("offset", "55%").attr("stop-color", "#ffd43b").attr("stop-opacity", "0.35");
    glowSearch.append("stop").attr("offset", "85%").attr("stop-color", "#ffd43b").attr("stop-opacity", "0.06");
    glowSearch.append("stop").attr("offset", "100%").attr("stop-color", "#000000").attr("stop-opacity", "0");

    // Render connection lines (constellation paths)
    const link = mainGroup.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(localLinks)
      .join("line")
      .attr("stroke", (d) => {
        // Highlight logic
        const isCoreLink = d.source === selectedId || d.target === selectedId || d.source === hoveredNodeId || d.target === hoveredNodeId;
        return isCoreLink ? "rgba(252, 196, 25, 0.45)" : "rgba(255, 255, 255, 0.08)";
      })
      .attr("stroke-width", (d) => (d.source === selectedId || d.target === selectedId || d.source === hoveredNodeId || d.target === hoveredNodeId ? 1.7 : 1))
      .attr("stroke-dasharray", (d) => (d.source === selectedId || d.target === selectedId || d.source === hoveredNodeId || d.target === hoveredNodeId ? "none" : "none"));

    // Render node groups
    const node = mainGroup.append("g")
      .attr("class", "nodes")
      .selectAll<SVGGElement, CosmicNode>("g")
      .data(localNodes)
      .join("g")
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        onSelectNode(d.id);
        // Center node subtly on selection
        d3.select(svgEl).transition().duration(400).call(
          zoom.transform,
          d3.zoomIdentity.translate(width / 2 - d.x!, height / 2 - d.y!).scale(1.1)
        );
      })
      .call(
          d3.drag<SVGGElement, CosmicNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.2).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
            // Write coordinates back to source data on end of drag to persist layout!
            const origNode = nodes.find(n => n.id === d.id);
            if (origNode) {
              origNode.x = d.x;
              origNode.y = d.y;
            }
          })
      );

    // Glowing Ambient Aura - Radial-gradient based wide halos with high blur filter
    node.append("circle")
      .attr("r", (d) => (d.id === selectedId || d.id === hoveredNodeId ? 52 : 36)) // significantly larger radius (1:1 with reference)
      .attr("fill", (d) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = query && (
          d.label.toLowerCase().includes(query) ||
          d.question.toLowerCase().includes(query) ||
          d.keywords?.some(k => k.toLowerCase().includes(query))
        );

        if (matchesSearch) return "url(#glow-search)";
        if (d.id === selectedId || d.id === hoveredNodeId) return "url(#glow-selected)";
        return "url(#glow-normal)";
      })
      .style("filter", "url(#soft-blur)")
      .style("mix-blend-mode", "screen"); // blends the glow naturally over connection lines!

    // Intense Central Particle Core (solid gold/white spark)
    node.append("circle")
      .attr("r", (d) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = query && (
          d.label.toLowerCase().includes(query) ||
          d.question.toLowerCase().includes(query) ||
          d.keywords?.some(k => k.toLowerCase().includes(query))
        );
        if (matchesSearch) return 5;
        return (d.id === selectedId || d.id === hoveredNodeId) ? 4.5 : 3.2;
      })
      .attr("fill", (d) => {
        if (d.id === selectedId || d.id === hoveredNodeId) return "#ffffff"; // pure bright white center matching reference stars
        return "#fcc419"; // golden/amber core
      });

    // Node Name Tag labels (SF Space styling)
    node.append("text")
      .text((d) => {
        if (lang === "en" && EN_TRANSLATIONS[d.id]) {
          return EN_TRANSLATIONS[d.id].label.toUpperCase();
        }
        return d.label.toUpperCase();
      })
      .attr("dy", -16)
      .attr("text-anchor", "middle")
      .attr("fill", (d) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = query && (
          d.label.toLowerCase().includes(query) ||
          d.question.toLowerCase().includes(query) ||
          d.keywords?.some(k => k.toLowerCase().includes(query))
        );

        if (matchesSearch) return "#ffffff";
        if (d.id === selectedId || d.id === hoveredNodeId) return "#ffd43b";
        return "rgba(255, 255, 255, 0.7)";
      })
      .attr("font-size", (d) => (d.id === selectedId || d.id === hoveredNodeId ? 11 : 9.5))
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("font-weight", (d) => (d.id === selectedId || d.id === hoveredNodeId ? "bold" : "500"))
      .attr("letter-spacing", "0.08em")
      .style("text-shadow", "0 2px 5px rgba(0,0,0,0.95)")
      .style("opacity", (d) => {
        if (!searchQuery) return 1;
        const query = searchQuery.toLowerCase().trim();
        const matches = (
          d.label.toLowerCase().includes(query) ||
          d.question.toLowerCase().includes(query) ||
          d.keywords?.some(k => k.toLowerCase().includes(query))
        );
        return matches ? 1 : 0.2;
      });

    // D3 update coordinates tick calculation
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x}, ${d.y})`);
    });

    // Run simulation to settle layout initially
    for (let i = 0; i < 40; ++i) simulation.tick();

    // Warm transition entry coordinates centering
    if (selectedId) {
      const activeNode = localNodes.find(n => n.id === selectedId);
      if (activeNode && activeNode.x && activeNode.y) {
        svg.transition().duration(500).call(
          zoom.transform,
          d3.zoomIdentity.translate(width / 2 - activeNode.x, height / 2 - activeNode.y).scale(1)
        );
      }
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, dimensions, selectedId, hoveredNodeId, searchQuery, lang]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full select-none"
    >
      <svg 
        ref={svgRef} 
        className="block w-full h-full text-white"
        style={{ background: "transparent" }}
      />
    </div>
  );
}
