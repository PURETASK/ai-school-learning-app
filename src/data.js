export const standardsFrameworks = [
  {
    id: "ccss-ela",
    name: "Common Core ELA",
    subjects: ["ela", "writing"],
    purpose: "Reading, language, speaking, listening, and writing expectations."
  },
  {
    id: "ccss-math",
    name: "Common Core Math",
    subjects: ["math"],
    purpose: "Grade-level math practices, fluency, problem solving, and modeling."
  },
  {
    id: "ngss",
    name: "Next Generation Science Standards",
    subjects: ["science"],
    purpose: "Science and engineering practices across physical, life, Earth, and space science."
  },
  {
    id: "c3",
    name: "C3 Social Studies Framework",
    subjects: ["social-studies"],
    purpose: "Civics, geography, history, economics, inquiry, and evidence."
  },
  {
    id: "shape",
    name: "SHAPE Health and PE",
    subjects: ["health-pe"],
    purpose: "Movement, wellness, health skills, safety, and personal fitness."
  },
  {
    id: "k12cs",
    name: "K-12 Computer Science Framework",
    subjects: ["computer-science"],
    purpose: "Algorithms, programming, data, systems, impacts, and digital citizenship."
  },
  {
    id: "arts",
    name: "National Core Arts Standards",
    subjects: ["arts-media"],
    purpose: "Creating, performing, responding, connecting, media, music, and visual arts."
  },
  {
    id: "sel",
    name: "CASEL-style SEL",
    subjects: ["life-skills"],
    purpose: "Self-awareness, self-management, relationship skills, and responsible decisions."
  }
];

export const learningScienceSources = [
  {
    id: "ies-wwc-study",
    name: "IES What Works Clearinghouse study guide",
    url: "https://ies.ed.gov/ncee/wwc/PracticeGuide/1",
    applies: ["spacing", "quizzing", "graphics-plus-words", "deep-explanation", "concrete-to-abstract"]
  },
  {
    id: "eef-metacognition",
    name: "Education Endowment Foundation metacognition review",
    url: "https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/metacognition-and-self-regulation",
    applies: ["plan-monitor-reflect", "student self-regulation", "thinking aloud"]
  },
  {
    id: "eef-feedback",
    name: "Education Endowment Foundation feedback review",
    url: "https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/feedback",
    applies: ["specific feedback", "correct-work feedback", "actionable next steps"]
  },
  {
    id: "eef-collaboration",
    name: "Education Endowment Foundation collaborative learning review",
    url: "https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/collaborative-learning-approaches",
    applies: ["structured groups", "shared outcome", "3-5 learner teams", "peer explanation"]
  },
  {
    id: "sdt",
    name: "Self-Determination Theory",
    url: "https://selfdeterminationtheory.org/theory/",
    applies: ["autonomy", "competence", "relatedness", "intrinsic motivation"]
  }
];

export const evidenceGuidanceAudit = {
  updatedAt: "2026-06-11",
  scope:
    "Evidence-backed teaching and learning recommendations for K-12 math design, with emphasis on Foundation and Bridge math plus Scholar algebra readiness.",
  sources: [
    {
      id: "eef-maths-ks2-3",
      name: "EEF Improving Mathematics in Key Stages 2 and 3",
      url: "https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/maths-ks-2-3",
      appliesTo: ["foundation", "bridge"],
      recommendations: [
        {
          id: "assessment-existing-knowledge",
          title: "Use assessment to build on existing knowledge",
          productRequirement:
            "Every math lesson needs a short prior-knowledge check, misconception check, feedback frame, and targeted reteach trigger."
        },
        {
          id: "manipulatives-representations",
          title: "Use manipulatives and representations",
          productRequirement:
            "Math lessons must state why the manipulative or representation is being used and how it fades toward independent reasoning."
        },
        {
          id: "problem-solving-strategies",
          title: "Teach strategies for solving problems",
          productRequirement:
            "Lessons must include non-routine problems, strategy comparison, worked examples, and prompts for communicating reasoning."
        },
        {
          id: "rich-knowledge-network",
          title: "Develop a rich network of mathematical knowledge",
          productRequirement:
            "Lessons must connect facts, procedures, concepts, fluency, strategy choice, number structure, and transfer tasks."
        },
        {
          id: "independence-motivation",
          title: "Develop independence and motivation",
          productRequirement:
            "Lessons must include plan, monitor, and evaluate prompts plus choice or explanation tasks that support ownership."
        },
        {
          id: "challenge-support-tasks",
          title: "Use tasks and resources to challenge and support mathematics",
          productRequirement:
            "Lesson tasks must be selected from assessment evidence, include examples and non-examples, and use technology as a tool."
        },
        {
          id: "structured-interventions",
          title: "Use structured interventions for additional support",
          productRequirement:
            "Progress data must trigger explicit reteach, visual support, cumulative review, and intervention logging."
        },
        {
          id: "primary-secondary-transition",
          title: "Support successful transition between primary and secondary",
          productRequirement:
            "Bridge Academy math must preserve continuity from Grade 5 concepts while adding planner prompts and independence supports."
        }
      ]
    },
    {
      id: "eef-early-maths",
      name: "EEF Improving Mathematics in the Early Years and Key Stage 1",
      url: "https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/early-maths",
      appliesTo: ["foundation"],
      recommendations: [
        {
          id: "early-developmental-progressions",
          title: "Use developmental progressions",
          productRequirement:
            "Foundation math diagnostics and lessons should sequence number, operations, shape, pattern, measurement, and data from concrete experiences to symbols."
        },
        {
          id: "math-through-day",
          title: "Integrate math through the day",
          productRequirement:
            "Young learner lessons should include home, movement, story, snack, game, or real-world mini tasks instead of screen-only practice."
        },
        {
          id: "stories-board-games",
          title: "Use storybooks and board games",
          productRequirement:
            "Foundation lessons should convert practice into story, board-game, movement, or explain-to-someone formats when possible."
        }
      ]
    },
    {
      id: "eef-implementation",
      name: "EEF A School's Guide to Implementation",
      url: "https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/implementation",
      appliesTo: ["foundation", "bridge", "scholar"],
      recommendations: [
        {
          id: "explore-prepare-deliver-sustain",
          title: "Use a structured implementation process",
          productRequirement:
            "New teaching practices must move through explore, prepare, deliver, and sustain phases with evidence, feasibility, and feedback checks."
        },
        {
          id: "monitor-adapt",
          title: "Monitor and adapt implementation",
          productRequirement:
            "The learning lab must track retention, joy, frustration, independence, parent effort, and stop-or-scale decisions."
        }
      ]
    },
    {
      id: "wwc-young-math",
      name: "WWC Teaching Math to Young Children",
      url: "https://ies.ed.gov/ncee/wwc/PracticeGuide/18",
      appliesTo: ["foundation"],
      recommendations: [
        {
          id: "number-operations-progression",
          title: "Teach number and operations using a developmental progression",
          productRequirement:
            "Foundation math units must sequence number sense and operations before abstract speed drills."
        },
        {
          id: "progress-monitoring-young",
          title: "Use progress monitoring",
          productRequirement:
            "Young learner placement and daily path decisions must build from what each child currently knows."
        },
        {
          id: "mathematical-world",
          title: "Describe the world mathematically",
          productRequirement:
            "Lessons should ask young learners to notice, count, compare, sort, measure, and describe real objects and events."
        }
      ]
    },
    {
      id: "wwc-rti-math",
      name: "WWC Assisting Students Struggling with Mathematics",
      url: "https://ies.ed.gov/ncee/wwc/PracticeGuide/2",
      appliesTo: ["foundation", "bridge"],
      recommendations: [
        {
          id: "screen-risk",
          title: "Screen students and intervene early",
          productRequirement:
            "Math diagnostics must identify risk, assign intervention supports, and monitor progress."
        },
        {
          id: "explicit-systematic",
          title: "Use explicit and systematic intervention",
          productRequirement:
            "Reteach paths must model thinking, verbalize steps, use guided practice, give corrective feedback, and include cumulative review."
        },
        {
          id: "visual-representations",
          title: "Use visual representations",
          productRequirement:
            "Interventions must include visual models and ensure the adult or system explains the link to the math idea."
        },
        {
          id: "fact-retrieval",
          title: "Build fluent retrieval",
          productRequirement:
            "Intervention sessions should include brief fluency retrieval without replacing conceptual work."
        },
        {
          id: "motivation-intervention",
          title: "Include motivational strategies",
          productRequirement:
            "Interventions should include success evidence, learner choice, and non-public reward supports."
        }
      ]
    },
    {
      id: "wwc-problem-solving",
      name: "WWC Improving Mathematical Problem Solving in Grades 4 Through 8",
      url: "https://ies.ed.gov/ncee/wwc/PracticeGuide/16",
      appliesTo: ["foundation", "bridge"],
      recommendations: [
        {
          id: "whole-class-problems",
          title: "Prepare problems for instruction",
          productRequirement:
            "Problem sets must include teacher-facing purpose, likely strategies, and discussion prompts."
        },
        {
          id: "monitor-reflect",
          title: "Monitor and reflect on problem solving",
          productRequirement:
            "Learners should explain plan, progress, strategy changes, and final reasoning."
        },
        {
          id: "multiple-strategies",
          title: "Expose students to multiple problem-solving strategies",
          productRequirement:
            "Lessons must include strategy comparison instead of only one fixed procedure."
        }
      ]
    },
    {
      id: "wwc-algebra",
      name: "WWC Teaching Strategies for Improving Algebra Knowledge",
      url: "https://ies.ed.gov/ncee/wwc/PracticeGuide/20",
      appliesTo: ["bridge", "scholar"],
      recommendations: [
        {
          id: "solved-problems",
          title: "Use solved problems to analyze reasoning",
          productRequirement:
            "Bridge and Scholar algebra lessons should include worked examples that students critique and compare."
        },
        {
          id: "algebraic-structure",
          title: "Use the structure of algebraic representations",
          productRequirement:
            "Algebra lessons must ask students to connect equations, graphs, tables, verbal descriptions, and structure."
        },
        {
          id: "choose-algebra-strategy",
          title: "Choose from alternative algebraic strategies",
          productRequirement:
            "Students should choose and justify strategies instead of following a single automatic path."
        }
      ]
    }
  ],
  requiredMathLessonMoves: [
    {
      key: "priorKnowledgeCheck",
      label: "Prior knowledge check",
      sourceIds: ["eef-maths-ks2-3", "wwc-rti-math", "wwc-young-math"],
      auditQuestion: "Does the lesson find out what the learner already knows before instruction?"
    },
    {
      key: "misconceptionCheck",
      label: "Misconception check",
      sourceIds: ["eef-maths-ks2-3"],
      auditQuestion: "Does the lesson anticipate common errors and explain why they happen?"
    },
    {
      key: "manipulativeRationale",
      label: "Manipulative rationale",
      sourceIds: ["eef-maths-ks2-3"],
      auditQuestion: "Does the lesson explain why the manipulative fits this concept?"
    },
    {
      key: "representations",
      label: "Representations",
      sourceIds: ["eef-maths-ks2-3", "wwc-problem-solving", "wwc-rti-math"],
      auditQuestion: "Does the lesson connect concrete materials, diagrams, symbols, and language?"
    },
    {
      key: "problemSolvingStrategy",
      label: "Problem-solving strategy",
      sourceIds: ["eef-maths-ks2-3", "wwc-problem-solving"],
      auditQuestion: "Does the lesson include non-routine problems and strategy comparison?"
    },
    {
      key: "workedExample",
      label: "Worked example",
      sourceIds: ["eef-maths-ks2-3", "wwc-algebra", "wwc-rti-math"],
      auditQuestion: "Does the lesson model reasoning and ask students to analyze the model?"
    },
    {
      key: "examplesAndNonExamples",
      label: "Examples and non-examples",
      sourceIds: ["eef-maths-ks2-3"],
      auditQuestion: "Does the lesson contrast what the concept is and is not?"
    },
    {
      key: "knowledgeConnections",
      label: "Knowledge connections",
      sourceIds: ["eef-maths-ks2-3"],
      auditQuestion: "Does the lesson connect facts, procedures, concepts, and transfer?"
    },
    {
      key: "metacognitivePrompt",
      label: "Plan-monitor-evaluate prompt",
      sourceIds: ["eef-maths-ks2-3", "wwc-problem-solving"],
      auditQuestion: "Does the lesson require learners to plan, monitor, evaluate, and explain?"
    },
    {
      key: "interventionTrigger",
      label: "Intervention trigger",
      sourceIds: ["eef-maths-ks2-3", "wwc-rti-math"],
      auditQuestion: "Does progress evidence trigger explicit reteach and cumulative review?"
    },
    {
      key: "transitionBridge",
      label: "Transition bridge",
      sourceIds: ["eef-maths-ks2-3"],
      auditQuestion: "Does the lesson state how the concept connects across grade bands?"
    },
    {
      key: "feedbackFrame",
      label: "Specific feedback frame",
      sourceIds: ["eef-maths-ks2-3", "wwc-rti-math"],
      auditQuestion: "Does feedback say what worked, what to try next, and when to retry?"
    }
  ],
  implementationCycle: [
    {
      phase: "Explore",
      requirement: "Use diagnostics, parent context, and evidence sources to choose the learning problem worth solving."
    },
    {
      phase: "Prepare",
      requirement: "Design lesson moves, staff/parent guidance, materials, accessibility supports, and telemetry before launch."
    },
    {
      phase: "Deliver",
      requirement: "Run the lesson with the planned model, guided practice, feedback, reteach, challenge, and data capture."
    },
    {
      phase: "Sustain",
      requirement: "Use retention and affect data to scale, revise, or retire the lesson pattern."
    }
  ]
};

export const radicalLearningModel = {
  thesis:
    "The product should feel less like school and more like an adaptive learning lab where children play, build, explain, retrieve, and earn meaningful privileges through mastery.",
  principles: [
    {
      id: "retrieve",
      name: "Recall beats re-reading",
      mechanic: "Every lesson ends with low-stakes retrieval, then resurfaces after 1 day, 3 days, 1 week, and 1 month."
    },
    {
      id: "space",
      name: "Short spaced practice",
      mechanic: "Young learners work in 6-10 minute bursts with movement or creative breaks before revisiting the idea."
    },
    {
      id: "make",
      name: "Make the idea visible",
      mechanic: "Students draw, move, sort, build, narrate, or simulate before answering abstract questions."
    },
    {
      id: "explain",
      name: "Explain to learn",
      mechanic: "Students teach a toy, sibling, parent, team, or future self using sentence stems and visual evidence."
    },
    {
      id: "choose",
      name: "Choice creates ownership",
      mechanic: "Learners choose task themes, challenge routes, reward goals, project formats, and review tools."
    },
    {
      id: "belong",
      name: "Learning is social",
      mechanic: "Middle and high school lessons include crew roles, peer explanation, shared artifacts, and group homework."
    },
    {
      id: "feedback",
      name: "Feedback must be usable",
      mechanic: "Feedback says what worked, what to try next, and gives time to act on it before the next score."
    },
    {
      id: "experiment",
      name: "The app learns what works",
      mechanic: "Every activity can be compared by retention, joy, effort, independence, and parent friction."
    }
  ],
  youngLearnerLoop: [
    "Spark curiosity with a story, mystery, image, sound, or object.",
    "Move or build the idea with hands before symbols.",
    "Name the concept in one sentence.",
    "Retrieve it through a game, not a worksheet.",
    "Explain it to someone or something.",
    "Sleep on it and return with a tiny review challenge.",
    "Unlock a meaningful reward when retention holds."
  ],
  experimentLoop: [
    "Choose a learning hypothesis.",
    "Run two lesson variants with similar learners or the same learner across weeks.",
    "Measure immediate mastery, delayed recall, joy rating, frustration, independence, and parent effort.",
    "Keep the variant that improves retention without raising frustration.",
    "Retire or redesign activities that create fast scores but weak delayed recall."
  ],
  rewardSystem: [
    {
      name: "XP",
      rule: "Earned for effort, completion, and reflection; never the only measure of success."
    },
    {
      name: "Mastery badges",
      rule: "Unlocked only after delayed recall or a transfer task proves retention."
    },
    {
      name: "Creative unlocks",
      rule: "Students unlock project themes, lab skins, avatar tools, music loops, printable missions, or challenge maps."
    },
    {
      name: "Family benefits",
      rule: "Parents can define non-monetary privileges such as choosing dinner music, leading a family game, or picking the next field trip topic."
    },
    {
      name: "Crew achievements",
      rule: "Middle and high school teams earn shared recognition for explanation quality and equitable participation."
    }
  ],
  metrics: ["Immediate score", "24-hour recall", "7-day recall", "Transfer task", "Joy rating", "Frustration rating", "Time to independence", "Parent support minutes"]
};

export const parentOnboardingModel = {
  requiredSteps: [
    {
      id: "parent-account",
      title: "Parent account",
      purpose: "A verified adult owns the household, consent, learning records, and reward settings."
    },
    {
      id: "child-profile",
      title: "Learner profile",
      purpose: "Create a child profile with nickname, grade band, schedule, accommodations, and learning goals."
    },
    {
      id: "consent",
      title: "Consent and privacy",
      purpose: "Record parent consent before child data, AI history, progress, or portfolio artifacts are collected."
    },
    {
      id: "placement",
      title: "Diagnostic placement",
      purpose: "Start from what the learner can do now instead of locking them into age-only pacing."
    },
    {
      id: "reward-plan",
      title: "Reward plan",
      purpose: "Let families choose non-monetary benefits and creative unlocks tied to retention."
    }
  ],
  childDataMinimum: ["Nickname", "Age band", "Grade", "Parent relationship", "Progress", "Answers", "Mastery", "Accommodations"],
  parentControls: ["View profile", "Edit accommodations", "AI permission", "Export records", "Delete request", "Reward settings", "Placement override"]
};

export const diagnosticBlueprints = [
  {
    id: "reading-foundation",
    academyId: "foundation",
    subject: "ela",
    title: "Reading foundations placement",
    measures: ["Phonemic awareness", "Decoding", "Fluency", "Vocabulary", "Comprehension"],
    recommendationRule: "Place by lowest fragile skill, then retest after three successful retrieval checks."
  },
  {
    id: "math-foundation",
    academyId: "foundation",
    subject: "math",
    title: "Math foundations placement",
    measures: ["Number sense", "Operations", "Fractions", "Measurement", "Problem solving"],
    recommendationRule: "Start at the first prerequisite below 80% and use manipulatives before symbols."
  },
  {
    id: "bridge-transition",
    academyId: "bridge",
    subject: "learning-skills",
    title: "Middle school independence check",
    measures: ["Reading stamina", "Note-taking", "Evidence use", "Planning", "Collaboration"],
    recommendationRule: "Pair academic placement with an independence support plan."
  },
  {
    id: "scholar-course-readiness",
    academyId: "scholar",
    subject: "career-college",
    title: "High school course readiness",
    measures: ["Course prerequisites", "Writing evidence", "Study system", "Project follow-through", "Portfolio readiness"],
    recommendationRule: "Recommend course level plus internal record supports and parent approval."
  }
];

