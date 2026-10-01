export type ProjectType =
  | 'Residential'
  | 'Villa'
  | 'Apartment'
  | 'Commercial'
  | 'Office'
  | 'Hospitality'
  | 'Mixed Use'
  | 'Other';

export type ProjectStatus = 'draft' | 'in_progress' | 'client_review' | 'completed';

export interface CADElement {
  id: string;
  type: 'wall' | 'door' | 'window' | 'room' | 'column' | 'stairs' | 'furniture';
  x: number;
  y: number;
  width: number;
  length: number;
  height?: number;
  rotation: number;
  label?: string;
  color?: string;
  material?: string;
}

export interface SiteAnalysisData {
  parcelArea: number;
  usableArea: number;
  orientation: string;
  roadAccess: string;
  topography: string;
  solarIndex: number;
  ventilationScore: number;
  selectedOptionId: string;
  options: Array<{
    id: string;
    title: string;
    tagline: string;
    utilization: string;
    footprint: string;
    pros: string[];
    cons: string[];
  }>;
}

export interface ProjectVersion {
  id: string;
  versionName: string;
  timestamp: string;
  author: string;
  description: string;
}

export interface ClientFeedback {
  id: string;
  author: string;
  text: string;
  date: string;
  areaRef?: string;
  status: 'pending' | 'resolved';
}

export interface ArchitecturalProject {
  id: string;
  name: string;
  clientName: string;
  projectType: ProjectType;
  location: string;
  landArea: number;
  buildingType: string;
  floors: number;
  status: ProjectStatus;
  updatedAt: string;
  thumbnail: string;
  siteData: SiteAnalysisData;
  elements: CADElement[];
  wallHeight: number;
  wallThickness: number;
  facadeStyle: 'Travertine Stone' | 'Fair-Faced Concrete' | 'Cedar Wood Louvers' | 'Textured Stucco';
  roofStyle: 'Flat Modern Parapet' | 'Cantilevered Eaves' | 'Pergola Terrace' | 'Sloped Zinc';
  flooringMaterial: 'Natural Limestone' | 'Italian White Marble' | 'Warm White Oak' | 'Polished Terrazzo';
  exteriorColor: string;
  interiorLighting: 'Warm 3000K' | 'Neutral 4000K' | 'Sunset Golden';
  versions: ProjectVersion[];
  clientComments: ClientFeedback[];
  isDemo?: boolean;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'engineer' | 'client';
  isVerified: boolean;
  token?: string;
}
