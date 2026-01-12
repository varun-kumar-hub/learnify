'use client'

import { useCallback } from 'react';
import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

const nodeTypes = {
    // We can add custom node types here later for "glass" look
};

type GraphProps = {
    initialNodes: any[];
    initialEdges: any[];
};

export function KnowledgeGraph({ initialNodes, initialEdges }: GraphProps) {
    // Map API nodes to ReactFlow nodes
    const mapNodes = initialNodes.map((n, i) => ({
        id: n.id,
        type: 'default', // or custom
        data: { label: n.label },
        position: { x: (i % 3) * 200, y: Math.floor(i / 3) * 150 }, // Simple layout, can be improved
        style: {
            background: '#09090b',
            color: '#fff',
            border: '1px solid #27272a',
            borderRadius: '8px',
            padding: '10px',
            width: 150,
            fontSize: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }
    }));

    const mapEdges = initialEdges.map((e) => ({
        id: `e${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
        animated: true,
        style: { stroke: '#2563eb' },
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#2563eb',
        },
    }));

    const [nodes, setNodes, onNodesChange] = useNodesState(mapNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(mapEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <div style={{ width: '100%', height: '600px' }} className="rounded-xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm overflow-hidden shadow-2xl">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Background color="#27272a" gap={16} />
                <Controls className='bg-zinc-800 fill-white stroke-white' />
            </ReactFlow>
        </div>
    );
}
