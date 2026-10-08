import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Play, 
  Lock, 
  Flame, 
  Award, 
  BookOpen, 
  ChevronRight, 
  X, 
  Search, 
  RotateCcw, 
  Sparkles, 
  Terminal,
  CheckCircle2,
  HelpCircle,
  Code,
  Zap,
  ArrowRight,
  Trophy
} from 'lucide-react';

// Complete Syllabus for Playwright with TypeScript (Web & API Testing)
const INITIAL_SYLLABUS = [
  { id: 1, title: "Introduction", category: "TypeScript Basics", xp: 50 },
  { id: 2, title: "Introduction to TypeScript & Setup Environment", category: "TypeScript Basics", xp: 50 },
  { id: 3, title: "TypeScript Variables", category: "TypeScript Basics", xp: 50 },
  { id: 4, title: "Data Types in TypeScript", category: "TypeScript Basics", xp: 50 },
  { id: 5, title: "Operators in TypeScript", category: "TypeScript Basics", xp: 50 },
  { id: 6, title: "Conditional Statements", category: "TypeScript Control Flow", xp: 75 },
  { id: 7, title: "Loops in TypeScript", category: "TypeScript Control Flow", xp: 75 },
  { id: 8, title: "Functions - Part1", category: "TypeScript Functions", xp: 75 },
  { id: 9, title: "Functions - Part 2", category: "TypeScript Functions", xp: 75 },
  { id: 10, title: "Arrays in TypeScript", category: "TypeScript Data Structures", xp: 75 },
  { id: 11, title: "Array Methods- Part1", category: "TypeScript Data Structures", xp: 75 },
  { id: 12, title: "Array Methods-Part2", category: "TypeScript Data Structures", xp: 75 },
  { id: 13, title: "Strings", category: "TypeScript Data Structures", xp: 50 },
  { id: 14, title: "Objects", category: "TypeScript Data Structures", xp: 75 },
  { id: 15, title: "Read Only, Optional Properties & Overloading", category: "TypeScript Advanced", xp: 100 },
  { id: 16, title: "Inheritance", category: "TypeScript OOP", xp: 100 },
  { id: 17, title: "Interface and Modules", category: "TypeScript OOP", xp: 100 },
  { id: 18, title: "Playwright Kick Start", category: "Playwright Fundamentals", xp: 100 },
  { id: 19, title: "Playwright locators", category: "Playwright Locators", xp: 100 },
  { id: 20, title: "Filtering locators", category: "Playwright Locators", xp: 100 },
  { id: 21, title: "Locating Elements using CSS Locators", category: "Playwright Locators", xp: 100 },
  { id: 22, title: "Locating Elements using XPath, Operators and functions in XPath", category: "Playwright Locators", xp: 125 },
  { id: 23, title: "Playwright Actions-Input Box & Radio buttons", category: "Playwright Actions", xp: 100 },
  { id: 24, title: "Handle checkboxes & Form validations", category: "Playwright Actions", xp: 100 },
  { id: 25, title: "Handle Dropdowns -Part 1", category: "Playwright Actions", xp: 100 },
  { id: 26, title: "Handle Dropdowns- Part 2", category: "Playwright Actions", xp: 100 },
  { id: 27, title: "Handle Web table-Part1", category: "Playwright UI Components", xp: 125 },
  { id: 28, title: "Handle Web table-2 Dynamic & Pagination Tables", category: "Playwright UI Components", xp: 125 },
  { id: 29, title: "Handling Date Pickers (Customized Elements)", category: "Playwright UI Components", xp: 125 },
  { id: 30, title: "Handling Dialogs", category: "Playwright Advanced UI", xp: 100 },
  { id: 31, title: "Browser context,Fixtures & Emulation", category: "Playwright Architecture", xp: 150 },
  { id: 32, title: "Handle multiple tabs, File upload and download", category: "Playwright Advanced UI", xp: 125 },
  { id: 33, title: "Handling Mouse and Keyboard actions", category: "Playwright Actions", xp: 100 },
  { id: 34, title: "Scrolling techniques", category: "Playwright Actions", xp: 100 },
  { id: 35, title: "Handle Shadow DOM & SVG Eelements", category: "Playwright Advanced UI", xp: 150 },
  { id: 36, title: "Handle frames", category: "Playwright Advanced UI", xp: 125 },
  { id: 37, title: "Assertions and Autowaiting", category: "Playwright Core Concepts", xp: 125 },
  { id: 38, title: "Cookies Storage", category: "Playwright Storage", xp: 100 },
  { id: 39, title: "Local & session Storage", category: "Playwright Storage", xp: 100 },
  { id: 40, title: "Parameterization ( Data Driven Testing with JSON, CSV & Excel Files)", category: "Framework Design", xp: 150 },
  { id: 41, title: "Grouping Tests, Hooks, Annotations & Tagging Tests", category: "Framework Design", xp: 125 },
  { id: 42, title: "Capture screenshots, videos, trace files and handle flaky tests", category: "Debugging & Reporting", xp: 125 },
  { id: 43, title: "Playwright Reports & Allure Reports", category: "Debugging & Reporting", xp: 125 },
  { id: 44, title: "Page Object Model", category: "Framework Design", xp: 150 },
  { id: 45, title: "Working with Playwright MCP (Model Context Protocol) - Mini Project", category: "AI & Modern Tools", xp: 175 },
  { id: 46, title: "Working with Playwright Agents (Planner, Generator & Healer) -Mini Project", category: "AI & Modern Tools", xp: 175 },
  { id: 47, title: "API Testing basics", category: "API Testing", xp: 125 },
  { id: 48, title: "Working with Post and Get Http requests", category: "API Testing", xp: 125 },
  { id: 49, title: "Working with Patch, Put & Delete requests", category: "API Testing", xp: 125 },
  { id: 50, title: "Schema testing, File upload & Download", category: "API Testing", xp: 150 },
  { id: 51, title: "Mocking and Network interception", category: "API Testing", xp: 175 },
  { id: 52, title: "API Authentications", category: "API Testing", xp: 150 },
  { id: 53, title: "Accessibility Testing & Visual Testing Playwright", category: "Specialized Testing", xp: 150 },
  { id: 54, title: "Database Testing (Validating backend Database)", category: "Backend Testing", xp: 150 },
  { id: 55, title: "Playwright Custom Fixtures", category: "Advanced Framework", xp: 175 },
  { id: 56, title: "Exploring AI Agents & Getting started with framework", category: "AI Framework", xp: 175 },
  { id: 57, title: "Framework Powered by AI - Part1 (Introduction and framework components)", category: "AI Framework", xp: 175 },
  { id: 58, title: "Framework Powered by AI -Part 2 (Generating Automation tests)", category: "AI Framework", xp: 175 },
  { id: 59, title: "Framework Powered by AI -Part 3 ( Git, GitHub & GitHub Actions )", category: "CI/CD & DevOps", xp: 200 },
  { id: 60, title: "Docker Integration", category: "CI/CD & DevOps", xp: 200 },
  { id: 61, title: "Jenkins-CI-CD-Creating Pipeline", category: "CI/CD & DevOps", xp: 200 }
];

