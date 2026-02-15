
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
    ArrowRight, Database, Cloud, Code, Package, Menu, X, CheckCircle,
    Zap, ChevronRight, BarChart, Layers, Shield, Globe, PlayCircle,
    LayoutGrid, Server, Landmark, Users, Settings, Plus, ArrowDown, Star, Play,
    ChevronLeft, Terminal, Cpu, Activity, Award, Save
} from 'lucide-react';
import { ContentProvider, useContent } from './src/context/ContentContext';
import { Editable } from './src/components/Editable';

// --- UTILS & HOOKS ---
const useScrollPosition = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    useEffect(() => {
        const updatePosition = () => setScrollPosition(window.scrollY);
        window.addEventListener("scroll", updatePosition);
        return () => window.removeEventListener("scroll", updatePosition);
    }, []);
    return scrollPosition;
};

// Navegación suave
const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

interface FadeInProps {
    children?: React.ReactNode;
    delay?: number;
    className?: string;
}

const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (domRef.current) observer.unobserve(domRef.current);
                }
            });
        }, { threshold: 0.1 });

        if (domRef.current) observer.observe(domRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={domRef}
            className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

// Componente para Títulos de Sección Estandarizados
const SectionHeader = ({ taglinePath, titlePath, subtitlePath }: { taglinePath: string, titlePath: string, subtitlePath?: string }) => (
    <div className="text-center mb-24 max-w-4xl mx-auto px-4">
        <span className="text-xs font-bold text-brand-blue uppercase tracking-[0.2em] mb-4 block">
            <Editable path={taglinePath} />
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 tracking-tight mb-6 pb-2">
            <Editable path={titlePath} />
        </h2>
        {subtitlePath && (
            <p className="text-slate-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed antialiased">
                <Editable path={subtitlePath} multiline />
            </p>
        )}
    </div>
);

// Helper para Renderizar Iconos (Lucide o Imagen URL)
const DynamicIcon = ({ name, url, size = 24, className = "" }: { name?: string, url?: string, size?: number, className?: string }) => {
    if (url) return <img src={url} alt="icon" style={{ width: size, height: size }} className={`object-contain ${className}`} />;

    // Mapeo de Lucide
    const icons = {
        Cloud: <Cloud size={size} className={className} />,
        Code: <Code size={size} className={className} />,
        BarChart: <BarChart size={size} className={className} />,
        Database: <Database size={size} className={className} />,
        Zap: <Zap size={size} className={className} />,
        Landmark: <Landmark size={size} className={className} />,
        Package: <Package size={size} className={className} />,
        Users: <Users size={size} className={className} />,
        Settings: <Settings size={size} className={className} />,
        Box: <Package size={size} className={className} />,
        Layers: <Layers size={size} className={className} />,
    };

    return icons[name] || <Package size={size} className={className} />;
};

const VideoModal = ({ onClose }: { onClose: () => void }) => {
    const { content: siteData } = useContent();
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4 animate-in fade-in duration-500">
            <div className="bg-black rounded-2xl w-full max-w-5xl aspect-video relative shadow-2xl overflow-hidden border border-white/10 ring-1 ring-white/5">
                <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors z-20 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10">
                    <X size={24} />
                </button>
                <iframe
                    src={siteData.assets.heroVideoUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

// --- NEW PREMIUM COMPONENTS ---

// 1. Magnetic Button
const MagneticButton = ({ children, onClick, className = "", variant = "primary" }: { children: React.ReactNode, onClick?: () => void, className?: string, variant?: "primary" | "secondary" | "outline" | "ghost" }) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!btnRef.current) return;
        const { left, top, width, height } = btnRef.current.getBoundingClientRect();
        const x = (e.clientX - (left + width / 2)) * 0.2; // Intensidad magnética
        const y = (e.clientY - (top + height / 2)) * 0.2;
        setPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const baseStyles = "relative overflow-hidden transition-all duration-300 transform font-medium rounded-full flex items-center justify-center gap-2 text-base group";
    const variants = {
        primary: "bg-slate-950 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20",
        secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
        outline: "bg-transparent border border-slate-600 text-white hover:bg-white/10",
        ghost: "bg-transparent text-slate-600 hover:text-slate-900"
    };

    return (
        <button
            ref={btnRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

// 2. Illuminated Border Card (Fixed: Only Border Glows, No Inner Cloud)
const IlluminatedBorderCard = ({ children, className = "", borderColor = "#3B82F6" }: { children: React.ReactNode, className?: string, borderColor?: string }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: -500, y: -500 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-[2rem] overflow-hidden group h-full bg-slate-200"
        >
            <div
                className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
                style={{
                    opacity,
                    background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${borderColor}, transparent 40%)`,
                }}
            />
            {/* Contenedor interno con margen de 1px para revelar el fondo (borde) */}
            <div className={`relative h-full w-full bg-slate-50 m-[1px] rounded-[calc(2rem-1px)] z-10 ${className}`} style={{ width: 'calc(100% - 2px)', height: 'calc(100% - 2px)' }}>
                {children}
            </div>
        </div>
    );
};

// 3. Organic Separator
const OrganicSeparator = ({ position = "bottom" }: { position?: "top" | "bottom" }) => (
    <div
        className={`absolute left-0 w-full h-32 z-10 pointer-events-none ${position === "bottom" ? "bottom-0 bg-gradient-to-t" : "top-0 bg-gradient-to-b"} from-white via-white/90 to-transparent`}
    ></div>
);

// 4. Aurora Background (Corporate Tech: Deep Blues & Greys)
const AuroraBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-slate-400/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob"></div>
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-brand-blue/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] bg-slate-300/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-4000"></div>
    </div>
);

// 5. Noise Overlay
const NoiseOverlay = () => (
    <div className="noise-bg"></div>
);

// --- COMPONENTS ---

const Navbar = () => {
    const { content: siteData } = useContent();
    const scrollY = useScrollPosition();
    const isScrolled = scrollY > 20;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { label: <Editable path="general.navbar.services" />, id: 'servicios' },
        { label: <Editable path="general.navbar.marketplace" />, id: 'marketplace' },
        { label: <Editable path="general.navbar.blog" />, id: 'blog' }
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/50 py-3' : 'bg-transparent py-6'}`}>
            <div className="mx-auto max-w-[90rem] px-6 md:px-12 grid grid-cols-2 md:grid-cols-3 items-center">
                {/* Columna 1: Logo (Izquierda) */}
                <div className="flex justify-start">
                    <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2 group">
                        <img
                            src={siteData.assets.logo}
                            alt="Solinntec"
                            className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                    </a>
                </div>

                {/* Columna 2: Enlaces (Centro - Solo Desktop) */}
                <div className="hidden md:flex justify-center items-center gap-10">
                    {navItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => scrollToSection(item.id)}
                            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-brand-blue after:transition-all hover:after:w-full"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Columna 3: Acciones (Derecha) */}
                <div className="flex justify-end items-center gap-4">
                    <button
                        onClick={() => scrollToSection('contact')}
                        className="hidden md:block bg-slate-950 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all transform hover:-translate-y-0.5"
                    >
                        <Editable path="general.navbar.contact" />
                    </button>
                    <button className="md:hidden text-slate-950" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Menú Móvil */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-4 shadow-xl md:hidden flex flex-col gap-4 animate-in slide-in-from-top duration-300">
                    {navItems.map((item, index) => (
                        <button key={index} onClick={() => { setMobileMenuOpen(false); scrollToSection(item.id); }} className="text-left text-slate-800 font-medium py-2 border-b border-slate-50 last:border-0">
                            {item.label}
                        </button>
                    ))}
                    <button onClick={() => { setMobileMenuOpen(false); scrollToSection('contact'); }} className="text-left text-slate-900 font-bold py-2">
                        <Editable path="general.navbar.contact" />
                    </button>
                </div>
            )}
        </nav>
    );
};

const Hero = () => {
    const { content: siteData } = useContent();
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    return (
        <section className="relative pt-16 pb-0 md:pt-24 overflow-hidden bg-white">
            <AuroraBackground />

            {/* Background Element: Massive SAP Text Watermark */}
            <div className="absolute top-38 md:-top-84 left-1/2 -translate-x-1/2 select-none pointer-events-none z-0 w-full flex justify-center opacity-50">
                <span className="font-sans font-black text-[30vw] md:text-[25rem] text-slate-900 opacity-[0.03] blur-[1px] tracking-tight leading-none mix-blend-overlay">
                    SAP
                </span>
            </div>

            {isVideoOpen && <VideoModal onClose={() => setIsVideoOpen(false)} />}

            <div className="max-w-[90rem] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">

                {/* NEW PRESTIGE BADGE: "Gold Partner" */}
                <div className="inline-flex items-center gap-3 px-2 py-2 pr-5 rounded-full bg-slate-50/50 backdrop-blur-sm border border-slate-200/60 mb-10 mt-8 shadow-sm hover:shadow-md transition-all duration-500 cursor-default group animate-in fade-in zoom-in duration-700">
                    <div className="bg-[#F0AB00] text-black w-7 h-7 rounded-full flex items-center justify-center shadow-sm">
                        <Award size={14} className="fill-black/10 text-black stroke-[2.5]" />
                    </div>
                    <div className="flex flex-col text-left leading-none">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.15em] mb-0.5">Official Partner</span>
                        <span className="text-sm font-bold text-slate-900 group-hover:text-[#b8860b] transition-colors">
                            <Editable path="hero.badge" />
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-bold text-slate-950 tracking-tighter leading-[1.05] text-center mb-6 max-w-5xl">
                    <Editable path="hero.title" />
                </h1>

                {/* Subtitle */}
                <div className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10 text-center font-normal">
                    <Editable path="hero.subtitle" multiline />
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-5 mb-16 w-full sm:w-auto">
                    <MagneticButton onClick={() => scrollToSection('contact')} variant="primary" className="px-8 py-4 min-w-[170px]">
                        <Editable path="hero.ctaPrimary" />
                    </MagneticButton>
                    <MagneticButton onClick={() => scrollToSection('marketplace')} variant="secondary" className="px-8 py-4 min-w-[170px]">
                        <Editable path="hero.ctaSecondary" />
                    </MagneticButton>
                </div>

                {/* Visual Content (Video/Mockups) */}
                <div className="relative w-full mx-auto perspective-1000 group">

                    {/* Floating Identity Card */}
                    <div className="absolute -top-6 right-6 md:-top-12 md:right-12 z-40 animate-float-slow">
                        <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] p-4 rounded-2xl flex items-center gap-4 min-w-[200px] transform transition-transform hover:scale-105 duration-300">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Technology</div>
                                <div className="text-sm font-bold text-slate-900 leading-tight">SAP Business One</div>
                                <div className="text-[10px] font-medium text-emerald-600 flex items-center gap-1 mt-0.5">
                                    <CheckCircle size={10} /> Certified Core
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Window Container */}
                    <div
                        className="relative bg-slate-900 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(2,6,23,0.3)] w-full aspect-[4/3] md:aspect-[21/9] lg:aspect-[2.4/1] transform transition-transform duration-700 hover:scale-[1.005] cursor-pointer ring-1 ring-slate-900/5 group-hover:shadow-[0_50px_100px_-20px_rgba(59,130,246,0.15)]"
                        onClick={() => setIsVideoOpen(true)}
                    >
                        {/* Fake UI Header */}
                        <div className="absolute top-0 left-0 w-full h-10 md:h-14 bg-slate-950/50 backdrop-blur-md flex items-center px-6 md:px-8 justify-between z-20 border-b border-white/5">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            </div>
                            <div className="flex items-center gap-2 opacity-60">
                                <Database size={12} className="text-blue-400" />
                                <span className="text-[10px] text-slate-300 font-mono tracking-wide">SAP_HANA_DB::CONNECTED</span>
                            </div>
                        </div>

                        {/* Internal Dashboard Mockup */}
                        <div className="absolute inset-0 pt-10 md:pt-14 bg-slate-900">
                            <div className="w-full h-full p-4 md:p-8 bg-gradient-to-br from-slate-800 to-slate-900 relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#F0AB00] opacity-[0.03] blur-[80px] rounded-full pointer-events-none"></div>

                                <div className="grid grid-cols-12 gap-4 md:gap-6 h-full opacity-90 relative z-10">
                                    <div className="hidden md:block col-span-2 bg-slate-800/50 rounded-xl border border-white/5 h-full"></div>
                                    <div className="col-span-12 md:col-span-10 grid grid-rows-6 gap-4 md:gap-6 h-full">
                                        <div className="row-span-1 grid grid-cols-4 gap-4 md:gap-6">
                                            <div className="bg-slate-800/50 rounded-xl border border-white/5"></div>
                                            <div className="bg-slate-800/50 rounded-xl border border-white/5"></div>
                                            <div className="bg-slate-800/50 rounded-xl border border-white/5"></div>
                                            <div className="bg-slate-800/50 rounded-xl border border-white/5"></div>
                                        </div>
                                        <div className="row-span-3 bg-slate-800/30 rounded-xl border border-white/5 relative overflow-hidden group-hover:bg-slate-800/40 transition-colors">
                                            <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-brand-blue/10 to-transparent"></div>
                                            <div className="absolute bottom-8 left-8 right-8 h-px bg-white/10"></div>
                                            <div className="absolute bottom-8 left-12 w-4 h-20 bg-brand-blue/40 rounded-t-sm"></div>
                                            <div className="absolute bottom-8 left-20 w-4 h-32 bg-brand-blue/60 rounded-t-sm"></div>
                                            <div className="absolute bottom-8 left-28 w-4 h-16 bg-brand-blue/30 rounded-t-sm"></div>
                                        </div>
                                        <div className="row-span-2 grid grid-cols-3 gap-4 md:gap-6">
                                            <div className="col-span-2 bg-slate-800/30 rounded-xl border border-white/5"></div>
                                            <div className="col-span-1 bg-slate-800/30 rounded-xl border border-white/5"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/5 transition-all z-20">
                                    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                        <Play size={32} className="text-white ml-1 fill-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex absolute -left-6 top-1/4 z-30 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 rounded-2xl border border-slate-100 items-center gap-3 animate-float-slow max-w-[220px]">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 flex-shrink-0">
                            <Cloud size={20} />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-900">SAP Cloud</div>
                            <div className="text-xs text-slate-500 font-medium">99.9% Uptime</div>
                        </div>
                    </div>

                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] h-20 bg-brand-blue/5 blur-3xl -z-10 rounded-full"></div>
                </div>
            </div>
            <OrganicSeparator position="bottom" />
        </section>
    );
};

