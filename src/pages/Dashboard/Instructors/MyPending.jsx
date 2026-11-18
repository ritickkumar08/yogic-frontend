import React from 'react';
import ClassStatusList from '../../../components/ClassStatusList/ClassStatusList';
import { useTitle } from '../../../hooks/useTitle';

const MyPending = () => {
    useTitle('Pending Classes | Yoga Master');
    return (
        <ClassStatusList
            status="pending"
            title={<>Pending <span className='text-secondary'>Classes</span></>}
            emptyText="You have no classes waiting for approval"
        />
    );
};

export default MyPending;