export const rewardCatalog = [
  {
    id: "creative-unlocks",
    title: "Creative unlocks",
    examples: ["Avatar studio", "Lab theme", "Music loop", "Printable mission map"],
    guardrail: "Unlocked through retention or transfer, not raw screen time."
  },
  {
    id: "family-benefits",
    title: "Family benefits",
    examples: ["Choose dinner music", "Pick field trip topic", "Lead family game", "Choose weekend science build"],
    guardrail: "Parent-defined, non-monetary, and never public ranking."
  },
  {
    id: "mastery-badges",
    title: "Mastery badges",
    examples: ["Fraction Trail", "Forecast Crew", "Systems Biologist", "Evidence Builder"],
    guardrail: "Requires delayed recall or transfer evidence."
  },
  {
    id: "crew-achievements",
    title: "Crew achievements",
    examples: ["Best explanation", "Strongest evidence trail", "Most improved collaboration", "Shared artifact completed"],
    guardrail: "Rewards equitable contribution and explanation quality."
  }
];

export const experimentTemplates = [
  {
    id: "movement-vs-screen",
    title: "Movement before screen",
    hypothesis: "K-5 students retain concrete math better when they move/build before answering on screen.",
    variantA: "Screen-only guided practice",
    variantB: "Movement or manipulative task before guided practice",
    targetMetric: "7-day recall"
  },
  {
    id: "choice-vs-fixed",
    title: "Choice of task theme",
    hypothesis: "Learners persist longer when they choose the project theme while the objective stays fixed.",
    variantA: "Fixed task theme",
    variantB: "Student chooses from three approved themes",
    targetMetric: "Joy rating and transfer task"
  },
  {
    id: "group-explain",
    title: "Group explanation roles",
    hypothesis: "Middle/high learners retain more when every student owns a role and explains evidence.",
    variantA: "Solo homework",
    variantB: "Structured crew roles with shared artifact",
    targetMetric: "Transfer task"
  }
];

export const agentTeam = [
  {
    id: "manager",
    title: "Manager Agent: Codex Orchestrator",
    owns: ["Task sequencing", "Agent prompts", "Integration review", "Final delivery"]
  },
  {
    id: "curriculum",
    title: "Curriculum And Standards Agent",
    owns: ["K-12 maps", "Standards alignment", "Lesson taxonomy", "Unit templates"]
  },
  {
    id: "ux",
    title: "Product And UX Agent",
    owns: ["Student flows", "Parent workflows", "Admin screens", "Age-specific UX rules"]
  },
  {
    id: "architecture",
    title: "Technical Architecture Agent",
    owns: ["Data model", "Service boundaries", "Build order", "Deployment path"]
  },
  {
    id: "frontend",
    title: "Frontend Implementation Agent",
    owns: ["Responsive shell", "Student dashboard", "Lesson player", "Visual system"]
  },
  {
    id: "backend",
    title: "Backend And Learning Engine Agent",
    owns: ["Mastery rules", "Assignments", "Reports", "Progress APIs"]
  },
  {
    id: "ai-safety",
    title: "AI Tutor And Safety Agent",
    owns: ["Hint rules", "Blocked answer policy", "Age controls", "AI logs", "First-principles student questioning"]
  },
  {
    id: "teacher-explanation",
    title: "Teacher And Explanation Design Agent",
    owns: ["Direct teaching plan", "Multiple explanation routes", "Checks for understanding", "Group task design"]
  },
  {
    id: "student-tutor",
    title: "Student Tutor Agent",
    owns: ["Student-facing stuck-point interview", "Hint sequence", "Mode switching", "Tutor feedback loop"]
  },
  {
    id: "fun-retention",
    title: "Fun And Retention Design Agent",
    owns: ["Lesson fun factor", "Retention mechanics", "Mastery-tied rewards", "Rubric engagement checks"]
  },
  {
    id: "syllabus-research",
    title: "Curriculum Web Audit And Misconception Research Agent",
    owns: ["Staff-side web audit", "Usual syllabus comparison", "Common trouble spots", "Source-backed redesign prompts"]
  },
  {
    id: "truth-policy",
    title: "Truth And Fact-Check Agent",
    owns: ["Tutor accuracy review", "Source requirements", "Misunderstanding reasoning quality", "External research escalation"]
  },
  {
    id: "visual-learning",
    title: "Visual Learning Agent",
    owns: ["Lesson image audits", "Diagram prompt generation", "Tutor visual supports", "OpenAI image review queue"]
  },
  {
    id: "content-ops",
    title: "Content Operations Agent",
    owns: ["Draft workflow", "Review gates", "Quiz bank rules", "Batch production"]
  },
  {
    id: "qa",
    title: "QA And Compliance Agent",
    owns: ["Launch gates", "Privacy checks", "Accessibility", "Curriculum integrity"]
  }
];

export const explanationModes = [
  {
    id: "diagnose",
    title: "Diagnose First",
    studentLabel: "Find my stuck point",
    strategy: "Classify the confusion and give one targeted reteach move.",
    uses: ["confusion analysis", "helper note"]
  },
  {
    id: "visual",
    title: "Picture Or Diagram",
    studentLabel: "Show me a picture",
    strategy: "Turn the idea into a visual model, sketch prompt, or diagram callout.",
    uses: ["diagram", "visual model"]
  },
  {
    id: "metaphor",
    title: "Metaphor Or Story",
    studentLabel: "Tell me a metaphor",
    strategy: "Use a safe age-appropriate metaphor before the learner retries.",
    uses: ["metaphor", "story"]
  },
  {
    id: "first-step",
    title: "First Step",
    studentLabel: "Show first step",
    strategy: "Give only the first action and ask the learner to continue.",
    uses: ["step", "scaffold"]
  },
  {
    id: "real-world",
    title: "Real-World Example",
    studentLabel: "Give real example",
    strategy: "Connect the lesson to a concrete task or everyday situation.",
    uses: ["example", "transfer"]
  },
  {
    id: "gentle-quiz",
    title: "Gentle Quiz",
    studentLabel: "Quiz me gently",
    strategy: "Ask one low-stakes retrieval question to test the repaired idea.",
    uses: ["retrieval", "self-check"]
  },
  {
    id: "first-principles",
    title: "First Principles",
    studentLabel: "Start from basics",
    strategy: "Break the idea into what is true, what changes, and what rule must stay true.",
    uses: ["first principles", "reasoning"]
  }
];

export const syllabusResearchSources = [
  {
    id: "common-core-math",
    name: "Common Core Mathematics Standards",
    url: "https://www.thecorestandards.org/Math/",
    use: "Map usual U.S. math domains, grade progressions, and practice expectations."
  },
  {
    id: "ngss",
    name: "Next Generation Science Standards",
    url: "https://www.nextgenscience.org/",
    use: "Map science disciplinary core ideas, practices, crosscutting concepts, and quality unit rubrics."
  },
  {
    id: "ies-wwc-practice-guides",
    name: "IES What Works Clearinghouse Practice Guides",
    url: "https://ies.ed.gov/ncee/wwc/practiceguides",
    use: "Find evidence-backed teaching recommendations and intervention patterns."
  },
  {
    id: "nations-report-card",
    name: "NAEP Nation's Report Card",
    url: "https://www.nationsreportcard.gov/",
    use: "Compare broad performance patterns and released-item difficulty signals."
  },
  {
    id: "state-doe-syllabi",
    name: "State Department Of Education Course Guides",
    url: "staff-research-required",
    use: "Cross-check local scope-and-sequence differences before state-specific publishing."
  },
  {
    id: "ca-common-core-math-grade-6",
    name: "California Common Core Mathematics Standards - Grade 6",
    url: "https://www.cde.ca.gov/be/st/ss/documents/ccssmathstandardaug2013.pdf",
    use: "Primary standards source for Grade 6 math domains, practices, and standards tags."
  },
  {
    id: "ca-common-core-ela-grade-6",
    name: "California Common Core ELA/Literacy Standards - Grade 6",
    url: "https://www.cde.ca.gov/be/st/ss/documents/finalelaccssstandards.pdf",
    use: "Primary standards source for Grade 6 reading, writing, language, speaking, and listening."
  },
  {
    id: "ca-ngss-grade-6",
    name: "California Next Generation Science Standards - Grade 6 Reference",
    url: "https://www.cde.ca.gov/pd/ca/sc/ngssstandards.asp",
    use: "Primary standards source for middle-school science practices, disciplinary ideas, and crosscutting concepts."
  },
  {
    id: "ca-history-social-science-grade-6",
    name: "California History-Social Science Standards - Grade 6",
    url: "https://www.cde.ca.gov/be/st/ss/documents/histsocscistnd.pdf",
    use: "Primary standards source for Grade 6 ancient world history and geography scope."
  },
  {
    id: "ixl-grade-6-math-reference",
    name: "IXL Grade 6 Math Skills, Lessons, and Videos",
    url: "https://www.ixl.com/math/grade-6/skills",
    use: "Commercial reference only: compare coverage categories and link staff to external practice/video pages without copying proprietary skill-plan content."
  }
];

export const syllabusResearchFindings = [
  {
    id: "finding-common-core-math-focus",
    sourceId: "common-core-math",
    sourceName: "Common Core Mathematics Standards",
    sourceUrl: "https://www.thecorestandards.org/Math/",
    sourceType: "official-standards",
    checkedAt: "2026-06-13",
    subjects: ["math"],
    gradeBands: ["K-5", "6-8", "9-12"],
    claim: "Math scope should be focused, coherent across grades, and require students to explain why an answer or method is true.",
    troubleSignal: "Students may get fast answers without understanding the structure or reason behind the method.",
    redesignMove: "Keep each lesson anchored to one core idea, a representation, and a student explanation prompt."
  },
  {
    id: "finding-wwc-fractions-number-line",
    sourceId: "wwc-fractions-k8",
    sourceName: "WWC Developing Effective Fractions Instruction for Kindergarten Through 8th Grade",
    sourceUrl: "https://ies.ed.gov/ncee/wwc/PracticeGuide/15",
    sourceType: "practice-guide",
    checkedAt: "2026-06-13",
    subjects: ["math"],
    gradeBands: ["K-5", "6-8"],
    claim: "Fractions should be taught as numbers that extend the whole-number system, with number lines used as a central representation.",
    troubleSignal: "Students often treat fractions as two whole numbers or count marks instead of equal spaces.",
    redesignMove: "Use sharing, proportionality, number lines, and procedure-why explanations before symbolic shortcuts."
  },
  {
    id: "finding-wwc-elementary-math-intervention",
    sourceId: "wwc-elementary-math-intervention",
    sourceName: "WWC Assisting Students Struggling with Mathematics: Intervention in the Elementary Grades",
    sourceUrl: "https://ies.ed.gov/ncee/wwc/PracticeGuide/26",
    sourceType: "practice-guide",
    checkedAt: "2026-06-13",
    subjects: ["math"],
    gradeBands: ["K-5", "6-8"],
    claim: "Students who struggle benefit from systematic instruction, clear mathematical language, concrete and semi-concrete representations, number lines, and deliberate word-problem instruction.",
    troubleSignal: "Students may miss the language, representation, or problem structure even when they can follow a memorized routine.",
    redesignMove: "Add explicit vocabulary, a chosen representation, a number-line or model check, and a short word-problem transfer task."
  },
  {
    id: "finding-eef-maths-difficulty-knowledge",
    sourceId: "eef-maths-ks2-3",
    sourceName: "EEF Improving Mathematics in Key Stages 2 and 3",
    sourceUrl: "https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/maths-ks-2-3",
    sourceType: "guidance-report",
    checkedAt: "2026-06-13",
    subjects: ["math"],
    gradeBands: ["K-5", "6-8"],
    claim: "Strong math teaching depends on knowing how students learn mathematics, the difficulties they are likely to encounter, and how the idea can be taught effectively.",
    troubleSignal: "A lesson may cover a standard without explicitly predicting and repairing likely student difficulties.",
    redesignMove: "Require every lesson to include likely hard parts, misconception checks, and a targeted reteach path."
  },
  {
    id: "finding-ngss-three-dimensional",
    sourceId: "ngss",
    sourceName: "Next Generation Science Standards",
    sourceUrl: "https://www.nextgenscience.org/",
    sourceType: "official-standards",
    checkedAt: "2026-06-13",
    subjects: ["science"],
    gradeBands: ["K-5", "6-8", "9-12"],
    claim: "Science learning should combine disciplinary core ideas, science and engineering practices, and crosscutting concepts.",
    troubleSignal: "Students may memorize labels without using practices, evidence, models, or crosscutting ideas to explain a phenomenon.",
    redesignMove: "Turn science lessons into phenomenon-first investigations with a model, evidence move, and explanation task."
  },
  {
    id: "finding-ca-g6-math-source-set",
    sourceId: "ca-common-core-math-grade-6",
    sourceName: "California Common Core Mathematics Standards - Grade 6",
    sourceUrl: "https://www.cde.ca.gov/be/st/ss/documents/ccssmathstandardaug2013.pdf",
    sourceType: "official-standards",
    checkedAt: "2026-07-12",
    subjects: ["math"],
    gradeBands: ["6-8"],
    claim: "Bridge Academy Grade 6 math should be organized around ratios, the number system, expressions and equations, geometry, statistics, and mathematical practices.",
    troubleSignal: "A learner can appear fluent on isolated arithmetic while still missing ratio meaning, signed-number direction, variable meaning, or data variability.",
    redesignMove: "Create original V3 math lessons that pair each standards cluster with a model, a real situation, an interactive task, a misconception check, and a transfer proof."
  },
  {
    id: "finding-ca-g6-ela-source-set",
    sourceId: "ca-common-core-ela-grade-6",
    sourceName: "California Common Core ELA/Literacy Standards - Grade 6",
    sourceUrl: "https://www.cde.ca.gov/be/st/ss/documents/finalelaccssstandards.pdf",
    sourceType: "official-standards",
    checkedAt: "2026-07-12",
    subjects: ["ela", "writing"],
    gradeBands: ["6-8"],
    claim: "Bridge Academy Grade 6 ELA should teach close reading, evidence, theme or central idea, vocabulary, writing arguments and explanations, research, discussion, and conventions.",
    troubleSignal: "Students often summarize without evidence, quote without explaining, or write paragraphs that lack a claim-reason-evidence chain.",
    redesignMove: "Use app-led reading missions with annotation tools, claim builders, sentence-combining supports, revision loops, and short oral explanation checks."
  },
  {
    id: "finding-ca-g6-science-source-set",
    sourceId: "ca-ngss-grade-6",
    sourceName: "California Next Generation Science Standards - Grade 6 Reference",
    sourceUrl: "https://www.cde.ca.gov/pd/ca/sc/ngssstandards.asp",
    sourceType: "official-standards",
    checkedAt: "2026-07-12",
    subjects: ["science"],
    gradeBands: ["6-8"],
    claim: "Bridge Academy Grade 6 science should be phenomenon-driven and require models, evidence, data interpretation, explanations, and engineering or design decisions.",
    troubleSignal: "Students may memorize science terms without connecting systems, scale, cause and effect, data, and model limits.",
    redesignMove: "Build investigation lessons that start with a visible phenomenon, ask students to model what is happening, test evidence, revise the model, and transfer the idea to a new case."
  },
  {
    id: "finding-ca-g6-social-studies-source-set",
    sourceId: "ca-history-social-science-grade-6",
    sourceName: "California History-Social Science Standards - Grade 6",
    sourceUrl: "https://www.cde.ca.gov/be/st/ss/documents/histsocscistnd.pdf",
    sourceType: "official-standards",
    checkedAt: "2026-07-12",
    subjects: ["social-studies"],
    gradeBands: ["6-8"],
    claim: "Bridge Academy Grade 6 social studies should center ancient world history, geography, primary-source thinking, chronology, culture, government, and economic systems.",
    troubleSignal: "Students can remember names and dates but miss geography, cause and effect, source reliability, and why civilizations changed.",
    redesignMove: "Use map labs, artifact investigations, timeline puzzles, source comparisons, civic and economic simulations, and group museum-style projects."
  },
  {
    id: "finding-ixl-g6-math-reference-boundary",
    sourceId: "ixl-grade-6-math-reference",
    sourceName: "IXL Grade 6 Math Skills, Lessons, and Videos",
    sourceUrl: "https://www.ixl.com/math/grade-6/skills",
    sourceType: "commercial-reference",
    checkedAt: "2026-07-12",
    subjects: ["math"],
    gradeBands: ["6-8"],
    claim: "IXL Grade 6 math pages provide a useful external coverage signal for skills, lessons, and videos, but the app must not copy proprietary lesson text, skill banks, assessment items, or sequence wholesale.",
    troubleSignal: "Directly copying a commercial skill plan would create copyright and product-differentiation risk.",
    redesignMove: "Store IXL URLs as staff reference links and create original Nexus V3 lessons from official standards, internal pedagogy, and staff-approved source-ledger summaries."
  }
];

export const funRetentionRubric = [
  {
    id: "curiosity",
    label: "Curiosity hook",
    question: "Does the lesson begin with a mystery, story, question, image, object, problem, or challenge worth caring about?"
  },
  {
    id: "active_build",
    label: "Active build",
    question: "Does the learner move, draw, sort, build, debate, simulate, diagnose, design, or explain instead of only reading?"
  },
  {
    id: "visual_model",
    label: "Visual model",
    question: "Can the learner see the relationship, sequence, system, comparison, or misconception?"
  },
  {
    id: "retrieval",
    label: "Retrieval loop",
    question: "Does the lesson ask the learner to recall and use the idea again after time passes?"
  },
  {
    id: "student_choice",
    label: "Student choice",
    question: "Can the learner choose a strategy, artifact, example, role, or explanation mode?"
  },
  {
    id: "mastery_reward",
    label: "Mastery reward",
    question: "Is the reward tied to transfer or delayed recall instead of raw completion?"
  }
];

