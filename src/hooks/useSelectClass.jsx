import { toast } from 'react-toastify';
import { useUser } from './useUser';
import useAxiosSecure from './useAxiosSecure';

// One place for "add this class to my selected list" so Card, Classes and SingleClass behave the same.
const useSelectClass = () => {
    const { currentUser } = useUser();
    const axiosSecure = useAxiosSecure();

    return async (classId) => {
        if (!currentUser) {
            return toast.error('Please Login First');
        }
        try {
            const [enrolledRes, cartRes] = await Promise.all([
                axiosSecure.get(`/enrolled-classes/${currentUser.email}`),
                axiosSecure.get(`/cart-item/${classId}?email=${currentUser.email}`),
            ]);
            if (enrolledRes.data.find(item => item.classes._id === classId)) {
                return toast.error('Already Enrolled');
            }
            if (cartRes.data?.classId === classId) {
                return toast.error('Already Selected');
            }
            const data = { classId, userMail: currentUser.email, date: new Date() };
            await toast.promise(axiosSecure.post('/add-to-cart', data), {
                pending: 'Selecting...',
                success: 'Selected Successfully',
                error: 'Could not select this class',
            });
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Something went wrong');
        }
    };
};

export default useSelectClass;
