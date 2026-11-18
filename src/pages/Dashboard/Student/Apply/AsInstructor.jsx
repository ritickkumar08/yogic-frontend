import React, { useEffect, useState } from 'react';
import { FiUser, FiMail, FiBriefcase, FiSend } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../../../hooks/useUser';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { ScaleLoader } from 'react-spinners';
import { toast } from 'react-toastify';
const AsInstructor = () => {
    const { currentUser } = useUser();
    const [submittedData, setSubmittedData] = useState({});
    const [loading, setLoading] = useState(true); // [1
    const axiosSecure = useAxiosSecure();
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();

        const name = e.target.name.value;
        const email = e.target.email.value;
        const experience = e.target.experience.value.trim();

        if (!experience) {
            return toast.error('Please tell us about your experience');
        }

        setSubmitting(true);
        axiosSecure.post('/as-instructor', { name, email, experience })
            .then(() => {
                toast.success('Application submitted');
                return axiosSecure.get(`/applied-instructors/${email}`);
            })
            .then((res) => setSubmittedData(res.data))
            .catch((err) => toast.error(err?.response?.data?.message || 'Could not submit application'))
            .finally(() => setSubmitting(false));
    };

    useEffect(() => {
        if (!currentUser?.email) return;
        axiosSecure.get(`/applied-instructors/${currentUser.email}`)
            .then((res) => setSubmittedData(res.data || {}))
            .catch(() => setSubmittedData({}))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?.email]);

    // Show the form when there is no application yet, or the last one was rejected (re-apply).
    const showForm = !submittedData?.name || submittedData?.status === 'rejected';
    const inputVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    const buttonVariants = {
        hidden: { opacity: 0, scale: 0 },
        visible: { opacity: 1, scale: 1 },
    };
    if (loading) { // [2
        return <div className='h-full w-full flex justify-center items-center'><ScaleLoader color="#FF1949" /></div>;
    }

    return (
        <>
            {submittedData?.status === 'rejected' && (
                <div className="mx-auto w-[60%] mt-6 p-4 border border-red-300 rounded-lg bg-red-50">
                    <p className='font-bold text-red-600'>Your previous application was not approved.</p>
                    {submittedData.reason && (
                        <p className='mt-1'><span className='font-bold'>Reason:</span> {submittedData.reason}</p>
                    )}
                    <p className="mt-2 text-sm">You can improve your experience details and submit the form again.</p>
                </div>
            )}
            <AnimatePresence>
                {showForm && (
                    <div className="py-4 min-h-screen flex items-center w-[60%]">
                        <form onSubmit={onSubmit}>
                            <div className="flex w-full">
                                <motion.div
                                    variants={inputVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ duration: 0.5 }}
                                    className="mb-4 w-full"
                                >
                                    <label className="text-gray-700" htmlFor="name">
                                        Name
                                    </label>
                                    <div className="flex items-center mt-1">
                                        <FiUser className="text-gray-500" />
                                        <input
                                            defaultValue={currentUser.name}
                                            disabled
                                            readOnly
                                            className="ml-2 w-full border-b border-gray-300 focus:border-secondary outline-none"
                                            type="text"
                                            id="name"
                                            name="name"
                                        />
                                    </div>
                                </motion.div>
                                <motion.div
                                    variants={inputVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="mb-4 w-full"
                                >
                                    <label className="text-gray-700" htmlFor="email">
                                        Email
                                    </label>
                                    <div className="flex items-center mt-1">
                                        <FiMail className="text-gray-500" />
                                        <input
                                            defaultValue={currentUser.email}
                                            disabled
                                            readOnly
                                            className="ml-2 w-full border-b border-gray-300 focus:border-secondary outline-none"
                                            type="email"
                                            id="email"
                                            name="email"
                                        />
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div
                                variants={inputVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="mb-4 w-full"
                            >
                                <label className="text-gray-700" htmlFor="experience">
                                    Experience
                                </label>
                                <div className="flex items-center mt-1">
                                    <FiBriefcase className="text-gray-500" />
                                    <textarea
                                        placeholder="Tell us about your experience..."
                                        className="ml-2 rounded-lg px-2 placeholder:text-sm py-1 w-full border border-gray-300 focus:border-secondary outline-none resize-none"
                                        id="experience"
                                        name="experience"
                                    ></textarea>
                                </div>
                            </motion.div>

                            <div className="text-center flex justify-center ">
                                <motion.button
                                    variants={buttonVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center px-4 py-2 bg-secondary text-white rounded-md focus:outline-none disabled:opacity-60"
                                >
                                    <FiSend className="mr-2" />
                                    {submitting ? 'Submitting...' : 'Submit'}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                )}
            </AnimatePresence>

            {submittedData?.name && submittedData?.status !== 'rejected' && (
                <div className="h-full w-full flex justify-center items-center">
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center"
                        >
                            {submittedData.status === 'approved' ? (
                                <h1 className="text-2xl font-bold">
                                    Congratulations! You are now an <span className="text-green-500">instructor</span>
                                </h1>
                            ) : (
                                <h1 className="text-2xl font-bold">
                                    Your <span className="text-secondary">application is</span> submitted
                                </h1>
                            )}
                            <p className="text-lg font-semibold">Name: {submittedData.name}</p>
                            <p className="text-lg font-semibold">Email: {submittedData.email}</p>
                            <p className="text-lg font-semibold">Experience: {submittedData.experience}</p>
                            {submittedData.status === 'approved' ? (
                                <p>Log out and log back in if you don't see the instructor dashboard yet.</p>
                            ) : (
                                <p>Now you need to wait for a few moments for admin approval</p>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}
        </>
    );
};

export default AsInstructor;
