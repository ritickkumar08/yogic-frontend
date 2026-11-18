import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBookmark, FiCreditCard, FiPlayCircle } from 'react-icons/fi';
import { useUser } from '../../../hooks/useUser';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useTitle } from '../../../hooks/useTitle';
import StatCard from '../../../components/StatCard/StatCard';
import welcome from '../../../assets/dashboard/urban-welcome.svg';

const StudentCP = () => {
    useTitle('Student Dashboard | Yoga Master');
    const { currentUser } = useUser();
    const axiosSecure = useAxiosSecure();
    const [stats, setStats] = useState({ enrolled: 0, selected: 0, payments: 0 });

    useEffect(() => {
        const email = currentUser?.email;
        if (!email) return;
        Promise.allSettled([
            axiosSecure.get(`/enrolled-classes/${email}`),
            axiosSecure.get(`/cart/${email}`),
            axiosSecure.get(`/payment-history-length/${email}`),
        ]).then(([enrolled, selected, payments]) => {
            setStats({
                enrolled: enrolled.status === 'fulfilled' ? enrolled.value.data.length : 0,
                selected: selected.status === 'fulfilled' ? selected.value.data.length : 0,
                payments: payments.status === 'fulfilled' ? payments.value.data.total : 0,
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?.email]);

    const links = [
        { to: '/dashboard/enrolled-class', label: 'My Enroll' },
        { to: '/dashboard/my-selected', label: 'My Selected' },
        { to: '/dashboard/my-payments', label: 'Payment History' },
        { to: '/dashboard/apply-instructor', label: 'Join as an Instructor' },
    ];

    return (
        <div className='flex justify-center items-center min-h-[80vh]'>
            <div className="w-full max-w-3xl">
                <div className="flex justify-center items-center">
                    <img onContextMenu={e => e.preventDefault()} className='h-[200px] w-auto' src={welcome} alt="" />
                </div>
                <h1 className='text-4xl text-center capitalize font-bold'>
                    Hi, <span className='text-secondary italic'>{currentUser?.name}</span> welcome to your dashboard
                </h1>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 my-8">
                    <StatCard label="Enrolled Classes" value={stats.enrolled} color="bg-green-400" icon={<FiPlayCircle />} />
                    <StatCard label="Selected Classes" value={stats.selected} color="bg-blue-400" icon={<FiBookmark />} />
                    <StatCard label="Payments" value={stats.payments} color="bg-indigo-400" icon={<FiCreditCard />} />
                </div>

                <div className="text-center">
                    <h2 className='font-bold'>Jump to any page from here.</h2>
                    <div className="flex flex-wrap items-center justify-center my-4 gap-3">
                        {links.map(link => (
                            <div key={link.to} className="border border-secondary rounded-lg hover:bg-secondary hover:text-white duration-200 px-2 py-1">
                                <Link to={link.to}>{link.label}</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentCP;