export const aiTutorToolContract = {
  id: "lesson-scoped-hint-tutor",
  ownerAgentId: "ai-safety",
  purpose: "Help K-12 learners explain what they do not understand, then give one targeted hint or reteach move without completing graded work.",
  responseStages: [
    "Check parent consent and learner role.",
    "Bind the conversation to the current lesson objective, standards tags, teaching support, and common misunderstandings.",
    "Ask the learner to write the exact stuck point before teaching.",
    "Classify the stuck point as vocabulary, visual model, first step, reasoning, misconception, safety, or direct-answer seeking.",
    "Select the best explanation mode: diagnose, visual, metaphor, first step, real-world example, gentle quiz, or first principles.",
    "Give one age-appropriate hint, diagram suggestion, or reteach move.",
    "Run truth-policy checks for factual accuracy, lesson grounding, answer-policy compliance, and whether external research is needed.",
    "Ask the learner to retry, explain, draw, or compare before any next hint.",
    "Log the interaction for parent/teacher visibility and safety review."
  ],
  allowedBehaviors: [
    "Ask guiding questions before explaining.",
    "Use lesson summaries, diagram callouts, helper notes, and common misunderstandings.",
    "Recommend reviewed visuals or request a new visual prompt through the Tool Gateway.",
    "Adapt language for K-5, Bridge, and Scholar learners.",
    "Switch teaching strategy when the student asks for a picture, metaphor, first step, real example, or gentle quiz.",
    "Use first-principles questioning when a concept should be rebuilt from what is true, what changes, and what must stay true.",
    "Explain a method step by step after the student identifies the stuck point.",
    "Escalate unsafe language to parent/teacher review."
  ],
  blockedBehaviors: [
    "Give final quiz or homework answers on request.",
    "Generate student-facing images without human visual review.",
    "Use unrestricted web search or external tools from a student session.",
    "Ask for unnecessary personal data.",
    "Guarantee grades, credits, diagnoses, test outcomes, or official placement.",
    "Bypass parent consent, role checks, or content publication gates."
  ],
  permittedTools: [
    {
      toolId: "lesson_audit",
      use: "Inspect objective, teaching support, evidence moves, and misconceptions before tutoring."
    },
    {
      toolId: "standards_lookup",
      use: "Explain which broad standards family a lesson is aligned to without hardcoding a state."
    },
    {
      toolId: "visual_generation",
      use: "Staff-only prompt preparation for a reviewed diagram or image; never student-triggered."
    },
    {
      toolId: "content_review",
      use: "Staff review of draft readiness before a lesson becomes student-facing."
    },
    {
      toolId: "truth_policy_review",
      use: "Grade tutor response accuracy, source needs, reasoning quality, and whether staff research or fact-checking is required."
    },
    {
      toolId: "explanation_variation_studio",
      use: "Staff/parent planning for multiple teacher explanations, visual types, tutor handoffs, and confusion-specific alternatives."
    },
    {
      toolId: "fun_retention_design",
      use: "Audit whether a lesson is fun, active, visual, collaborative, and retention-focused."
    },
    {
      toolId: "syllabus_misconception_research",
      use: "Staff-only planning for syllabus, standards, misconception, and difficulty research before content revisions."
    },
    {
      toolId: "live_curriculum_source_audit",
      use: "Staff-only live fetch of approved curriculum/practice-guide sources when the tutor or truth-policy review needs external evidence."
    }
  ],
  auditSignals: [
    "direct-answer request",
    "unsafe language",
    "repeated confusion",
    "missing lesson support",
    "generated visual requested",
    "truth-policy review needed",
    "external research needed",
    "parent consent disabled",
    "age-band mismatch"
  ]
};

const subjectStandards = {
  ela: ["ccss-ela"],
  writing: ["ccss-ela"],
  math: ["ccss-math"],
  science: ["ngss"],
  "social-studies": ["c3"],
  "health-pe": ["shape"],
  "computer-science": ["k12cs"],
  "arts-media": ["arts"],
  "life-skills": ["sel"],
  "world-language": ["ccss-ela"],
  "career-college": ["sel", "ccss-ela"]
};

const foundationUnits = {
  K: {
    ela: ["Letters and sounds", "Rhyming and syllables", "Sight words", "Read-aloud comprehension"],
    writing: ["Tracing", "Drawing stories", "Labeling pictures", "Simple sentences"],
    math: ["Numbers 0-20", "Counting and comparing", "Shapes and patterns", "Add and subtract within 10"],
    science: ["Weather and seasons", "Plants and animals", "Five senses", "Pushes and pulls"],
    "social-studies": ["Me and my family", "Classroom rules", "Community helpers", "Maps and cultures"],
    "health-pe": ["Feelings", "Sharing", "Routines", "Body safety"],
    "computer-science": ["Directions", "Sequencing", "Sorting", "Unplugged coding games"],
    "arts-media": ["Color", "Line", "Rhythm", "Story pictures"],
    "life-skills": ["Kindness", "Routines", "Teamwork", "Perseverance"]
  },
  1: {
    ela: ["Short vowels", "Long vowels", "Blends and digraphs", "Story elements"],
    writing: ["Complete sentences", "Capitalization and punctuation", "Opinion writing", "Personal narratives"],
    math: ["Add and subtract within 20", "Place value to 120", "Time and money", "Shapes"],
    science: ["Light and sound", "Animal traits", "Plant parts", "Sky patterns"],
    "social-studies": ["Neighborhoods", "Rules and laws", "Needs and wants", "American symbols"],
    "health-pe": ["Friendship", "Problem solving", "Nutrition", "Hygiene"],
    "computer-science": ["Algorithms", "Loops", "Pattern commands", "Digital citizenship"],
    "arts-media": ["Drawing choices", "Beat", "Movement", "Visual storytelling"],
    "life-skills": ["Friendship", "Self-control", "Helping", "Reflection"]
  },
  2: {
    ela: ["Multisyllable words", "Prefixes and suffixes", "Main idea", "Nonfiction features"],
    writing: ["Paragraphs", "Opinion pieces", "Informational writing", "Narrative sequence"],
    math: ["Add and subtract within 1000", "Place value", "Money and time", "Arrays and multiplication"],
    science: ["Landforms", "Erosion", "Habitats", "Plant life cycles"],
    "social-studies": ["Communities past and present", "Geography", "Goods and services", "Local government"],
    "health-pe": ["Conflict resolution", "Growth mindset", "Personal safety", "Movement skills"],
    "computer-science": ["Events", "Loops", "Block-code puzzles", "Debugging"],
    "arts-media": ["Texture", "Pattern", "Song form", "Media messages"],
    "life-skills": ["Goal setting", "Responsibility", "Listening", "Problem solving"]
  },
  3: {
    ela: ["Context clues", "Theme", "Main idea", "Point of view"],
    writing: ["Multi-paragraph writing", "Opinion essays", "Research reports", "Narrative scenes"],
    math: ["Multiplication", "Division", "Fractions", "Area and perimeter"],
    science: ["Forces and motion", "Weather and climate", "Ecosystems", "Engineering challenges"],
    "social-studies": ["Regions", "Native peoples", "State history", "Citizenship"],
    "health-pe": ["Goal setting", "Empathy", "Stress basics", "Healthy choices"],
    "computer-science": ["Conditionals", "Debugging", "Block projects", "Digital safety"],
    "arts-media": ["Composition", "Rhythm patterns", "Character design", "Presentation"],
    "life-skills": ["Empathy", "Planning", "Stress tools", "Collaboration"]
  },
  4: {
    ela: ["Literary analysis", "Informational text", "Figurative language", "Evidence"],
    writing: ["Opinion essays", "Explanatory essays", "Research", "Editing and revising"],
    math: ["Multi-digit multiplication", "Long division", "Equivalent fractions", "Decimals and geometry"],
    science: ["Energy", "Waves", "Earth systems", "Natural hazards"],
    "social-studies": ["U.S. geography", "Early America", "State history", "Government"],
    "health-pe": ["Digital safety", "Communication", "Resilience", "Nutrition"],
    "computer-science": ["Variables", "Simple games", "Digital citizenship", "Input and output"],
    "arts-media": ["Perspective", "Ensemble music", "Media critique", "Creative revision"],
    "life-skills": ["Resilience", "Communication", "Planning", "Decision making"]
  },
  5: {
    ela: ["Theme", "Author craft", "Text structure", "Research reading"],
    writing: ["Argument writing", "Informative essays", "Narrative writing", "Source citation basics"],
    math: ["Fraction operations", "Decimals", "Volume", "Coordinate planes"],
    science: ["Matter", "Ecosystems", "Earth systems", "Space systems"],
    "social-studies": ["Colonial America", "Revolution", "Constitution basics", "Civic rights"],
    "health-pe": ["Puberty basics", "Peer pressure", "Emotional regulation", "Decision making"],
    "computer-science": ["Game design", "Algorithms", "Loops and conditionals", "Debugging"],
    "arts-media": ["Visual voice", "Music structure", "Digital media", "Portfolio critique"],
    "life-skills": ["Self-management", "Peer pressure", "Study habits", "Service"]
  }
};

const middleUnits = {
  6: {
    ela: ["Mythology", "Fiction", "Nonfiction", "Claims and evidence"],
    writing: ["Personal narrative", "Literary response", "Informational essay", "Argument essay"],
    math: ["Ratios and rates", "Fractions and division", "Negative numbers", "Statistics"],
    science: ["Earth systems", "Weather and climate", "Energy", "Ecosystems"],
    "social-studies": ["Mesopotamia", "Egypt", "Greece and Rome", "World geography"],
    "health-pe": ["Fitness planning", "Nutrition", "Mental health", "Online safety"],
    "computer-science": ["Algorithms", "Loops", "Conditionals", "Intro Python"],
    "arts-media": ["Visual design", "Music and culture", "Media literacy", "Presentation"],
    "life-skills": ["Study habits", "Planner use", "Teamwork", "Online safety"]
  },
  7: {
    ela: ["Character analysis", "Nonfiction argument", "Poetry", "Media literacy"],
    writing: ["Research paper", "Argumentative essay", "Explanatory essay", "Creative narrative"],
    math: ["Proportional relationships", "Percents", "Rational numbers", "Probability and geometry"],
    science: ["Cells", "Body systems", "Genetics", "Natural selection"],
    "social-studies": ["Medieval world", "Renaissance", "Exploration", "World religions"],
    "health-pe": ["Conflict resolution", "Financial basics", "Digital footprint", "Safety"],
    "computer-science": ["Python functions", "Variables", "Interactive stories", "Data collection"],
    "arts-media": ["Design systems", "Audio production", "Rhetoric in media", "Digital collage"],
    "life-skills": ["Conflict resolution", "Financial basics", "Self-advocacy", "Digital footprint"]
  },
  8: {
    ela: ["Dystopian fiction", "Historical fiction", "Speeches", "Literary analysis"],
    writing: ["Thesis statements", "Source-based writing", "Research", "Formal debate"],
    math: ["Linear equations", "Functions", "Slope and systems", "Pythagorean theorem"],
    science: ["Forces and motion", "Waves", "Chemistry basics", "Space systems"],
    "social-studies": ["U.S. founding", "Constitution", "Civil War", "Reconstruction"],
    "health-pe": ["High-school readiness", "Stress management", "Healthy relationships", "First aid"],
    "computer-science": ["Python projects", "Web pages", "Cybersecurity basics", "AI and data ethics"],
    "arts-media": ["Documentary", "Music technology", "Theater design", "Portfolio presentation"],
    "life-skills": ["Note-taking", "Time management", "Career awareness", "Responsible choices"]
  }
};

const scholarCourses = {
  9: [
    ["English 9", "ela", ["Short stories", "Mythology", "Novels and drama", "Poetry and literary analysis"]],
    ["Algebra I", "math", ["Expressions", "Equations and inequalities", "Linear functions", "Systems and quadratics intro"]],
    ["Biology", "science", ["Cells", "Genetics", "Evolution", "Ecology and body systems"]],
    ["World History I", "social-studies", ["Early civilizations", "Classical empires", "Religions", "Medieval exchange"]],
    ["Health and PE 9", "health-pe", ["Fitness plans", "Nutrition", "Sleep and mental health", "Substance prevention"]],
    ["Intro Computer Science", "computer-science", ["Digital literacy", "Python basics", "HTML and CSS", "Responsible AI"]],
    ["Study Systems", "life-skills", ["Note-taking", "Goal planning", "Organization", "Self-advocacy"]]
  ],
  10: [
    ["English 10", "ela", ["World literature", "Rhetoric", "Research writing", "Media analysis"]],
    ["Geometry", "math", ["Logic and proofs", "Triangles and circles", "Area and volume", "Transformations"]],
    ["Chemistry", "science", ["Matter and atoms", "Periodic table", "Bonding and reactions", "Acids and bases"]],
    ["World History II", "social-studies", ["Renaissance", "Revolutions", "Industrialization", "Modern global issues"]],
    ["Health and PE 10", "health-pe", ["Personal wellness", "Relationships", "Stress", "First aid"]],
    ["Applied Programming", "computer-science", ["Python projects", "Data", "Web apps", "Cybersecurity basics"]],
    ["Communication", "life-skills", ["Public speaking", "Collaboration", "Digital reputation", "Feedback"]]
  ],
  11: [
    ["American Literature", "ela", ["Foundational texts", "Novels and poetry", "Rhetoric", "Literary movements"]],
    ["Algebra II", "math", ["Functions", "Polynomials", "Exponentials and logs", "Statistics and trigonometry intro"]],
    ["Physics or Environmental Science", "science", ["Motion and forces", "Energy and waves", "Electricity", "Climate and sustainability"]],
    ["U.S. History", "social-studies", ["Revolution and Constitution", "Civil War", "Industrialization", "Civil rights to modern America"]],
    ["Economics and Finance Intro", "career-college", ["Budgeting", "Credit", "Taxes", "Markets and investing"]],
    ["CS and Career Studio", "computer-science", ["App design", "Game design", "Data science", "Portfolio project"]],
    ["Career Readiness", "life-skills", ["Resume", "Internships", "Career research", "Professional communication"]]
  ],
  12: [
    ["English 12", "ela", ["British and world literature", "Advanced composition", "Argument", "Capstone research"]],
    ["Math Option", "math", ["Precalculus", "Statistics", "Consumer math", "Financial algebra"]],
    ["Science Option", "science", ["Physics", "Anatomy", "Environmental science", "Astronomy and forensics"]],
    ["Government", "social-studies", ["Constitution", "Branches and courts", "Elections", "Civil rights and public policy"]],
    ["Economics", "career-college", ["Microeconomics", "Macroeconomics", "Personal finance", "Entrepreneurship"]],
    ["College and Career", "career-college", ["Applications", "Scholarships", "Interviews", "Portfolio and business planning"]],
    ["Capstone", "life-skills", ["Research project", "Product build", "Community project", "Creative portfolio"]]
  ]
};

const academyDefinitions = [
  {
    id: "foundation",
    name: "Foundation Academy",
    range: "K-5",
    purpose: "Reading, writing, math foundations, science, early civics, creativity, and habits.",
    style: "Bright, guided, parent-friendly, short sessions.",
    grades: ["K", "1", "2", "3", "4", "5"],
    targetLessons: 2100
  },
  {
    id: "bridge",
    name: "Bridge Academy",
    range: "6-8",
    purpose: "Middle-school mastery, critical thinking, research, labs, essays, and algebra readiness.",
    style: "Independent, quest-based, skill-tree progress.",
    grades: ["6", "7", "8"],
    targetLessons: 1400
  },
  {
    id: "scholar",
    name: "Scholar Academy",
    range: "9-12",
    purpose: "High-school courses, internal progress records, college/career readiness, and portfolios.",
    style: "Course-based, efficient, transcript-style progress without accreditation claims.",
    grades: ["9", "10", "11", "12"],
    targetLessons: 2600
  }
];

export const lessonTemplate = [
  "Learning objective",
  "Warm-up",
  "Teach section",
  "Guided practice",
  "Interactive activity",
  "Independent practice",
  "Mini quiz",
  "Mastery score",
  "Reteach path",
  "Challenge path",
  "Parent or teacher report",
  "Badge or XP reward"
];

function standardsFor(subject) {
  return subjectStandards[subject] || ["ccss-ela"];
}

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function createCourse(academyId, grade, title, subject, units) {
  const id = `${academyId}-${slug(grade)}-${slug(title)}`;
  return {
    id,
    grade: String(grade),
    title,
    subject,
    standards: standardsFor(subject),
    unitCount: units.length,
    units: units.map((name, index) => ({
      id: `${id}-u${index + 1}`,
      title: name,
      lessonTarget: academyId === "scholar" ? 24 : 18,
      requiredLessonSections: lessonTemplate
    }))
  };
}

function buildAcademy(definition) {
  const grades = definition.grades.map((grade) => {
    let courses;
    if (definition.id === "foundation") {
      courses = Object.entries(foundationUnits[grade]).map(([subject, units]) =>
        createCourse(definition.id, grade, subject.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()), subject, units)
      );
    } else if (definition.id === "bridge") {
      courses = Object.entries(middleUnits[grade]).map(([subject, units]) =>
        createCourse(definition.id, grade, subject.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()), subject, units)
      );
    } else {
      courses = scholarCourses[grade].map(([title, subject, units]) =>
        createCourse(definition.id, grade, title, subject, units)
      );
    }

    return {
      id: `${definition.id}-${slug(grade)}`,
      label: grade === "K" ? "Kindergarten" : `Grade ${grade}`,
      grade: String(grade),
      courses
    };
  });

  return {
    ...definition,
    grades,
    courseCount: grades.reduce((sum, grade) => sum + grade.courses.length, 0),
    plannedUnitCount: grades.reduce((sum, grade) => sum + grade.courses.reduce((count, course) => count + course.units.length, 0), 0)
  };
}

export const curriculum = {
  academies: academyDefinitions.map(buildAcademy),
  totalTargetLessons: academyDefinitions.reduce((sum, academy) => sum + academy.targetLessons, 0)
};

