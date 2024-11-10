import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { SkillNode, SkillLink, SkillGraphData } from '../types';

interface SkillNetworkProps {
    skills: string[];
    jobSkills?: string[];
    matchScore?: number;
}

const SkillNetwork: React.FC<SkillNetworkProps> = ({ skills = [], jobSkills, matchScore }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || skills.length === 0) return;

        // Clear any existing visualization
        d3.select(svgRef.current).selectAll('*').remove();

        // Create graph data
        const data: SkillGraphData = {
            nodes: skills.map(skill => ({
                id: skill,
                name: skill,
            })),
            links: skills.slice(0, -1).map((skill, index) => ({
                source: skill,
                target: skills[index + 1],
            })),
        };

        // Set up SVG dimensions
        const width = 600;
        const height = 400;
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        // Create simulation
        const simulation = d3.forceSimulation<SkillNode>(data.nodes)
            .force('link', d3.forceLink<SkillNode, SkillLink>(data.links)
                .id((d: SkillNode) => d.id)
                .distance(100))
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter(width / 2, height / 2));

        // Create links
        const links = svg.append('g')
            .selectAll('line')
            .data(data.links)
            .join('line')
            .style('stroke', '#999')
            .style('stroke-opacity', 0.6)
            .style('stroke-width', 2);

        // Create nodes
        const nodes = svg.append('g')
            .selectAll('g')
            .data(data.nodes)
            .join('g')
            .call(d3.drag<SVGGElement, SkillNode>()
                .on('start', dragStarted)
                .on('drag', dragging)
                .on('end', dragEnded) as any);

        // Add circles to nodes
        nodes.append('circle')
            .attr('r', 20)
            .style('fill', '#69b3a2')
            .style('stroke', '#fff')
            .style('stroke-width', 2);

        // Add labels to nodes
        nodes.append('text')
            .text(d => d.name)
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .style('fill', 'white')
            .style('font-size', '12px');

        // Update positions on simulation tick
        simulation.on('tick', () => {
            links
                .attr('x1', (d: SkillLink) => (d.source as SkillNode).x!)
                .attr('y1', (d: SkillLink) => (d.source as SkillNode).y!)
                .attr('x2', (d: SkillLink) => (d.target as SkillNode).x!)
                .attr('y2', (d: SkillLink) => (d.target as SkillNode).y!);

            nodes
                .attr('transform', (d: SkillNode) => `translate(${d.x},${d.y})`);
        });

        // Drag functions
        function dragStarted(event: d3.D3DragEvent<SVGGElement, SkillNode, any>) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragging(event: d3.D3DragEvent<SVGGElement, SkillNode, any>) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragEnded(event: d3.D3DragEvent<SVGGElement, SkillNode, any>) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        // Cleanup
        return () => {
            simulation.stop();
        };
    }, [skills, jobSkills, matchScore]);

    return (
        <div className="skill-network">
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default SkillNetwork;