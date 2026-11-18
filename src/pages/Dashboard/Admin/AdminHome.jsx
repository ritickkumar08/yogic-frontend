import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import AdminStats from './AdminStats';
import { Fade } from "react-awesome-reveal";
import useAxiosSecure from '../../../hooks/useAxiosSecure';
const AdminHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [users, setUsers] = useState([]);
    useEffect(() => {
        axiosSecure.get('/users')
            .then(res => setUsers(res.data))
            .catch(() => setUsers([]));
    }, []);
    return (
        <div>
            <Fade delay={1e3} cascade damping={1e-1}>
                <h1 className='text-4xl font-bold my-7'>Welcome Back, <span className='text-secondary'>{user?.displayName}</span></h1>
                <AdminStats users={users} />
            </Fade>
        </div>
    );
};

export default AdminHome;