const basePilotLessons = [
  {
    id: "g3-fractions-number-line",
    academyId: "foundation",
    grade: "3",
    subject: "math",
    courseTitle: "Math",
    unitTitle: "Fractions",
    title: "Fractions on a Number Line",
    objective: "Place unit fractions and equivalent fractions on a number line.",
    standards: ["ccss-math"],
    estimatedMinutes: 22,
    masteryThreshold: 80,
    xp: 120,
    visual: {
      type: "number-line",
      title: "Fraction path image",
      caption: "A number line from 0 to 1 with equal jumps for halves, thirds, and fourths."
    },
    teachingSupport: {
      summary: "Fractions on a number line are about equal spaces between 0 and 1, not just marks on the line.",
      description:
        "Learners start with a physical strip, move to a floor path, then draw the same equal spaces on paper before using symbols.",
      diagramCallouts: [
        {
          title: "Whole interval",
          body: "Mark 0 and 1 first so the child sees the whole before naming the parts."
        },
        {
          title: "Equal spaces",
          body: "Count the spaces between tick marks; the denominator names the number of equal spaces."
        },
        {
          title: "Same point",
          body: "Use 1/2 and 2/4 on the same line to show equivalent fractions visually."
        }
      ],
      helperNotes: [
        "Use tape on the floor or paper strips before asking for a written answer.",
        "Ask the learner to point to the whole, then the equal spaces, then the target fraction.",
        "Have the child say: I counted spaces, not tick marks."
      ],
      commonMisunderstandings: [
        {
          mistake: "Counting tick marks instead of spaces.",
          fix: "Cover the tick marks and ask the learner to hop only the spaces between 0 and 1."
        },
        {
          mistake: "Thinking fourths are always bigger than halves because 4 is bigger than 2.",
          fix: "Compare same-size strips and show that more pieces means smaller pieces."
        }
      ],
      confusionPrompt: "Write which part is confusing: finding the whole, making equal spaces, or placing the fraction."
    },
    funTasks: [
      "Hop the fraction path on the floor using tape marks.",
      "Build a snack-strip model, then transfer the same spacing to a number line.",
      "Teach a stuffed animal why 2/4 lands on the same point as 1/2."
    ],
    retentionChecks: ["10-minute mini recall", "Next-day fraction hop", "Three-day mixed fraction review"],
    reward: "Unlock the Fraction Trail badge after a next-day recall win.",
    evidenceMoves: {
      priorKnowledgeCheck:
        "Ask learners to place 1/2 on a blank 0 to 1 line and explain what the denominator tells them before instruction starts.",
      misconceptionCheck:
        "Watch for learners counting tick marks instead of spaces or treating larger denominators as larger pieces.",
      manipulativeRationale:
        "Use fraction strips because they make equal spacing visible before learners move to the number line.",
      representations: [
        "Fraction strip",
        "Floor number line",
        "Drawn number line",
        "Symbolic fractions",
        "Student explanation sentence"
      ],
      problemSolvingStrategy:
        "Use the problem-solving routine: mark 0 and 1, count equal spaces, place the fraction, then compare with a second representation.",
      workedExample:
        "Model why 2/4 lands at the same point as 1/2, then ask learners to critique a wrong example where 2/4 is placed after 1/2.",
      examplesAndNonExamples:
        "Compare 2/4 as an equivalent example with 2/3 as a non-example for 1/2 on the same 0 to 1 line.",
      knowledgeConnections:
        "Connect equal sharing, skip counting spaces, equivalent fractions, and the idea that fractions extend the number system between whole numbers.",
      metacognitivePrompt:
        "Plan where the whole starts and ends, monitor whether spaces are equal, evaluate whether the answer matches the strip, and explain the strategy.",
      interventionTrigger:
        "If the learner misses either quiz item or cannot explain equal spaces, assign the strip-to-line reteach and a next-day recall check.",
      transitionBridge:
        "Grade 3 number-line fractions prepare learners for Grade 4 equivalent fractions, Grade 5 fraction operations, and Grade 6 ratios.",
      feedbackFrame:
        "Name the accurate part of the model, identify the first spacing error, and ask for one corrected placement before scoring again."
    },
    sections: {
      warmup: "Compare halves, thirds, and fourths using equal-size visual parts.",
      teach: "Fractions show equal parts of a whole. On a number line, the denominator tells how many equal spaces fit between 0 and 1.",
      guidedPractice: "Drag 1/2, 1/3, and 3/4 to the correct tick marks.",
      independentPractice: "Solve 10 placement problems with unit fractions and equivalent fractions.",
      activity: "Build a paper strip number line and mark equal jumps.",
      reteach: "Use fraction strips first, then transfer the same spacing to the number line.",
      challenge: "Explain why 2/4 and 1/2 land on the same point."
    },
    quiz: [
      {
        id: "g3-fractions-q1",
        prompt: "Where does 1/2 belong on a number line from 0 to 1?",
        choices: ["At the middle point", "At 0", "At the first of three spaces", "Past 1"],
        answerIndex: 0,
        explanation: "One half divides the space from 0 to 1 into two equal parts and lands in the middle."
      },
      {
        id: "g3-fractions-q2",
        prompt: "Which fraction is equivalent to 1/2?",
        choices: ["1/3", "2/4", "3/3", "4/2"],
        answerIndex: 1,
        explanation: "Two fourths covers the same amount as one half."
      }
    ]
  },
  {
    id: "g3-ela-main-idea-evidence",
    academyId: "foundation",
    grade: "3",
    subject: "ela",
    courseTitle: "ELA",
    unitTitle: "Main Idea",
    title: "Main Idea Detective",
    objective: "Identify the main idea of a nonfiction passage and support it with two details.",
    standards: ["ccss-ela"],
    estimatedMinutes: 24,
    masteryThreshold: 80,
    xp: 120,
    visual: {
      type: "story-map",
      title: "Evidence detective board",
      caption: "A visual board with a main idea clue in the center and detail cards connected around it."
    },
    teachingSupport: {
      summary: "A main idea is the big point that the strongest details all help prove.",
      description:
        "Learners use a detective board to sort details, reject distracting facts, and defend one main idea with proof.",
      diagramCallouts: [
        {
          title: "Main idea",
          body: "Put the big point in the center only after checking several details."
        },
        {
          title: "Proof details",
          body: "Details should connect back to the center idea, not just sound interesting."
        },
        {
          title: "Distractor detail",
          body: "A fun fact can be true and still not prove the main idea."
        }
      ],
      helperNotes: [
        "Ask: What do most of these details have in common?",
        "Use two proof cards before writing the final sentence.",
        "Have the learner explain why one detail does not belong."
      ],
      commonMisunderstandings: [
        {
          mistake: "Choosing the first sentence as the main idea every time.",
          fix: "Check whether every detail supports it before accepting it."
        },
        {
          mistake: "Picking an interesting detail instead of the big point.",
          fix: "Ask whether the detail is one clue or the whole message."
        }
      ],
      confusionPrompt: "Write whether you are stuck finding the big idea, choosing proof details, or rejecting distractors."
    },
    funTasks: [
      "Use clue cards to sort details that prove or do not prove the main idea.",
      "Record a 20-second detective report explaining the strongest evidence.",
      "Build a main-idea badge with one sentence and two proof stickers."
    ],
    retentionChecks: ["Same-day detail sort", "Next-day main idea recall", "Seven-day new passage transfer"],
    reward: "Unlock the Evidence Detective badge after a new-passage transfer task.",
    sections: {
      warmup: "Look at four picture clues and guess what they all have in common.",
      teach: "The main idea is what a text is mostly about. Strong details prove the main idea instead of adding random facts.",
      guidedPractice: "Read a short paragraph and drag two details onto the evidence board.",
      independentPractice: "Choose the best main idea and explain why two details support it.",
      activity: "Create a detective board with one main idea and two evidence cards.",
      reteach: "Ask what all the details have in common before choosing a main idea.",
      challenge: "Find one detail that is interesting but does not support the main idea."
    },
    quiz: [
      {
        id: "g3-main-idea-q1",
        prompt: "What is the main idea of a paragraph?",
        choices: ["What the text is mostly about", "The longest word", "The first name in the text", "A random fun fact"],
        answerIndex: 0,
        explanation: "The main idea tells what the whole paragraph is mostly about."
      },
      {
        id: "g3-main-idea-q2",
        prompt: "Which detail best supports a passage about how bees help plants?",
        choices: ["Bees move pollen between flowers", "Some people wear yellow shirts", "A flower can be drawn with crayons", "Honey jars can be heavy"],
        answerIndex: 0,
        explanation: "Moving pollen explains how bees help plants."
      }
    ]
  },
  {
    id: "g3-science-mini-ecosystem",
    academyId: "foundation",
    grade: "3",
    subject: "science",
    courseTitle: "Science",
    unitTitle: "Ecosystems",
    title: "Build a Mini Ecosystem",
    objective: "Explain how organisms depend on each other in a small ecosystem.",
    standards: ["ngss"],
    estimatedMinutes: 28,
    masteryThreshold: 80,
    xp: 130,
    visual: {
      type: "ecosystem-model",
      title: "Mini ecosystem image",
      caption: "A model showing sun, plants, insects, soil, water, and a simple food connection."
    },
    teachingSupport: {
      summary: "An ecosystem is a set of living and nonliving parts that depend on each other.",
      description:
        "Learners build a model, add dependency arrows, remove one part, and explain how the system changes.",
      diagramCallouts: [
        {
          title: "Energy source",
          body: "Sunlight starts many food connections because plants use it to make food."
        },
        {
          title: "Dependency arrow",
          body: "An arrow means one part needs or affects another part."
        },
        {
          title: "System change",
          body: "Removing water, plants, or insects changes more than one part of the ecosystem."
        }
      ],
      helperNotes: [
        "Sort cards into living and nonliving before drawing arrows.",
        "Ask what each part needs to survive.",
        "Use a missing-part challenge to test whether the learner understands relationships."
      ],
      commonMisunderstandings: [
        {
          mistake: "Thinking only animals are important in an ecosystem.",
          fix: "Trace how plants, sunlight, water, and soil support the animals."
        },
        {
          mistake: "Drawing arrows as decoration instead of relationships.",
          fix: "Require every arrow to be read aloud as depends on or gives to."
        }
      ],
      confusionPrompt: "Write whether you are stuck on living parts, nonliving parts, arrows, or what changes when one part disappears."
    },
    funTasks: [
      "Build a paper mini ecosystem with arrows that show who depends on what.",
      "Play dependency Jenga: remove one part and explain what changes.",
      "Act out sun, plant, insect, and decomposer roles in a tiny ecosystem loop."
    ],
    retentionChecks: ["Same-day dependency arrow check", "Next-day missing part challenge", "Seven-day ecosystem transfer"],
    reward: "Unlock the Ecosystem Builder badge after explaining a new ecosystem.",
    sections: {
      warmup: "Name three living or nonliving parts of a backyard or park.",
      teach: "Organisms depend on food, water, shelter, sunlight, and other organisms. A model can show these connections.",
      guidedPractice: "Connect plants, insects, water, soil, and sunlight with dependency arrows.",
      independentPractice: "Explain what might happen if one part of the ecosystem disappears.",
      activity: "Build a mini ecosystem model with labeled arrows.",
      reteach: "Separate living and nonliving parts, then ask what each part needs.",
      challenge: "Compare a pond ecosystem and a garden ecosystem."
    },
    quiz: [
      {
        id: "g3-ecosystem-q1",
        prompt: "Why do many plants need sunlight?",
        choices: ["To make food", "To learn spelling", "To become rocks", "To stop all insects"],
        answerIndex: 0,
        explanation: "Plants use sunlight as part of making their food."
      },
      {
        id: "g3-ecosystem-q2",
        prompt: "What does a dependency arrow show in an ecosystem model?",
        choices: ["How one part depends on another", "Which word is longest", "Where to write your name", "How to erase the model"],
        answerIndex: 0,
        explanation: "Dependency arrows show relationships between parts of a system."
      }
    ]
  },
  {
    id: "g3-social-regions-community-map",
    academyId: "foundation",
    grade: "3",
    subject: "social-studies",
    courseTitle: "Social Studies",
    unitTitle: "Regions",
    title: "Map a Community Region",
    objective: "Use map features to describe a region and explain how people use local resources.",
    standards: ["c3"],
    estimatedMinutes: 26,
    masteryThreshold: 80,
    xp: 125,
    visual: {
      type: "community-map",
      title: "Community region map",
      caption: "A simple map with a river, road, farm, town center, park, school, and compass rose."
    },
    teachingSupport: {
      summary: "Maps use symbols, labels, directions, and resources to explain how people use a place.",
      description:
        "Learners walk a floor map, match symbols to real places, and explain how a local resource supports the community.",
      diagramCallouts: [
        {
          title: "Compass rose",
          body: "Use north, south, east, and west to describe movement and location."
        },
        {
          title: "Map symbol",
          body: "A simple picture stands for a real feature such as a school, river, road, or park."
        },
        {
          title: "Local resource",
          body: "A resource is useful when people use it for water, food, travel, work, or recreation."
        }
      ],
      helperNotes: [
        "Point to the symbol, name the real place, then say why it matters.",
        "Use direction words while physically walking the map.",
        "Ask the learner to compare two places on the map before writing."
      ],
      commonMisunderstandings: [
        {
          mistake: "Treating symbols as decorations.",
          fix: "Ask what real place each symbol stands for and how people use it."
        },
        {
          mistake: "Confusing a region with one single building.",
          fix: "Have the learner describe land, water, weather, people, and resources together."
        }
      ],
      confusionPrompt: "Write whether you are stuck on directions, symbols, resources, or describing the whole region."
    },
    funTasks: [
      "Design a floor map with tape and walk from the school to the river using directions.",
      "Trade resource cards and explain why a community might need each one.",
      "Create a tour guide card for one region feature."
    ],
    retentionChecks: ["Compass rose recall", "Next-day map symbol match", "Seven-day new map transfer"],
    reward: "Unlock the Community Cartographer badge after reading a new map.",
    sections: {
      warmup: "Look at a map symbol and guess what real place it represents.",
      teach: "Maps use symbols, labels, directions, and scale to show places. Regions can be described by land, water, weather, and how people live.",
      guidedPractice: "Find the compass rose, river, road, and town center on a community map.",
      independentPractice: "Write two sentences about how people use one local resource.",
      activity: "Build a community map and add three useful symbols.",
      reteach: "Start with one symbol at a time and connect it to the real place.",
      challenge: "Explain how the community would change if the river dried up."
    },
    quiz: [
      {
        id: "g3-map-q1",
        prompt: "What does a compass rose help you find?",
        choices: ["Directions", "The main character", "The answer key", "A plant's roots"],
        answerIndex: 0,
        explanation: "A compass rose shows directions such as north, south, east, and west."
      },
      {
        id: "g3-map-q2",
        prompt: "Which is an example of a local resource?",
        choices: ["A river used for water", "A made-up space laser", "A spelling mistake", "A blank page"],
        answerIndex: 0,
        explanation: "A river can be a resource when people use it for water, travel, or farming."
      }
    ]
  },
  {
    id: "g6-math-ratios-unit-rates",
    academyId: "bridge",
    grade: "6",
    subject: "math",
    courseTitle: "Grade 6 Math",
    unitTitle: "Ratios, Rates, and Proportional Reasoning",
    title: "Ratio Quest: Build a Better Deal",
    objective: "Use equivalent ratios, ratio tables, double number lines, and unit rates to compare real-world deals.",
    standards: ["ccss-math"],
    estimatedMinutes: 32,
    masteryThreshold: 80,
    xp: 160,
    externalReferenceCards: [
      {
        id: "ixl-g6-math-skills-reference",
        title: "IXL Grade 6 Math Skills",
        url: "https://www.ixl.com/math/grade-6/skills",
        usageLabel: "Optional external practice reference",
        studentVisibility: false,
        reviewStatus: "manager-review-required"
      },
      {
        id: "ixl-g6-math-lessons-reference",
        title: "IXL Grade 6 Math Lessons",
        url: "https://www.ixl.com/math/grade-6/lessons",
        usageLabel: "Optional external lesson reference",
        studentVisibility: false,
        reviewStatus: "manager-review-required"
      },
      {
        id: "ixl-g6-math-videos-reference",
        title: "IXL Grade 6 Math Videos",
        url: "https://www.ixl.com/math/grade-6/videos",
        usageLabel: "Optional external video reference",
        studentVisibility: false,
        reviewStatus: "manager-review-required"
      }
    ],
    visual: {
      type: "ratio-double-number-line",
      title: "Ratio table and double number line",
      caption: "A neon market board comparing two snack packs with ratio tables, double number lines, and unit price callouts.",
      altText:
        "Two snack deals are shown with matching ratio tables and double number lines. Labels point to equivalent ratios, scale factors, and unit rate.",
      generationPrompt:
        "Create a bold cyber-neon Grade 6 math teaching diagram that compares two snack deals using ratio tables, double number lines, scale factors, and unit rate labels. Make the labels readable, kid-friendly, and classroom-safe."
    },
    teachingSupport: {
      summary: "Ratios compare quantities, and unit rates make different-size deals fair to compare.",
      description:
        "The app teaches the student to see a ratio as a relationship that can scale, then uses a double number line and table to compare real deals.",
      diagramCallouts: [
        {
          title: "Ratio pair",
          body: "A ratio compares two quantities in a specific order, such as dollars to tickets or cups to scoops."
        },
        {
          title: "Scale factor",
          body: "Equivalent ratios keep the relationship the same by multiplying both quantities by the same factor."
        },
        {
          title: "Unit rate",
          body: "A unit rate tells the amount for one, which makes different-size deals easier to compare."
        }
      ],
      helperNotes: [
        "Ask the learner to say what each number means before calculating.",
        "Use the double number line before the shortcut so the relationship stays visible.",
        "Require a fairness sentence: I chose ___ because each one costs ___ or gives ___."
      ],
      commonMisunderstandings: [
        {
          mistake: "Adding the same number to both quantities and calling it equivalent.",
          fix: "Use a scale factor and ask whether both quantities were multiplied by the same number."
        },
        {
          mistake: "Choosing the lower total price instead of the better unit rate.",
          fix: "Compare the cost for one item or one unit before deciding which deal is better."
        },
        {
          mistake: "Reversing the ratio order.",
          fix: "Label the quantities first and keep the same order in the table, line, and sentence."
        }
      ],
      confusionPrompt:
        "Write whether you are stuck on what the ratio means, how to scale it, how to use the double number line, or how to find the unit rate."
    },
    funTasks: [
      "Run a neon market challenge: pick the better snack-pack deal and defend it with a unit rate.",
      "Build a ratio table ladder where each step must keep the same relationship.",
      "Design a fair class reward bundle and prove the best deal with a double number line."
    ],
    groupHomework: {
      title: "Better deal crew",
      groupSize: "3-5 learners",
      roles: ["Deal scout", "Table builder", "Number-line mapper", "Skeptic", "Presenter"],
      sharedOutcome: "Submit a one-page deal comparison with a ratio table, double number line, unit rate, and final recommendation.",
      parentRole: "Let the student gather two real prices, then ask them to explain which deal is better and why."
    },
    retentionChecks: ["Next-day equivalent ratio sort", "Three-day unit rate comparison", "Seven-day grocery or game-currency transfer"],
    reward: "Earn the Deal Hacker badge after proving a better deal and passing the delayed unit-rate recall.",
    evidenceMoves: {
      priorKnowledgeCheck:
        "Ask the learner to compare two simple prices, label dollars and items, and divide a whole-number total before teaching ratio language.",
      misconceptionCheck:
        "Check for three likely errors: reversing ratio order, adding instead of scaling, and choosing the lower total price instead of the lower unit rate.",
      manipulativeRationale:
        "Use item cards, price tags, ratio tables, and double number lines because they keep the two related quantities visible before symbolic shortcuts.",
      representations: [
        "Physical item-price cards",
        "Ratio table",
        "Double number line",
        "Unit-rate sentence",
        "Student-created misleading deal"
      ],
      problemSolvingStrategy:
        "Use the strategy: label quantities, build equivalent rows, reduce to one unit, compare unit rates, then defend the choice in a because sentence.",
      workedExample:
        "Model 6 pencils for $3 as $0.50 per pencil, then compare with a wrong example that picks the lower total price without dividing.",
      examplesAndNonExamples:
        "Compare 2:5 and 4:10 as equivalent ratios, then contrast 2:5 and 4:7 as a non-example that was created by adding instead of scaling.",
      knowledgeConnections:
        "Connect multiplication, division, decimal money, tables, number lines, equivalent fractions, percent, and future proportional relationships.",
      metacognitivePrompt:
        "Plan by labeling the quantities, monitor whether both quantities scaled together, evaluate the unit rate, and explain why the chosen deal is fair.",
      interventionTrigger:
        "If the learner reverses labels, uses additive scaling, or chooses by total price, assign the quantity-labeling and unit-rate reteach before the next quiz.",
      transitionBridge:
        "Grade 6 ratios build from fraction equivalence and prepare learners for proportional relationships, percent, scale drawings, slope, and linear functions.",
      feedbackFrame:
        "Name the correct label or row, identify the first scale or division error, and ask the learner to rewrite one unit-rate sentence before scoring again."
    },
    sections: {
      warmup: "Look at two snack deals and vote for the better buy before calculating.",
      teach:
        "A ratio compares two quantities. Equivalent ratios multiply both quantities by the same factor. A unit rate tells the amount for one, so deals can be compared fairly.",
      guidedPractice:
        "Complete a ratio table, then map the same values onto a double number line before writing the unit rate.",
      independentPractice:
        "Compare two real-world deals and choose the better one using a labeled unit-rate sentence.",
      activity:
        "Use the interactive ratio board to scale a recipe, ticket bundle, or snack-pack deal and defend the best choice.",
      reteach:
        "Return to one ratio pair, label each quantity, and build only two equivalent rows before finding the unit rate.",
      challenge:
        "Design a new deal that looks cheaper but is not better, then explain the trap."
    },
    quiz: [
      {
        id: "g6-ratios-q1",
        prompt: "A pack has 6 pencils for $3. What is the cost per pencil?",
        choices: ["$0.50 per pencil", "$2 per pencil", "$3 per pencil", "$9 per pencil"],
        answerIndex: 0,
        explanation: "Divide $3 by 6 pencils. Each pencil costs $0.50."
      },
      {
        id: "g6-ratios-q2",
        prompt: "Which ratio is equivalent to 2 cups of juice for 5 cups of water?",
        choices: ["4 cups of juice for 10 cups of water", "3 cups of juice for 6 cups of water", "2 cups of juice for 7 cups of water", "5 cups of juice for 2 cups of water"],
        answerIndex: 0,
        explanation: "Multiplying both 2 and 5 by 2 gives 4 to 10, so the relationship stays the same."
      },
      {
        id: "g6-ratios-q3",
        prompt: "Deal A is 4 tickets for $12. Deal B is 6 tickets for $15. Which is the better price per ticket?",
        choices: ["Deal B", "Deal A", "They are the same", "There is not enough information"],
        answerIndex: 0,
        explanation: "Deal A is $3 per ticket. Deal B is $2.50 per ticket, so Deal B is the better price."
      }
    ]
  },
  {
    id: "g6-earth-systems-weather",
    academyId: "bridge",
    grade: "6",
    subject: "science",
    courseTitle: "Science",
    unitTitle: "Weather and Climate",
    title: "Reading Weather Patterns",
    objective: "Use weather data to describe patterns and predict short-term changes.",
    standards: ["ngss"],
    estimatedMinutes: 28,
    masteryThreshold: 80,
    xp: 150,
    visual: {
      type: "weather-map",
      title: "Weather systems image",
      caption: "A map-style weather visual with pressure zones, wind arrows, clouds, and temperature bands."
    },
    teachingSupport: {
      summary: "Weather predictions are evidence claims built from patterns in pressure, temperature, wind, and clouds.",
      description:
        "Learners read a map like a forecast team: gather data, make a claim, test confidence, and revise after actual weather arrives.",
      diagramCallouts: [
        {
          title: "Pressure zone",
          body: "High and low pressure help explain likely air movement and changing conditions."
        },
        {
          title: "Wind arrow",
          body: "Wind direction helps predict what kind of air may arrive next."
        },
        {
          title: "Evidence claim",
          body: "A forecast should cite at least two pieces of current map or table evidence."
        }
      ],
      helperNotes: [
        "Ask students to separate observation, pattern, and prediction.",
        "Require a confidence rating so teams notice missing or weak evidence.",
        "After real weather happens, revise the rule instead of only marking right or wrong."
      ],
      commonMisunderstandings: [
        {
          mistake: "Using one symbol as a complete forecast.",
          fix: "Ask for two data points before accepting the claim."
        },
        {
          mistake: "Thinking a wrong forecast means the method failed.",
          fix: "Compare prediction to actuals and improve the rule using new evidence."
        }
      ],
      confusionPrompt: "Write whether you are stuck on pressure, wind arrows, data tables, or turning evidence into a forecast."
    },
    funTasks: [
      "Run a forecast studio: one student reads the map, one checks evidence, one records the prediction.",
      "Create a 30-second weather briefing with one claim and two evidence points.",
      "Compare two forecasts and decide which one deserves the team confidence badge."
    ],
    groupHomework: {
      title: "Family weather crew",
      groupSize: "3-5 learners or family members",
      roles: ["Data lead", "Map reader", "Skeptic", "Reporter", "Reflection captain"],
      sharedOutcome: "Submit a one-week weather board with predictions, actuals, and one improved forecast rule.",
      parentRole: "Help gather daily observations, but let students defend the forecast."
    },
    retentionChecks: ["Next-day map symbol recall", "Three-day pressure pattern check", "Seven-day forecast reflection"],
    reward: "Earn the Forecast Crew badge when the team improves its rule after real data.",
    sections: {
      warmup: "Look at a three-day temperature and cloud-cover chart.",
      teach: "Weather patterns form when air pressure, temperature, humidity, and wind interact.",
      guidedPractice: "Match symbols on a weather map to observations.",
      independentPractice: "Use a data table to write a two-sentence forecast.",
      activity: "Build a weather station log for one week.",
      reteach: "Review one variable at a time before combining the full forecast.",
      challenge: "Compare forecast confidence when one data point is missing."
    },
    quiz: [
      {
        id: "g6-weather-q1",
        prompt: "Which evidence best supports a short-term weather forecast?",
        choices: ["A current pressure map", "A list of favorite seasons", "A drawing of clouds from last year", "A map with no labels"],
        answerIndex: 0,
        explanation: "Current pressure patterns are evidence scientists use to forecast weather."
      },
      {
        id: "g6-weather-q2",
        prompt: "A falling air pressure reading often suggests what kind of change?",
        choices: ["Possible stormy weather", "No weather can happen", "The season is over", "All wind stops"],
        answerIndex: 0,
        explanation: "Falling pressure can indicate approaching unsettled or stormy weather."
      }
    ]
  },
  {
    id: "g9-biology-cells",
    academyId: "scholar",
    grade: "9",
    subject: "science",
    courseTitle: "Biology",
    unitTitle: "Cells",
    title: "Cell Structure and Function",
    objective: "Explain how major cell structures support life processes.",
    standards: ["ngss"],
    estimatedMinutes: 35,
    masteryThreshold: 80,
    xp: 180,
    visual: {
      type: "cell-diagram",
      title: "Cell systems image",
      caption: "A labeled cell diagram that connects structures to jobs: information, energy, transport, and protection."
    },
    teachingSupport: {
      summary: "Cell structures are easier to remember when they are linked to jobs in a living system.",
      description:
        "Learners analyze a diagram, diagnose a cell failure, and defend which structure explains the evidence.",
      diagramCallouts: [
        {
          title: "Information",
          body: "The nucleus stores instructions that guide cell activity."
        },
        {
          title: "Energy",
          body: "Mitochondria transfer energy that cells can use for work."
        },
        {
          title: "Boundary",
          body: "The cell membrane controls movement into and out of the cell."
        }
      ],
      helperNotes: [
        "Sort organelles by job category before memorizing names.",
        "Use claim-evidence-reasoning for every cell failure diagnosis.",
        "Compare plant and animal cells by structure and function, not only appearance."
      ],
      commonMisunderstandings: [
        {
          mistake: "Memorizing organelle names without knowing the job.",
          fix: "Ask what would break in the cell if that structure stopped working."
        },
        {
          mistake: "Confusing cell wall and cell membrane.",
          fix: "Compare support/protection with controlled movement across a boundary."
        }
      ],
      confusionPrompt: "Write whether you are stuck on organelle names, jobs, evidence, or comparing plant and animal cells."
    },
    funTasks: [
      "Run a cell city simulation where each role must keep the cell alive for three rounds.",
      "Build a claim-evidence-reasoning card for one organelle failure.",
      "Design a before/after image showing how a plant cell differs from an animal cell."
    ],
    groupHomework: {
      title: "Organelle emergency room",
      groupSize: "3-5 learners",
      roles: ["Systems doctor", "Evidence analyst", "Diagram designer", "Skeptic", "Presenter"],
      sharedOutcome: "Diagnose a mystery cell failure and present the evidence trail.",
      parentRole: "Ask the team to explain why their diagnosis fits the evidence."
    },
    retentionChecks: ["24-hour organelle sort", "Seven-day transfer case", "One-month biology spiral review"],
    reward: "Unlock the Systems Biologist badge after the transfer case, not just the first quiz.",
    sections: {
      warmup: "Compare a cell to a city system and name three jobs that must happen.",
      teach: "Organelles perform specialized functions: the nucleus stores genetic instructions, mitochondria transfer energy, and membranes regulate movement.",
      guidedPractice: "Match organelles to evidence-based function statements.",
      independentPractice: "Analyze a cell diagram and explain what happens if one structure fails.",
      activity: "Build a labeled model with a claim-evidence-reasoning note.",
      reteach: "Sort organelles by job category: information, energy, transport, structure.",
      challenge: "Compare plant and animal cells using three structural differences."
    },
    quiz: [
      {
        id: "g9-cells-q1",
        prompt: "Which structure controls what enters and leaves the cell?",
        choices: ["Cell membrane", "Nucleus", "Ribosome", "Vacuole"],
        answerIndex: 0,
        explanation: "The cell membrane regulates movement into and out of the cell."
      },
      {
        id: "g9-cells-q2",
        prompt: "Which organelle is most directly tied to energy transfer?",
        choices: ["Mitochondrion", "Nucleus", "Cell wall", "Golgi body"],
        answerIndex: 0,
        explanation: "Mitochondria are the major site of cellular energy transfer."
      }
    ]
  }
];

