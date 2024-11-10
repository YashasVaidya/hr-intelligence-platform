// src/types.ts

import * as d3 from 'd3';

export interface Sentiment {
    timestamp: string;
    polarity: number;
    subjectivity: number;
}

export interface SkillNode {
    id: string;
    name: string;
    x?: number;
    y?: number;
}

export interface SkillLink extends d3.SimulationLinkDatum<SkillNode> {
    source: string | SkillNode;
    target: string | SkillNode;
}

export interface SkillGraphData {
    nodes: SkillNode[];
    links: SkillLink[];
}