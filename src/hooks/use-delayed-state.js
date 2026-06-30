import { useState, useEffect } from 'react';

const useDelayedState = (initialValue, delay = 300) => {
    const [state, setState] = useState(initialValue);
    const [tempState, setTempState] = useState(initialValue);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setState(tempState);
        }, delay);

        return () => clearTimeout(timeout);
    }, [tempState, delay]);

    return [state, setTempState];
};

export default useDelayedState;