const studentFacingLessonGuides = {
  "g3-fractions-number-line": {
    mission: "Rescue the fraction path by proving every jump is the same size.",
    whyItMatters: "Fractions stop feeling like two random numbers when you can see them as places on a path.",
    bigIdea: "The denominator tells how many equal spaces split the whole from 0 to 1.",
    modelSteps: [
      "Mark the whole first: 0 at the start and 1 at the end.",
      "Split the whole into equal spaces, not just tick marks.",
      "Place the fraction by counting spaces from 0."
    ],
    example: "For 2/4, split 0 to 1 into four equal spaces, then move two spaces. You land at the same place as 1/2.",
    nonExample: "If the spaces are not equal, the point is not a fair fraction even if the label looks right.",
    quickCheck: "Before you answer, point to the whole, count the equal spaces, then name the landing point.",
    studentSummary: "A fraction on a number line is a location made from equal spaces.",
    tutorHandoff: "Tell the tutor whether you are counting tick marks, making equal spaces, or finding the whole."
  },
  "g3-ela-main-idea-evidence": {
    mission: "Become a text detective and prove the big idea with the strongest clues.",
    whyItMatters: "Reading gets easier when you can separate the author's big point from extra facts.",
    bigIdea: "The main idea is the one sentence that most of the details work together to prove.",
    modelSteps: [
      "Read the details like clues.",
      "Ask what most clues have in common.",
      "Choose two details that prove the same big point."
    ],
    example: "If three details tell how bees move pollen and help flowers grow, the main idea is probably about bees helping plants.",
    nonExample: "A fun fact about honey jars may be true, but it does not prove how bees help plants.",
    quickCheck: "Can both proof details point back to the same center idea?",
    studentSummary: "Main idea is the big point; details are the proof.",
    tutorHandoff: "Tell the tutor if you are stuck choosing the big idea, finding proof, or rejecting a distractor."
  },
  "g3-science-mini-ecosystem": {
    mission: "Build a tiny ecosystem and prove how each part helps the system stay alive.",
    whyItMatters: "Science is about relationships. When one part changes, other parts can change too.",
    bigIdea: "Living and nonliving parts form a system when they depend on each other.",
    modelSteps: [
      "Sort each part as living or nonliving.",
      "Draw arrows for needs or effects.",
      "Remove one part and predict what changes."
    ],
    example: "A plant uses sunlight and water; an insect may use the plant for food or shelter.",
    nonExample: "An arrow with no explanation is decoration, not science evidence.",
    quickCheck: "Read every arrow out loud as 'depends on' or 'gives to.'",
    studentSummary: "An ecosystem is a web of parts that need or affect each other.",
    tutorHandoff: "Tell the tutor if the confusing part is living/nonliving, arrows, or what changes when one part disappears."
  },
  "g3-social-regions-community-map": {
    mission: "Use the community map to explain how people move, live, and use resources.",
    whyItMatters: "Maps help you understand real places, not just memorize symbols.",
    bigIdea: "A region is described by features, directions, resources, and how people use them.",
    modelSteps: [
      "Find the compass rose and choose a direction.",
      "Match each symbol to a real feature.",
      "Explain how one resource helps people in the region."
    ],
    example: "A river can be a resource when people use it for water, farming, travel, or recreation.",
    nonExample: "A school symbol is not just a picture; it stands for a real place in the community.",
    quickCheck: "Point to a symbol, name the real place, then say why it matters.",
    studentSummary: "Maps turn symbols and directions into a story about how a place works.",
    tutorHandoff: "Tell the tutor if directions, symbols, resources, or describing the whole region feels stuck."
  },
  "g6-earth-systems-weather": {
    mission: "Run a forecast studio: make a claim, cite the map, then revise with real data.",
    whyItMatters: "Forecasting teaches evidence reasoning: your claim is only as strong as the data you use.",
    bigIdea: "Weather predictions are claims built from patterns in pressure, wind, temperature, and clouds.",
    modelSteps: [
      "Separate observations from predictions.",
      "Use at least two data points before making a claim.",
      "Give a confidence rating and name what data is missing."
    ],
    example: "Falling pressure plus changing wind direction can support a claim that unsettled weather may arrive.",
    nonExample: "One cloud icon by itself is not enough evidence for a complete forecast.",
    quickCheck: "Can your forecast sentence include 'because' followed by two pieces of evidence?",
    studentSummary: "A forecast is an evidence claim, not a guess.",
    tutorHandoff: "Tell the tutor if pressure, wind arrows, data tables, or evidence sentences are confusing."
  },
  "g6-math-ratios-unit-rates": {
    mission: "Hack the neon market by proving which deal is actually better.",
    whyItMatters: "Ratios and unit rates help you make fair comparisons in shopping, recipes, games, speed, maps, and class projects.",
    bigIdea: "Equivalent ratios keep the same relationship, and unit rates compare every deal by one unit.",
    modelSteps: [
      "Label what the two quantities mean and keep the order the same.",
      "Multiply or divide both quantities by the same factor to make equivalent ratios.",
      "Find the amount for one unit, then use that unit rate to compare deals."
    ],
    example: "If 6 pencils cost $3, then 1 pencil costs $0.50 because 3 dollars divided by 6 pencils equals 0.50 dollars per pencil.",
    nonExample: "Adding 2 to both quantities does not usually make an equivalent ratio because the relationship changes.",
    quickCheck: "Before choosing the better deal, say the unit rate for Deal A and Deal B out loud.",
    studentSummary: "A ratio is a relationship. A unit rate makes the relationship easy to compare.",
    tutorHandoff: "Tell the tutor if you are stuck on ratio order, scaling, double number lines, or the unit rate."
  },
  "g6-learning-ai-build-test": {
    mission: "Train like an AI builder: explain what AI is, design a tiny app, talk to the AI clearly, then test for bugs.",
    whyItMatters: "Students are already using AI tools. This lesson turns AI from magic into a system they can question, build with, and check safely.",
    bigIdea: "AI can help you think, draft, code, and debug, but the human still defines the goal, checks the facts, protects private information, and tests the result.",
    modelSteps: [
      "Name the system parts: user, prompt, AI model, context, output, frontend, backend, API, database, test.",
      "Write a clear prompt with role, goal, constraints, examples, and what a good answer should include.",
      "Build a tiny app plan: what the user sees, what data is stored, what the server does, and how you will test it.",
      "Run the bug loop: reproduce, isolate, fix, retest, and explain what changed."
    ],
    example: "A good AI request says: You are helping a Grade 6 student. Explain APIs using a restaurant-order metaphor, then give one tiny coding example and one check-for-understanding question.",
    nonExample: "A weak AI request says: Make my app better. It gives no goal, user, constraints, or definition of done.",
    quickCheck: "Before trusting an AI answer, ask: Does it answer my goal, make factual claims I should verify, expose private data, or need a test?",
    studentSummary: "AI is a tool in a build process. Strong builders ask clearly, test carefully, and stay responsible for the final work.",
    tutorHandoff: "Tell the tutor if you are stuck on AI vocabulary, frontend/backend, writing prompts, APIs, databases, tests, bugs, or checking AI output."
  },
  "g9-biology-cells": {
    mission: "Diagnose a living system by matching cell structures to the jobs they perform.",
    whyItMatters: "Biology becomes easier when names connect to jobs and evidence, not memorized labels.",
    bigIdea: "Cell structures support life processes by handling information, energy, transport, boundaries, and building.",
    modelSteps: [
      "Sort each structure by job category.",
      "Ask what would fail if that structure stopped working.",
      "Use claim, evidence, and reasoning to defend the diagnosis."
    ],
    example: "If a cell cannot control what enters or leaves, the membrane is the strongest suspect.",
    nonExample: "Knowing the word mitochondrion is not enough; you need to connect it to energy transfer evidence.",
    quickCheck: "For each organelle, say the job and one sign that the job failed.",
    studentSummary: "Cell parts are system tools; each structure matters because of the job it performs.",
    tutorHandoff: "Tell the tutor if you are stuck on names, jobs, evidence, or plant-vs-animal comparisons."
  }
};

