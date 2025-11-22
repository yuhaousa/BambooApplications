
export enum SimulationType {
  HOME = 'HOME',
  PROJECTILE = 'PROJECTILE',
  PENDULUM = 'PENDULUM',
  HOOKES = 'HOOKES',
  BALANCING = 'BALANCING',
  SOLAR = 'SOLAR',
  COLLISION = 'COLLISION',
  GRAVITY = 'GRAVITY',
  GAS = 'GAS',
  GRAPHING = 'GRAPHING',
  WAVE = 'WAVE',
  CIRCUIT = 'CIRCUIT',
  ATOM = 'ATOM',
  SKATE = 'SKATE',
  POPULATION = 'POPULATION',
  FRICTION = 'FRICTION',
  REFRACTION = 'REFRACTION',
  VECTORS = 'VECTORS',
  PH_SCALE = 'PH_SCALE',
  SELECTION = 'SELECTION',
  FOURIER = 'FOURIER',
  BALLISTIC = 'BALLISTIC',
  CHARGED_SPRING = 'CHARGED_SPRING',
  COULOMB = 'COULOMB',
  DOPPLER = 'DOPPLER'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface SimContextData {
  name: string;
  parameters: Record<string, string | number>;
  description: string;
}
