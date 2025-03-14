import {
    DndContext,
    MeasuringStrategy,
    MouseSensor,
    TouchSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';

export const DndProvider = ({ children }) => {
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 50,
            tolerance: 5,
        },
    });
    const keyboardSensor = useSensor(KeyboardSensor, {});
    const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

    return (
        <DndContext
            sensors={sensors}
            modifiers={[restrictToFirstScrollableAncestor]}
            measuring={{
                droppable: { strategy: MeasuringStrategy.Always },
                draggable: { strategy: MeasuringStrategy.Always },
                dragOverlay: { strategy: MeasuringStrategy.Always },
            }}
        >
            {children}
        </DndContext>
    );
};