function defaultStudentFacingGuide(lesson) {
  return studentFacingLessonGuides[lesson.id] || {
    mission: `Use a visual model to master ${lesson.title}.`,
    whyItMatters: lesson.objective,
    bigIdea: lesson.teachingSupport?.summary || lesson.objective,
    modelSteps: lesson.teachingSupport?.diagramCallouts?.map((callout) => `${callout.title}: ${callout.body}`) || [],
    example: lesson.sections?.guidedPractice || lesson.objective,
    nonExample: lesson.teachingSupport?.commonMisunderstandings?.[0]?.mistake || "A rushed answer without evidence.",
    quickCheck: lesson.sections?.challenge || "Explain the idea in your own words.",
    studentSummary: lesson.teachingSupport?.summary || lesson.objective,
    tutorHandoff: lesson.teachingSupport?.confusionPrompt || "Tell the tutor exactly what feels confusing."
  };
}

function nativeFoundationFractionsV3(lesson) {
  if (lesson.id !== "g3-fractions-number-line") return {};
  return {
    schemaVersion: "3",
    academy: "foundation",
    gradeLevel: "3",
    course: "Grade 3 Mathematics",
    unitId: "fractions-as-numbers",
    lessonNumber: 1,
    lessonFamily: "concept_launch",
    secondaryLessonFamily: "skill_workshop",
    activePhases: ["orient", "model", "deconstruct", "practice", "reason", "prove", "remember", "transfer", "adapt"],
    targetLearningStates: ["acquiring", "developing", "accurate", "secure"],
    learningObjective: lesson.objective,
    successCriteria: [
      "I can mark 0 and 1 before I split the whole into equal spaces.",
      "I can place a fraction by counting equal spaces, not just tick marks.",
      "I can show why two equivalent fractions land on the same point.",
      "I can explain my placement with a drawing, words, or a fraction strip."
    ],
    essentialQuestion: "How can a number line show that a fraction is a number and not just a piece of a shape?",
    standardsTags: lesson.standards,
    thinkingSkillTags: ["equal-part-reasoning", "number-line-model", "equivalence", "explain-with-a-model"],
    vocabularyTerms: ["whole", "equal spaces", "numerator", "denominator", "unit fraction", "equivalent"],
    prerequisiteSkillIds: ["count-equal-groups", "compare-whole-numbers", "describe-position"],
    outcomes: {
      knowledge: [
        "The denominator tells how many equal spaces make the whole interval from 0 to 1.",
        "The numerator tells how many of those equal spaces to move from 0.",
        "Equivalent fractions name the same location when their equal spaces line up."
      ],
      capability: [
        "Build a fraction number line with a strip, drawing, or interactive model.",
        "Place unit and equivalent fractions and defend the location."
      ],
      reasoning: ["Use equal spaces and a shared whole as evidence instead of guessing from the size of the denominator."],
      retention: ["Retrieve the whole, equal spaces, and movement rule after a delay."],
      transfer: ["Use a number line to explain a fraction in a recipe, measurement, or game path."]
    },
    phaseModules: [
      { phase: "orient", title: "Find the whole", studentAction: "Point to 0 and 1 on the path, then say what the whole interval represents.", visualSupport: "A bright floor path from 0 to 1 with a large whole marker.", successCheck: "I can identify the whole before naming parts." },
      { phase: "model", title: "Build equal spaces", studentAction: "Fold or split a strip into equal spaces, then copy those spaces onto the number line.", visualSupport: "Fraction strip lined up with a number line.", successCheck: "All spaces are the same size." },
      { phase: "deconstruct", title: "Read the fraction", studentAction: "Use the denominator to name the number of spaces and the numerator to count the jumps.", visualSupport: "Callouts for denominator, numerator, spaces, and jumps.", successCheck: "I can explain both numbers without using a memorized trick." },
      { phase: "practice", title: "Place and check", studentAction: "Place halves, thirds, and fourths, then check each location against the strip.", visualSupport: "Drag-and-check fraction path.", successCheck: "I can correct a placement using the model." },
      { phase: "reason", title: "Explain the same point", studentAction: "Compare 1/2 and 2/4 and explain why both names can point to one location.", visualSupport: "Two fraction strips aligned to one number line point.", successCheck: "My explanation names the shared whole and equal location." },
      { phase: "prove", title: "Show your thinking", studentAction: "Place a new fraction and explain the spaces and jumps using a drawing or sentence.", successCheck: "The proof is independently understandable." },
      { phase: "remember", title: "Fraction hop recall", studentAction: "After a delay, rebuild a small 0-to-1 path and retrieve one fraction location.", successCheck: "I can retrieve the rule without seeing the original example." },
      { phase: "transfer", title: "Use a measurement", studentAction: "Use a number line to show a fraction of a meter, cup, or game path and explain the choice.", successCheck: "The model still works when the context changes." },
      { phase: "adapt", title: "Choose the next move", studentAction: "Decide whether to use a strip, draw equal spaces, retry, or explain an equivalent fraction.", successCheck: "I can name the support that helps me learn next." }
    ],
    proofTasks: [
      { proof: "recall", prompt: "Place 1/3 on a 0-to-1 line after a delay.", independentRequired: true },
      { proof: "explain", prompt: "Explain what the numerator and denominator tell you on the line.", independentRequired: true },
      { proof: "perform", prompt: "Build and use a number line to place 3/4.", independentRequired: true },
      { proof: "retain", prompt: "Complete a delayed Memory Vault fraction-hop check.", independentRequired: true },
      { proof: "transfer", prompt: "Use the model to show a fraction of a real measurement.", independentRequired: true }
    ],
    requiredMasteryProofs: ["recall", "explain", "perform", "retain", "transfer"],
    feedbackRules: [
      { diagnosisCode: "tick_mark_trap", result: "The learner counted marks instead of spaces.", hint: "Cover the marks and count only the equal hops between 0 and 1.", action: "Route to a floor-path or fraction-strip repair." },
      { diagnosisCode: "denominator_size_trap", result: "The learner thinks a larger denominator makes a larger piece.", hint: "Compare one strip split into 2 parts with the same strip split into 4 parts.", action: "Route to a concrete equal-parts comparison before retry." },
      { diagnosisCode: "whole_missing", result: "The learner started naming parts without identifying the whole.", hint: "Point to 0 and 1 first and say what distance is being divided.", action: "Return to orient and model phases." }
    ],
    reteachPaths: [{ id: "g3-fractions-number-line-reteach", trigger: "Placement or explanation misses the equal-space rule.", action: "Use a physical strip, then transfer the same folds to a number line." }],
    prerequisiteRepairPaths: [{ id: "g3-fractions-number-line-prerequisite", trigger: "The learner cannot identify a whole or compare equal groups.", action: "Repair whole-versus-part language with sorting and matching before fractions." }],
    challengePaths: [{ id: "g3-fractions-number-line-challenge", trigger: "The learner explains equivalent fractions independently.", action: "Compare two new equivalent fractions and create a measurement example." }],
    parentTeacherNotes: "Use concrete strips, movement, drawing, and oral explanation before requiring symbols. Treat a correct placement with heavy prompting as developing evidence, not durable mastery.",
    accessibilityNotes: ["Provide a tactile strip and a spoken description of each number-line move.", "Do not use color alone to distinguish numerator, denominator, or spaces.", "Accept pointing, drawing, oral explanation, or keyboard interaction as evidence."],
    safetyNotes: [],
    contentStatus: "pilot_ready",
    version: "3.0.0-foundation-fractions-exemplar"
  };
}

function nativeScholarCellsV3(lesson) {
  if (lesson.id !== "g9-biology-cells") return {};
  return {
    schemaVersion: "3",
    academy: "scholar",
    gradeLevel: "9",
    course: "Biology",
    unitId: "cell-structure-and-function",
    lessonNumber: 1,
    lessonFamily: "inquiry_investigation",
    secondaryLessonFamily: "reasoning_lab",
    activePhases: ["orient", "model", "deconstruct", "practice", "reason", "prove", "remember", "transfer", "adapt"],
    targetLearningStates: ["acquiring", "developing", "accurate", "secure"],
    learningObjective: lesson.objective,
    successCriteria: [
      "I can connect a cell structure to a life-process job.",
      "I can use evidence from a diagram or case to diagnose a failed structure.",
      "I can distinguish a plausible function claim from a memorized label.",
      "I can transfer the structure-function model to plant, animal, or engineered-cell evidence."
    ],
    essentialQuestion: "How can structure-function evidence explain what a cell can and cannot do?",
    standardsTags: lesson.standards,
    thinkingSkillTags: ["structure-function", "systems-thinking", "claim-evidence-reasoning", "model-based-inference", "transfer"],
    vocabularyTerms: ["organelle", "nucleus", "membrane", "mitochondrion", "ribosome", "cytoplasm", "structure-function"],
    prerequisiteSkillIds: ["read-labeled-diagram", "identify-evidence", "write-claim-evidence-reasoning"],
    outcomes: {
      knowledge: [
        "Cell structures have specialized jobs that support information, energy, transport, boundaries, and construction.",
        "A structure-function explanation is stronger when it connects a failure pattern to a specific job."
      ],
      capability: [
        "Diagnose a cell-system failure from diagram and case evidence.",
        "Construct and defend a structure-function explanation."
      ],
      reasoning: ["Infer the most likely failed structure from what the cell can no longer do."],
      retention: ["Retrieve organelle jobs through mixed cases rather than isolated label recall."],
      transfer: ["Apply the structure-function model to a changed cell type or designed biological system."]
    },
    phaseModules: [
      { phase: "orient", title: "Read the system", studentAction: "List the life jobs a cell must perform and predict what evidence would reveal a failure.", visualSupport: "Cell systems map organized by information, energy, boundary, and construction.", successCheck: "I can name a job before naming an organelle." },
      { phase: "model", title: "Connect structure to job", studentAction: "Trace one organelle from its structure to its job and the evidence of that job.", visualSupport: "Labeled cell diagram with job callouts.", successCheck: "The explanation includes structure, job, and evidence." },
      { phase: "deconstruct", title: "Separate label from reason", studentAction: "Sort statements into structure, function, evidence, or unsupported guess.", successCheck: "I can identify what a claim still needs to prove." },
      { phase: "practice", title: "Diagnose a case", studentAction: "Use a case card and cell model to identify the most likely failed structure.", visualSupport: "Case-to-organelle evidence board.", successCheck: "I can cite at least two relevant clues." },
      { phase: "reason", title: "Defend the diagnosis", studentAction: "Write or speak a claim-evidence-reasoning explanation and compare an alternative diagnosis.", successCheck: "My reasoning explains why the evidence fits better than the alternative." },
      { phase: "prove", title: "Show biological understanding", studentAction: "Analyze a new diagram and defend one structure-function conclusion independently.", successCheck: "The proof uses evidence, not only vocabulary." },
      { phase: "remember", title: "Mixed organelle retrieval", studentAction: "After a delay, match jobs to structures in a mixed set and explain one match.", successCheck: "I can retrieve the job when the order and context change." },
      { phase: "transfer", title: "Design a better cell", studentAction: "Apply structure-function reasoning to a plant cell comparison or an engineered cell with a new job.", successCheck: "I can predict a structural requirement and defend it." },
      { phase: "adapt", title: "Choose evidence support", studentAction: "Decide whether the next step is a diagram sort, prerequisite repair, alternate model, or challenge case.", successCheck: "I can name the evidence gap that controls my next move." }
    ],
    proofTasks: [
      { proof: "recall", prompt: "Retrieve three organelle jobs after a delay.", independentRequired: true },
      { proof: "explain", prompt: "Explain one structure-function relationship with evidence.", independentRequired: true },
      { proof: "perform", prompt: "Diagnose a cell failure from a new case card.", independentRequired: true },
      { proof: "retain", prompt: "Complete a mixed Memory Vault organelle review.", independentRequired: true },
      { proof: "transfer", prompt: "Predict a structural feature for an engineered cell and defend the prediction.", independentRequired: true }
    ],
    requiredMasteryProofs: ["recall", "explain", "perform", "retain", "transfer"],
    feedbackRules: [
      { diagnosisCode: "label_without_job", result: "The learner named a structure without explaining its function.", hint: "Ask what would stop working if the structure failed.", action: "Route to structure-job-evidence sorting." },
      { diagnosisCode: "membrane_wall_confusion", result: "The learner treated boundary support and controlled movement as the same job.", hint: "Compare protection and shape with selective movement across a boundary.", action: "Route to alternate boundary model and retry." },
      { diagnosisCode: "weak_evidence_link", result: "The learner cited a clue without explaining why it supports the claim.", hint: "Add the because sentence between the evidence and the function.", action: "Route to CER frame before a new diagnosis." }
    ],
    reteachPaths: [{ id: "g9-biology-cells-reteach", trigger: "The learner can name structures but cannot connect them to evidence.", action: "Sort organelles by job, model one structure-function chain, then retry a smaller case." }],
    prerequisiteRepairPaths: [{ id: "g9-biology-cells-prerequisite", trigger: "The learner cannot read the diagram or identify evidence.", action: "Repair diagram-reading and claim-evidence-reasoning skills before organelle diagnosis." }],
    challengePaths: [{ id: "g9-biology-cells-challenge", trigger: "The learner independently diagnoses changed cases.", action: "Compare plant and animal cells or design a structure for a novel biological function." }],
    parentTeacherNotes: "Keep the lesson evidence-driven. A vocabulary-perfect response without a defensible structure-function explanation should remain below transferable mastery.",
    accessibilityNotes: ["Provide a text-based description of every diagram and a keyboard-completable sort.", "Do not rely on color alone for organelle categories.", "Allow oral CER explanation or labeled drawing when writing mechanics are not the target."],
    safetyNotes: ["Keep biological examples classroom-safe and do not imply medical diagnosis from cell analogies."],
    contentStatus: "pilot_ready",
    version: "3.0.0-scholar-cells-exemplar"
  };
}

function nativeBridgeRatiosV3(lesson) {
  if (lesson.id !== "g6-math-ratios-unit-rates") return {};
  return {
    schemaVersion: "3",
    academy: "bridge",
    gradeLevel: "6",
    course: "Grade 6 Math",
    unitId: "ratios-rates-proportional-reasoning",
    lessonNumber: 1,
    lessonFamily: "skill_workshop",
    secondaryLessonFamily: "reasoning_lab",
    activePhases: ["orient", "model", "deconstruct", "practice", "reason", "prove", "remember", "transfer", "adapt"],
    targetLearningStates: ["acquiring", "developing", "accurate", "secure"],
    learningObjective: lesson.objective,
    successCriteria: [
      "I can explain what both quantities in a ratio mean.",
      "I can build equivalent ratios by multiplying or dividing both quantities by the same factor.",
      "I can use a double number line or ratio table to find a unit rate.",
      "I can defend which deal is better using a unit-rate sentence."
    ],
    essentialQuestion: "How can ratios help us compare different-size deals fairly?",
    standardsTags: lesson.standards,
    thinkingSkillTags: ["ratio-reasoning", "double-number-line", "unit-rate", "fair-comparison", "misleading-deal-detection"],
    vocabularyTerms: ["ratio", "equivalent ratio", "rate", "unit rate", "scale factor", "double number line"],
    prerequisiteSkillIds: ["multiply-and-divide-whole-numbers", "decimal-money-values", "read-table", "write-because-sentence"],
    outcomes: {
      knowledge: [
        "A ratio compares two quantities in a chosen order.",
        "Equivalent ratios preserve the same relationship by scaling both quantities equally.",
        "A unit rate compares a quantity to one unit."
      ],
      capability: [
        "Build a ratio table from a real-world deal.",
        "Use a double number line to find a unit rate.",
        "Compare two deals with a labeled unit-rate sentence."
      ],
      reasoning: [
        "Detect when a deal looks cheaper because the total price is lower but the unit rate is worse.",
        "Explain why adding the same number to both quantities usually changes the ratio relationship."
      ],
      retention: ["Recall the equivalent-ratio rule and unit-rate comparison after a delay."],
      transfer: ["Use ratio reasoning on a new shopping, recipe, map, game-currency, or classroom-budget problem."]
    },
    phaseModules: [
      {
        phase: "orient",
        title: "Enter the neon market",
        studentAction: "Pick which snack deal looks better, then write what information you need to prove it.",
        successCheck: "The learner recognizes that a first guess needs fair-comparison evidence."
      },
      {
        phase: "model",
        title: "See the relationship",
        studentAction: "Watch the ratio table and double number line show the same relationship in two visual forms.",
        teacherModel: "Label the quantities first, then scale both quantities by the same factor.",
        visualSupport: lesson.visual.caption,
        successCheck: "The learner can point to the same ratio pair in the table and on the double number line."
      },
      {
        phase: "deconstruct",
        title: "Break the deal into ratio, scale, and unit rate",
        studentAction: "Sort each part of a worked example into quantity labels, scale factor, equivalent ratio, and unit rate.",
        teacherModel: "The unit rate is the deal reduced to one unit, not just the smallest-looking number.",
        successCheck: "The learner can explain why 4 for $10 and 2 for $5 have the same price per item."
      },
      {
        phase: "practice",
        title: "Build the better-deal board",
        studentAction: "Complete a ratio table and double number line for two deals, then calculate each unit rate.",
        teacherModel: lesson.sections.guidedPractice,
        successCheck: "The learner creates a matching table, line, and unit-rate sentence."
      },
      {
        phase: "reason",
        title: "Defend the fair comparison",
        studentAction: "Write which deal is better and use because plus two labeled unit rates.",
        teacherModel: "A strong answer says what one unit costs or gives for both deals.",
        successCheck: "The learner explains the choice without relying on total price alone."
      },
      {
        phase: "prove",
        title: "Complete the deal checkpoint",
        studentAction: "Answer the ratio and unit-rate quiz items independently.",
        successCheck: "The learner completes the checkpoint without final-answer help."
      },
      {
        phase: "remember",
        title: "Store the comparison rule",
        studentAction: "Return later to recall the rule: scale both quantities together, then compare one unit.",
        successCheck: "Delayed recall is scheduled before durable mastery is claimed."
      },
      {
        phase: "transfer",
        title: "Find a real better deal",
        studentAction: "Use a real or teacher-provided price pair to build a table, line, unit rate, and recommendation.",
        successCheck: "The learner applies ratio reasoning to a changed shopping, recipe, or classroom-budget problem."
      },
      {
        phase: "adapt",
        title: "Choose reteach or challenge",
        studentAction: "If the unit-rate sentence is weak, retry with one labeled ratio; if it is strong, design a misleading deal.",
        successCheck: "The next move is based on evidence from the learner's explanation, not only the score."
      }
    ],
    proofTasks: [
      {
        proof: "recall",
        prompt: "State the rule for creating an equivalent ratio.",
        independentRequired: true
      },
      {
        proof: "explain",
        prompt: "Explain why adding the same number to both quantities can break a ratio relationship.",
        independentRequired: true
      },
      {
        proof: "perform",
        prompt: "Compare two deals by finding both unit rates.",
        independentRequired: true
      },
      {
        proof: "retain",
        prompt: "After a delay, solve a new unit-rate comparison without looking back at the model.",
        independentRequired: true
      },
      {
        proof: "transfer",
        prompt: "Use ratio reasoning on a new real-world deal, recipe, game-currency, or map-scale problem.",
        independentRequired: true
      }
    ],
    requiredMasteryProofs: ["recall", "explain", "perform", "retain", "transfer"],
    feedbackRules: [
      {
        diagnosisCode: "ratio_order_reversal",
        result: "The learner changes the meaning by reversing or mixing quantity order.",
        hint: "Label the two quantities before writing the ratio, table, or sentence.",
        action: "Return to the quantity-labeling step and rebuild the first row."
      },
      {
        diagnosisCode: "additive_scaling_error",
        result: "The learner adds the same amount instead of multiplying by the same scale factor.",
        hint: "Ask what number multiplies both quantities to get the new row.",
        action: "Use the ratio table ladder and mark the scale factor beside each arrow."
      },
      {
        diagnosisCode: "total_price_trap",
        result: "The learner chooses a lower total price without comparing the price for one unit.",
        hint: "Find the cost for one item in both deals before choosing.",
        action: "Use the unit-rate sentence frame: Deal ___ is better because one ___ costs ___."
      }
    ],
    reteachPaths: [
      {
        id: "g6-ratios-label-quantities-reteach",
        trigger: "The learner cannot say what each number in the ratio means.",
        action: "Use two-column labels and physical item cards before building a ratio table."
      },
      {
        id: "g6-ratios-unit-rate-reteach",
        trigger: "The learner compares total prices instead of unit rates.",
        action: "Reduce each deal to one item or one unit, then compare the unit-rate sentence."
      }
    ],
    prerequisiteRepairPaths: [
      {
        id: "g6-ratios-decimal-money-repair",
        trigger: "The learner cannot divide money values or interpret decimals.",
        action: "Repair decimal money division with a simpler 2-item or 4-item price before returning to the deal."
      }
    ],
    challengePaths: [
      {
        id: "g6-ratios-misleading-deal-challenge",
        trigger: "The learner can compare two deals and explain the unit rates independently.",
        action: "Ask the learner to design a misleading deal that looks cheaper but has a worse unit rate."
      }
    ],
    memoryPlan: {
      defaultIntervals: ["day-0", "day-1", "day-3", "day-7"],
      reviewModes: ["recall", "explain", "apply"],
      priorityItems: ["ratio order", "scale factor", "unit rate", "fair comparison sentence"]
    },
    transferTask: {
      title: "Better deal crew board",
      prompt: lesson.groupHomework.sharedOutcome,
      individualAccountability: "Each learner submits one unit-rate sentence and one trap they checked for."
    },
    parentTeacherNotes:
      "Use this as Bridge Academy Batch 1 math exemplar for ratios and rates. Keep IXL links as reference-only unless the school or parent has approved external use.",
    accessibilityNotes: [
      "Do not rely only on color to connect table rows to double-number-line points.",
      "Provide alt text for the ratio diagram and spoken labels for the two quantities.",
      "Offer sentence frames and calculator accommodations when arithmetic is not the target barrier."
    ],
    safetyNotes: ["Do not send students to external IXL links unless staff or parent approval and licensing are in place."],
    contentStatus: "pilot_ready",
    version: "3.0.0-bridge-ratios-unit-rates"
  };
}

