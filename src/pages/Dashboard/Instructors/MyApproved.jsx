import React from 'react';
import ClassStatusList from '../../../components/ClassStatusList/ClassStatusList';
import { useTitle } from '../../../hooks/useTitle';

const MyApproved = () => {
    useTitle('Approved Classes | Yoga Master');
    return (
        <ClassStatusList
            status="approved"
            title={<>Approved <span className='text-secondary'>Classes</span></>}
            emptyText="You have no approved classes yet"
        />
    );
};

export default MyApproved;
