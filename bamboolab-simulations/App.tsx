
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { SimulationType, SimContextData } from './types';
import InlineAITutor from './components/InlineAITutor';
import SimulationCard from './components/SimulationCard';
import ProjectileMotion from './simulations/ProjectileMotion';
import PendulumLab from './simulations/PendulumLab';
import HookesLaw from './simulations/HookesLaw';
import BalancingAct from './simulations/BalancingAct';
import SolarSystem from './simulations/SolarSystem';
import CollisionLab from './simulations/CollisionLab';
import GravityForceLab from './simulations/GravityForceLab';
import GasProperties from './simulations/GasProperties';
import GraphingLines from './simulations/GraphingLines';
import WaveInterference from './simulations/WaveInterference';
import CircuitLab from './simulations/CircuitLab';
import AtomBuilder from './simulations/AtomBuilder';
import EnergySkatePark from './simulations/EnergySkatePark';
import PopulationGrowth from './simulations/PopulationGrowth';
import FrictionRamp from './simulations/FrictionRamp';
import Refraction from './simulations/Refraction';
import VectorAddition from './simulations/VectorAddition';
import PHScale from './simulations/PHScale';
import NaturalSelection from './simulations/NaturalSelection';
import FourierSeries from './simulations/FourierSeries';
import BallisticPendulum from './simulations/BallisticPendulum';
import ChargedSpring from './simulations/ChargedSpring';
import DopplerEffect from './simulations/DopplerEffect';
import { getThumbnail } from './thumbnails';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<SimulationType>(SimulationType.HOME);
  
  const [simContext, setSimContext] = useState<SimContextData>({
    name: "Home Library",
    description: "Browsing the simulation library.",
    parameters: {}
  });

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleSimContextUpdate = useCallback((data: SimContextData) => {
    setSimContext(data);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case SimulationType.PROJECTILE:
        return <ProjectileMotion onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.PENDULUM:
        return <PendulumLab onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.HOOKES:
        return <HookesLaw onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.BALANCING:
        return <BalancingAct onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.SOLAR:
        return <SolarSystem onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.COLLISION:
        return <CollisionLab onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.GRAVITY:
        return <GravityForceLab mode="gravity" onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.COULOMB:
        return <GravityForceLab mode="coulomb" onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.GAS:
        return <GasProperties onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.GRAPHING:
        return <GraphingLines onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.WAVE:
        return <WaveInterference onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.CIRCUIT:
        return <CircuitLab onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.ATOM:
        return <AtomBuilder onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.SKATE:
        return <EnergySkatePark onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.POPULATION:
        return <PopulationGrowth onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.FRICTION:
        return <FrictionRamp onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.REFRACTION:
        return <Refraction onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.VECTORS:
        return <VectorAddition onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.PH_SCALE:
        return <PHScale onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.SELECTION:
        return <NaturalSelection onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.FOURIER:
        return <FourierSeries onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.BALLISTIC:
        return <BallisticPendulum onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.CHARGED_SPRING:
        return <ChargedSpring onContextUpdate={handleSimContextUpdate} />;
      case SimulationType.DOPPLER:
        return <DopplerEffect onContextUpdate={handleSimContextUpdate} />;
      default:
        return <Library setView={setCurrentView} />;
    }
  };

  const isDarkTheme = currentView === SimulationType.SOLAR || currentView === SimulationType.WAVE || currentView === SimulationType.FOURIER || currentView === SimulationType.DOPPLER;

  return (
    <div className={`min-h-screen flex flex-col ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navbar */}
      <nav className={`${isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm sticky top-0 z-40 border-b transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setCurrentView(SimulationType.HOME)}
          >
            <div className="bg-brand-600 text-white p-2 rounded-lg">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <span className={`text-xl font-bold tracking-tight ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>BambooLab</span>
          </div>
          
          {currentView !== SimulationType.HOME && (
            <button 
              onClick={() => setCurrentView(SimulationType.HOME)}
              className={`${isDarkTheme ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-brand-600'} font-medium text-sm flex items-center gap-1 transition-colors`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Library
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {renderView()}
        
        {/* AI Tutor Dialogue Section (Below Experiment) */}
        {currentView !== SimulationType.HOME && (
          <InlineAITutor simContext={simContext} simulationType={currentView} />
        )}
      </main>
    </div>
  );
};

// --- Data & Types for Filtering ---

interface SimData {
  id: string;
  title: string;
  description: string;
  type: SimulationType;
  categories: string[]; // Can belong to multiple subcategories
  image: string;
  isNew?: boolean;
}

// Extensive list of simulations to fill categories
const SIMULATIONS: SimData[] = [
  // --- PHYSICS: MOTION (10 items) ---
  {
    id: 'projectile',
    title: "Projectile Motion",
    description: "Launch objects. Learn about parabolic trajectories, gravity, and kinematics.",
    type: SimulationType.PROJECTILE,
    categories: ['Motion', 'Math Applications'],
    image: getThumbnail(SimulationType.PROJECTILE),
  },
  {
    id: 'friction',
    title: "Friction Ramp",
    description: "Forces on an incline. Static vs Kinetic friction and net acceleration.",
    type: SimulationType.FRICTION,
    categories: ['Motion', 'Work, Energy & Power', 'Math Applications'],
    image: getThumbnail(SimulationType.FRICTION),
    isNew: true
  },
  {
    id: 'collision',
    title: "Collision Lab",
    description: "Investigate momentum in 1D. Elastic vs inelastic collisions.",
    type: SimulationType.COLLISION,
    categories: ['Motion', 'General Chemistry'],
    image: getThumbnail(SimulationType.COLLISION),
  },
  {
    id: 'skate',
    title: "Energy Skate Park",
    description: "Explore conservation of energy, kinetic vs potential.",
    type: SimulationType.SKATE,
    categories: ['Motion', 'Work, Energy & Power', 'Biology'],
    image: getThumbnail(SimulationType.SKATE),
  },
  {
    id: 'gravity',
    title: "Gravity Force Lab",
    description: "Visualizing gravitational force between two masses.",
    type: SimulationType.GRAVITY,
    categories: ['Motion', 'Earth & Space', 'Electricity, Magnets & Circuits'],
    image: getThumbnail(SimulationType.GRAVITY),
  },
   {
    id: 'vectors_motion',
    title: "Vector Addition",
    description: "Visualize vector math for forces and velocities.",
    type: SimulationType.VECTORS,
    categories: ['Motion', 'Math Concepts'],
    image: getThumbnail(SimulationType.VECTORS),
  },
  {
    id: 'pendulum_motion',
    title: "Pendulum Lab",
    description: "Study periodic motion and harmonic oscillation.",
    type: SimulationType.PENDULUM,
    categories: ['Motion', 'Sound & Waves'],
    image: getThumbnail(SimulationType.PENDULUM),
  },
  {
    id: 'balancing_motion',
    title: "Rotational Balance",
    description: "Torque and equilibrium in rotational systems.",
    type: SimulationType.BALANCING,
    categories: ['Motion'],
    image: getThumbnail(SimulationType.BALANCING),
  },
  {
    id: 'solar_motion',
    title: "Kepler's Laws",
    description: "Orbits and Kepler's laws of planetary motion in action.",
    type: SimulationType.SOLAR,
    categories: ['Motion', 'Earth & Space'],
    image: getThumbnail(SimulationType.SOLAR),
  },
  {
    id: 'hookes_motion',
    title: "Spring Force",
    description: "Oscillatory motion and restoring forces.",
    type: SimulationType.HOOKES,
    categories: ['Motion'],
    image: getThumbnail(SimulationType.HOOKES),
  },

  // --- PHYSICS: WAVES (8 items) ---
  {
    id: 'doppler',
    title: "Doppler Effect",
    description: "Visualize the change in frequency as a sound source moves.",
    type: SimulationType.DOPPLER,
    categories: ['Sound & Waves', 'Motion'],
    image: getThumbnail(SimulationType.DOPPLER),
    isNew: true
  },
  {
    id: 'pendulum',
    title: "Pendulum Waves",
    description: "Simple harmonic motion. Period vs length and mass.",
    type: SimulationType.PENDULUM,
    categories: ['Sound & Waves'],
    image: getThumbnail(SimulationType.PENDULUM),
  },
  {
    id: 'wave',
    title: "Wave Interference",
    description: "Water, Sound, and Light waves. Interference patterns.",
    type: SimulationType.WAVE,
    categories: ['Sound & Waves', 'Light & Radiation', 'Quantum Phenomena'],
    image: getThumbnail(SimulationType.WAVE),
  },
  {
    id: 'hookes',
    title: "Hooke's Law",
    description: "Spring force (F = -kx) and harmonic oscillation.",
    type: SimulationType.HOOKES,
    categories: ['Sound & Waves', 'Work, Energy & Power'],
    image: getThumbnail(SimulationType.HOOKES),
  },
  {
    id: 'fourier',
    title: "Fourier Series",
    description: "Building complex waves from simple sines.",
    type: SimulationType.FOURIER,
    categories: ['Sound & Waves', 'Math Concepts'],
    image: getThumbnail(SimulationType.FOURIER),
  },
  {
    id: 'refraction',
    title: "Bending Light",
    description: "Snell's Law, refraction and total internal reflection.",
    type: SimulationType.REFRACTION,
    categories: ['Light & Radiation', 'Sound & Waves', 'Math Applications'],
    image: getThumbnail(SimulationType.REFRACTION),
  },
  {
    id: 'atom_waves',
    title: "Atom Builder",
    description: "Electron orbitals and energy levels (Wave/Particle).",
    type: SimulationType.ATOM,
    categories: ['Quantum Phenomena', 'Sound & Waves', 'Light & Radiation'],
    image: getThumbnail(SimulationType.ATOM),
  },
  {
    id: 'sound_interference',
    title: "Sound Waves",
    description: "Explore constructive and destructive sound interference.",
    type: SimulationType.WAVE,
    categories: ['Sound & Waves'],
    image: getThumbnail(SimulationType.WAVE),
  },
  {
    id: 'optics_lab',
    title: "Geometric Optics",
    description: "Trace light rays through different media.",
    type: SimulationType.REFRACTION,
    categories: ['Light & Radiation'],
    image: getThumbnail(SimulationType.REFRACTION),
  },

  // --- PHYSICS: ELECTRICITY (6 items) ---
  {
    id: 'circuit',
    title: "Circuit Lab",
    description: "Build circuits. Explore Ohm's Law (V=IR).",
    type: SimulationType.CIRCUIT,
    categories: ['Electricity, Magnets & Circuits', 'Work, Energy & Power'],
    image: getThumbnail(SimulationType.CIRCUIT),
  },
  {
    id: 'coulomb',
    title: "Coulomb's Law",
    description: "Electric force between charges (Inverse Square Law).",
    type: SimulationType.COULOMB, 
    categories: ['Electricity, Magnets & Circuits', 'General Chemistry'],
    image: getThumbnail(SimulationType.COULOMB),
  },
  {
    id: 'charged_spring_elec',
    title: "Electric Fields",
    description: "Forces on charges in uniform electric fields.",
    type: SimulationType.CHARGED_SPRING,
    categories: ['Electricity, Magnets & Circuits'],
    image: getThumbnail(SimulationType.CHARGED_SPRING),
  },
  {
    id: 'ions_builder',
    title: "Ion Builder",
    description: "Create charged ions by adding/removing electrons.",
    type: SimulationType.ATOM,
    categories: ['Electricity, Magnets & Circuits', 'General Chemistry'],
    image: getThumbnail(SimulationType.ATOM),
  },
  {
    id: 'battery_resistor',
    title: "Battery & Resistor",
    description: "Simple DC circuit analysis.",
    type: SimulationType.CIRCUIT,
    categories: ['Electricity, Magnets & Circuits'],
    image: getThumbnail(SimulationType.CIRCUIT),
  },
  {
    id: 'static_force',
    title: "Static Electricity",
    description: "Attraction and repulsion of charges.",
    type: SimulationType.COULOMB,
    categories: ['Electricity, Magnets & Circuits'],
    image: getThumbnail(SimulationType.COULOMB),
  },

  // --- CHEMISTRY (8 items) ---
  {
    id: 'ph',
    title: "pH Scale",
    description: "Test acidity and basicity of liquids. H+ vs OH- ions.",
    type: SimulationType.PH_SCALE,
    categories: ['General Chemistry', 'Biology'],
    image: getThumbnail(SimulationType.PH_SCALE),
  },
  {
    id: 'gas',
    title: "Gas Properties",
    description: "Ideal Gas Law (PV=nRT), heat, and pressure.",
    type: SimulationType.GAS,
    categories: ['General Chemistry', 'Heat & Thermo', 'Earth & Space'],
    image: getThumbnail(SimulationType.GAS),
  },
  {
    id: 'atom',
    title: "Atom Builder",
    description: "Build atoms from protons, neutrons, electrons.",
    type: SimulationType.ATOM,
    categories: ['General Chemistry', 'Quantum Chemistry'],
    image: getThumbnail(SimulationType.ATOM),
  },
  {
    id: 'isotopes',
    title: "Isotopes & Stability",
    description: "Nuclear stability and neutron/proton ratios.",
    type: SimulationType.ATOM,
    categories: ['General Chemistry', 'Quantum Chemistry'],
    image: getThumbnail(SimulationType.ATOM),
  },
  {
    id: 'collision_chem',
    title: "Reaction Kinetics",
    description: "Particle collisions and energy transfer.",
    type: SimulationType.COLLISION,
    categories: ['General Chemistry', 'Heat & Thermo'],
    image: getThumbnail(SimulationType.COLLISION),
  },
  {
    id: 'molecular_polarity',
    title: "Charge Interactions",
    description: "Ionic interactions modeled via Coulomb's Law.",
    type: SimulationType.COULOMB,
    categories: ['General Chemistry'],
    image: getThumbnail(SimulationType.COULOMB),
  },
  {
    id: 'spectrum',
    title: "Atomic Spectra",
    description: "Light emission and wave properties.",
    type: SimulationType.WAVE,
    categories: ['General Chemistry', 'Quantum Chemistry'],
    image: getThumbnail(SimulationType.WAVE),
  },
  {
    id: 'diffusion',
    title: "Diffusion",
    description: "Random motion of gas particles.",
    type: SimulationType.GAS,
    categories: ['General Chemistry'],
    image: getThumbnail(SimulationType.GAS),
  },
  
  // --- MATH (10 items) ---
  {
    id: 'graphing',
    title: "Graphing Lines",
    description: "Slope-intercept form of linear equations.",
    type: SimulationType.GRAPHING,
    categories: ['Math Concepts', 'Math Applications'],
    image: getThumbnail(SimulationType.GRAPHING),
  },
  {
    id: 'vectors_math',
    title: "Vector Addition",
    description: "Summing vectors geometrically (Head-to-Tail).",
    type: SimulationType.VECTORS,
    categories: ['Math Concepts', 'Math Applications'],
    image: getThumbnail(SimulationType.VECTORS),
  },
  {
    id: 'fourier_math',
    title: "Fourier Series",
    description: "Infinite series and harmonic functions.",
    type: SimulationType.FOURIER,
    categories: ['Math Concepts', 'Math Applications'],
    image: getThumbnail(SimulationType.FOURIER),
  },
  {
    id: 'population_math',
    title: "Exponential Growth",
    description: "Logistic and exponential functions in nature.",
    type: SimulationType.POPULATION,
    categories: ['Math Applications', 'Math Concepts'],
    image: getThumbnail(SimulationType.POPULATION),
  },
  {
    id: 'balancing_math',
    title: "Balancing Equations",
    description: "Algebra of torque equations.",
    type: SimulationType.BALANCING,
    categories: ['Math Concepts', 'Math Applications'],
    image: getThumbnail(SimulationType.BALANCING),
  },
  {
    id: 'parabola_lab',
    title: "Parabolas",
    description: "Quadratic functions via projectile trajectories.",
    type: SimulationType.PROJECTILE,
    categories: ['Math Applications'],
    image: getThumbnail(SimulationType.PROJECTILE),
  },
  {
    id: 'linear_spring',
    title: "Linear Relations",
    description: "Proportional relationships (F = kx).",
    type: SimulationType.HOOKES,
    categories: ['Math Concepts'],
    image: getThumbnail(SimulationType.HOOKES),
  },
  {
    id: 'inverse_square',
    title: "Inverse Square Law",
    description: "Graphing 1/x² relationships in gravity.",
    type: SimulationType.GRAVITY,
    categories: ['Math Applications'],
    image: getThumbnail(SimulationType.GRAVITY),
  },
  {
    id: 'proportionality',
    title: "Proportionality",
    description: "Exploring V = IR linear relationships.",
    type: SimulationType.CIRCUIT,
    categories: ['Math Applications'],
    image: getThumbnail(SimulationType.CIRCUIT),
  },
  {
    id: 'probability',
    title: "Probability & Chance",
    description: "Random selection and genetic probability.",
    type: SimulationType.SELECTION,
    categories: ['Math Concepts', 'Math Applications'],
    image: getThumbnail(SimulationType.SELECTION),
  },

  // --- BIOLOGY (8 items) ---
  {
    id: 'selection',
    title: "Natural Selection",
    description: "Survival of the fittest. Camouflage and predation.",
    type: SimulationType.SELECTION,
    categories: ['Biology', 'Math Applications'],
    image: getThumbnail(SimulationType.SELECTION),
  },
  {
    id: 'population',
    title: "Population Growth",
    description: "Carrying capacity and reproduction rates.",
    type: SimulationType.POPULATION,
    categories: ['Biology', 'Math Applications'],
    image: getThumbnail(SimulationType.POPULATION),
  },
   {
    id: 'ph_bio',
    title: "pH in Biology",
    description: "Acidity in biological systems (Blood, Stomach).",
    type: SimulationType.PH_SCALE,
    categories: ['Biology', 'General Chemistry'],
    image: getThumbnail(SimulationType.PH_SCALE),
  },
  {
    id: 'vision_optics',
    title: "Eye Optics",
    description: "Refraction of light for vision.",
    type: SimulationType.REFRACTION,
    categories: ['Biology', 'Light & Radiation'],
    image: getThumbnail(SimulationType.REFRACTION),
  },
  {
    id: 'neurons',
    title: "Neuron Circuits",
    description: "Electrical impulses in the nervous system.",
    type: SimulationType.CIRCUIT,
    categories: ['Biology', 'Electricity, Magnets & Circuits'],
    image: getThumbnail(SimulationType.CIRCUIT),
  },
  {
    id: 'respiration',
    title: "Gas Exchange",
    description: "Diffusion of gases in respiration.",
    type: SimulationType.GAS,
    categories: ['Biology'],
    image: getThumbnail(SimulationType.GAS),
  },
  {
    id: 'metabolism',
    title: "Energy Balance",
    description: "Energy intake and usage (conservation models).",
    type: SimulationType.SKATE,
    categories: ['Biology'],
    image: getThumbnail(SimulationType.SKATE),
  },
  {
    id: 'enzyme_kinetics',
    title: "Molecule Collision",
    description: "Random motion and interaction of biological molecules.",
    type: SimulationType.COLLISION,
    categories: ['Biology'],
    image: getThumbnail(SimulationType.COLLISION),
  },

  // --- EARTH & SPACE (7 items) ---
  {
    id: 'solar',
    title: "Orbital Gravity",
    description: "N-body gravitational systems and planetary motion.",
    type: SimulationType.SOLAR,
    categories: ['Earth & Space', 'Motion'],
    image: getThumbnail(SimulationType.SOLAR),
  },
  {
    id: 'gas_space',
    title: "Atmospheric Gases",
    description: "Gas behavior in atmospheres.",
    type: SimulationType.GAS,
    categories: ['Earth & Space'],
    image: getThumbnail(SimulationType.GAS),
  },
  {
    id: 'gravity_space',
    title: "Gravity Force",
    description: "Universal gravitation between planets.",
    type: SimulationType.GRAVITY,
    categories: ['Earth & Space', 'Motion'],
    image: getThumbnail(SimulationType.GRAVITY),
  },
  {
    id: 'seismic',
    title: "Seismic Waves",
    description: "Wave propagation through mediums.",
    type: SimulationType.WAVE,
    categories: ['Earth & Space'],
    image: getThumbnail(SimulationType.WAVE),
  },
  {
    id: 'atmosphere_optics',
    title: "Atmospheric Optics",
    description: "Refraction in the atmosphere.",
    type: SimulationType.REFRACTION,
    categories: ['Earth & Space'],
    image: getThumbnail(SimulationType.REFRACTION),
  },
  {
    id: 'ballistics_space',
    title: "Rocket Ballistics",
    description: "Launch trajectories.",
    type: SimulationType.PROJECTILE,
    categories: ['Earth & Space'],
    image: getThumbnail(SimulationType.PROJECTILE),
  },
  {
    id: 'pendulum_earth',
    title: "Gravity & Pendulums",
    description: "Measuring local gravity (g) with pendulums.",
    type: SimulationType.PENDULUM,
    categories: ['Earth & Space'],
    image: getThumbnail(SimulationType.PENDULUM),
  },

  // --- INTEGRATED CHALLENGES (2 items) ---
  {
    id: 'ballistic',
    title: "Ballistic Pendulum",
    description: "Combine Momentum and Energy conservation to solve a collision problem.",
    type: SimulationType.BALLISTIC,
    categories: ['Integrated Challenges', 'Motion', 'Work, Energy & Power'],
    image: getThumbnail(SimulationType.BALLISTIC),
    isNew: true
  },
  {
    id: 'charged_spring',
    title: "Charged Spring",
    description: "Forces mastery: Combine Electric Fields, Gravity, and Spring Forces.",
    type: SimulationType.CHARGED_SPRING,
    categories: ['Integrated Challenges', 'Electricity, Magnets & Circuits', 'Work, Energy & Power'],
    image: getThumbnail(SimulationType.CHARGED_SPRING),
    isNew: true
  },
];

// Sidebar Tree Data
interface CategoryNode {
  label: string;
  children?: CategoryNode[];
}

const CATEGORY_TREE: CategoryNode[] = [
  {
    label: "Physics",
    children: [
      { label: "Motion" },
      { label: "Sound & Waves" },
      { label: "Work, Energy & Power" },
      { label: "Heat & Thermo" },
      { label: "Light & Radiation" },
      { label: "Electricity, Magnets & Circuits" },
      { label: "Quantum Phenomena" }
    ]
  },
  {
    label: "Math & Statistics",
    children: [
      { label: "Math Concepts" },
      { label: "Math Applications" }
    ]
  },
  {
    label: "Chemistry",
    children: [
      { label: "General Chemistry" },
      { label: "Quantum Chemistry" }
    ]
  },
  {
    label: "Earth & Space",
    children: [] 
  },
  {
    label: "Biology",
    children: [] 
  },
  {
    label: "Integrated Challenges",
    children: []
  },
];

const Library: React.FC<{ setView: (t: SimulationType) => void }> = ({ setView }) => {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Helper to get all leaf categories under a node
  const getLeafCategories = (node: CategoryNode): string[] => {
    if (!node.children || node.children.length === 0) return [node.label];
    return node.children.flatMap(getLeafCategories);
  };

  const toggleFilter = (label: string, node?: CategoryNode) => {
    const newFilters = new Set(activeFilters);
    const leafCats = node ? getLeafCategories(node) : [label];

    // Check if fully selected
    const isSelected = leafCats.every(c => newFilters.has(c));

    if (isSelected) {
      leafCats.forEach(c => newFilters.delete(c));
    } else {
      leafCats.forEach(c => newFilters.add(c));
    }
    setActiveFilters(newFilters);
  };

  // Reset to first page when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters, searchQuery]);

  const filteredSimulations = useMemo(() => {
    let result = SIMULATIONS;

    // Category Filter
    if (activeFilters.size > 0) {
        result = result.filter(sim => 
            sim.categories.some(cat => activeFilters.has(cat) || activeFilters.has(sim.categories[0])) 
        );
    }

    // Search Filter
    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        result = result.filter(sim => 
            sim.title.toLowerCase().includes(q) || 
            sim.description.toLowerCase().includes(q)
        );
    }
    
    return result;
  }, [activeFilters, searchQuery]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredSimulations.length / ITEMS_PER_PAGE);
  const paginatedSimulations = filteredSimulations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Recursive render for Sidebar
  const renderCategory = (node: CategoryNode, depth = 0) => {
    const leafCats = getLeafCategories(node);
    const isChecked = leafCats.every(c => activeFilters.has(c));
    const isIndeterminate = leafCats.some(c => activeFilters.has(c)) && !isChecked;

    return (
      <div key={node.label} className={`ml-${depth * 4} mb-1`}>
        <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
          <input 
            type="checkbox"
            checked={isChecked}
            ref={input => { if (input) input.indeterminate = isIndeterminate; }}
            onChange={() => toggleFilter(node.label, node)}
            className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
          />
          <span className={`text-sm ${depth === 0 ? 'font-bold text-gray-800' : 'text-gray-600'}`}>
            {node.label}
          </span>
        </label>
        {node.children && node.children.map(child => renderCategory(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* Sidebar Filter */}
      <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
             <span>SUBJECT</span>
             <button onClick={() => setActiveFilters(new Set())} className="text-xs font-normal text-brand-600 hover:underline">Clear</button>
          </h3>
          <div className="space-y-1">
            {CATEGORY_TREE.map(node => renderCategory(node))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-end gap-4">
          <div>
             <h1 className="text-3xl font-extrabold text-gray-900">Simulation Library</h1>
             <p className="text-gray-600 mt-1">
               {filteredSimulations.length} interactive simulations
             </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Search simulations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 min-h-[600px] content-start">
          {paginatedSimulations.map(sim => (
            <SimulationCard 
              key={sim.id}
              title={sim.title}
              description={sim.description}
              type={sim.type}
              image={sim.image}
              isNew={sim.isNew}
              onClick={setView}
            />
          ))}
          
          {filteredSimulations.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border-2 border-dashed border-gray-200 h-fit">
               <p className="text-lg">No simulations found.</p>
               <button onClick={() => { setActiveFilters(new Set()); setSearchQuery(""); }} className="mt-2 text-brand-600 font-bold hover:underline">Clear Filters & Search</button>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-2 py-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50 font-medium text-sm transition-colors"
            >
              Previous
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors text-sm ${
                    currentPage === page
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50 font-medium text-sm transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