function nativeBridgeWeatherV3(lesson) {
  if (lesson.id !== "g6-earth-systems-weather") return {};
  return {
    schemaVersion: "3",
    academy: "bridge",
    gradeLevel: "6",
    course: "Grade 6 Science",
    unitId: "weather-and-climate",
    lessonNumber: 1,
    lessonFamily: "inquiry_investigation",
    secondaryLessonFamily: "reasoning_lab",
    activePhases: ["orient", "model", "deconstruct", "practice", "reason", "prove", "remember", "transfer", "adapt"],
    targetLearningStates: ["acquiring", "developing", "accurate", "secure"],
    learningObjective: lesson.objective,
    successCriteria: [
      "I can separate weather observations from forecast predictions.",
      "I can use at least two pieces of weather evidence before making a claim.",
      "I can explain how pressure, wind, temperature, or clouds support a short-term forecast.",
      "I can revise a forecast rule after comparing it with real weather data."
    ],
    essentialQuestion: "How can weather data support a forecast without turning the forecast into a guess?",
    standardsTags: lesson.standards,
    thinkingSkillTags: ["evidence_room", "systems_mapper", "claim-evidence-reasoning", "forecast-revision"],
    vocabularyTerms: ["air pressure", "wind direction", "temperature", "humidity", "forecast", "confidence rating"],
    prerequisiteSkillIds: ["read-simple-data-table", "identify-map-symbols", "write-because-sentence"],
    outcomes: {
      knowledge: [
        "Weather data includes pressure, temperature, humidity, wind, clouds, and recent change over time.",
        "Forecasts are evidence claims with uncertainty, not guaranteed answers."
      ],
      capability: [
        "Read a weather map or table and identify at least two useful data points.",
        "Write a short forecast claim with evidence and confidence."
      ],
      reasoning: [
        "Compare strong and weak forecast evidence.",
        "Revise a rule when actual weather does not match the forecast."
      ],
      retention: ["Recall what high/low pressure and wind arrows can indicate after a delay."],
      transfer: ["Use the same evidence logic on a new city, map, or weather table."]
    },
    phaseModules: [
      {
        phase: "orient",
        title: "Join the forecast studio",
        studentAction: "Study the mission and write one thing a forecast must prove with evidence.",
        successCheck: "The learner can say the lesson is about evidence-based prediction, not guessing."
      },
      {
        phase: "model",
        title: "Read the weather map like data",
        studentAction: "Inspect the pressure zones, wind arrows, cloud bands, and temperature clues before making any claim.",
        teacherModel: "A strong forecast starts with observations, then uses patterns to make a cautious prediction.",
        visualSupport: lesson.visual.caption,
        successCheck: "The learner can point to two data clues in the map."
      },
      {
        phase: "deconstruct",
        title: "Break a forecast into parts",
        studentAction: "Sort the work into observation, pattern, claim, confidence, and missing data.",
        teacherModel: "Observation is what the data shows. Prediction is what may happen next. Confidence depends on how much useful evidence you have.",
        successCheck: "The learner can explain why one symbol alone is weak evidence."
      },
      {
        phase: "practice",
        title: "Build a two-evidence forecast",
        studentAction: "Use the interactive check and write a first forecast sentence with because plus two data points.",
        teacherModel: lesson.sections.guidedPractice,
        successCheck: "The learner attempts the widget and writes a first evidence sentence."
      },
      {
        phase: "reason",
        title: "Defend the forecast",
        studentAction: "Write the claim, evidence, and the exact part that still feels uncertain.",
        teacherModel: "Good scientists name uncertainty so they can test and revise the rule later.",
        successCheck: "The learner can explain what evidence supports the claim and what data is missing."
      },
      {
        phase: "prove",
        title: "Complete the mission checkpoint",
        studentAction: "Answer the weather evidence questions without final-answer help.",
        successCheck: "The learner answers the checkpoint and reviews the reasoning notes."
      },
      {
        phase: "remember",
        title: "Save it to Memory Vault",
        studentAction: "Return later to recall what pressure and wind clues can show.",
        successCheck: "Delayed recall is scheduled before durable mastery is claimed."
      },
      {
        phase: "transfer",
        title: "Forecast a new place",
        studentAction: "Use a new weather table or family weather board to make, test, and revise a forecast rule.",
        successCheck: "The learner applies evidence reasoning to a changed map, city, or week."
      },
      {
        phase: "adapt",
        title: "Choose the next instructional move",
        studentAction: "If the evidence sentence is weak, switch to one-variable reteach; if it is strong, move to a new forecast challenge.",
        successCheck: "The next action is based on the evidence, not just the score."
      }
    ],
    proofTasks: [
      {
        proof: "recall",
        prompt: "Name two types of weather data that can support a short-term forecast.",
        independentRequired: true
      },
      {
        proof: "explain",
        prompt: "Explain why one weather symbol is weaker than two connected data points.",
        independentRequired: true
      },
      {
        proof: "perform",
        prompt: "Write a forecast claim with two evidence points and a confidence rating.",
        independentRequired: true
      },
      {
        proof: "retain",
        prompt: "After a delay, recall how pressure or wind evidence can affect a forecast.",
        independentRequired: true
      },
      {
        proof: "transfer",
        prompt: "Use a different weather map or one-week family weather board to revise a forecast rule.",
        independentRequired: true
      }
    ],
    requiredMasteryProofs: ["recall", "explain", "perform", "retain", "transfer"],
    feedbackRules: [
      {
        diagnosisCode: "evidence_selection_weakness",
        result: "The forecast claim uses too little or weak evidence.",
        hint: "Point to two data clues before writing the word because.",
        action: "Return to the map and label observation, pattern, and claim."
      },
      {
        diagnosisCode: "vocabulary_confusion",
        result: "The learner is mixing up pressure, wind, temperature, or humidity.",
        hint: "Use one variable at a time and say what it can help predict.",
        action: "Run the one-variable reteach path before combining data."
      },
      {
        diagnosisCode: "confidence_mismatch",
        result: "The learner sounds too certain when evidence is incomplete.",
        hint: "Name what data is missing and lower the confidence rating.",
        action: "Revise the forecast with a confidence sentence."
      }
    ],
    reteachPaths: [
      {
        id: "g6-weather-one-variable-reteach",
        trigger: "The learner cannot connect a data clue to a forecast claim.",
        action: "Use one variable at a time: pressure first, then wind, then temperature."
      },
      {
        id: "g6-weather-evidence-sentence-reteach",
        trigger: "The learner gives a prediction without because plus evidence.",
        action: "Use the sentence frame: I predict ___ because the map shows ___ and ___."
      }
    ],
    prerequisiteRepairPaths: [
      {
        id: "g6-weather-map-symbol-repair",
        trigger: "The learner cannot read the map or table symbols.",
        action: "Repair map-symbol reading before asking for a full forecast."
      }
    ],
    challengePaths: [
      {
        id: "g6-weather-new-city-transfer",
        trigger: "The learner can defend a current-context forecast independently.",
        action: "Give a new city or one-week family weather board and require a revised forecast rule."
      }
    ],
    memoryPlan: {
      defaultIntervals: ["day-0", "day-1", "day-3", "day-7"],
      reviewModes: ["recall", "explain", "apply"],
      priorityItems: ["pressure clues", "wind direction", "two-evidence forecast sentence"]
    },
    transferTask: {
      title: "Family weather board",
      prompt: lesson.groupHomework.sharedOutcome,
      individualAccountability: "Each learner submits one revised forecast rule and explains what changed."
    },
    parentTeacherNotes:
      "This native V3 exemplar should be used to test the Bridge Academy class-session model, group evidence roles, delayed recall, and transfer before scaling Grade 6 content.",
    accessibilityNotes: [
      "Provide alt text for map visuals and do not rely on color alone for pressure or wind symbols.",
      "Offer sentence frames for claim-evidence-reasoning responses.",
      "Allow oral explanation or diagram annotation when writing is not the target skill."
    ],
    safetyNotes: ["Do not represent forecasts as guaranteed weather or emergency guidance."],
    contentStatus: "pilot_ready",
    version: "3.0.0-bridge-weather-exemplar"
  };
}

function nativeBridgeLearningAiV3(lesson) {
  if (lesson.id !== "g6-learning-ai-build-test") return {};
  return {
    schemaVersion: "3",
    academy: "bridge",
    gradeLevel: "6",
    course: "AI And App Building",
    unitId: "learning-ai-building-apps-testing-projects",
    lessonNumber: 1,
    lessonFamily: "project_studio",
    secondaryLessonFamily: "concept_launch",
    activePhases: ["orient", "model", "deconstruct", "practice", "reason", "prove", "remember", "transfer", "adapt"],
    targetLearningStates: ["acquiring", "developing", "accurate", "secure"],
    learningObjective: lesson.objective,
    successCriteria: [
      "I can explain AI as a tool that predicts useful output from prompts and context.",
      "I can separate frontend, backend, API, and database responsibilities in a small app.",
      "I can write a strong AI prompt with role, goal, constraints, examples, and success criteria.",
      "I can test AI output with a bug report, privacy check, fact check, and retest loop.",
      "I can name when an AI agent, tool call, log, environment variable, or human review gate is needed."
    ],
    essentialQuestion: "How can I use AI like a responsible builder instead of treating it like magic?",
    standardsTags: lesson.standards,
    thinkingSkillTags: ["ai-literacy", "system-design", "prompt-engineering", "debugging", "privacy-safety", "human-review"],
    vocabularyTerms: [
      "artificial intelligence",
      "prompt",
      "context",
      "model",
      "hallucination",
      "frontend",
      "backend",
      "API",
      "database",
      "AI agent",
      "tool call",
      "version control",
      "environment variable",
      "log",
      "cost limit",
      "debugging",
      "test case",
      "bug report",
      "deployment",
      "accessibility",
      "privacy"
    ],
    prerequisiteSkillIds: ["read-short-technical-definition", "write-clear-question", "sort-system-parts", "explain-expected-vs-actual"],
    outcomes: {
      knowledge: [
        "AI tools generate likely outputs from prompts, context, and training patterns; they can be helpful and wrong.",
        "Frontend is the visible interface; backend stores data, enforces rules, and connects services.",
        "APIs are controlled ways for software parts to request or send information.",
        "Agents can plan and use approved tools, but they need permissions, logs, cost limits, and human review gates.",
        "Testing checks whether the project does what it is supposed to do before people rely on it."
      ],
      capability: [
        "Write a builder prompt with role, goal, constraints, examples, and definition of done.",
        "Map a tiny app into frontend screens, backend jobs, API calls, database records, agent/tool boundaries, and tests.",
        "Create a useful bug report with expected result, actual result, reproduction steps, logs or clues, and one possible cause."
      ],
      reasoning: [
        "Decide which AI outputs need fact-checking, safety review, privacy filtering, or code testing.",
        "Explain why the human is still responsible for the final project even when AI helped create it.",
        "Decide whether a task should be done by the user, the app, an AI tutor, an agent, a backend service, or a human reviewer."
      ],
      retention: ["Recall AI builder vocabulary and the reproduce -> isolate -> fix -> retest bug loop after a delay."],
      transfer: ["Use the same AI builder process on a new class project, website idea, or learning-tool prototype."]
    },
    phaseModules: [
      {
        phase: "orient",
        title: "Enter AI builder mode",
        studentAction: "Pick one app idea and write what the app should help a real learner do.",
        successCheck: "The learner starts with a human goal instead of asking AI for a random answer."
      },
      {
        phase: "model",
        title: "See the AI builder system",
        studentAction: "Read the map from goal to prompt, AI output, frontend, backend, agent/tool boundary, database, test loop, and final project.",
        teacherModel: "AI is one tool inside the system. The builder defines the goal, checks the output, protects privacy, and tests the result.",
        visualSupport: lesson.visual.caption,
        successCheck: "The learner can point to the human decision points and software parts."
      },
      {
        phase: "deconstruct",
        title: "Break down the parts",
        studentAction: "Sort each card into AI term, frontend part, backend part, data part, testing action, or safety check.",
        teacherModel: "A good builder names the part before trying to fix or improve it.",
        successCheck: "The learner can explain why a login screen, permission rule, API route, and bug test are different jobs."
      },
      {
        phase: "practice",
        title: "Build a tiny app blueprint",
        studentAction: "Choose the strongest prompt, then sketch one screen, one backend job, one data record, one safe AI/tool boundary, and one test.",
        teacherModel: lesson.sections.guidedPractice,
        successCheck: "The learner produces a small system map instead of a vague app idea."
      },
      {
        phase: "reason",
        title: "Check the AI instead of trusting it",
        studentAction: "Write which part of the AI output needs a fact check, privacy check, accessibility check, or bug test.",
        teacherModel: "Confidence is not proof. The answer has to survive a check.",
        successCheck: "The learner names at least one verification move before using AI output."
      },
      {
        phase: "prove",
        title: "Complete the AI builder checkpoint",
        studentAction: "Answer the prompt, frontend/backend, AI safety, and bug-report questions independently.",
        successCheck: "The learner proves current understanding without final-answer help."
      },
      {
        phase: "remember",
        title: "Store the builder loop",
        studentAction: "Return later to recall: goal -> prompt -> review -> build -> test -> debug -> retest.",
        successCheck: "Delayed recall is scheduled before durable mastery is claimed."
      },
      {
        phase: "transfer",
        title: "Use AI on a new project",
        studentAction: "Apply the same process to a different class project: write a prompt, map the system, test the output, and revise.",
        successCheck: "The learner transfers AI builder thinking to a new project instead of memorizing terms only."
      },
      {
        phase: "adapt",
        title: "Choose the next builder move",
        studentAction: "If vocabulary is weak, use the glossary; if the system map is weak, rebuild the frontend/backend split; if testing is weak, write a better bug report.",
        successCheck: "The app routes help based on the exact stuck point."
      }
    ],
    proofTasks: [
      {
        proof: "recall",
        prompt: "Define prompt, model, frontend, backend, API, database, test case, and bug report in student-friendly words.",
        independentRequired: true
      },
      {
        proof: "explain",
        prompt: "Explain why AI output must be checked before it becomes part of a real project.",
        independentRequired: true
      },
      {
        proof: "perform",
        prompt: "Create a tiny app blueprint with prompt, frontend, backend, data, safe agent/tool boundary, tests, and privacy rule.",
        independentRequired: true
      },
      {
        proof: "retain",
        prompt: "After a delay, recall the AI builder loop and debugging loop without looking back.",
        independentRequired: true
      },
      {
        proof: "transfer",
        prompt: "Use the same AI builder process on a new website, study tool, or class project idea.",
        independentRequired: true
      }
    ],
    requiredMasteryProofs: ["recall", "explain", "perform", "retain", "transfer"],
    feedbackRules: [
      {
        diagnosisCode: "ai_magic_thinking",
        result: "The learner treats AI as always correct or automatically creative.",
        hint: "Ask what the human goal is and what check would prove the output is useful.",
        action: "Return to the human-review step and require a fact, safety, or test check."
      },
      {
        diagnosisCode: "frontend_backend_blur",
        result: "The learner mixes visible interface work with server/data/security work.",
        hint: "Ask whether the user sees it directly or whether it happens behind the scenes.",
        action: "Use the restaurant metaphor and sort each part into menu/table, kitchen, order system, or storage."
      },
      {
        diagnosisCode: "weak_debug_report",
        result: "The learner says it is broken without expected result, actual result, or reproduction steps.",
        hint: "Use the bug card: expected, actual, steps, clue, retest.",
        action: "Rewrite the bug report before trying another fix."
      },
      {
        diagnosisCode: "unsafe_agent_or_tool_use",
        result: "The learner wants an AI agent or tool to act without clear permission, cost limit, or review.",
        hint: "Ask what the tool can access, what it may change, what it costs, and who reviews the result.",
        action: "Add a tool boundary card with permission, log, cost limit, and human approval before launch."
      }
    ],
    reteachPaths: [
      {
        id: "g6-ai-glossary-reteach",
        trigger: "The learner cannot define or sort AI/app-building terms.",
        action: "Use definition cards and the system map before asking for another project plan."
      },
      {
        id: "g6-ai-debug-loop-reteach",
        trigger: "The learner cannot describe a test or bug report.",
        action: "Use one broken-button scenario and fill expected, actual, steps, clue, fix, and retest."
      },
      {
        id: "g6-ai-agent-tool-boundary-reteach",
        trigger: "The learner treats AI agents or tool calls as unlimited helpers.",
        action: "Sort tasks into human-only, AI suggestion, approved tool call, backend service, and manager review."
      }
    ],
    prerequisiteRepairPaths: [
      {
        id: "g6-ai-clear-question-repair",
        trigger: "The learner asks a vague AI question with no goal or success criteria.",
        action: "Repair prompt writing with the frame: role, audience, task, constraints, example, definition of done."
      }
    ],
    challengePaths: [
      {
        id: "g6-ai-red-team-challenge",
        trigger: "The learner can map the system and test output independently.",
        action: "Ask the learner to red-team the app idea for privacy, hallucination, accessibility, and edge-case bugs."
      }
    ],
    memoryPlan: {
      defaultIntervals: ["day-0", "day-1", "day-3", "day-7"],
      reviewModes: ["define", "sort", "debug", "transfer"],
      priorityItems: ["prompt checklist", "frontend/backend/API/database split", "agent/tool boundary", "human review", "bug loop"]
    },
    transferTask: {
      title: "AI app launch card",
      prompt: lesson.groupHomework.sharedOutcome,
      individualAccountability: "Each learner submits one prompt, one system-map part, one agent/tool boundary, one test, and one safety check."
    },
    parentTeacherNotes:
      "Use this as a school-sellable AI literacy class: students learn definitions through a system map, build a tiny app blueprint, ask AI responsibly, test outputs, and revise with evidence.",
    accessibilityNotes: [
      "Provide all technical terms as definition cards with short labels and examples.",
      "Let learners submit the app blueprint as text, drawing, or oral explanation.",
      "Do not rely only on neon color to distinguish AI, frontend, backend, database, and testing roles."
    ],
    safetyNotes: lesson.safetyNotes,
    contentStatus: "special_showcase",
    version: "3.0.0-special-ai-showcase"
  };
}

