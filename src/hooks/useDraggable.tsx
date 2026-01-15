'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface Position {
    x: number;
    y: number;
}

interface Size {
    width: number;
    height: number;
}

interface UseResizableDraggableOptions {
    initialPosition?: Position;
    initialSize?: Size;
    minSize?: Size;
}

export function useResizableDraggable({
    initialPosition = { x: 100, y: 100 },
    initialSize = { width: 400, height: 300 },
    minSize = { width: 200, height: 150 }
}: UseResizableDraggableOptions = {}) {
    const [position, setPosition] = useState<Position>(initialPosition);
    const [size, setSize] = useState<Size>(initialSize);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState<string>('');

    const dragStart = useRef<Position>({ x: 0, y: 0 });
    const resizeStart = useRef<{ size: Size; position: Position }>({
        size: initialSize,
        position: initialPosition
    });

    // Drag handlers
    const startDrag = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        dragStart.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    }, [position]);

    // Resize handlers
    const startResize = useCallback((e: React.MouseEvent, direction: string) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        setResizeDirection(direction);
        dragStart.current = { x: e.clientX, y: e.clientY };
        resizeStart.current = { size: { ...size }, position: { ...position } };
    }, [size, position]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragStart.current.x,
                    y: e.clientY - dragStart.current.y
                });
            } else if (isResizing) {
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
                const startSize = resizeStart.current.size;
                const startPos = resizeStart.current.position;

                let newWidth = startSize.width;
                let newHeight = startSize.height;
                let newX = startPos.x;
                let newY = startPos.y;

                if (resizeDirection.includes('e')) {
                    newWidth = Math.max(minSize.width, startSize.width + dx);
                }
                if (resizeDirection.includes('w')) {
                    newWidth = Math.max(minSize.width, startSize.width - dx);
                    newX = startPos.x + (startSize.width - newWidth);
                }
                if (resizeDirection.includes('s')) {
                    newHeight = Math.max(minSize.height, startSize.height + dy);
                }
                if (resizeDirection.includes('n')) {
                    newHeight = Math.max(minSize.height, startSize.height - dy);
                    newY = startPos.y + (startSize.height - newHeight);
                }

                setSize({ width: newWidth, height: newHeight });
                setPosition({ x: newX, y: newY });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
            setResizeDirection('');
        };

        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, resizeDirection, minSize]);

    return {
        position,
        size,
        isDragging,
        isResizing,
        startDrag,
        startResize,
        setSize,
        setPosition,
        containerStyle: {
            position: 'absolute' as const,
            left: position.x,
            top: position.y,
            width: size.width,
            height: size.height,
            zIndex: isDragging || isResizing ? 100 : 10
        }
    };
}
