import React from 'react';

const StatCard = ({ label, value, color = 'bg-blue-400', icon }) => {
    return (
        <div className="flex items-center bg-white border rounded-sm overflow-hidden shadow">
            <div className={`p-4 ${color} text-white text-4xl`}>{icon}</div>
            <div className="px-4 text-gray-700">
                <h3 className="text-sm tracking-wider whitespace-nowrap">{label}</h3>
                <p className="text-3xl">{value ?? 0}</p>
            </div>
        </div>
    );
};

export default StatCard;