const specialAiLesson = {
  id: "g6-learning-ai-build-test",
  academyId: "bridge",
  grade: "6",
  subject: "computer-science",
  courseTitle: "AI And App Building",
  unitTitle: "Learning AI, Building Apps, And Testing Projects",
  title: "Learning AI",
  objective:
    "Explain core AI terms, describe frontend and backend responsibilities, write useful AI prompts, and use a bug-testing loop on a small app idea.",
  standards: ["k12cs"],
  estimatedMinutes: 36,
  masteryThreshold: 80,
  xp: 190,
  contentStatus: "special_showcase",
  showcase: {
    label: "Featured special lesson",
    reason: "Launches AI literacy as a hands-on builder class instead of a passive lecture.",
    priority: 1
  },
  definitionCards: [
    {
      term: "Artificial intelligence",
      definition: "Software that can generate or classify outputs from patterns, prompts, and context. It can help, but it can be wrong."
    },
    {
      term: "Prompt",
      definition: "The instruction you give AI. Strong prompts include role, goal, audience, constraints, examples, and definition of done."
    },
    {
      term: "Context",
      definition: "Information the AI can use for the task. Context should never include passwords or private student information."
    },
    {
      term: "Hallucination",
      definition: "A confident-sounding AI output that is false, unsupported, or made up."
    },
    {
      term: "Frontend",
      definition: "The screens, buttons, forms, visuals, sounds, and interactions the user sees and uses."
    },
    {
      term: "Backend",
      definition: "The server-side logic that checks permissions, runs rules, stores data, and connects tools."
    },
    {
      term: "API",
      definition: "A controlled doorway that lets one software part ask another software part for data or an action."
    },
    {
      term: "Database",
      definition: "An organized place where the app stores records such as accounts, lessons, quiz attempts, progress, and reviews."
    },
    {
      term: "AI agent",
      definition: "An AI-driven helper that can follow a goal through steps, but only inside approved permissions, tool limits, logs, and review gates."
    },
    {
      term: "Tool call",
      definition: "A controlled action an AI or app asks a tool to perform, such as searching, saving a file, reading data, or generating an image."
    },
    {
      term: "Version control",
      definition: "A way to track project changes so builders can compare versions, fix mistakes, and understand what changed."
    },
    {
      term: "Environment variable",
      definition: "A secret or setting kept outside the code, such as an API key, database URL, or feature flag."
    },
    {
      term: "Log",
      definition: "A record of what happened in the app, useful for finding bugs, checking safety, and understanding failures."
    },
    {
      term: "Cost limit",
      definition: "A rule that controls how much a paid AI or tool feature can spend before it needs approval."
    },
    {
      term: "Test case",
      definition: "A specific check that says what you did, what should happen, and whether the app passed."
    },
    {
      term: "Bug report",
      definition: "A clear note with expected result, actual result, steps to reproduce, clues, and retest result."
    },
    {
      term: "Deployment",
      definition: "Putting a project somewhere real users can open it, with the right environment variables and safety checks."
    },
    {
      term: "Accessibility",
      definition: "Designing so people can use the app with keyboards, screen readers, readable contrast, captions, and clear labels."
    }
  ],
  builderPath: [
    {
      title: "Define the learner goal",
      body: "Say who the app helps, what problem it solves, and what success looks like."
    },
    {
      title: "Ask AI like a builder",
      body: "Give role, audience, task, constraints, examples, output format, and a checklist."
    },
    {
      title: "Map the system",
      body: "Separate visible screens from backend jobs, API requests, database records, agent/tool boundaries, and review gates."
    },
    {
      title: "Test before trusting",
      body: "Run normal cases, edge cases, privacy checks, accessibility checks, and factual checks."
    },
    {
      title: "Debug and improve",
      body: "Reproduce the bug, isolate the cause, check logs, fix one thing, retest, and explain what changed."
    },
    {
      title: "Launch with guardrails",
      body: "Check environment variables, permissions, cost limits, review gates, logs, rollback plan, and user feedback."
    }
  ],
  visual: {
    type: "ai-system-map",
    title: "AI builder system map",
    caption:
      "A neon flow map showing student idea, prompt, AI model, frontend, backend, database, tests, bug reports, and final project.",
    altText:
      "A diagram connects a student's goal to a prompt, AI model output, frontend screen, backend server, database, tests, and bug fix loop.",
    generationPrompt:
      "Create a bold cyber-neon Grade 6 computer science teaching diagram for a lesson called Learning AI. Show a student goal flowing into a prompt, AI model, output review, frontend screen, backend API, database, approved agent/tool boundary, test checklist, logs, bug loop, and final project. Use short readable labels only, high contrast, no real children, no private data, no logos, and classroom-safe imagery."
  },
  teachingSupport: {
    summary: "AI is not magic: it is one tool inside a human-led build, test, and review process.",
    description:
      "The app teaches students to understand AI vocabulary, talk to AI with clear prompts, separate frontend from backend work, and test projects before trusting them.",
    diagramCallouts: [
      {
        title: "Prompt and context",
        body: "A prompt tells the AI the role, goal, constraints, examples, and output format. Context is the information the AI can use."
      },
      {
        title: "Frontend and backend",
        body: "The frontend is what the user sees and clicks. The backend handles data, rules, accounts, APIs, and storage."
      },
      {
        title: "Test and debug loop",
        body: "Good builders reproduce the bug, isolate the cause, fix one thing, retest, and write down what changed."
      },
      {
        title: "Agent and tool boundary",
        body: "AI agents and tools need permission limits, cost limits, logs, and human review before they can affect a real project."
      }
    ],
    helperNotes: [
      "Do not let students paste private names, addresses, passwords, or personal records into AI tools.",
      "Require students to define done before asking AI for help: audience, goal, constraints, and success checklist.",
      "Have students test AI output with small examples, edge cases, and a plain-language bug report.",
      "Teach students that API keys, database URLs, and passwords belong in environment variables, not in public code or prompts.",
      "When an AI agent uses a tool, require a permission, cost, log, and human-review checkpoint before trusting the result."
    ],
    commonMisunderstandings: [
      {
        mistake: "Thinking AI always knows the truth.",
        fix: "Teach that AI predicts useful text and can be wrong. Factual claims need source checks or tests."
      },
      {
        mistake: "Thinking frontend and backend are the same thing.",
        fix: "Use a restaurant metaphor: frontend is the menu and table service; backend is the kitchen, inventory, and order system."
      },
      {
        mistake: "Asking AI vague questions and accepting the first answer.",
        fix: "Use a prompt checklist and ask for alternatives, assumptions, tests, and possible bugs."
      },
      {
        mistake: "Testing only the happy path.",
        fix: "Check normal cases, weird inputs, missing data, permission mistakes, mobile layout, keyboard use, and whether the bug comes back."
      },
      {
        mistake: "Forgetting that apps need launch and maintenance.",
        fix: "Teach that real projects need environment variables, deployment checks, logs, error reports, backups, and a plan for user feedback."
      },
      {
        mistake: "Thinking AI agents can safely use every tool automatically.",
        fix: "Teach tool boundaries: the agent needs permission, limited access, cost controls, logs, and a human review gate for important actions."
      }
    ],
    confusionPrompt:
      "Write the exact part that is confusing: AI definitions, prompt writing, frontend, backend, API, database, agents, tool calls, testing, debugging, safety, costs, logs, or checking if the AI is wrong."
  },
  funTasks: [
    "Run a prompt battle: compare a weak AI prompt with a strong one and vote on which gives better help.",
    "Design a tiny app map with three frontend screens, two backend jobs, one database record, and three tests.",
    "Create an agent boundary card: what the agent can read, what it can change, what it costs, what gets logged, and who approves it.",
    "Create a bug report card: what happened, what you expected, steps to reproduce, and one possible cause.",
    "Run a red-team check: find one privacy risk, one hallucination risk, one accessibility risk, and one edge-case bug.",
    "Ship a launch checklist with environment variables, test cases, rollback plan, and user feedback question."
  ],
  groupHomework: {
    title: "AI builder crew",
    groupSize: "3-5 learners",
    roles: ["Prompt engineer", "Frontend designer", "Backend mapper", "Bug hunter", "Safety reviewer"],
    sharedOutcome:
      "Submit a one-page AI app blueprint with a prompt, screen sketch, backend/API map, agent/tool boundary, test checklist, bug report, and safety rule.",
    parentRole:
      "Ask the learner to explain what the AI did, what the human checked, and what private information should never be shared."
  },
  retentionChecks: [
    "Next-day AI vocabulary recall",
    "Three-day frontend/backend sorting challenge",
    "Seven-day prompt revision and bug-test transfer"
  ],
  reward: "Earn the AI Builder badge after revising a prompt, explaining the app system, and passing the bug-test challenge.",
  sections: {
    warmup: "Look at two AI prompts. Choose which one is more useful and explain why.",
    teach:
      "AI tools can generate suggestions from prompts and context. A builder still decides the goal, protects private information, checks the output, and tests the project. The frontend is the visible user experience. The backend stores data, runs rules, and connects services through APIs.",
    guidedPractice:
      "Sort cards into AI terms, frontend parts, backend parts, tool/agent boundaries, and testing actions. Then revise one weak prompt into a stronger builder prompt.",
    independentPractice:
      "Design a tiny study-helper app. List what the learner sees, what the backend stores, what AI helps with, what tool boundary protects users, and three tests before launch.",
    activity:
      "Use the AI Builder Map to connect prompt -> AI output -> frontend screen -> backend API -> database -> approved tool call -> test -> bug fix.",
    reteach:
      "Use the restaurant metaphor: frontend is what customers see, backend is the kitchen/order system, and AI is a helper that still needs a manager.",
    challenge:
      "Write a prompt that asks AI to find bugs in a project, then critique the AI's answer with a test checklist, privacy check, accessibility check, and launch checklist."
  },
  quiz: [
    {
      id: "g6-ai-q1",
      prompt: "Which prompt is most useful for getting AI help?",
      choices: [
        "You are helping a Grade 6 student. Explain APIs with a restaurant metaphor, give one example, and ask one check question.",
        "Make it better.",
        "Do my project.",
        "Tell me everything about computers."
      ],
      answerIndex: 0,
      explanation: "The best prompt gives role, audience, goal, format, and a clear definition of useful output."
    },
    {
      id: "g6-ai-q2",
      prompt: "In a web app, which part is usually frontend work?",
      choices: ["The buttons and screens the user sees", "The private database password", "The server rule that checks permissions", "The stored account records"],
      answerIndex: 0,
      explanation: "Frontend work is the visible interface: screens, buttons, forms, layout, and user interactions."
    },
    {
      id: "g6-ai-q3",
      prompt: "What should you do before trusting an AI-generated answer or code change?",
      choices: ["Test it and check important claims", "Assume it is always correct", "Paste private passwords so it has context", "Skip debugging if it sounds confident"],
      answerIndex: 0,
      explanation: "AI can be useful and still wrong. Builders test outputs, verify important claims, and protect private data."
    },
    {
      id: "g6-ai-q4",
      prompt: "Which bug report is strongest?",
      choices: [
        "When I click Start, the lesson page stays blank. I expected the lesson to open. Steps: sign in, go to Child, click Start.",
        "It is broken.",
        "The app is bad.",
        "Fix this now."
      ],
      answerIndex: 0,
      explanation: "A useful bug report says what happened, what was expected, and the steps to reproduce it."
    },
    {
      id: "g6-ai-q5",
      prompt: "What is the safest way to let an AI agent use a paid image tool in a school app?",
      choices: [
        "Give it a clear task, cost limit, content rules, log, and human approval before publishing",
        "Let it generate unlimited images without review",
        "Give it every password so it has more context",
        "Publish the first image immediately if it looks cool"
      ],
      answerIndex: 0,
      explanation: "Real AI tools need boundaries: permission, cost controls, safety checks, logs, and review before students see the result."
    }
  ],
  parentTeacherNotes:
    "Use this as a special AI literacy and app-building showcase. Keep it student-facing: students should build a small system map, write prompts, test, debug, and reflect on AI safety.",
  accessibilityNotes: [
    "Use short labels on diagrams and provide text definitions for every technical term.",
    "Allow students to explain the frontend/backend map orally or with a drawing.",
    "Do not rely on color alone to distinguish AI, frontend, backend, database, and testing nodes."
  ],
  safetyNotes: [
    "Students must not paste passwords, addresses, real student records, or private family information into AI tools.",
    "AI suggestions require human review, factual checks, and tests before project use."
  ],
  version: "1.0.0-special-ai-showcase"
};

export const pilotLessons = [...basePilotLessons, specialAiLesson].map((lesson) => {
  const studentFacing = defaultStudentFacingGuide(lesson);
  return {
    ...lesson,
    studentFacing,
    ...nativeFoundationFractionsV3({ ...lesson, studentFacing }),
    ...nativeScholarCellsV3({ ...lesson, studentFacing }),
    ...nativeBridgeRatiosV3({ ...lesson, studentFacing }),
    ...nativeBridgeWeatherV3({ ...lesson, studentFacing }),
    ...nativeBridgeLearningAiV3({ ...lesson, studentFacing })
  };
});

export const contentPipeline = [
  {
    stage: "Curriculum map",
    status: "Active",
    output: "Academy, grade, course, unit, skill, and standards coverage."
  },
  {
    stage: "Unit outline",
    status: "Active",
    output: "Objectives, sequence, projects, assessments, and prerequisites."
  },
  {
    stage: "Evidence design audit",
    status: "Gate",
    output: "EEF/WWC-aligned assessment, representation, problem solving, metacognition, intervention, and feedback checks."
  },
  {
    stage: "Lesson draft",
    status: "Ready",
    output: "Template-complete lesson with teach, practice, quiz, reteach, and challenge."
  },
  {
    stage: "Academic review",
    status: "Gate",
    output: "Accuracy, age fit, bias review, and standards confirmation."
  },
  {
    stage: "Interactive conversion",
    status: "Planned",
    output: "Manipulatives, labs, writing prompts, code activities, and simulations."
  },
  {
    stage: "Publish",
    status: "Gate",
    output: "Versioned lesson visible to learners with rollback support."
  }
];

export const qualityGates = [
  "Published lessons must include every universal lesson section.",
  "Core lessons must have at least one approved standards tag.",
  "Quiz items must include answer keys, explanations, and difficulty.",
  "Student lessons must include a summary, teaching description, diagram callouts, helper notes, common misunderstandings, and a confusion prompt.",
  "Visual Learning Agent prompts must be reviewed before generated images become student-facing assets.",
  "Agent and MCP tools must run through the Tool Gateway with role checks, logs, external-risk labels, and human-review gates.",
  "Math lessons must pass the evidence guidance audit before publication.",
  "Batch-imported lessons must pass duplicate, media, alt text, accessibility, readability, and standards coverage QA.",
  "Generated lesson visual assets must be reviewed and approved before linked drafts can publish.",
  "Replacement visual assets must include a valid source URL, license, credit, caption, and alt text before review.",
  "AI help must be lesson-scoped and hint-first for graded work.",
  "Parent dashboard must show mastery, time, intervention, and portfolio evidence.",
  "Child accounts require parent-managed setup, data export, and deletion flows.",
  "UI must meet keyboard access, visible focus, readable text, and contrast requirements."
];

export const productionArchitecture = {
  currentPrototype: "Dependency-free static web app with modular data, learning engine, UI, and tests.",
  targetStack: "Next.js, TypeScript, PostgreSQL, Prisma, object storage, queue jobs, Playwright, and an AI gateway.",
  modules: [
    "auth",
    "curriculum",
    "contentWorkflow",
    "learning",
    "assessment",
    "mastery",
    "assignment",
    "reporting",
    "portfolio",
    "ai",
    "audit"
  ]
};
