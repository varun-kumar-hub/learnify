'use client'

import ReactFlow, {
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    Node,
    Edge,
    NodeChange,
    applyNodeChanges
} from 'reactflow'
import 'reactflow/dist/style.css'
import { TopicNode } from './topic-node'
import { useCallback, useEffect } from 'react'
import { updateNodePosition } from '@/app/actions'

const nodeTypes = {
    topicNode: TopicNode
}

interface GraphProps {
    initialNodes: Node[]
    initialEdges: Edge[]
}

export function GraphVisualizer({ initialNodes, initialEdges }: GraphProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

    // Handle node drag stop -> Persist to DB
    const onNodeDragStop = useCallback((event: any, node: Node) => {
        updateNodePosition(node.id, node.position.x, node.position.y)
    }, [])

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        if (node.data.status === 'LOCKED') return // Optional: prevent clicking locked nodes
        window.location.href = `/learn/${node.id}` // Using window.location for hard nav or router.push
    }, [])

    return (
        <div className="w-full h-[600px] border border-white/10 rounded-2xl bg-black/50 overflow-hidden relative group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeDragStop={onNodeDragStop}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                className="bg-[#0a0a0b]"
            >
                <Background color="#333" gap={20} size={1} />
                <Controls className="!bg-zinc-900 !border-zinc-800 [&>button]:!fill-white [&>button]:!border-none" />
            </ReactFlow>
        </div>
    )
}
