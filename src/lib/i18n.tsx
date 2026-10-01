import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface I18nContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Identity
    brandName: 'DEAL',
    brandTagline: 'Design • Engineering • Architecture • Living',
    brandSubtitle: 'AI-Powered Engineering & Architectural Design Platform',
    motto: 'Transforming architectural concepts into tangible 3D reality.',
    
    // Nav & Sidebar
    navDashboard: 'Dashboard',
    navProjects: 'Projects',
    navNewProject: 'New Project',
    navSiteAnalysis: 'Site & Land Analysis',
    navFloorPlans: 'Floor Plan Editor',
    nav3DStudio: '3D Design Studio',
    navHandTracking: 'Hand Tracking',
    navAIAssistant: 'AI Design Assistant',
    navFurniture: 'Furniture 3D Generator',
    navMaterials: 'Materials & Colors',
    navClientCollab: 'Client Presentation',
    navReports: 'Report Generator',
    navTemplates: 'Templates & Demos',
    navSmartCity: 'DEAL Smart City',
    navSettings: 'Platform Settings',
    navContact: 'Contact & Support',
    navAdmin: 'Owner Portal',
    
    // Auth
    signIn: 'Sign In',
    createAccount: 'Create Account',
    forgotPassword: 'Forgot Password?',
    emailAddress: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    enterCode: 'Enter 6-Digit Verification Code',
    verifyEmail: 'Verify Email',
    emailSentNotice: 'A verification code has been dispatched to your email.',
    backToLogin: 'Back to Sign In',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    resendCode: 'Resend Code',
    resetPasswordBtn: 'Reset Password',
    newPasswordLabel: 'New Password',
    signOut: 'Sign Out',
    demoQuickLogin: 'Quick Demo Access',
    engineerRole: 'Architectural Engineer',
    ownerRole: 'DEAL Founder & Owner',

    // Dashboard
    welcomeBack: 'Welcome back',
    dashboardOverview: 'Architectural Project Control Center',
    recentProjects: 'Recent Projects',
    draftProjects: 'Draft Projects',
    inProgress: 'In Progress',
    clientReview: 'Client Review',
    completed: 'Completed',
    quickActions: 'Quick Actions',
    actionNewProject: 'Create New Project',
    actionAnalyzeLand: 'Analyze Land Parcel',
    actionUploadDrawing: 'Upload Paper Drawing',
    actionStart3D: 'Launch 3D Studio',
    actionHandTracking: 'Start Hand Tracking',
    actionGenerateReport: 'Generate Report',
    openProject: 'Open Project',
    viewDetails: 'View Details',
    duplicate: 'Duplicate',
    exportDoc: 'Export Report',

    // Site Analysis
    siteTitle: 'Site & Land Parcel Analysis',
    siteSubtitle: 'Photogrammetric zoning, environmental microclimate, and conceptual building placement',
    uploadSitePhoto: 'Upload Site Photo or Aerial Survey',
    takeCameraPhoto: 'Capture Land with Camera',
    analyzeLandBtn: 'Run AI Land Analysis',
    landBoundaries: 'Land Boundaries',
    approxDimensions: 'Approximate Dimensions',
    availableArea: 'Total Parcel Area',
    potentialBuildingZone: 'Potential Building Zone',
    orientation: 'Solar Orientation',
    accessPoints: 'Access Points & Roadway',
    surroundings: 'Surrounding Topography',
    placementOptions: 'Conceptual Building Placement Options',
    optionA: 'Option A — Maximum Usable Area',
    optionB: 'Option B — Central Courtyard & Bio-Oasis',
    optionC: 'Option C — Wind-Funnel & Natural Daylighting',
    optionD: 'Option D — Passive Solar & Net-Zero',
    compareOptions: 'Compare Options',
    selectOption: 'Select Placement',
    applyToProject: 'Apply to 3D Scene',
    disclaimerEngineering: 'Notice: Preliminary AI design suggestions for conceptual exploration. Not certified engineering, structural, surveying, geotechnical, or regulatory decisions.',

    // Floor Plan
    cadTitle: 'Interactive Architectural Floor Plan Editor',
    cadSubtitle: 'Draw walls, openings, dimensions, and generate parametric 3D models',
    toolWall: 'Wall',
    toolDoor: 'Door',
    toolWindow: 'Window',
    toolRoom: 'Room',
    toolColumn: 'Column',
    toolStairs: 'Stairs',
    toolFurniture: 'Furniture',
    toolDimension: 'Dimension',
    toolText: 'Text Label',
    toolMeasure: 'Measure',
    toolSelect: 'Select',
    toolDelete: 'Delete',
    snapToGrid: 'Snap to Grid',
    scale100: 'Scale 1:100',
    convertTo3D: 'Generate 3D Model',
    paperToDigital: 'Scan Paper Sketch → 3D',

    // Paper to 3D
    paperTitle: 'Paper Drawing → Digital 3D',
    paperSubtitle: 'Convert hand-drawn architectural sketches into structured CAD and 3D buildings',
    uploadPaperSketch: 'Upload Paper Floor Plan Sketch',
    originalDrawing: '1. Original Paper Drawing',
    detectedCAD: '2. Detected Digital Plan',
    threeDBuilding: '3. Generated 3D Architecture',
    scanNow: 'Process Sketch with AI',
    compareAllThree: '3-Way Architectural Comparison',

    // 3D Studio
    studioTitle: 'Interactive 3D Design Studio',
    studioSubtitle: 'Photorealistic architectural visualization, materials, and lighting',
    cameraOrbit: 'Orbit Camera',
    viewDay: 'Day Sunlight',
    viewGolden: 'Golden Hour',
    viewNight: 'Night Lighting',
    viewTop: 'Top (Plan)',
    viewFront: 'Elevation',
    viewIso: 'Isometric',
    viewWalkthrough: 'Walkthrough',
    objectProperties: 'Object Properties',
    dimensions: 'Dimensions',
    width: 'Width',
    length: 'Length',
    height: 'Height',
    thickness: 'Thickness',
    material: 'Material',
    color: 'Color',
    roughness: 'Roughness',
    transparency: 'Transparency',
    facadeStyle: 'Facade Style',
    roofType: 'Roof Structure',

    // Hand Tracking
    handTitle: 'Real-Time Spatial Hand Tracking',
    handSubtitle: 'Natural gesture interaction for 3D modeling and spatial manipulation',
    cameraFeed: 'Optical Camera Stream',
    handStatus: 'Hand Skeleton Tracking Status',
    gestureDetected: 'Active Gesture',
    gesturePoint: 'Point — Select Object',
    gestureMove: 'Finger Motion — Draw Wall',
    gesturePinch: 'Pinch — Resize & Scale',
    gestureSwipe: 'Swipe — Translate Object',
    gestureRotate: 'Rotational Arc — Rotate Mesh',
    gestureTwoHand: 'Two-Hand Spread — Zoom Camera',
    startCamera: 'Enable Computer Vision Camera',
    cameraActive: 'Vision Sensor Online',
    handCalibrated: 'Hand Calibrated — 21 Keypoints Tracked',

    // Voice
    voiceTitle: 'Voice Architectural Command',
    voiceSubtitle: 'Speak natural engineering instructions to modify spatial plans',
    voiceRecording: 'Listening to Architect...',
    voiceStart: 'Hold to Speak Instruction',
    voiceSamplePrompt: 'Try: "Make the living room 20% larger and add two floor-to-ceiling windows on the garden facade"',
    transcription: 'Voice Transcription',
    detectedIntent: 'Detected Design Intent',
    proposedChanges: 'Proposed Architectural Actions',
    applyChanges: 'Apply Changes',
    cancelChanges: 'Dismiss',

    // AI Assistant & Problems
    aiAssistantTitle: 'DEAL Architectural AI Assistant',
    aiAssistantSubtitle: 'Context-aware intelligence grounded in your current floor plan and model',
    askAssistant: 'Ask architectural questions or command layout changes...',
    problemDetectionTitle: 'Design Heuristics & Issue Detection',
    problemDetectionSub: 'Automated geometric conflict and circulation bottleneck detection',
    potentialIssue: 'Potential Issue',
    whyItMatters: 'Why It Matters',
    suggestedImprovement: 'Suggested Improvement',
    considerReviewing: 'Consider Reviewing',

    // Materials & Furniture
    materialsTitle: 'Architectural Materials Library',
    materialsSubtitle: 'PBR architectural textures and physical shaders',
    furnitureTitle: 'Furniture Image → 3D Model',
    furnitureSubtitle: 'AI background isolation and volumetric 3D mesh approximation',
    uploadFurniturePhoto: 'Upload Furniture Photo',
    approximate3D: 'Generate 3D Asset',
    placeInRoom: 'Insert into 3D Room',

    // Client & Reports
    clientTitle: 'Client Presentation Mode',
    clientSubtitle: 'Immersive walk-through and curated design variant selection',
    leaveComment: 'Leave Client Feedback',
    commentPlaceholder: 'Describe your aesthetic or layout preferences...',
    submitComment: 'Submit Note to Architect',
    reportsTitle: 'Architectural Document & Report Generator',
    reportsSubtitle: 'Generate complete publication-grade project booklets and printable drawing sheets',
    downloadPdf: 'Export PDF Report',
    printReport: 'Print Presentation Sheet',
    drawingSheet: 'Standard Architectural Title Block',
    drawingNo: 'DWG-001',
    scaleText: 'Scale: 1:100 @ A3',

    // Smart City & Admin
    smartCityTitle: 'DEAL Smart City (Future Horizon)',
    smartCitySubtitle: 'Urban scale microclimate simulation, zoning density, and infrastructure modeling',
    adminTitle: 'DEAL Owner & Administration Portal',
    adminSubtitle: 'System overview, user privileges, AI telemetry, and inquiries',
    registeredUsers: 'Registered Engineers',
    activeSessions: 'Active Design Sessions',
    aiTokens: 'AI Compute Requests',
    contactInquiries: 'Client Inquiries',
    toggleStatus: 'Toggle Status',
    activeStatus: 'Active',
    suspendedStatus: 'Suspended'
  },
  ar: {
    // Brand & Identity
    brandName: 'ديل DEAL',
    brandTagline: 'تصميم • هندسة • عمارة • حياة',
    brandSubtitle: 'المنصة الهندسية والمعمارية الذكية المدعومة بالذكاء الاصطناعي',
    motto: 'تحويل الأفكار والرسومات اليدوية وصور الأراضي إلى واقع معماري تفاعلي ثلاثي الأبعاد.',
    
    // Nav & Sidebar
    navDashboard: 'لوحة التحكم',
    navProjects: 'المشاريع المعمارية',
    navNewProject: 'مشروع جديد',
    navSiteAnalysis: 'تحليل الموقع والأرض',
    navFloorPlans: 'محرر المخططات',
    nav3DStudio: 'استوديو التصميم ثلاثي الأبعاد',
    navHandTracking: 'تتبع حركة اليد',
    navAIAssistant: 'المساعد المعماري الذكي',
    navFurniture: 'تحويل صور الأثاث لثلاثي الأبعاد',
    navMaterials: 'المواد والألوان',
    navClientCollab: 'عرض العميل والملاحظات',
    navReports: 'مُولّد التقارير الهندسية',
    navTemplates: 'النماذج والمشاريع الجاهزة',
    navSmartCity: 'مدينة ديل الذكية (المستقبل)',
    navSettings: 'إعدادات المنصة',
    navContact: 'التواصل والدعم الفني',
    navAdmin: 'بوابة المالك والإدارة',

    // Auth
    signIn: 'تسجيل الدخول',
    createAccount: 'إنشاء حساب جديد',
    forgotPassword: 'نسيت كلمة المرور؟',
    emailAddress: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    fullName: 'الاسم الكامل',
    enterCode: 'أدخل رمز التحقق المكون من 6 أرقام',
    verifyEmail: 'تأكيد البريد الإلكتروني',
    emailSentNotice: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني.',
    backToLogin: 'العودة لتسجيل الدخول',
    dontHaveAccount: 'ليس لديك حساب؟',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    resendCode: 'إعادة إرسال الرمز',
    resetPasswordBtn: 'تعيين كلمة المرور',
    newPasswordLabel: 'كلمة المرور الجديدة',
    signOut: 'تسجيل الخروج',
    demoQuickLogin: 'دخول سريع للعرض والتحكيم',
    engineerRole: 'مهندس معماري',
    ownerRole: 'المؤسس ومالك المنصة',

    // Dashboard
    welcomeBack: 'مرحباً بك',
    dashboardOverview: 'مركز التحكم بالمشاريع المعمارية',
    recentProjects: 'أحدث المشاريع',
    draftProjects: 'المسودات',
    inProgress: 'قيد التنفيذ',
    clientReview: 'مراجعة العميل',
    completed: 'المشاريع المكتملة',
    quickActions: 'الإجراءات السريعة',
    actionNewProject: 'إنشاء مشروع جديد',
    actionAnalyzeLand: 'تحليل قطعة أرض',
    actionUploadDrawing: 'رفع مخطط ورقي',
    actionStart3D: 'بدء الاستوديو ثلاثي الأبعاد',
    actionHandTracking: 'تفعيل تتبع اليد',
    actionGenerateReport: 'توليد تقرير هندسي',
    openProject: 'فتح المشروع',
    viewDetails: 'عرض التفاصيل',
    duplicate: 'نسخ مكرر',
    exportDoc: 'تصدير المستند',

    // Site Analysis
    siteTitle: 'تحليل الموقع وقطعة الأرض',
    siteSubtitle: 'تحليل الحدود، المناخ الدقيق، وخيارات التوجيه والكتلة المعمارية المقترحة',
    uploadSitePhoto: 'رفع صورة الأرض أو الرفع المساحي الجوي',
    takeCameraPhoto: 'التقاط صورة للأرض بالكاميرا',
    analyzeLandBtn: 'بدء التحليل الذكي للأرض',
    landBoundaries: 'حدود الأرض والموقع',
    approxDimensions: 'الأبعاد والقياسات التقريبية',
    availableArea: 'المساحة الإجمالية للموقع',
    potentialBuildingZone: 'نطاق البناء المتاح',
    orientation: 'التوجيه ومسار الشمس',
    accessPoints: 'مداخل الموقع ومحاور الطرق',
    surroundings: 'البيئة المحيطة والتضاريس',
    placementOptions: 'خيارات التوزيع المعماري المبدئية',
    optionA: 'الخيار أ — أقصى استغلال للمساحة البنائية',
    optionB: 'الخيار ب — فناء داخلي وواحة خضراء',
    optionC: 'الخيار ج — التقاط الرياح والإضاءة الطبيعية',
    optionD: 'الخيار د — التوجيه الشمسي والمبنى المستدام',
    compareOptions: 'مقارنة الخيارات',
    selectOption: 'اختيار التوزيع',
    applyToProject: 'تطبيق على البيئة ثلاثية الأبعاد',
    disclaimerEngineering: 'تنويه: هذه المقترحات والتوزيعات مبدئية لاستكشاف المفهوم المعماري، ولا تُعد قرارات إنشائية أو مساحية أو جيوتقنية أو نظامية معتمدة.',

    // Floor Plan
    cadTitle: 'محرر المخططات المعمارية التفاعلي',
    cadSubtitle: 'رسم الجدران، الفتحات، القياسات، والتحويل الآلي إلى مجسمات ثلاثية الأبعاد',
    toolWall: 'جدار',
    toolDoor: 'باب',
    toolWindow: 'نافذة',
    toolRoom: 'غرفة',
    toolColumn: 'عمود إنشائي',
    toolStairs: 'درج',
    toolFurniture: 'أثاث',
    toolDimension: 'أبعاد وقياس',
    toolText: 'نص توضيحي',
    toolMeasure: 'قياس',
    toolSelect: 'تحديد',
    toolDelete: 'حذف',
    snapToGrid: 'محاذاة الشبكة',
    scale100: 'المقياس 1:100',
    convertTo3D: 'توليد المبنى ثلاثي الأبعاد',
    paperToDigital: 'مسح المخطط الورقي ← ثلاثي الأبعاد',

    // Paper to 3D
    paperTitle: 'من رسم ورقي ← إلى مبنى ثلاثي الأبعاد',
    paperSubtitle: 'تحويل الاسكتشات اليدوية على الورق إلى مخطط رقمي ونموذج معماري تفاعلي',
    uploadPaperSketch: 'رفع صورة الاسكتش الورقي',
    originalDrawing: '1. الرسم الورقي الأصلي',
    detectedCAD: '2. المخطط الرقمي المكتشف',
    threeDBuilding: '3. المبنى ثلاثي الأبعاد المُولد',
    scanNow: 'معالجة الاسكتش بالذكاء الاصطناعي',
    compareAllThree: 'المقارنة المعمارية الثلاثية',

    // 3D Studio
    studioTitle: 'استوديو التصميم ثلاثي الأبعاد',
    studioSubtitle: 'تصيير معماري واقعي، خامات طبيعية، وإضاءة شمسية ديناميكية',
    cameraOrbit: 'دوران الكاميرا',
    viewDay: 'إضاءة النهار',
    viewGolden: 'الساعة الذهبية',
    viewNight: 'الإضاءة الليلية',
    viewTop: 'المسقط الأفقي',
    viewFront: 'الواجهة الأمامية',
    viewIso: 'المنظور الآيزومتري',
    viewWalkthrough: 'جولة داخلية',
    objectProperties: 'خصائص العنصر المحدد',
    dimensions: 'الأبعاد والقياسات',
    width: 'العرض',
    length: 'الطول',
    height: 'الارتفاع',
    thickness: 'سماكة الجدار',
    material: 'الخامة والمادة',
    color: 'اللون',
    roughness: 'الخشونة واللمعان',
    transparency: 'الشفافية',
    facadeStyle: 'طراز الواجهة',
    roofType: 'هيكل السقف',

    // Hand Tracking
    handTitle: 'تتبع حركة اليد المكانية في الوقت الفعلي',
    handSubtitle: 'تفاعل حركي طبيعي عبر الكاميرا للتحكم في الكتل والنمذجة المكانية',
    cameraFeed: 'بث الكاميرا البصرية',
    handStatus: 'حالة تتبع مفاصل اليد',
    gestureDetected: 'الإيماءة الحالية',
    gesturePoint: 'الإشارة بالسبابة — اختيار عنصر',
    gestureMove: 'حركة الإصبع — رسم جدار',
    gesturePinch: 'القرص — تغيير الحجم والمقياس',
    gestureSwipe: 'السحب — تحريك العنصر المحدد',
    gestureRotate: 'الدوران — تدوير العنصر',
    gestureTwoHand: 'حركة اليدين — تكبير وتصغير المشهد',
    startCamera: 'تفعيل كاميرا الرؤية الحاسوبية',
    cameraActive: 'مستشعر الرؤية متصل',
    handCalibrated: 'تمت معايرة اليد — 21 نقطة مفصلية',

    // Voice
    voiceTitle: 'الأوامر الصوتية المعمارية',
    voiceSubtitle: 'تحدث بالتعليمات الهندسية باللغة الطبيعية لتعديل المخطط المعماري',
    voiceRecording: 'جاري الاستماع للمهندس المعماري...',
    voiceStart: 'اضغط للتحدث بالأمر المعماري',
    voiceSamplePrompt: 'مثال: "اجعل غرفة المعيشة أكبر بنسبة 20% وأضف نافذتين ممتدتين على حديقة الفناء"',
    transcription: 'النص الصوتي المفرغ',
    detectedIntent: 'الهدف المعماري المكتشف',
    proposedChanges: 'التعديلات المعمارية المقترحة',
    applyChanges: 'تطبيق التعديلات',
    cancelChanges: 'إلغاء التعديل',

    // AI Assistant & Problems
    aiAssistantTitle: 'مساعد ديل المعماري الذكي',
    aiAssistantSubtitle: 'ذكاء متخصص يفهم تفاصيل مخططك الحالي وأبعاد الموقع ومواده',
    askAssistant: 'اطرح استفسارات معمارية أو اطلب مقترحات لتوزيع المساحات...',
    problemDetectionTitle: 'الفحص الذكي واكتشاف الملاحظات المعمارية',
    problemDetectionSub: 'تحليل آلي للتعارضات الهندسية وممرات الحركة وكفاءة الإضاءة',
    potentialIssue: 'ملاحظة محتملة',
    whyItMatters: 'الأثر الهندسي',
    suggestedImprovement: 'المقترح الهندسي',
    considerReviewing: 'يُنصح بمراجعته',

    // Materials & Furniture
    materialsTitle: 'مكتبة الخامات والمواد المعمارية',
    materialsSubtitle: 'خامات فيزيائية واقعية (حجر، رخام، خرسانة، خشب، زجاج)',
    furnitureTitle: 'تحويل صور الأثاث إلى نماذج ثلاثية الأبعاد',
    furnitureSubtitle: 'عزل الخلفية بالذكاء الاصطناعي وتوليد مجسم حجمي تقريبي للأثاث',
    uploadFurniturePhoto: 'رفع صورة قطعة الأثاث',
    approximate3D: 'توليد المجسم 3D',
    placeInRoom: 'إدراج العنصر داخل المبنى',

    // Client & Reports
    clientTitle: 'وضع عرض العميل',
    clientSubtitle: 'جولة تفاعلية وتجربة بصرية للمواد والألوان ومشاركة الملاحظات',
    leaveComment: 'إضافة ملاحظة العميل',
    commentPlaceholder: 'اكتب تفضيلاتك المعمارية أو أي تعديل ترغب به...',
    submitComment: 'إرسال الملاحظة للمهندس',
    reportsTitle: 'مُولّد التقارير والمستندات المعمارية',
    reportsSubtitle: 'إعداد كتيب المشروع الكامل ولوحات الرسم الهندسي القابلة للطباعة',
    downloadPdf: 'تصدير التقرير PDF',
    printReport: 'طباعة لوحة العرض',
    drawingSheet: 'لوحة المخطط الهندسي المعتمد',
    drawingNo: 'مخطط-001',
    scaleText: 'المقياس: 1:100 @ A3',

    // Smart City & Admin
    smartCityTitle: 'مدينة ديل الذكية (الآفاق المستقبلية)',
    smartCitySubtitle: 'محاكاة التخطيط الحضري، المناخ الدقيق، الكثافة السكانية، والبنية التحتية',
    adminTitle: 'بوابة المالك وإدارة منصة DEAL',
    adminSubtitle: 'الإحصائيات، المستخدمين المسجلين، اتصالات العملاء، وتتبع الذكاء الاصطناعي',
    registeredUsers: 'المهندسون المسجلون',
    activeSessions: 'جلسات التصميم النشطة',
    aiTokens: 'طلبات الذكاء الاصطناعي',
    contactInquiries: 'استفسارات العملاء ومشاريعهم',
    toggleStatus: 'تغيير الحالة',
    activeStatus: 'نشط',
    suspendedStatus: 'موقوف'
  }
};

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  setLang: () => {},
  t: (k: string) => k,
  isRTL: false
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('deal_lang') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('deal_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string): string => {
    return translations[lang][key] || translations.en[key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t, isRTL: lang === 'ar' }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
