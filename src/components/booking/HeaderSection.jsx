import React, { useState } from 'react';
import Phone from '../../assets/icons8-phone-50 white.png';
import Mail from '../../assets/icons8-mail-48 (2 white.png';
import Pin from '../../assets/icons8-location-50 white.png';
import Insta from '../../assets/icons8-instagram-52 white.png';
import Facebook from '../../assets/icons8-facebook-50 white.png';
import Tiktok from '../../assets/icons8-tik-tok-48 white.png';
import Logo from '../../assets/logoBaseilles.webp';

import French from '../../assets/icons8-french-flag-48.png';
import GreatBritain from '../../assets/icons8-great-britain-48.png';
import Netherland from '../../assets/icons8-netherlands-48.png';

export const HeaderSection = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState('fr'); // Default to French
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

    const languages = [
        { code: 'fr', name: 'FR', flag: French },
        { code: 'en', name: 'EN', flag: GreatBritain },
        { code: 'nl', name: 'NL', flag: Netherland }
    ];


    const handleLanguageChange = (langCode) => {
        setCurrentLanguage(langCode);
        setShowLanguageDropdown(false);
        // Add your language change logic here
    };

    const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

    const menuItems = [
        { label: 'Accueil', url: '#' },
        {
            label: 'Nos Logements',
            url: '#',
            submenu: [
                { label: 'Logements Insolites', url: '#' },
                { label: 'Gîte & Chambres d\'Hôtes', url: '#' }
            ]
        },
        { label: 'Extras', url: '#' },
        { label: 'Activités & Partenaires', url: '#' },
        { label: 'Qui Sommes-Nous ?', url: '#' },
        { label: 'Info & Presse', url: '#' }
    ];

    return (
        <header className="w-full fixed top-0 left-0 bg-white z-50">
            <div className="bg-[#668E73] text-white h-[44px] px-[5%] z-50">
                <div className="mx-auto flex justify-between items-center text-xs h-full">
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="flex items-center gap-2 text-[12px]">
                            <img src={Phone} alt="phone" className="h-[18px] w-[18px] text-white" />
                            <span className='font-light'>+32 475 20 16 19</span>
                        </div>
                        <div className="flex items-center gap-2 text-[12px]">
                            <img src={Mail} alt="mail" className="h-[18px] w-[18px] text-white" />
                            <span className='font-light'>fermedebasseilies@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-2 text-[12px]">
                            <img src={Pin} alt="location" className="h-[18px] w-[18px] text-white" />
                            <span className='font-light'>Rue de Basseilles 1 - 5340 MOZET</span>
                        </div>
                    </div>

                    <div className="flex space-x-4 items-center">

                        <div className="group">
                                <button className="flex items-center gap-2 hover:text-gray-200">
                                    <img 
                                        src={currentLang.flag} 
                                        alt="Selected language" 
                                        className="h-[20px] w-[20px] rounded-sm"
                                    />
                                    <svg 
                                        className="w-4 h-4 transition-transform group-hover:rotate-180"
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                                <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 absolute mt-2">
                                    <div className="flex flex-col gap-2">
                                        {languages
                                            .filter(lang => lang.code !== currentLanguage)
                                            .map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => handleLanguageChange(lang.code)}
                                                    className="hover:text-gray-200"
                                                >
                                                    <img 
                                                        src={lang.flag} 
                                                        alt={`Switch to ${lang.code}`} 
                                                        className="h-[20px] w-[20px] rounded-sm"
                                                    />
                                                </button>
                                            ))}
                                    </div>
                                </div>
                        </div>

                        <a href="#" className="hover:text-gray-200 my-auto">
                            <img src={Facebook} alt="facebook" className="h-[18px] w-[18px]" />
                        </a>
                        <a href="#" className="hover:text-gray-200 my-auto">
                            <img src={Insta} alt="instagram" className="h-[18px] w-[18px]" />
                        </a>
                        <a href="#" className="hover:text-gray-200 my-auto">
                            <img src={Tiktok} alt="tiktok" className="h-[18px] w-[18px]" />
                        </a>
                        <button className='bg-[#d3b574] text-black p-[10px] font-light text-[12px]'>Bon cadeau</button>
                    </div>
                </div>
            </div>

            <div className="h-[130px] py-[15px] bg-[#fbfdfb] flex items-center relative z-[-1]">
                <nav className="w-full px-4 lg:px-40">
                    <div className="flex items-center justify-between lg:justify-center relative">
                        {/* Logo - centered on desktop, left on mobile */}
                        <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                            <img src={Logo} alt="Logo" className="w-[100px] h-[100px]" />
                        </div>

                        {/* Hamburger Menu Button - only on mobile */}
                        <div className="lg:hidden relative">
                            <button 
                                className="p-2 ml-auto"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <div className="w-6 h-0.5 bg-[#668E73] mb-1"></div>
                                <div className="w-6 h-0.5 bg-[#668E73] mb-1"></div>
                                <div className="w-6 h-0.5 bg-[#668E73]"></div>
                            </button>

                            {/* Mobile Dropdown Menu */}
                            {isMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50">
                                    {menuItems.map((item, index) => (
                                        <div key={index} className="relative group">
                                            <a href={item.url} className="block px-4 py-2 text-[#668E73] text-[16px] font-light hover:bg-gray-50">
                                                {item.label}
                                            </a>
                                            {item.submenu && (
                                                <div className="pl-6">
                                                    {item.submenu.map((subItem, subIndex) => (
                                                        <a 
                                                            key={subIndex}
                                                            href={subItem.url}
                                                            className="block px-4 py-2 text-[#668E73] text-[14px] font-light hover:bg-gray-50"
                                                        >
                                                            {subItem.label}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Desktop Navigation - hidden on mobile */}
                        <div className="hidden lg:flex justify-between w-full">
                            <div className="flex space-x-10 gap-5 w-1/3 justify-center">
                                <a href="#" className="text-gray-700 text-[16px] font-light">Accueil</a>
                                <div className="relative group">
                                    <a href="#" className="text-gray-700 text-[16px] font-light flex items-center gap-2">
                                        Nos Logements
                                        <svg 
                                            className="w-4 h-4 transition-transform group-hover:rotate-180"
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </a>
                                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                        <a href="#" className="block px-4 py-2 text-[16px] text-gray-700 hover:bg-gray-100 font-light">
                                            Logements Insolites
                                        </a>
                                        <a href="#" className="block px-4 py-2 text-[16px] text-gray-700 hover:bg-gray-100 font-light">
                                            Gîte & Chambres d'Hôtes
                                        </a>
                                    </div>
                                </div>
                                <a href="#" className="text-gray-700 text-[16px] font-light">Extras</a>
                            </div>
                            <div className="flex space-x-6 w-1/3 justify-start">
                                <a href="#" className="text-gray-700 text-[16px] font-light">Activités & Partenaires</a>
                                <a href="#" className="text-gray-700 text-[16px] font-light">Qui Sommes-Nous ?</a>
                                <a href="#" className="text-gray-700 text-[16px] font-light">Info & Presse</a>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default HeaderSection;