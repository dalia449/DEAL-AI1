/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { I18nProvider, useI18n } from './lib/i18n';
import { DealLogo } from './components/DealLogo';
import { AuthScreen } from './components/AuthScreen';
import { DashboardView } from './components/DashboardView';
import { ThreeDStudio } from './components/ThreeDStudio';
import { FloorPlanEditor } from './components/FloorPlanEditor';
import { SiteAnalysisStudio } from './components/SiteAnalysisStudio';
import { PaperTo3DStudio } from './components/PaperTo3DStudio';
import { HandTrackingStudio } from './components/HandTrackingStudio';
import { AIAssistantStudio } from './components/AIAssistantStudio';
import { FurnitureStudio } from './components/FurnitureStudio';
import { MaterialsStudio } from './components/MaterialsStudio';
import { ClientPresentationStudio } from './components/ClientPresentationStudio';
import { ReportGeneratorStudio } from './components/ReportGeneratorStudio';
import { TemplatesStudio } from './components/TemplatesStudio';
import { SmartCityStudio } from './components/SmartCityStudio';
import { ContactStudio } from './components/ContactStudio';
import { AdminDashboard } from './components/AdminDashboard';
import { NewProjectModal } from './components/NewProjectModal';
import { INITIAL_PROJECTS } from './data/mockProjects';
import { ArchitecturalProject, CADElement, ClientFeedback, ProjectVersion, UserSession } from './types';
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  Compass,
  FileCode2,
  Box,
  Hand,
  Sparkles,
  Armchair,
  Palette,
  Eye,
  FileText,
  BookmarkCheck,
  Globe2,
  Settings,
  Mail,
  LogOut,
  User,
  Search,
  Bell,
  Languages,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