const Services = () => {
    const { content: siteData } = useContent();
    return (
        <section id="servicios" className="bg-white pt-20 pb-24 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-24 max-w-4xl mx-auto px-4">
                    <span className="text-xs font-bold text-brand-blue uppercase tracking-[0.2em] mb-4 block">
                        <Editable path="services.tagline" />
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 tracking-tight mb-6 pb-2">
                        <Editable path="services.main.title" />
                    </h2>
                    <p className="text-slate-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed antialiased">
                        <Editable path="services.main.description" multiline />
                    </p>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">

                    <FadeIn className="md:col-span-8 row-span-2 relative group rounded-[2.5rem] overflow-hidden shadow-2xl transform transition-transform duration-700 hover:scale-[1.005]">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] z-0"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] z-0 opacity-40"></div>
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full mix-blend-screen animate-pulse-slow"></div>
                        <AuroraBackground />

                        <div className="absolute -right-24 -bottom-12 h-[120%] z-0 opacity-[0.07] transform rotate-0 scale-110 pointer-events-none mix-blend-plus-lighter grayscale transition-all duration-700 group-hover:scale-110 group-hover:opacity-[0.1]">
                            <img
                                src={siteData.assets.sapLogo}
                                alt="SAP Structure"
                                className="h-full w-auto object-contain filter invert drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                            />
                        </div>

                        <div className="absolute top-8 right-8 z-20 flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                <span className="text-[10px] font-mono text-emerald-200 uppercase tracking-widest">System Active</span>
                            </div>
                        </div>

                        <div className="relative z-10 p-10 md:p-14 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex items-start justify-between mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-[0_10px_20px_-5px_rgba(59,130,246,0.4)] border border-white/10 ring-4 ring-white/5">
                                        <Database size={30} />
                                    </div>
                                    <span className="md:hidden bg-blue-900/50 border border-blue-500/30 text-blue-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                        SAP Partner
                                    </span>
                                </div>

                                <h4 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-[1.1] max-w-lg relative tracking-tight">
                                    <Editable path="services.main.title" />
                                    <span className="text-blue-500">.</span>
                                </h4>

                                <div className="text-slate-300 text-lg mb-10 max-w-xl leading-relaxed font-light border-l-2 border-blue-500/30 pl-6">
                                    <Editable path="services.main.description" multiline />
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
                                    {siteData.services.main.features.slice(0, 4).map((f, i) => (
                                        <div key={i} className="flex items-center gap-3 group/item">
                                            <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-blue-400 group-hover/item:text-white group-hover/item:bg-blue-600 transition-all">
                                                <CheckCircle size={14} />
                                            </div>
                                            <span className="text-sm text-slate-400 font-medium group-hover/item:text-slate-200 transition-colors">
                                                <Editable path={`services.main.features.${i}`} />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto pt-8 border-t border-white/5 flex flex-wrap items-center gap-6">
                                <button onClick={() => scrollToSection('contact')} className="bg-white text-slate-900 px-8 py-3.5 rounded-full font-bold flex items-center gap-2 hover:bg-blue-50 transition-all group/btn shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                    <Editable path="services.main.cta" /> <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
                    </FadeIn>

                    {siteData.services.grid.map((s, idx) => (
                        <FadeIn key={s.id} delay={(idx + 1) * 100} className="md:col-span-4 h-full">
                            <IlluminatedBorderCard className="p-8 flex flex-col justify-between group h-full">
                                <div>
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-brand-blue border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                                        <DynamicIcon name={s.icon} url={s.iconUrl} />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-blue transition-colors duration-300">
                                        <Editable path={`services.grid.${idx}.title`} />
                                    </h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        <Editable path={`services.grid.${idx}.description`} multiline />
                                    </p>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button onClick={() => scrollToSection('contact')}>
                                        <ArrowRight size={20} className="text-slate-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all duration-300" />
                                    </button>
                                </div>
                            </IlluminatedBorderCard>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};

const AddonsMarketplace = () => {
    const { content: siteData } = useContent();
    const [activeAddonId, setActiveAddonId] = useState(siteData.addons[0].id);
    const activeAddon = siteData.addons.find(a => a.id === activeAddonId) || siteData.addons[0];
    const activeAddonIndex = siteData.addons.findIndex(a => a.id === activeAddonId);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
        }
    };

    useEffect(() => {
        checkScroll();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 240;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section id="marketplace" className="py-24 bg-slate-50 border-t border-slate-200 relative">
            <OrganicSeparator position="top" />
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="text-center mb-24 max-w-4xl mx-auto px-4">
                    <span className="text-xs font-bold text-brand-blue uppercase tracking-[0.2em] mb-4 block">
                        <Editable path="marketplace.tagline" />
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 tracking-tight mb-6 pb-2">
                        <Editable path="marketplace.title" />
                    </h2>
                    <p className="text-slate-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed antialiased">
                        <Editable path="marketplace.subtitle" multiline />
                    </p>
                </div>

                <div className="flex flex-col">
                    <div className="relative mb-0 group/carousel z-20">
                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 pl-2 transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <button onClick={() => scroll('left')} className="p-3 rounded-full bg-white shadow-lg border border-slate-100 text-slate-600 hover:text-brand-blue hover:scale-110 transition-all">
                                <ChevronLeft size={24} />
                            </button>
                        </div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 pr-2">
                            <button onClick={() => scroll('right')} className="p-3 rounded-full bg-white shadow-lg border border-slate-100 text-slate-600 hover:text-brand-blue hover:scale-110 transition-all">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                        <div
                            ref={scrollContainerRef}
                            onScroll={checkScroll}
                            className="flex gap-4 overflow-x-auto py-6 px-4 snap-x snap-mandatory scrollbar-hide relative"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {siteData.addons.map((addon, idx) => {
                                const isActive = activeAddonId === addon.id;
                                const isFastInvoice = addon.id === 'fast-invoice';
                                return (
                                    <button
                                        key={addon.id}
                                        onClick={() => setActiveAddonId(addon.id)}
                                        className={`flex-none w-[180px] md:w-[220px] snap-center p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-visible group hover:-translate-y-1 ${isActive
                                            ? 'bg-white border-brand-blue ring-2 ring-brand-blue/10 shadow-sm'
                                            : 'bg-white/50 border-slate-200 hover:border-slate-300 hover:shadow-md shadow-none'
                                            } ${isFastInvoice ? 'border-amber-400/50' : ''}`}
                                    >
                                        {isActive && (
                                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45 border-r border-b border-brand-blue/20 z-10 hidden md:block"></div>
                                        )}
                                        {isFastInvoice && (
                                            <div className="absolute top-0 right-0 bg-[#F0AB00] text-black text-[9px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-2xl">
                                                STAR
                                            </div>
                                        )}
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${isActive
                                            ? (isFastInvoice ? 'bg-[#F0AB00] text-black' : 'bg-brand-blue text-white')
                                            : (isFastInvoice ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500')
                                            }`}>
                                            <DynamicIcon name={addon.icon} size={20} />
                                        </div>
                                        <div className="font-bold text-slate-900 text-sm truncate">
                                            <Editable path={`addons.${idx}.name`} />
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1 truncate font-medium">
                                            <Editable path={`addons.${idx}.category`} />
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="min-h-[500px] relative mt-2">
                        <div key={activeAddon.id} className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col md:flex-row gap-12 animate-in fade-in slide-in-from-right-8 duration-500 ease-out relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-white to-white pointer-events-none"></div>
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-blue/20 to-transparent opacity-60"></div>
                            <div className="flex-1 flex flex-col justify-center relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${activeAddon.id === 'fast-invoice' ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-slate-900 text-white'}`}>
                                        <DynamicIcon name={activeAddon.icon} size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                                            <Editable path={`addons.${activeAddonIndex}.name`} />
                                        </h3>
                                        <div className="text-slate-500 text-sm font-semibold uppercase tracking-wider">
                                            <Editable path={`addons.${activeAddonIndex}.category`} />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xl font-semibold text-brand-blue mb-4 leading-tight">
                                    <Editable path={`addons.${activeAddonIndex}.tagline`} />
                                </p>
                                <div className="text-slate-600 leading-relaxed mb-8 text-lg font-light">
                                    <Editable path={`addons.${activeAddonIndex}.description`} multiline />
                                </div>
                                <div className="flex gap-4 mb-10">
                                    {activeAddon.stats.map((stat, i) => (
                                        <div key={i} className="px-5 py-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-blue/20 transition-colors group/stat">
                                            <div className="text-xl font-bold text-slate-900 group-hover/stat:text-brand-blue transition-colors">
                                                <Editable path={`addons.${activeAddonIndex}.stats.${i}.value`} />
                                            </div>
                                            <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                                                <Editable path={`addons.${activeAddonIndex}.stats.${i}.label`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <button onClick={() => scrollToSection('contact')} className="bg-brand-blue text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-brand-blue/20 flex items-center gap-2 group/btn">
                                        <Editable path="marketplace.cta" /> <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                    {activeAddon.isPremium && (
                                        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-100 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider">
                                            <Star size={16} fill="currentColor" /> SAP Certified
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="md:w-1/2 aspect-video md:aspect-auto md:h-auto rounded-3xl overflow-hidden relative shadow-2xl bg-slate-100 group">
                                <img src={activeAddon.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Preview" />
                                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold shadow-xl border border-white/20">
                                    v2.4.2 Stable Release
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Blog = () => {
    const { content: siteData } = useContent();
    const [visibleCount, setVisibleCount] = useState(3);
    const hasMore = visibleCount < siteData.news.length;
    return (
        <section id="blog" className="py-32 bg-white relative">
            <OrganicSeparator position="top" />
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24 max-w-4xl mx-auto px-4">
                    <span className="text-xs font-bold text-brand-blue uppercase tracking-[0.2em] mb-4 block">
                        <Editable path="blog.tagline" />
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 tracking-tight mb-6 pb-2">
                        <Editable path="blog.title" />
                    </h2>
                    <p className="text-slate-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed antialiased">
                        <Editable path="blog.subtitle" multiline />
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-10 transition-all duration-500">
                    {siteData.news.slice(0, visibleCount).map((item, idx) => (
                        <FadeIn key={item.id} delay={(idx % 3) * 100} className="group cursor-pointer flex flex-col h-full hover:-translate-y-2 transition-transform duration-500">
                            <div className="aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden mb-6 relative border border-slate-100 shadow-sm group-hover:shadow-xl transition-all duration-500 transform-gpu z-0 [mask-image:linear-gradient(white,white)]">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 rounded-2xl" />
                                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-900 z-20 shadow-sm tracking-wide uppercase">
                                    <Editable path={`news.${idx}.category`} />
                                </div>
                            </div>
                            <div className="space-y-3 flex-grow">
                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                                    <Editable path={`news.${idx}.date`} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-blue transition-colors leading-tight">
                                    <Editable path={`news.${idx}.title`} />
                                </h3>
                                <div className="text-slate-500 text-sm line-clamp-3 leading-relaxed">
                                    <Editable path={`news.${idx}.excerpt`} multiline />
                                </div>
                            </div>
                            <div className="pt-6 mt-auto flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:gap-3 transition-all">
                                <Editable path="blog.readMore" /> <ArrowRight size={16} />
                            </div>
                        </FadeIn>
                    ))}
                </div>
                {hasMore && (
                    <div className="mt-16 flex justify-center">
                        <button onClick={() => setVisibleCount(prev => prev + 3)} className="group flex items-center gap-3 bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-bold hover:bg-slate-50 hover:border-brand-blue/30 transition-all shadow-sm transform hover:-translate-y-1">
                            <Editable path="blog.cta" /> <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}

const Footer = () => {
    const { content: siteData } = useContent();
    return (
        <footer id="contact" className="bg-white border-t border-slate-100 pt-32 pb-12 relative">
            <OrganicSeparator position="top" />
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="bg-brand-darkBlue rounded-[3rem] p-12 md:p-24 text-center text-white mb-24 relative overflow-hidden shadow-2xl shadow-blue-900/40 group">
                    <AuroraBackground />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-8 tracking-tight leading-tight"><Editable path="footer.title" /></h2>
                        <p className="text-slate-300 mb-12 text-lg md:text-xl leading-relaxed font-light"><Editable path="footer.subtitle" multiline /></p>
                        <div className="flex flex-col sm:flex-row justify-center gap-5">
                            <MagneticButton onClick={() => window.location.href = `mailto:${siteData.general.contactEmail}`} variant="secondary" className="px-10 py-5 bg-white text-brand-darkBlue hover:bg-slate-100 border-none shadow-xl hover:shadow-2xl hover:-translate-y-1">
                                <Editable path="footer.ctaEmail" />
                            </MagneticButton>
                            <MagneticButton onClick={() => window.open(siteData.general.whatsappLink, '_blank')} variant="outline" className="px-10 py-5 border-slate-600">
                                <Editable path="footer.ctaWhatsapp" />
                            </MagneticButton>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-slate-500 border-t border-slate-100 pt-12">
                    <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                        <img src={siteData.assets.logo} alt="Solinntec" className="h-6 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-500" />
                        <span className="font-bold text-slate-900">SpA</span>
                    </div>
                    <div className="flex gap-8 font-medium">
                        <a href={siteData.general.linkedinLink} className="hover:text-brand-blue transition-colors"><Editable path="footer.links.linkedin" /></a>
                        <a href="#" className="hover:text-brand-blue transition-colors"><Editable path="footer.links.instagram" /></a>
                        <a href="#" className="hover:text-brand-blue transition-colors"><Editable path="footer.links.legal" /></a>
                    </div>
                    <div className="font-medium text-slate-400">&copy; {new Date().getFullYear()} Solinntec. <span className="hidden md:inline"><Editable path="footer.rights" /></span></div>
                </div>
            </div>
        </footer>
    );
};

const EditControls = () => {
    const { isEditing, hasUnsavedChanges, saveChanges } = useContent();

    if (!isEditing && !hasUnsavedChanges) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-4 animate-in slide-in-from-bottom duration-300">
            {hasUnsavedChanges && (
                <button
                    onClick={saveChanges}
                    className="bg-brand-blue text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 hover:bg-blue-700 transition-all hover:scale-105"
                >
                    <Save size={18} />
                    Guardar Cambios
                </button>
            )}
            {isEditing && (
                <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-xs font-bold shadow-sm border border-yellow-200 text-center">
                    Modo Edición Activo
                </div>
            )}
        </div>
    );
};

const App = () => {
    return (
        <ContentProvider>
            <div className="font-sans antialiased text-slate-900 bg-white selection:bg-brand-blue selection:text-white relative">
                <NoiseOverlay />
                <Navbar />
                <main>
                    <Hero />
                    <Services />
                    <AddonsMarketplace />
                    <Blog />
                </main>
                <Footer />
                <EditControls />
            </div>
        </ContentProvider>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