// Mock interactive slide generator for topics
const getTopicLesson = (topicTitle) => {
  return {
    title: topicTitle,
    slides: [
      {
        type: 'theory',
        heading: `Understanding ${topicTitle}`,
        content: [
          `Mastering ${topicTitle} is essential for writing robust Playwright automated tests with TypeScript.`,
          `Pay key attention to async/await syntax and correct Locator strategies.`,
          `Always prefer user-facing locators like page.getByRole() or page.getByText() over brittle XPath.`
        ],
        codeSnippet: `import { test, expect } from '@playwright/test';\n\ntest('${topicTitle} demo', async ({ page }) => {\n  await page.goto('https://example.com');\n  // Applying ${topicTitle} concept\n  const element = page.getByRole('button', { name: 'Submit' });\n  await expect(element).toBeVisible();\n});`
      },
      {
        type: 'mcq',
        question: `Which statement accurately reflects best practice for "${topicTitle}" in Playwright?`,
        options: [
          `Always use hardcoded sleep timeouts like page.waitForTimeout(5000).`,
          `Use web-first assertions like expect(locator).toBeVisible() which automatically wait.`,
          `Locators in Playwright immediately throw an error if the element is not found on creation.`
        ],
        correctIndex: 1,
        explanation: `Playwright features automatic waiting! Web-first assertions like expect(locator).toBeVisible() retry automatically until the condition is met.`
      },
      {
        type: 'fill_blank',
        question: `Complete the Playwright code snippet for ${topicTitle}:`,
        codeTemplate: `await page.[BLANK]('button', { name: 'Login' }).click();`,
        blankWord: `getByRole`,
        hint: `Use the recommended user-facing locator method for ARIA roles.`
      }
    ]
  };
};

