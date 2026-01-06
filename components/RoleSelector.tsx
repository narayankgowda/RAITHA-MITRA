
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TractorIcon, SettingsIcon, ShoppingCartIcon } from './icons';
import { Logo } from './Logo';

const RoleSelector: React.FC = () => {
    const navigate = useNavigate();

    const handleRoleSelect = (role: string) => {
        navigate(`/login?role=${role}`);
    };

    const RoleCard: React.FC<{
        onClick: () => void;
        icon: React.ReactNode;
        title: string;
        description: string;
    }> = ({ onClick, icon, title, description }) => (
        <div
            onClick={onClick}
            className="w-full md:w-80 p-8 bg-card-light dark:bg-card-dark rounded-xl shadow-lg border border-border-light dark:border-border-dark cursor-pointer transform hover:-translate-y-2 transition-all duration-300 group"
        >
            <div className="mx-auto mb-6 w-20 h-20 flex items-center justify-center rounded-full bg-primary/10 text-primary dark:text-primary-light group-hover:bg-primary group-hover:text-white transition-all duration-300">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-center text-text-light dark:text-text-dark">{title}</h3>
            <p className="text-center text-gray-500 dark:text-gray-400 mt-2">{description}</p>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4">
            <div className="text-center mb-12 flex flex-col items-center">
                 <div className="mb-4 transform scale-150 origin-center">
                    <Logo />
                 </div>
                 <h1 className="text-4xl md:text-5xl font-extrabold text-text-light dark:text-text-dark mt-6">Welcome</h1>
                 <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Your all-in-one platform for modern farming.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 flex-wrap justify-center">
                <RoleCard
                    onClick={() => handleRoleSelect('farmer')}
                    icon={<TractorIcon className="w-10 h-10" />}
                    title="Farmer Login"
                    description="Access your dashboard, tools, and marketplace."
                />
                <RoleCard
                    onClick={() => handleRoleSelect('buyer')}
                    icon={<ShoppingCartIcon className="w-10 h-10" />}
                    title="Buyer Login"
                    description="Purchase fresh produce directly from farmers."
                />
                <RoleCard
                    onClick={() => handleRoleSelect('admin')}
                    icon={<SettingsIcon className="w-10 h-10" />}
                    title="Admin Login"
                    description="Manage platform settings and marketplace products."
                />
            </div>
        </div>
    );
};

export default RoleSelector;
