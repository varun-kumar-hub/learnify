'use client'

import ReactFlow, {
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    Edge,
    NodeChange,
    applyNodeChanges,
    Position,
    Node as FlowNode
} from 'reactflow'
import 'reactflow/dist/style.css'
import { TopicNode } from '@/components/topic-node'
import dagre from 'dagre'
import { useCallback, useEffect } from 'react'
import { updateNodePosition } from '@/app/actions'

const nodeTypes = {
    topicNode: TopicNode
}

// Layout configuration
const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const nodeWidth = 180
const nodeHeight = 60

const getLayoutedElements = (nodes: any[], edges: Edge[]) => {
    dagreGraph.setGraph({ rankdir: 'TB', ranksep: 80, nodesep: 100 }) // TB = Top to Bottom

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
    })

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target)
    })

    dagre.layout(dagreGraph)

    // @ts-ignore
    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id)
        return {
            ...node,
            targetPosition: 'top' as Position,
            sourcePosition: 'bottom' as Position,
            // Shift to center the node (dagre returns center point)
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        }
    })

    return { nodes: layoutedNodes, edges }
}

interface GraphProps {
    initialNodes: any[]
    initialEdges: Edge[]
}

export function GraphVisualizer({ initialNodes, initialEdges }: GraphProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])

    // Apply layout on initial load
    useEffect(() => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges)
        setNodes(layoutedNodes)
        setEdges(layoutedEdges)
    }, [initialNodes, initialEdges, setNodes, setEdges]) // Re-run if props change significantly

    // Handle node drag stop -> Persist to DB
    const onNodeDragStop = useCallback((event: any, node: any) => {
        updateNodePosition(node.id, node.position.x, node.position.y)
    }, [])

    const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
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
