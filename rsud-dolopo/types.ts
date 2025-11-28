export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  image: string;
  schedule: string;
  available: boolean;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum NavLink {
  HOME = '/',
  DOCTORS = '/doctors',
  SERVICES = '/services',
  CONTACT = '/contact'
}