export function AppContent() {
  const { t, lang, setLang, isRTL } = useI18n();

  // Authentication State
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('deal_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Projects State
  const [projects, setProjects] = useState<ArchitecturalProject[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>(INITIAL_PROJECTS[0].id);

  // Active Navigation Section
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Hand tracking external gesture state shared with 3D studio
  const [lastGesture, setLastGesture] = useState<any>(null);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  const handleLoginSuccess = (session: UserSession) => {
    setUserSession(session);
    localStorage.setItem('deal_session', JSON.stringify(session));
  };

  const handleSignOut = () => {
    setUserSession(null);
    localStorage.removeItem('deal_session');
    setActiveSection('dashboard');
  };

  const handleCreateProject = (newProj: ArchitecturalProject) => {
    setProjects(prev => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
    setActiveSection('3d');
  };

  const handleUpdateProject = (updated: ArchitecturalProject) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  // If not authenticated, render login
  if (!userSession) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // If user is Owner and navigated to admin
  if (activeSection === 'admin' && userSession.role === 'owner') {
    return (
      <AdminDashboard onBackToApp={() => setActiveSection('dashboard')} />
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#FAF7F2] overflow-hidden text-[#3F3832]">
      {/* LEFT SIDEBAR (Architectural & Minimal) */}
      <aside className="w-64 bg-[#EFE6DA] border-r border-[#D8CEC2] flex flex-col justify-between flex-shrink-0 z-20 select-none">
        <div>
          {/* DEAL Official Brand Logo in Sidebar */}
          <div className="p-4 border-b border-[#D8CEC2] flex items-center justify-between">
            <DealLogo variant="horizontal" size="sm" />
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] text-xs font-medium">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeSection === 'dashboard'
                  ? 'bg-[#54483C] text-[#FAF7F2]'
                  : 'text-[#3F3832] hover:bg-[#FAF7F2]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t('navDashboard')}</span>
            </button>

            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left text-[#54483C] hover:bg-[#FAF7F2] font-semibold"
            >
              <PlusCircle className="w-4 h-4 text-[#54483C]" />
              <span>{t('navNewProject')}</span>
            </button>

            <div className="pt-2 pb-1 px-3 text-[10px] uppercase font-bold tracking-widest text-[#756A60]">
              Architectural Studio
            </div>

            <button
              onClick={() => setActiveSection('site')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeSection === 'site'
                  ? 'bg-[#54483C] text-[#FAF7F2]'
                  : 'text-[#3F3832] hover:bg-[#FAF7F2]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{t('navSiteAnalysis')}</span>
            </button>

            <button
              onClick={() => setActiveSection('cad')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeSection === 'cad'
                  ? 'bg-[#54483C] text-[#FAF7F2]'
                  : 'text-[#3F3832] hover:bg-[#FAF7F2]'
              }`}
            >
              <FileCode2 className="w-4 h-4" />
              <span>{t('navFloorPlans')}</span>
            </button>

            <button
              onClick={() => setActiveSection('paper')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeSection === 'paper'
                  ? 'bg-[#54483C] text-[#FAF7F2]'
                  : 'text-[#3F3832] hover:bg-[#FAF7F2]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('paperToDigital')}</span>
            </button>

            <button
              onClick={() => setActiveSection('3d')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeSection === '3d'
                  ? 'bg-[#54483C] text-[#FAF7F2]'
                  : 'text-[#3F3832] hover:bg-[#FAF7F2]'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>{t('nav3DStudio')}</span>
            </button>

            <button
              onClick={() => setActiveSection('hand')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeSection === 'hand'
                  ? 'bg-[#54483C] text-[#FAF7F2]'
                  : 'text-[#3F3832] hover:bg-[#FAF7F2]'
              }`}
            >
              <Hand className="w-4 h-4" />
              <span>{t('navHandTracking')}</span>
            </button>

            <button
              onClick={() => setActiveSection('ai')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeSection === 'ai'
                  ? 'bg-[#54483C] text-[#FAF7F2]'
                  : 'text-[#3F3832] hover:bg-[#FAF7F2]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('navAIAssistant')}</span>
            </button>

            <button
              onClick={() => setActiveSection('furniture')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeSection === 'furniture'
                  ? 'bg-[#54483C] text-[#FAF7F2]'
                  : 'text-[#3F3832] hover:bg-[#FAF7F2]'
              }`}
            >
              <Armchair className="w-4 h-4" />
              <span>{t('navFurniture')}</span>
            </button>

            <button
              onClick={() => setActiveSection('materials')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeSection === 'materials'
                  ? 'bg-[#54483C] text-[#FAF7F2]'
                  : 'text-[#3F3832] hover:bg-[#FAF7F2]'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>{t('navMaterials')}</span>
            </button>

            <button
              onClick={() => setActiveSection('client')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeSection === 'client'
                  ? 'bg-[#54483C] text-[#FAF7F2]'
                  : 'text-[#3F3832] hover:bg-[#FAF7F2]'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{t('navClientCollab')}</span>
            </button>

            <button
              onClick={() => setActiveSection('reports')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeSection === 'reports'
                  ? 'bg-[#54483C] text-[#FAF7F2]'
                  : 'text-[#3F3832] hover:bg-[#FAF7F2]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t('navReports')}</span>
            </button>

            <button
              onClick={() => setActiveSection('templates')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeSection === 'templates'
                  ? 'bg-[#54483C] text-[#FAF7F2]'
                  : 'text-[#3F3832] hover:bg-[#FAF7F2]'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{t('navTemplates')}</span>
            </button>

            <button
              onClick={() => setActiveSection('smartcity')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeSection === 'smartcity'
                  ? 'bg-[#54483C] text-[#FAF7F2]'
                  : 'text-[#3F3832] hover:bg-[#FAF7F2]'
              }`}
            >
              <Globe2 className="w-4 h-4" />
              <span>{t('navSmartCity')}</span>
            </button>

            <button
              onClick={() => setActiveSection('contact')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeSection === 'contact'
                  ? 'bg-[#54483C] text-[#FAF7F2]'
                  : 'text-[#3F3832] hover:bg-[#FAF7F2]'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>{t('navContact')}</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom Profile & Language & Owner Portal */}
        <div className="p-3 border-t border-[#D8CEC2] bg-[#EAE1D5]/60 text-xs space-y-2">
          {/* Owner Role Secret Entrance (Only shown when authenticated as Owner) */}
          {userSession.role === 'owner' && (
            <button
              onClick={() => setActiveSection('admin')}
              className="w-full py-1.5 px-2 bg-[#54483C] text-[#FAF7F2] rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>{t('navAdmin')} (Dalia Al Waqtan)</span>
            </button>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#54483C] text-[#FAF7F2] flex items-center justify-center font-bold text-xs">
                {userSession.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[#3F3832] truncate max-w-[110px]">
                  {userSession.name}
                </span>
                <span className="text-[10px] text-[#756A60] capitalize">
                  {userSession.role === 'owner' ? t('ownerRole') : t('engineerRole')}
                </span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="p-1.5 rounded hover:bg-[#D8CEC2] text-[#756A60] hover:text-[#54483C]"
              title={t('signOut')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN VIEW AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* TOP BAR */}
        <header className="h-14 bg-[#FAF7F2] border-b border-[#D8CEC2] px-6 flex items-center justify-between z-10">
          {/* Active Project Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#756A60] hidden sm:inline">Active Project:</span>
            <select
              value={activeProjectId}
              onChange={(e) => setActiveProjectId(e.target.value)}
              className="bg-[#EFE6DA] border border-[#D8CEC2] rounded px-2.5 py-1 text-xs font-semibold text-[#54483C] focus:outline-none focus:border-[#54483C]"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.buildingType})
                </option>
              ))}
            </select>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Bilingual Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="px-3 py-1 bg-[#EFE6DA] border border-[#D8CEC2] rounded text-xs font-medium text-[#54483C] hover:bg-[#D8CEC2] transition-colors flex items-center gap-1.5"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>
          </div>
        </header>

        {/* Dynamic Section Rendering */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeSection === 'dashboard' && (
            <DashboardView
              projects={projects}
              onOpenProject={(proj) => {
                setActiveProjectId(proj.id);
                setActiveSection('3d');
              }}
              onNewProjectClick={() => setIsNewProjectModalOpen(true)}
              onNavigateSection={(sec) => setActiveSection(sec)}
            />
          )}

          {activeSection === 'site' && (
            <SiteAnalysisStudio
              project={activeProject}
              onSelectOption={(optId) => {
                const updated = {
                  ...activeProject,
                  siteData: { ...activeProject.siteData, selectedOptionId: optId }
                };
                handleUpdateProject(updated);
              }}
              onOpen3DView={() => setActiveSection('3d')}
            />
          )}

          {activeSection === 'cad' && (
            <FloorPlanEditor
              project={activeProject}
              onUpdateElements={(elems) => {
                handleUpdateProject({ ...activeProject, elements: elems });
              }}
              onOpen3DView={() => setActiveSection('3d')}
            />
          )}

          {activeSection === 'paper' && (
            <PaperTo3DStudio
              onApplyPlanToProject={(elems) => {
                handleUpdateProject({ ...activeProject, elements: elems });
              }}
              onOpen3DView={() => setActiveSection('3d')}
            />
          )}

          {activeSection === '3d' && (
            <ThreeDStudio
              project={activeProject}
              onUpdateProject={handleUpdateProject}
              externalGesture={lastGesture}
            />
          )}

          {activeSection === 'hand' && (
            <HandTrackingStudio
              project={activeProject}
              onGestureTrigger={(gesture) => setLastGesture(gesture)}
              onAddWallByHand={(start, end) => {
                const newWall: CADElement = {
                  id: `wall-hand-${Date.now()}`,
                  type: 'wall',
                  x: Math.round(start.x / 40),
                  y: Math.round(start.y / 40),
                  width: Math.max(0.3, Math.abs(end.x - start.x) / 40),
                  length: Math.max(0.3, Math.abs(end.y - start.y) / 40),
                  rotation: 0,
                  label: 'Wall Created via Hand Motion'
                };
                handleUpdateProject({
                  ...activeProject,
                  elements: [...activeProject.elements, newWall]
                });
              }}
            />
          )}

          {activeSection === 'ai' && (
            <AIAssistantStudio
              project={activeProject}
              onApplyModification={(details) => {
                const newVer: ProjectVersion = {
                  id: `ver-${Date.now()}`,
                  versionName: `v${activeProject.versions.length + 1}.0 AI Synthesis`,
                  timestamp: new Date().toISOString().split('T')[0],
                  author: 'DEAL AI Assistant',
                  description: details
                };
                handleUpdateProject({
                  ...activeProject,
                  versions: [...activeProject.versions, newVer]
                });
              }}
              onOpen3DView={() => setActiveSection('3d')}
            />
          )}

          {activeSection === 'furniture' && (
            <FurnitureStudio
              project={activeProject}
              onAddFurnitureToProject={(item) => {
                const newFurn: CADElement = {
                  id: `furn-${Date.now()}`,
                  type: 'furniture',
                  x: 10,
                  y: 5,
                  width: 2.4,
                  length: 1.8,
                  rotation: 0,
                  label: item.name
                };
                handleUpdateProject({
                  ...activeProject,
                  elements: [...activeProject.elements, newFurn]
                });
              }}
              onOpen3DView={() => setActiveSection('3d')}
            />
          )}

          {activeSection === 'materials' && (
            <MaterialsStudio
              project={activeProject}
              onUpdateProject={handleUpdateProject}
              onOpen3DView={() => setActiveSection('3d')}
            />
          )}

          {activeSection === 'client' && (
            <ClientPresentationStudio
              project={activeProject}
              onAddComment={(comm) => {
                handleUpdateProject({
                  ...activeProject,
                  clientComments: [comm, ...activeProject.clientComments]
                });
              }}
              onRestoreVersion={(ver) => {
                alert(`Restored snapshot: ${ver.versionName}`);
                setActiveSection('3d');
              }}
            />
          )}

          {activeSection === 'reports' && (
            <ReportGeneratorStudio project={activeProject} />
          )}

          {activeSection === 'templates' && (
            <TemplatesStudio
              onLoadTemplate={(tmpl) => {
                const importedProj: ArchitecturalProject = {
                  ...activeProject,
                  name: tmpl.title,
                  buildingType: tmpl.category,
                  facadeStyle: tmpl.facade,
                  thumbnail: tmpl.image
                };
                handleUpdateProject(importedProj);
              }}
              onOpen3DView={() => setActiveSection('3d')}
            />
          )}

          {activeSection === 'smartcity' && <SmartCityStudio />}

          {activeSection === 'contact' && <ContactStudio />}
        </main>
      </div>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
