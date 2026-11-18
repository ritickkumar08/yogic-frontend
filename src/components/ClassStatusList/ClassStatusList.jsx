import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { ScaleLoader } from 'react-spinners';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useUser } from '../../hooks/useUser';

// Lists the logged-in instructor's classes filtered by status ('pending' | 'approved' | 'rejected').
const ClassStatusList = ({ status, title, emptyText }) => {
    const { currentUser } = useUser();
    const axiosSecure = useAxiosSecure();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser?.email) return;
        axiosSecure.get(`/classes/${currentUser.email}?status=${status}`)
            .then(res => setClasses(res.data))
            .catch(() => setClasses([]))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?.email, status]);

    if (loading) {
        return <div className='h-full w-full flex justify-center items-center'><ScaleLoader color="#FF1949" /></div>;
    }

    return (
        <div className="my-9">
            <h1 className='text-4xl font-bold text-center'>{title}</h1>
            {classes.length === 0 ? (
                <div className='text-center text-2xl font-bold mt-10'>{emptyText}</div>
            ) : (
                <div className="mt-9 grid gap-5">
                    {classes.map(cls => (
                        <div key={cls._id} className="bg-white flex flex-col md:flex-row rounded-lg gap-6 shadow p-4 hover:ring ring-secondary duration-200">
                            <img className='max-h-[160px] max-w-[260px] object-cover rounded' src={cls.image} alt={cls.name} />
                            <div className="w-full">
                                <h2 className='text-[21px] font-bold text-secondary border-b pb-2 mb-2'>{cls.name}</h2>
                                <div className="grid sm:grid-cols-2 gap-1">
                                    <p><span className='font-bold'>Price:</span> ${cls.price}</p>
                                    <p><span className='font-bold'>Seats:</span> {cls.availableSeats}</p>
                                    <p><span className='font-bold'>Students:</span> {cls.totalEnrolled || 0}</p>
                                    <p><span className='font-bold'>Submitted:</span> {cls.submitted ? moment(cls.submitted).format('MMMM Do YYYY') : 'N/A'}</p>
                                </div>
                                {cls.reason && status === 'rejected' && (
                                    <p className='mt-2 text-red-600'><span className='font-bold'>Reason:</span> {cls.reason}</p>
                                )}
                                <div className="mt-3">
                                    <Link to={`/dashboard/update/${cls._id}`} className='inline-block px-3 py-1 bg-secondary text-white rounded-lg'>Update</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClassStatusList;
