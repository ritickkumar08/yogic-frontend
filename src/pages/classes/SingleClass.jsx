import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { FaUser, FaUsers } from "react-icons/fa";
import { MdEventSeat } from "react-icons/md";
import { BiTime } from "react-icons/bi";
import { useUser } from "../../hooks/useUser";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import useSelectClass from "../../hooks/useSelectClass";
import { useTitle } from "../../hooks/useTitle";

const InfoRow = ({ icon, label, value }) => (
    <li className="flex space-x-3 border-b border-[#ECECEC] mb-4 pb-4 last:pb-0 last:mb-0 last:border-0">
        <div className="flex-1 space-x-3 flex items-center">
            {icon}
            <div className="text-black font-semibold">{label}</div>
        </div>
        <div className="flex-none">{value}</div>
    </li>
);

const SingleClass = () => {
    const course = useLoaderData();
    const { currentUser } = useUser();
    const role = currentUser?.role;
    const axiosFetch = useAxiosFetch();
    const handleSelect = useSelectClass();
    const [related, setRelated] = useState([]);
    useTitle(`${course?.name || 'Class'} | Yogic`);

    useEffect(() => {
        axiosFetch.get('/popular_classes')
            .then(res => setRelated(res.data.filter(item => item._id !== course?._id).slice(0, 3)))
            .catch(() => setRelated([]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [course?._id]);

    if (!course) {
        return (
            <div className="w-[90%] mx-auto mt-40 text-center">
                <h2 className="text-2xl font-bold">This class could not be found</h2>
                <Link to="/classes" className="text-secondary underline">Back to all classes</Link>
            </div>
        );
    }

    const noSeats = course.availableSeats < 1;
    const blockedRole = role === 'admin' || role === 'instructor';
    const buttonTitle = blockedRole
        ? 'Instructor/Admin can not select a class'
        : noSeats ? 'No seats available' : 'You can select this class';

    return (
        <div className="font-gilroy font-medium text-gray dark:text-white text-lg leading-[27px] w-[90%] mx-auto">
            <div className="bg-primary py-20 mt-20 bg-cover bg-center bg-no-repeat">
                <div className="container text-center">
                    <h2>Class Details</h2>
                </div>
            </div>

            <div className="mt-8">
                <div className="grid grid-cols-12 md:gap-[30px]">
                    {/* left side */}
                    <div className="lg:col-span-8 col-span-12">
                        <div className="xl:h-[470px] h-[350px] mb-10">
                            <img src={course.image} alt={course.name} className="rounded-md object-cover w-full h-full block" />
                        </div>
                        <h2 className="text-2xl mb-2">{course.name}</h2>
                        <div className="mt-4 sm:flex sm:space-x-10 space-y-2 sm:space-y-0 items-center">
                            <p className="text-secondary">
                                Trainer: <span className="text-black">{course.instructorName}</span>
                            </p>
                            {course.submitted && (
                                <p className="text-secondary">
                                    Last Update: <span className="text-black ml-1">{new Date(course.submitted).toLocaleDateString()}</span>
                                </p>
                            )}
                        </div>

                        <h3 className="text-2xl mt-8">Class Description</h3>
                        <p className="mt-4 whitespace-pre-line">
                            {course.description || 'The instructor has not added a description for this class yet.'}
                        </p>

                        {course.videoLink && (
                            <div className="mt-8">
                                <h3 className="text-2xl">Preview Video</h3>
                                <a href={course.videoLink} target="_blank" rel="noreferrer" className="inline-block mt-3 text-secondary underline">
                                    Watch the class preview
                                </a>
                            </div>
                        )}
                    </div>

                    {/* right side */}
                    <div className="lg:col-span-4 col-span-12 mt-8 md:mt-0">
                        <div className="space-y-[30px]">
                            <div className="space-y-5">
                                <div className="h-[220px] rounded relative block">
                                    <img src={course.image} alt="" className="block w-full h-full object-cover rounded" />
                                    {course.videoLink && (
                                        <a href={course.videoLink} target="_blank" rel="noreferrer" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <img src="/play.png" alt="Play preview" />
                                        </a>
                                    )}
                                </div>
                                <h3>${course.price}</h3>
                                <button
                                    onClick={() => handleSelect(course._id)}
                                    title={buttonTitle}
                                    disabled={blockedRole || noSeats}
                                    className="btn btn-primary w-full text-center bg-secondary py-2 px-6 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {noSeats ? 'Sold Out' : 'Enroll Now'}
                                </button>
                                <ul>
                                    <InfoRow icon={<FaUser />} label="Instructor" value={course.instructorName} />
                                    <InfoRow icon={<MdEventSeat />} label="Available seats" value={course.availableSeats} />
                                    <InfoRow icon={<FaUsers />} label="Enrolled" value={`${course.totalEnrolled || 0} students`} />
                                    {course.submitted && (
                                        <InfoRow icon={<BiTime />} label="Added on" value={new Date(course.submitted).toLocaleDateString()} />
                                    )}
                                </ul>
                            </div>

                            {related.length > 0 && (
                                <div>
                                    <h4 className="text-xl font-bold mb-4">Popular Classes</h4>
                                    <ul>
                                        {related.map(item => (
                                            <li key={item._id} className="flex space-x-4 border-[#ECECEC] pb-6 mb-6 last:pb-0 last:mb-0 border-b last:border-0">
                                                <Link to={`/class/${item._id}`} className="h-20 w-20 flex-none rounded">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                                                </Link>
                                                <div className="flex-1">
                                                    <Link to={`/class/${item._id}`} className="mb-1 font-semibold text-black block">{item.name}</Link>
                                                    <span className="text-secondary font-semibold">${item.price}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleClass;