export default function App() {
  // Topic completion states: completed IDs 1-5 by default, 6 active, rest locked
  const [completedIds, setCompletedIds] = useState([1, 2, 3, 4, 5]);
  const [activeId, setActiveId] = useState(6);
  const [xp, setXp] = useState(325);
  const [streak, setStreak] = useState(4);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selected topic modal state
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  // Lesson Slide Modal Active State
  const [activeLesson, setActiveLesson] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [userMcqAnswer, setUserMcqAnswer] = useState(null);
  const [userBlankInput, setUserBlankInput] = useState('');
  const [slideFeedback, setSlideFeedback] = useState(null);

  // Offset positions for winding road UI effect
  const getNodeOffsetClass = (index) => {
    const pattern = [
      'col-start-2 justify-self-center', // Center
      'col-start-3 justify-self-start translate-x-4', // Right
      'col-start-3 justify-self-end translate-x-8', // Far Right
      'col-start-3 justify-self-start translate-x-4', // Right
      'col-start-2 justify-self-center', // Center
      'col-start-1 justify-self-end -translate-x-4', // Left
      'col-start-1 justify-self-start -translate-x-8', // Far Left
      'col-start-1 justify-self-end -translate-x-4', // Left
    ];
    return pattern[index % pattern.length];
  };

  const filteredSyllabus = INITIAL_SYLLABUS.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const progressPercentage = Math.round((completedIds.length / INITIAL_SYLLABUS.length) * 100);

  // Handle opening topic details modal
  const handleNodeClick = (topic) => {
    if (completedIds.includes(topic.id) || topic.id === activeId) {
      setSelectedTopic(topic);
    }
  };

  // Launch interactive SoloLearn lesson modal
  const handleStartLesson = (topic) => {
    setSelectedTopic(null);
    setActiveLesson(getTopicLesson(topic.title));
    setCurrentSlideIndex(0);
    setUserMcqAnswer(null);
    setUserBlankInput('');
    setSlideFeedback(null);
  };

  const handleNextSlide = () => {
    const currentSlide = activeLesson.slides[currentSlideIndex];

    if (currentSlide.type === 'mcq') {
      if (userMcqAnswer === null) {
        setSlideFeedback({ error: 'Please select an answer to proceed.' });
        return;
      }
      if (userMcqAnswer !== currentSlide.correctIndex) {
        setSlideFeedback({ error: 'Incorrect option. Try again!' });
        return;
      }
    }

    if (currentSlide.type === 'fill_blank') {
      if (userBlankInput.trim().toLowerCase() !== currentSlide.blankWord.toLowerCase()) {
        setSlideFeedback({ error: `Incorrect syntax. Hint: ${currentSlide.hint}` });
        return;
      }
    }

    setSlideFeedback(null);

    // If there are more slides
    if (currentSlideIndex < activeLesson.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      setUserMcqAnswer(null);
      setUserBlankInput('');
    } else {
      // Completed current lesson!
      const topicObj = INITIAL_SYLLABUS.find(t => t.title === activeLesson.title);
      if (topicObj) {
        if (!completedIds.includes(topicObj.id)) {
          setCompletedIds(prev => [...prev, topicObj.id]);
          setActiveId(topicObj.id + 1);
          setXp(prev => prev + topicObj.xp);
        }
      }
      setActiveLesson(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-900 pb-20">
      
      {/* ================= HEADER & BRANDING ================= */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          
          {/* Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-cyan-600 p-[1.5px] shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <Code className="w-5 h-5 text-cyan-400 absolute opacity-50" />
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 relative z-10" />
                </div>
              </div>
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400 bg-clip-text text-transparent">
                TestKraft
              </h1>
              <p className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">QA Learning Path</p>
            </div>
          </div>

          {/* Gamification Badges (Streak & XP) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Flame className="w-4 h-4 fill-amber-400 animate-pulse" />
              <span>{streak}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Zap className="w-4 h-4 fill-cyan-400" />
              <span>{xp} XP</span>
            </div>
          </div>

        </div>
      </header>

      {/* ================= COURSE BANNER & PROGRESS ================= */}
      <main className="max-w-md mx-auto px-4 pt-4">
        
        {/* Course Card */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl relative overflow-hidden mb-6">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active Course
            </span>
            <span className="text-xs text-slate-400 font-medium">{completedIds.length} / {INITIAL_SYLLABUS.length} Topics</span>
          </div>

          <h2 className="text-base font-bold text-slate-100 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Playwright with TypeScript (Web & API)
          </h2>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-lg shadow-emerald-500/30"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 font-medium">{progressPercentage}% Course Completed</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search locator, assertion, topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* ================= VERTICAL SOLOLEARN ROADMAP PATH ================= */}
        <div className="relative py-4 px-2">
          
          {/* Central Connecting Road SVG Line */}
          <div className="absolute inset-0 flex justify-center pointer-events-none z-0">
            <div className="w-1 bg-slate-800 rounded-full h-full opacity-60" />
          </div>

          <div className="grid grid-cols-3 gap-y-8 relative z-10 items-center">
            {filteredSyllabus.map((topic, index) => {
              const isCompleted = completedIds.includes(topic.id);
              const isActive = topic.id === activeId;
              const isLocked = !isCompleted && !isActive;
              const offsetClass = getNodeOffsetClass(index);

              return (
                <div key={topic.id} className={`flex flex-col items-center ${offsetClass}`}>
                  
                  {/* Topic Node Button */}
                  <div className="relative group">
                    {/* Active pulsing aura */}
                    {isActive && (
                      <div className="absolute -inset-2 bg-amber-500/30 rounded-full blur-md animate-pulse" />
                    )}
                    
                    <button
                      onClick={() => handleNodeClick(topic)}
                      disabled={isLocked}
                      className={`relative w-16 h-16 rounded-full flex items-center justify-center font-bold transition-all duration-300 transform active:scale-95 shadow-xl ${
                        isCompleted 
                          ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-emerald-500/25 ring-4 ring-emerald-500/20 hover:scale-105' 
                          : isActive 
                            ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-amber-500/30 ring-4 ring-amber-500/30 animate-bounce hover:scale-105' 
                            : 'bg-slate-800 text-slate-600 border border-slate-700/60 cursor-not-allowed opacity-80'
                      }`}
                    >
                      {isCompleted && <Check className="w-8 h-8 stroke-[3]" />}
                      {isActive && <Play className="w-7 h-7 fill-slate-950 stroke-none translate-x-0.5" />}
                      {isLocked && <Lock className="w-6 h-6 text-slate-500" />}

                      {/* Topic Number Badge */}
                      <span className={`absolute -bottom-1 -right-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border ${
                        isCompleted ? 'bg-slate-950 text-emerald-400 border-emerald-500/40' :
                        isActive ? 'bg-slate-950 text-amber-400 border-amber-500/40' :
                        'bg-slate-900 text-slate-500 border-slate-800'
                      }`}>
                        #{topic.id}
                      </span>
                    </button>
                  </div>

                  {/* Topic Title Label */}
                  <div className="mt-2 text-center max-w-[120px]">
                    <span className={`text-[11px] font-semibold leading-tight line-clamp-2 block ${
                      isCompleted ? 'text-slate-300' :
                      isActive ? 'text-amber-400 font-bold' :
                      'text-slate-500'
                    }`}>
                      {topic.title}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* ================= TOPIC PREVIEW SHEET / MODAL ================= */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative animate-in fade-in slide-in-from-bottom-6 duration-200">
            <button 
              onClick={() => setSelectedTopic(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {selectedTopic.category}
              </span>
              <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-400" />+{selectedTopic.xp} XP
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-100 mb-2">
              Topic #{selectedTopic.id}: {selectedTopic.title}
            </h3>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Test your knowledge on syntax, assertions, and best practices for {selectedTopic.title} in Playwright and TypeScript.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleStartLesson(selectedTopic)}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-slate-950" /> Start Practice Slide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= LESSON INTERACTIVE RUNNER MODAL (SOLOLEARN SLIDE DECK) ================= */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto">
          
          {/* Top Progress */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => setActiveLesson(null)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Slide Dots Indicator */}
              <div className="flex items-center gap-1.5">
                {activeLesson.slides.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentSlideIndex 
                        ? 'w-6 bg-emerald-400' 
                        : idx < currentSlideIndex 
                          ? 'w-2 bg-emerald-600' 
                          : 'w-2 bg-slate-800'
                    }`}
                  />
                ))}
              </div>

              <span className="text-xs text-slate-400 font-bold">
                {currentSlideIndex + 1}/{activeLesson.slides.length}
              </span>
            </div>

            <h2 className="text-base font-bold text-slate-200 text-center mb-4">
              {activeLesson.title}
            </h2>
          </div>

          {/* Slide Content Area */}
          <div className="flex-1 my-auto flex flex-col justify-center">
            
            {/* SLIDE TYPE: THEORY / READING */}
            {activeLesson.slides[currentSlideIndex].type === 'theory' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" /> Concept Summary
                </div>
                
                <h3 className="text-lg font-bold text-slate-100">
                  {activeLesson.slides[currentSlideIndex].heading}
                </h3>

                <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  {activeLesson.slides[currentSlideIndex].content.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {/* Code Snippet Display */}
                {activeLesson.slides[currentSlideIndex].codeSnippet && (
                  <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 font-mono text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
                    <pre>{activeLesson.slides[currentSlideIndex].codeSnippet}</pre>
                  </div>
                )}
              </div>
            )}

            {/* SLIDE TYPE: MULTIPLE CHOICE QUESTION */}
            {activeLesson.slides[currentSlideIndex].type === 'mcq' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4" /> Multiple Choice Practice
                </div>

                <h3 className="text-sm font-semibold text-slate-100 leading-snug">
                  {activeLesson.slides[currentSlideIndex].question}
                </h3>

                <div className="space-y-2.5 pt-2">
                  {activeLesson.slides[currentSlideIndex].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setUserMcqAnswer(idx)}
                      className={`w-full text-left text-xs p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                        userMcqAnswer === idx
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/50'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full border text-[10px] font-bold flex items-center justify-center shrink-0 ${
                        userMcqAnswer === idx ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'border-slate-700 text-slate-500'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SLIDE TYPE: FILL IN THE BLANK */}
            {activeLesson.slides[currentSlideIndex].type === 'fill_blank' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                  <Terminal className="w-4 h-4" /> Code Completion Practice
                </div>

                <h3 className="text-xs font-semibold text-slate-200">
                  {activeLesson.slides[currentSlideIndex].question}
                </h3>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200">
                  <p className="leading-loose">
                    {activeLesson.slides[currentSlideIndex].codeTemplate.split('[BLANK]')[0]}
                    <input
                      type="text"
                      value={userBlankInput}
                      onChange={(e) => setUserBlankInput(e.target.value)}
                      placeholder="Fill syntax..."
                      className="inline-block bg-slate-900 border border-cyan-500/50 text-cyan-300 px-2 py-1 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-cyan-400 w-32 text-center"
                    />
                    {activeLesson.slides[currentSlideIndex].codeTemplate.split('[BLANK]')[1]}
                  </p>
                </div>
              </div>
            )}

            {/* Error / Feedback Banner */}
            {slideFeedback && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
                <X className="w-4 h-4 shrink-0" />
                <span>{slideFeedback.error}</span>
              </div>
            )}

          </div>

          {/* Bottom Action Area */}
          <div className="pt-4 border-t border-slate-800/80">
            <button
              onClick={handleNextSlide}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <span>{currentSlideIndex < activeLesson.slides.length - 1 ? 'Check & Continue' : 'Finish Lesson (+75 XP)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}