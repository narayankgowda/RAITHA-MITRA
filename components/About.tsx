
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
    TargetIcon, GlobeIcon, UsersIcon, LeafIcon, 
    TrendingUpIcon, ShieldCheckIcon, AwardIcon, 
    FacebookIcon, LinkedinIcon, InstagramIcon, 
    MapPinIcon, CheckCircleIcon, SproutIcon 
} from './icons';
import { Logo } from './Logo';

const About: React.FC = () => {
    const { t } = useTranslation();

    const stats = [
        { label: "Farmers Empowered", value: "90+" },
        { label: "Acres Monitored", value: "50+" },
        { label: "Districts Covered", value: "10+" },
        { label: "Expert Consultations", value: "15+" },
    ];

    const team = [
        { name: "NARAYAN K GOWDA", usn: "4YG22AD032", image: "https://jpcdn.it/img/afac0fefaaf2d54911aa5b6903fbefc6.jpg" },
        { name: "CHETHAN R GOWDA", usn: "4YG22AD012", image: "https://jpcdn.it/img/44c45c73e1685f276e68b5ee34918883.jpg" },
        { name: "SURAJ S KASHYAP", usn: "4YG22AD054", image: "https://jpcdn.it/img/01c3637b7bbf4609c97601eebcbc85a2.jpg" },
        { name: "TARUN GOWDA H A", usn: "4YG22AD057", image: "https://jpcdn.it/img/3956e2cd4dba30c96694cebe94b5d2a5.jpg" }
    ];

    const values = [
        { icon: <LeafIcon className="w-6 h-6"/>, title: "Sustainability First", desc: "Every tool we build aims to reduce waste and promote regenerative farming practices." },
        { icon: <TargetIcon className="w-6 h-6"/>, title: "Precision Agriculture", desc: "Moving from guesswork to data-driven decisions using satellite & AI technology." },
        { icon: <UsersIcon className="w-6 h-6"/>, title: "Community Centric", desc: "Building a network where farmers support farmers, eliminating isolation." },
        { icon: <ShieldCheckIcon className="w-6 h-6"/>, title: "Trust & Transparency", desc: "Fair market prices and verified inputs to protect farmer interests." },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black font-sans text-text-light dark:text-text-dark">
            
            {/* 1. Hero Section */}
            <div className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-white dark:from-green-900/10 dark:to-black"></div>
                    {/* Abstract background pattern */}
                    <svg className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] dark:opacity-[0.05]" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M50 0 L100 0 L100 100 L0 100 Z" fill="currentColor" />
                    </svg>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 animate-fadeIn">
                        <SproutIcon className="w-4 h-4"/> Revolutionizing Agriculture
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                        Cultivating the Future of <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-700 dark:to-green-400">Smart Farming</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Raitha Mitra bridges the gap between traditional wisdom and modern technology. 
                        We provide farmers with AI-driven insights, market access, and the tools needed to thrive in a changing climate.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                            Join Our Network
                        </button>
                        <button className="px-8 py-4 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 hover:border-primary text-text-light dark:text-text-dark font-bold rounded-xl transition-all">
                            View Our Impact
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Impact Strip */}
            <div className="bg-[#0b1120] py-12 border-y border-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-800/50">
                        {stats.map((stat, i) => (
                            <div key={i} className="p-2">
                                <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.value}</p>
                                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Our Story Section (Redesigned - No Image) */}
            <div className="max-w-5xl mx-auto px-6 py-24">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for Farmers, <br/>By Innovators.</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed max-w-4xl mx-auto">
                        It started with a simple observation: Farmers work harder than anyone, yet they often lack the real-time data needed to maximize their returns.
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
                        We built Raitha Mitra to change that equation. By combining satellite imagery, machine learning, and on-ground community support, we've created an ecosystem where agriculture is predictable, profitable, and sustainable.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 text-left">
                        <div className="flex items-start p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl mr-5 shrink-0">
                                <GlobeIcon className="w-8 h-8"/>
                            </div>
                            <div>
                                <h4 className="font-bold text-xl mb-2">Global Tech, Local Roots</h4>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">World-class AI adapted for Indian soil conditions and languages.</p>
                            </div>
                        </div>
                        <div className="flex items-start p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl mr-5 shrink-0">
                                <TrendingUpIcon className="w-8 h-8"/>
                            </div>
                            <div>
                                <h4 className="font-bold text-xl mb-2">Economic Empowerment</h4>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">Direct market linkages increasing farmer income by up to 40%.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Core Values (Bento Grid) */}
            <div className="bg-gray-50 dark:bg-[#0f172a] py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
                        <p className="text-gray-500">The principles that guide every feature we build.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((val, i) => (
                            <div key={i} className="bg-white dark:bg-card-dark p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800">
                                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                                    {val.icon}
                                </div>
                                <h3 className="font-bold text-lg mb-3">{val.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {val.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 5. Leadership Team */}
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Meet The Minds</h2>
                    <p className="text-gray-500">A diverse team of agronomists, engineers, and problem solvers.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, i) => (
                        <div key={i} className="text-center group">
                            <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-800 shadow-lg">
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                            </div>
                            <h3 className="text-xl font-bold">{member.name}</h3>
                            <p className="text-sm text-primary font-medium mb-3">{member.usn}</p>
                            <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a href="#" className="text-gray-400 hover:text-blue-500"><LinkedinIcon className="w-4 h-4"/></a>
                                <a href="#" className="text-gray-400 hover:text-pink-500"><InstagramIcon className="w-4 h-4"/></a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 6. Footer */}
            <footer className="bg-[#0b1120] text-gray-400 py-16 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <Logo showTagline={false} className="mb-6 text-white"/>
                            <p className="text-sm leading-relaxed mb-6">
                                Empowering agriculture through intelligence, community, and sustainable innovation.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><FacebookIcon className="w-5 h-5"/></a>
                                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><InstagramIcon className="w-5 h-5"/></a>
                                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><LinkedinIcon className="w-5 h-5"/></a>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="text-white font-bold mb-6">Product</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="hover:text-primary transition-colors">Marketplace</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Crop Diagnosis</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Soil Analysis</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Weather AI</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Company</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Press & News</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Impact Report</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Contact</h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start"><MapPinIcon className="w-5 h-5 mr-2 text-primary"/> navkis college, Hassan, Karnataka</li>
                                <li className="flex items-center"><span className="w-5 h-5 mr-2 flex items-center justify-center font-bold text-primary">@</span> support@raithamitra.com</li>
                                <li className="flex items-center"><span className="w-5 h-5 mr-2 flex items-center justify-center font-bold text-primary">#</span> +91 98765 43210</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                        <p>&copy; {new Date().getFullYear()} Raitha Mitra Technologies Pvt Ltd.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default About;