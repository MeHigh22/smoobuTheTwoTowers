import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import Logo from '../../assets/logoBaseilles.webp'

export const HeaderSection = () => {

    return (
        <header className="w-full">
            <div className="bg-[#668E73] text-white h-[44px] px-[3%]">
                <div className="mx-auto flex justify-between items-center text-xs h-full">
                    <div className="flex items-center space-x-6">
                        <button className='bg-[#d3b574] text-black p-[10px] font-light text-[12px]'>Reserver</button>
                        <div className="flex items-center gap-2 text-[12px]">
                            <Phone size={16} />
                            <span className='font-light'>+32 475 20 16 19</span>
                        </div>
                        <div className="flex items-center gap-2 text-[12px]">
                            <Mail size={16} />
                            <span className='font-light'>fermedebasseilies@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-2 text-[12px]">
                            <MapPin size={16} />
                            <span className='font-light'>Rue de Basseilles 1 - 5340 MOZET</span>
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-gray-200 my-auto">
                            <svg className="w-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                        <a href="#" className="hover:text-gray-200 my-auto">
                            <svg className="w-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                        </a>
                        <a href="#" className="hover:text-gray-200 my-auto">
                            <svg className="w-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.298 0 .593.057.87.168V9.07a6.37 6.37 0 00-1-.05A6.3 6.3 0 003 20.83a6.3 6.3 0 0010.39-4.83l.03-10.3a8.32 8.32 0 006.17 3.16v-2.17z"/></svg>
                        </a>
                        <a href="#" className="hover:text-gray-200 my-auto">
                            <button className='bg-[#d3b574] text-black p-[10px] font-light text-[12px] flex gap-3'>
                                <svg className="w-[18px]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 6h-2.18c.11-.31.18-.65.18-1a3 3 0 0 0-3-3 3 3 0 0 0-2.68 1.66L12 4.15l-.32-.49A3 3 0 0 0 9 2a3 3 0 0 0-3 3c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                                </svg>
                                Reserver
                            </button>
                        </a>
                    </div>
                </div>
            </div>

            <div className="h-auto py-[15px] bg-[#fbfdfb] flex items-center">
                <nav className="w-full px-40">
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-6 w-1/3">
                            <a href="#" className="text-gray-700 text-[16px] font-light">Accueil</a>
                            <div className="relative group">
                                <a href="#" className="text-gray-700 text-[16px] font-light">Nos Logements</a>
                                <div className="absolute left-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                    <div className="h-2"></div>
                                    <a href="#" className="block px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-100 font-light">
                                        Logements Insolites
                                    </a>
                                    <a href="#" className="block px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-100 font-light">
                                        Gîte & Chambres d'Hôtes
                                    </a>
                                </div>
                            </div>
                            <a href="#" className="text-gray-700 text-[16px] font-light">Extras</a>
                        </div>
                        <div className="flex justify-center w-1/3">
                            <img src={Logo} alt="Logo" className="w-[100px] h-[100px]" />
                        </div>
                        <div className="flex space-x-6 w-1/3 justify-end">
                            <a href="#" className="text-gray-700 text-[16px] font-light">Activités & Partenaires</a>
                            <a href="#" className="text-gray-700 text-[16px] font-light">Qui Sommes-Nous ?</a>
                            <a href="#" className="text-gray-700 text-[16px] font-light">Info & Presse</a>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default HeaderSection;




