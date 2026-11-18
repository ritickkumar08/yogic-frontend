import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiCheckCircle, FiClock, FiUsers, FiXCircle } from 'react-icons/fi';
import { ScaleLoader } from 'react-spinners';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useUser } from '../../../hooks/useUser';
import { useTitle } from '../../../hooks/useTitle';
import StatCard from '../../../components/StatCard/StatCard';

const InstructorCP = () => {
    useTitle('Instructor Dashboard | Yoga Master');
    const { currentUser } = useUser();
    const axiosSecure = useAxiosSecure();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser?.email) return;
        axiosSecure.get(`/instructor-stats/${currentUser.email}`)
            .then(res => setStats(res.data))
            .catch(() => setStats(null))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?.email]);

    if (loading) {
        return <div className='h-full w-full flex justify-center items-center'><ScaleLoader color="#FF1949" /></div>;
    }

    const links = [
        { to: '/dashboard/add-class', label: 'Add a class' },
        { to: '/dashboard/my-classes', label: 'My classes' },
        { to: '/dashboard/my-pending', label: 'Pending classes' },
        { to: '/dashboard/my-approved', label: 'Approved classes' },
    ];

    return (
        <div>
            <h1 className='text-4xl font-bold my-7 capitalize'>
                Welcome back, <span className='text-secondary'>{currentUser?.name}</span>
            </h1>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <StatCard label="Total Classes" value={stats?.totalClasses} color="bg-blue-400" icon={<FiBookOpen />} />
                <StatCard label="Approved" value={stats?.approvedClasses} color="bg-green-400" icon={<FiCheckCircle />} />
                <StatCard label="Pending" value={stats?.pendingClasses} color="bg-orange-400" icon={<FiClock />} />
                <StatCard label="Rejected" value={stats?.rejectedClasses} color="bg-red-400" icon={<FiXCircle />} />
                <StatCard label="Total Students" value={stats?.totalEnrolled} color="bg-indigo-400" icon={<FiUsers />} />
            </div>

            <h2 className='font-bold mt-10 mb-3'>Quick links</h2>
            <div className="flex flex-wrap gap-3">
                {links.map(link => (
                    <Link key={link.to} to={link.to} className="border border-secondary rounded-lg hover:bg-secondary hover:text-white duration-200 px-3 py-1">
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default InstructorCP;
