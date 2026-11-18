import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { ScaleLoader } from 'react-spinners';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { useTitle } from '../../../../hooks/useTitle';

const TABS = ['all', 'pending', 'approved', 'rejected'];

const statusStyle = {
    pending: 'text-orange-400',
    approved: 'text-green-500',
    rejected: 'text-red-600',
};

const ManageApplication = () => {
    useTitle('Applications | Yoga Master - Manage instructor applications');
    const axiosSecure = useAxiosSecure();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('all');

    useEffect(() => {
        axiosSecure.get('/applied-instructors')
            .then(res => setApplications(res.data))
            .catch(() => toast.error('Could not load applications'))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const review = (id, status, reason) => {
        return axiosSecure.put(`/applied-instructors/${id}`, { status, reason })
            .then(() => {
                setApplications(prev => prev.map(app =>
                    app._id === id ? { ...app, status, reason: status === 'rejected' ? reason : '' } : app
                ));
                toast.success(status === 'approved' ? 'Application approved. User is now an instructor.' : 'Application rejected');
            })
            .catch(err => toast.error(err?.response?.data?.message || 'Something went wrong'));
    };

    const handleApprove = (app) => {
        Swal.fire({
            title: 'Approve this application?',
            text: `${app.name} will become an instructor.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, approve',
        }).then(result => {
            if (result.isConfirmed) review(app._id, 'approved');
        });
    };

    const handleReject = (app) => {
        Swal.fire({
            title: 'Reason for rejection',
            input: 'text',
            inputPlaceholder: 'Write a short reason',
            showCancelButton: true,
            confirmButtonText: 'Reject',
            confirmButtonColor: '#d33',
            inputValidator: value => (!value?.trim() ? 'A reason is required' : null),
        }).then(result => {
            if (result.isConfirmed) review(app._id, 'rejected', result.value.trim());
        });
    };

    const handleDelete = (app) => {
        Swal.fire({
            title: 'Delete this application?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(result => {
            if (!result.isConfirmed) return;
            axiosSecure.delete(`/applied-instructors/${app._id}`)
                .then(() => {
                    setApplications(prev => prev.filter(a => a._id !== app._id));
                    toast.success('Application deleted');
                })
                .catch(() => toast.error('Could not delete application'));
        });
    };

    const visible = tab === 'all' ? applications : applications.filter(app => app.status === tab);
    const countOf = (t) => (t === 'all' ? applications.length : applications.filter(app => app.status === t).length);

    if (loading) {
        return <div className='h-full w-full flex justify-center items-center'><ScaleLoader color="#FF1949" /></div>;
    }

    return (
        <div>
            <h1 className='text-center text-4xl font-bold my-7'>Instructor <span className='text-secondary'>Applications</span></h1>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
                {TABS.map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-4 py-1 rounded-full border capitalize duration-200 ${tab === t ? 'bg-secondary text-white border-secondary' : 'hover:border-secondary'}`}
                    >
                        {t} ({countOf(t)})
                    </button>
                ))}
            </div>

            {visible.length === 0 ? (
                <div className='text-center text-2xl font-bold mt-10'>No {tab === 'all' ? '' : tab} applications</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm font-light">
                        <thead className="border-b font-medium dark:border-neutral-500">
                            <tr>
                                <th className="px-6 py-4">#</th>
                                <th className="px-6 py-4">NAME</th>
                                <th className="px-6 py-4">EMAIL</th>
                                <th className="px-6 py-4">EXPERIENCE</th>
                                <th className="px-6 py-4">SUBMITTED</th>
                                <th className="px-6 py-4">STATUS</th>
                                <th className="px-6 py-4">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((app, idx) => (
                                <tr key={app._id} className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600 align-top">
                                    <td className="px-6 py-4 font-medium">{idx + 1}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{app.name}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{app.email}</td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <p className='line-clamp-3' title={app.experience}>{app.experience}</p>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {app.submittedAt ? moment(app.submittedAt).format('MMM Do YYYY') : '—'}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className={`font-bold capitalize ${statusStyle[app.status] || 'text-gray-400'}`}>{app.status || 'unknown'}</span>
                                        {app.status === 'rejected' && app.reason && (
                                            <p className='text-xs text-gray-500 whitespace-normal max-w-[180px]'>{app.reason}</p>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex gap-2">
                                            {app.status !== 'approved' && (
                                                <button onClick={() => handleApprove(app)} className='bg-green-500 text-white rounded-md px-2 py-1'>Approve</button>
                                            )}
                                            {app.status !== 'rejected' && app.status !== 'approved' && (
                                                <button onClick={() => handleReject(app)} className='bg-orange-400 text-white rounded-md px-2 py-1'>Reject</button>
                                            )}
                                            <button onClick={() => handleDelete(app)} className='bg-red-600 text-white rounded-md px-2 py-1'>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageApplication;
