/* Your content lives here. Keep ids unique. Add/remove entries freely;
   status is "ongoing" or "past". Every key in `details` becomes a section in
   the reading panel. links: [{ label: "GitHub", url: "https://..." }]. */
window.PORTFOLIO = {
  profile: {
    name: 'Asif Hoda', handle: 'mrhello291',
    tagline: 'A curious mind. A work in progress.',
    bio: 'Final-year CSE undergrad at IIT Mandi and former SWE intern at Microsoft. I build agentic AI systems, research how generative models fail, and automate anything I have to do twice — mostly because I’m lazy.',
    degree: 'B.Tech · Computer Science & Engineering', college: 'IIT Mandi', location: 'Himachal Pradesh, India', age: 'Final year · Class of 2027',
    about: [
      'It started in 2020 with tiny Python games and a reminder script. At IIT Mandi that habit grew into line-following robots, a quadruped built on a student budget, and a lot of hackathons.',
      'Somewhere along the way I fell for the hard part of AI: not the demo, but making it dependable. That runs through my work, from multi-agent root-cause analysis at Microsoft to research on hallucination, synthetic data and deepfake detection, and side projects like VectorLedger and ACOS.',
      'I like problems where careful evaluation matters more than a clever trick, and I compete because it shows me quickly what actually works.'
    ],
    email: 'hoda.asif123@gmail.com',
    socials: [
      { label: 'GitHub', url: 'https://github.com/mrhello291' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/asif-hoda-4312b4288/' },
      { label: 'Hugging Face', url: 'https://huggingface.co/mrhello291' },
      { label: 'Kaggle', url: 'https://www.kaggle.com/mrhello291' },
      { label: 'Codeforces', url: 'https://codeforces.com/profile/Lazy_interpreter' },
      { label: 'LeetCode', url: 'https://leetcode.com/u/mrhello291/' }
    ],
    highlights: [
      { title: 'SWE Intern · Microsoft', subtitle: 'Azure Storage · agentic root-cause analysis', category: 'jobs', entry: 'microsoft-azure-storage',
        logos: [{ src: 'assets/logos/microsoft.svg', alt: 'Microsoft' }] },
      { title: 'Fetch.ai Agentic AI Hackathon · 1st prize', subtitle: 'FrostHack 2025 at IIT Mandi · Fetch.ai Innovation Lab', category: 'competitions', entry: 'frosthack-2025',
        logos: [{ src: 'assets/logos/fetchai.png', alt: 'Fetch.ai' }] },
      { title: 'AiHack India 2026 · Best Model prize', subtitle: 'Organised by AIFUL at IIT Mandi', category: 'competitions', entry: 'aihack-2026',
        logos: [{ src: 'assets/logos/aiful.png', alt: 'AIFUL' }] },
      { title: 'Inter IIT Tech Meet 14.0', subtitle: 'Observe.AI NLP challenge · IIT Patna', category: 'competitions', entry: 'inter-iit-14',
        logos: [{ src: 'assets/logos/interiit14.png', alt: 'Inter IIT Tech Meet 14.0' }, { src: 'assets/logos/observeai.svg', alt: 'Observe.AI' }] }
    ],
    journey: [
      { date: 'Oct 2026', title: '4th prize, Best Model · AiHack India 2026', description: 'Credit-risk modelling on AIFUL’s lending data at IIT Mandi, finishing 4th on the final private leaderboard.' },
      { date: 'May — Jul 2026', title: 'Software Engineer Intern · Microsoft', description: 'Built a multi-agent root-cause analysis service for the Azure Storage team in Bengaluru, now part of the on-call workflow.' },
      { date: 'Feb — Apr 2026', title: 'TabGEN research', description: 'Led a project on diffusion-based synthetic tabular data that generates better minority-class rows for imbalanced datasets.' },
      { date: 'Dec 2025', title: '6th of 23 IITs · Inter IIT Tech Meet 14.0', description: 'Represented IIT Mandi on Observe.AI’s NLP problem statement at IIT Patna, later recognised with IIT Mandi’s Foundation Day award for technical activities.' },
      { date: 'Sep — Nov 2025', title: 'Data Analytics Intern · Drezily', description: 'Unified three data silos into one analytics platform for a Bay Area startup, while researching hallucination reduction in LLMs.' },
      { date: 'Mar 2025', title: '1st prize · FrostHack 2025', description: 'Won the Fetch.ai-sponsored AI agent hackathon at IIT Mandi with FinnyRAG, an agentic assistant for personal finance.' },
      { date: 'Nov 2024 — Mar 2025', title: 'Head of Web Development · Xpecto', description: 'Led the team that built the first website for IIT Mandi’s techfest and handled most of its back end.' },
      { date: 'Aug 2023', title: 'B.Tech Computer Science · IIT Mandi', description: 'A line-following robot in the first year, then a budget quadruped, and deep learning courses that turned into research.' },
      { date: '2023', title: 'Cracked JEE Main and JEE Advanced', description: 'Cleared both national engineering entrance exams, with a JEE Advanced rank under 5,000, and earned a seat at IIT Mandi.' },
      { date: '2020', title: 'Where it began', description: 'Small Python games and a reminder script. The start of automating things instead of doing them twice.' }
    ]
  },
  categories: [
    { id:'jobs', title:'Jobs', place:'The workshop', number:'01', symbol:'⌘',
      description:'Places I’ve worked. Things I’ve learned. Experiences I’ve gained.', intro:'A field journal of work, collaboration, and lessons along the way.',
      x:14, y:39, path:'M 53 48 C 42 62 44 49 32 49 S 23 40 14 39', action:'Read role notes' },
    { id:'competitions', title:'Competitions', place:'The proving grounds', number:'02', symbol:'♜',
      description:'A challenge. A team. Something to figure out.', intro:'Challenges entered, ideas tested, and lessons taken home.',
      x:33, y:33, path:'M 53 48 C 41 55 43 44 40 42 S 38 34 33 33', action:'View challenge' },
    { id:'research', title:'Research', place:'The observatory', number:'03', symbol:'✧',
      description:'Good questions lead to interesting places.', intro:'Questions, experiments, and notes from the edges of what I understand.',
      x:85, y:36, path:'M 53 48 C 65 53 66 45 72 43 S 77 36 85 36', action:'Open notebook' },
    { id:'side-quests', title:'Side Quests', place:'The automation shed', number:'04', symbol:'⚙',
      description:'Small annoyances. Homemade solutions.', intro:'A little effort now, a little less repetitive work forever.',
      x:17, y:66, path:'M 53 48 C 44 63 38 59 30 66 S 21 66 17 66', action:'Inspect build' },
    { id:'open-source', title:'Open Source', place:'The shared yard', number:'05', symbol:'⌥',
      description:'Small contributions. Shared possibilities.', intro:'Building in the open, learning from others, and leaving things a little better.',
      x:43, y:77, path:'M 53 48 C 49 60 56 63 52 68 S 54 76 43 77', action:'View contribution' },
    { id:'fun-projects', title:'Fun Projects', place:'The playground', number:'06', symbol:'✣',
      description:'Built to see what happens.', intro:'Experiments with no grand plan. Just curiosity and a reason to press play.',
      x:84, y:74, path:'M 53 48 C 58 64 62 63 68 67 S 73 77 84 74', action:'Peek inside' }
  ]
};

PORTFOLIO.entries = [
  /* ── Jobs ─────────────────────────────────────────────── */
  { id:'microsoft-azure-storage', category:'jobs', status:'past',
    title:'Software Engineer Intern', org:'Microsoft', unit:'Azure Storage · Bengaluru, India · Full-time', logo:'assets/logos/microsoft.svg',
    summary:'Agentic root-cause analysis for Azure Storage. Built a multi-agent AI service that investigates failures from feature testing and produces evidence-backed root-cause analyses.',
    tags:['Full-time','On-site','Bengaluru, India'], date:'May 2026 — Jul 2026',
    skillIds:['backend','agents','rag','llm-eval','apis','deployment','containers','data-pipelines'],
    toolIds:['aspnet','azure','kusto','mcp','docker'],
    details:{
      'Team':'Azure Storage, part of Microsoft’s Cloud + AI group. Full-time Software Engineer Intern, on-site in Bengaluru, India.',
      'The problem':'When automated feature tests fail, engineers have to work out where the fault lies and why, often by digging through large volumes of logs, code and documentation by hand.',
      'What I built':'An end-to-end multi-agent AI service that investigates a test failure and produces an evidence-backed root-cause analysis with a suggested fix. I designed and implemented the agent harness: a ReAct reasoning and tool-use loop, memory and state management, orchestration across specialised agents, and parallel evidence collection.',
      'Evaluation':'Built an evaluation framework against engineer-written analyses, which showed a clear improvement in client/server fault classification over the previous system.',
      'Deployment':'Built with ASP.NET Core and Azure OpenAI, deployed on Azure Container Apps, and integrated into the team’s on-call workflow.',
      'What I learned':'Specialised agents beat one overloaded agent; long, noisy inputs need deliberate summarisation rather than bigger context windows; and a good evaluation set is worth building early.'
    }, links:[] },
  { id:'drezily-analytics', category:'jobs', status:'past',
    title:'Data Analytics Intern', org:'Drezily Inc.', unit:'Remote (SF Bay Area) · Part-time', logo:'assets/logos/drezily.png',
    summary:'Unified executive analytics platform. Owned the design and deployment of a dashboard joining MongoDB, GA4 and Search Console, replacing 6+ hours a week of manual reporting.',
    tags:['Remote','Part-time'], date:'Sep 2025 — Nov 2025',
    skillIds:['data-pipelines','databases','dashboards','apis'],
    toolIds:['python','streamlit','mongodb','pandas'],
    details:{
      'Organization':'Drezily Inc., an AI-native fashion shopping startup based in Milpitas, California, in the San Francisco Bay Area. Part-time, remote from India.',
      'The problem':'KPIs lived in three silos: MongoDB for signups, AI stylist adoption and partner-store clicks; GA4 for sessions and engagement; Search Console for organic search. Weekly reporting meant hand-merging CSV exports in Excel, 6–7 hours every week.',
      'What I built':'A Streamlit MVP that queried everything live, which collapsed under real use: ~5 minute page loads and Google API 429s. I decoupled ingestion from visualisation with a cron-driven worker that runs heavy aggregations, pulls incremental GA4/GSC deltas, normalises them with Pandas and writes pre-computed payloads to MongoDB. The app was then refactored into data, logic and UI layers with a multi-period engine for daily, weekly, monthly and custom ranges.',
      'Outcome':'Load time fell from ~5 minutes to under 20 seconds, three manual workflows disappeared, and leadership got one source of truth.',
      'What I learned':'Streamlit traded native cross-filtering for speed of development, so drill-downs needed session-state workarounds. With more time I would add Redis for sub-millisecond reads, anomaly alerts over Slack, and role-based access.'
    }, links:[] },

  { id:'xpecto-head-web', category:'jobs', status:'past',
    title:'Head of Web Development', org:'Xpecto Tech', unit:'IIT Mandi · Part-time', logo:'assets/logos/xpecto.png',
    summary:'Led the team that built the first-ever website for Xpecto ’25, IIT Mandi’s techfest, and owned most of its back end: accounts, team registrations, memberships, merch and payments.',
    tags:['On-site','Part-time','T3 stack'], date:'Nov 2024 — Mar 2025',
    skillIds:['backend','apis','databases','deployment'], toolIds:['typescript','nextjs','trpc','prisma','postgresql','supabase','clerk'],
    details:{
      'Organization':'Xpecto Tech, the team behind Xpecto, IIT Mandi’s annual techfest. Part-time, on-site.',
      'My role':'Head of Web Development. Planned the build, led a team of about ten contributors, and handled most of the back end myself as the second-largest contributor with 150+ commits.',
      'The challenge':'Xpecto had never had its own website. Everything from sign-ups to team formation, paid registrations and merch orders had to work for students from IIT Mandi and other colleges, on a fixed fest deadline.',
      'What I built':'The back end on the T3 stack: type-safe tRPC routers for users, competitions, teams and invitations, registrations, memberships, merch, campus ambassadors, workshops, expos, pronites and sponsors, over a PostgreSQL schema in Prisma on Supabase. Clerk handled Google and GitHub sign-in through a shared user context.',
      'Key features':'Team creation with invite tokens, acceptance and finalisation; competition registration with variable pricing by membership tier; membership plans with free online events for members and IIT Mandi students; merch orders with combos and a size chart; a campus ambassador programme and leaderboard; payment verification with transactional emails; and a fast site-wide event search.',
      'Hardening':'Guarded the rules that mattered: users cannot switch their college to IIT Mandi to claim its benefits, sign-in routes stay closed to logged-in users, and registration buttons cannot be double-submitted to trigger duplicate captchas.',
      'Outcome':'Xpecto’s first website, live for the fest, handling registrations, memberships and merch for Xpecto ’25.'
    }, links:[
      { label:'Website', url:'https://www.xpecto.org/' },
      { label:'Code', url:'https://github.com/Voldemort271/xpecto-25' }
    ] },

  /* ── Competitions ─────────────────────────────────────── */
  { id:'inter-iit-15', category:'competitions', status:'ongoing',
    title:'Inter IIT Tech Meet 15.0', org:'All IITs', unit:'Annual inter-IIT technical championship', result:'In preparation',
    summary:'Preparing with IIT Mandi’s contingent for the next inter-IIT technical meet.',
    tags:['IIT Mandi contingent'], date:'2026',
    skillIds:[], toolIds:[],
    details:{
      'Event':'Inter IIT Tech Meet 15.0.',
      'Status':'In preparation. More notes once the problem statements are out.'
    }, links:[] },
  { id:'gitlab-life-after-code', category:'competitions', status:'ongoing',
    title:'Life After Code', org:'GitLab', unit:'Devpost hackathon · The path to production', result:'In progress', logo:'assets/logos/gitlab.svg',
    summary:'GitLab’s Devpost hackathon on the path to production at the speed of imagination: what happens to software after the code is written.',
    tags:['Devpost','GitLab'], date:'Oct 2026',
    skillIds:[], toolIds:[],
    details:{
      'Event':'Life After Code, a GitLab hackathon on Devpost running 5–27 October 2026, with a $45,000 prize pool.',
      'Status':'Building now. More once the submission is in.'
    }, links:[{ label:'Hackathon', url:'https://gitlab-transcend.devpost.com/' }] },
  { id:'gemma-4-developer-agent', category:'competitions', status:'ongoing',
    title:'Gemma 4 Developer Agent', org:'Google · Kaggle', unit:'Kaggle competition · Coding agents on everyday hardware', result:'In progress', logo:'assets/logos/kaggle.svg', partnerLogo:{ src:'assets/logos/google.svg', alt:'Google' },
    summary:'A Kaggle competition from Google to train the open Gemma 4 model into a capable coding agent that runs on everyday hardware.',
    tags:['Kaggle','Gemma 4','Coding agents'], date:'2026',
    skillIds:['agents','alignment'], toolIds:[],
    details:{
      'Event':'The Gemma 4 Developer Agent competition on Kaggle, run with Google, with a $100,000 prize pool and an entry deadline of 25 November 2026.',
      'The challenge':'Further train an open Gemma 4 model into a coding agent that is useful on ordinary developer hardware.',
      'Status':'In progress.'
    }, links:[] },
  { id:'name-that-llm', category:'competitions', status:'ongoing',
    title:'Name That LLM', org:'Kaggle', unit:'Kaggle competition · Model attribution', result:'In progress', logo:'assets/logos/kaggle.svg',
    summary:'Identify which of 18 large language models wrote each unlabelled passage of text.',
    tags:['Kaggle','NLP','Model attribution'], date:'2026 — 2027',
    skillIds:['nlp'], toolIds:[],
    details:{
      'Event':'Name That LLM on Kaggle, with a $50,000 prize pool and an entry deadline of 6 January 2027.',
      'The challenge':'Attribute each passage to one of 18 models from Anthropic, Google, Moonshot AI, OpenAI, Qwen and Z.ai. Telling models apart from short text helps researchers audit open benchmarks.',
      'Status':'In progress.'
    }, links:[{ label:'Competition', url:'https://www.kaggle.com/competitions/name-that-llm' }] },
  { id:'aihack-2026', category:'competitions', status:'past',
    title:'AiHack India 2026', org:'AIFUL Corporation', unit:'Held at IIT Mandi · Credit-risk modelling', result:'4th prize · Best Model', medal:'steel', logo:'assets/logos/aiful.png',
    summary:'Predicting which borrowers will default by month 24 from AIFUL’s anonymised lending data. Team KamandNet finished 4th on the final private leaderboard in the Best Model category.',
    tags:['Team KamandNet','Tabular ML','ROC AUC'], date:'Oct 2026',
    skillIds:['tabular','deep-learning','data-pipelines'], toolIds:['python','gbdt','pytorch','modal'],
    details:{
      'Result':'4th place in the Best Model category on the final private leaderboard, with ROC AUC 0.76578. We climbed two places from 6th on the public board, because we picked our final submission on our own validation rather than public scores. ₹10,000 prize.',
      'Event':'AiHack India 2026, run by AIFUL Corporation at IIT Mandi, 16–18 October 2026, with around 200 teams. Two categories: Best Model, ranked on the private leaderboard, and Best Team, judged on a presentation round.',
      'The challenge':'AIFUL’s customers had all survived their first 12 months without defaulting. Using only what was known at month 12 (application data plus monthly balances, borrowing and repayments for months 6–12), predict who would be in default by month 24. The hard part: most future defaulters still look healthy at month 12, and the target is imbalanced at about 8%.',
      'Our approach':'Over 22 submissions in three days we merged every idea into one 650-column feature matrix: an application-risk score trained on all 205k customers (including ones absent from train and test), minimum-payment and delinquency-streak features, payday alignment, and credit-limit utilisation, our biggest feature gain. On top sat a rank-averaged blend of gradient-boosted trees over several feature views, GRU networks, and a swap-noise denoising autoencoder with an MLP head (the Porto Seguro winning technique), which was our largest single step.',
      'How we kept it honest':'The public board was far noisier than the improvements we were chasing, so every change had to pass paired, repeated cross-validation and beat two standard errors. We caught and fixed several ways validation can flatter you: early stopping on the scored fold, fitting blend weights on the rows they are scored on, and picking the best of many candidates.',
      'What I learned':'Diversity beats strength in a blend: the autoencoder helped because it ranked customers differently, while our strongest tree added nothing. Keep cleaned values alongside raw ones, since data-entry errors carry signal. And simple equal-weight blending beat stacking and fancy weight searches.'
    },
    gallery:[
      { src:'assets/work/aihack/team.jpg', alt:'Team KamandNet with AIFUL and IIT Mandi organisers at the AiHack India 2026 prize ceremony', caption:'Prize ceremony at IIT Mandi' },
      { src:'assets/work/aihack/award.jpg', alt:'Certificate and trophy for 4th prize, Best Model category, AiHack India 2026', caption:'Certificate and trophy' },
      { src:'assets/work/aihack/leaderboard-private.jpg', alt:'Final private leaderboard with KamandNet in 4th place', caption:'Final private leaderboard' }
    ],
    links:[] },
  { id:'inter-iit-14', category:'competitions', status:'past',
    title:'Inter IIT Tech Meet 14.0', org:'IIT Patna', unit:'Observe.AI NLP problem statement · One team per IIT', result:'6th among all IITs', medal:'steel', logo:'assets/logos/interiit14.png', partnerLogo:{ src:'assets/logos/observeai.svg', alt:'Observe.AI' },
    summary:'Causal rationale extraction for contact-centre conversations: a system that explains why business events like escalations, refunds and churn happen, with evidence from the transcripts.',
    tags:['Observe.AI','NLP · Mid prep','IIT Patna'], date:'Dec 2025',
    skillIds:['nlp','rag','agents','llm-eval'], toolIds:['python','huggingface','gemini'],
    details:{
      'Result':'6th of 23 in Observe.AI’s NLP problem statement, where each IIT sent its best NLP team, so we were up against the top team from every IIT in India. IIT Mandi recognised our contingent with its Foundation Day Award for Outstanding Performance in Technical Activities 2025, presented at the 17th Foundation Day in March 2026.',
      'Event':'Inter IIT Tech Meet 14.0, hosted by IIT Patna, 11–14 December 2025. Observe.AI set a mid-prep problem statement in NLP and conversational intelligence.',
      'The problem':'Contact centres record huge volumes of conversations, but existing tools only detect what happened, not why. We had to build a scalable, domain-agnostic system that finds the dialogue spans causing events like escalations, refunds or churn, answers follow-up questions in context, and generates its own evaluation queries.',
      'Our approach':'An LLM-powered retrieval and reasoning system that discovers business events in unlabelled conversations, gathers supporting evidence for each question, and writes grounded answers that keep context across follow-ups. It stays domain-agnostic and inexpensive to run.',
      'Evaluation':'Compared with a plain hybrid-search baseline, our system substantially improved reasoning quality, contextual coherence and accuracy on specific questions while keeping faithfulness level. It was strongest at explaining why something happened and at big-picture questions; queries with several specific filters remained the hardest.'
    },
    gallery:[
      { src:'assets/work/interiit14/award.jpg', alt:'IIT Mandi Foundation Day Award for Outstanding Performance in Technical Activities 2025', caption:'IIT Mandi Foundation Day award' }
    ],
    links:[] },
  { id:'ai-knight', category:'competitions', status:'past',
    title:'AI-Knight', org:'IIT Jodhpur', unit:'Kaggle competition · real vs AI-generated images', result:'16th place', logo:'assets/logos/iitjodhpur.png',
    summary:'Real vs AI-generated images. Kaggle competition by IIT Jodhpur. Fine-tuned XceptionNet and EfficientNet to spot synthetic images; finished 16th.',
    tags:['IIT Jodhpur · Kaggle','16th place'], date:'Jun 2025',
    skillIds:['deep-learning'], toolIds:['python','pytorch'],
    details:{
      'Event':'AI-Knight, hosted by IIT Jodhpur on Kaggle.',
      'The challenge':'Classify CIFAKE-style images as real or AI-generated.',
      'Our approach':'Fine-tuned XceptionNet and EfficientNet backbones on Kaggle T4 GPUs and compared them.',
      'Result':'16th place, with an F1 of 0.93 on the private leaderboard and 0.91 on public.'
    }, links:[{ label:'Code', url:'https://github.com/AL-ETERNITY/AI-Knight' }] },
  { id:'matlab-troubleshooter', category:'competitions', status:'past',
    title:'HCLTech Deep Learning Hackathon', org:'HCLTech', unit:'At IIT Mandi · CS671 Deep Learning course', result:'11th place', logo:'assets/logos/hcltech.png',
    summary:'A MATLAB troubleshooting assistant: ask about an error or paste a screenshot, and get an answer grounded in MATLAB’s documentation, with citations.',
    tags:['CS671','Team of six'], date:'May 2025',
    skillIds:['backend','agents','rag','llm-eval','apis'], toolIds:['python','langgraph','faiss','mongodb','streamlit','gemini','huggingface'],
    details:{
      'Result':'11th place in the hackathon run by HCLTech at IIT Mandi for CS671 Deep Learning.',
      'The challenge':'Build a chatbot that helps people debug MATLAB errors and syntax problems, using the official documentation as its source of truth.',
      'What we built':'A multi-agent RAG system behind a Streamlit app. An initial agent checks whether a question is relevant and answers simple ones directly. A cache agent spots repeat questions and answers them from a Q&A store. New questions go to a retrieval agent that rephrases the query several ways, searches a FAISS index of MATLAB documentation chunks, and re-ranks results with RAG fusion before a final agent writes the cited answer. Every answer is scored by an in-house evaluator and TruLens. Around it: image-based queries, suggested follow-ups, automatic chat titles, saved multi-chat sessions in MongoDB, user and admin login, and an admin analytics dashboard.'
    },
    gallery:[
      { src:'assets/work/matlab-bot/backend-flow.jpg', alt:'Backend flow: relevance check, cache answering agent, document retrieving agent, answer generator and answer evaluating agent', caption:'Backend flow', fit:'contain' },
      { src:'assets/work/matlab-bot/frontend-flow.jpg', alt:'Frontend user flow of the MATLAB troubleshooting chatbot', caption:'User flow', fit:'contain' }
    ],
    links:[{ label:'Code', url:'https://github.com/pihu26112005/DLHackathon' }] },
  { id:'frosthack-2025', category:'competitions', status:'past',
    title:'Fetch.ai Agentic AI Hackathon 2025', org:'Fetch.ai Innovation Lab', unit:'FrostHack 2025 at IIT Mandi · AI agent hackathon', result:'1st prize', medal:'gold', logo:'assets/logos/fetchai.png',
    summary:'FinnyRAG: drop in your bank statements and ask about your money in plain language. A team of Fetch.ai agents parses the documents, finds the right transactions, answers questions and draws charts.',
    tags:['FrostHack 2025','1st prize','Team of two'], date:'Mar 2025',
    skillIds:['backend','agents','rag','apis','dashboards'],
    toolIds:['python','langgraph','streamlit','pathway','gemini'],
    details:{
      'Result':'1st prize at FrostHack 2025, the AI agent hackathon of Xpecto ’25 at IIT Mandi, sponsored by Fetch.ai Innovation Lab, among 111 registered participants.',
      'Event':'FrostHack 2025, the Xpecto ’25 AI Agent Hackathon at IIT Mandi powered by Fetch.ai Innovation Lab. Held online, 29–31 March 2025, with ₹50,000 in cash prizes.',
      'The idea':'Personal finances live in PDFs nobody wants to read. FinnyRAG turns them into something you can simply ask: “How much did I spend on food last month?”, “Show my biggest transfers”, “Why is my balance lower than usual?”',
      'What we built':'A parsing agent combines an LLM with regular expressions to turn statements into a structured transaction table. The table is chunked into text files in Google Drive, which feeds a Pathway vector store that updates live as new documents arrive. Separate agents handle net-spend visualisation, query-driven charts, relevant-document fetching and transaction search, and a question-answering agent uses a modified adaptive RAG loop. Everything runs as Fetch.ai agents on Agentverse, coordinated through LangGraph, behind a Streamlit app with home, chat and search pages.'
    },
    gallery:[
      { src:'assets/work/finnyrag/app-diagram.jpg', alt:'FinnyRAG architecture: parsing agent, output table, Pathway dynamic vector store, visualising, fetching, query and question-answering agents', caption:'App architecture', fit:'contain' },
      { src:'assets/work/finnyrag/agent-diagram.jpg', alt:'Fetch.ai agent diagram for FinnyRAG', caption:'Fetch.ai agents', fit:'contain' }
    ],
    links:[
      { label:'Code', url:'https://github.com/mrhello291/financeTrackerFrosthack2k25' },
      { label:'Demo video', url:'https://www.youtube.com/watch?v=DY6-u3Y996Q' },
      { label:'Devpost', url:'https://ai-agent-hackatho.devpost.com/project-gallery' }
    ] },
  /* ── Research ─────────────────────────────────────────── */
  { id:'log-analysis-ml', category:'research', status:'ongoing',
    title:'Learning which log lines matter',
    summary:'Can a model find bugs, errors and their causes in huge logs better than keyword windows around ERROR and WARN?',
    tags:['Log analysis','Early stage'], date:'2026 — present',
    skillIds:['deep-learning','llm-eval'], toolIds:['python'],
    details:{
      'Research question':'Current extraction of failures and causes from logs is too simple. Can a learned model rank the lines that matter for root-cause analysis?',
      'Where it came from':'Working on root-cause analysis made it clear how much of the job is finding the few log lines that matter. Simple heuristics get you part of the way; I want a model to decide what is important.',
      'Status':'Scoping the problem and the datasets.'
    }, links:[] },
  { id:'synthetic-financial-db', category:'research', status:'ongoing',
    title:'Scenario-based synthetic financial databases',
    summary:'Generating realistic synthetic financial databases driven by configurable scenarios.',
    tags:['Synthetic data','Finance','Confidential'], date:'2026 — present',
    skillIds:['generative','tabular'], toolIds:[],
    details:{
      'Research question':'How can we generate realistic, scenario-driven synthetic financial databases?',
      'Status':'In progress. Details are confidential for now; more once the work can be shared.'
    }, links:[] },
  { id:'tabgen-ord', category:'research', status:'past',
    title:'TabGEN: better minority-class synthetic tabular data',
    summary:'Diffusion-based synthetic data for imbalanced tables. Building on ORD and TabSyn, we generate better minority-class rows without hurting the majority, using overlap-aware latent diffusion and sub-unity classifier-free guidance.',
    tags:['Generative AI course','Tabular diffusion','Led the project'], date:'Feb 2026 — Apr 2026',
    skillIds:['generative','tabular','deep-learning','llm-eval'], toolIds:['python','pytorch','optuna'],
    details:{
      'Findings':'Sub-unity classifier-free guidance was the key. On the Adult dataset, minority-class accuracy peaked when guidance strength was set below 1 and fell steadily as it rose past 1, while macro-F1 stayed stable. Combined with ORD’s overlap labels, this improved minority-class learning over the original ORD sampler.',
      'Research question':'How do you build a synthetic data generator that produces higher-quality minority-class data while keeping majority-class quality intact?',
      'Background':'I led this project, which started in a college generative-AI course. We surveyed tabular generators (SMOTE, CTGAN, TVAE, CTAB-GAN and CTAB-GAN+, TabDDPM and TabSyn) and built on ORD, which shows that majority rows overlapping the minority confuse generators. ORD splits the target into clear majority, overlapping majority and minority before generation.',
      'What failed first':'We tried pulling the overlap classes apart in TabSyn’s VAE latent space, borrowing from CTTVAE with a triplet-style loss. Performance dropped: forcing classes apart distorts the very distribution the diffusion model is meant to learn. That failure pointed us towards controlling generation at sampling time instead.',
      'What worked':'c-TabSyn from ORD, with latent-space restructuring, a vectorised ordinal loss, an algebraically safe distance matrix and Optuna tuning, then sampling with classifier-free guidance below 1 so that minority samples keep their natural overlap with the majority.',
      'Evaluation':'Three scenarios (balanced, synthetic majority, and overlap-aware) across three datasets, scored on predictive utility (AUPRC, macro-F1, minority accuracy, XGBoost accuracy), statistical fidelity (pairwise correlation error) and privacy (DCR and NNDR at the 5th percentile).'
    },
    gallery:[
      { src:'assets/work/tabgen/minority-accuracy-vs-guidance.jpg', alt:'Bar charts of minority-class accuracy against guidance strength on the Adult dataset for three scenarios, highest below 1', caption:'Minority accuracy vs guidance strength (Adult)', fit:'contain' },
      { src:'assets/work/tabgen/latent-tsne.jpg', alt:'t-SNE of the VAE latent space showing majority, overlap and minority points', caption:'Latent space: majority, overlap and minority', fit:'contain' }
    ],
    links:[
      { label:'Code', url:'https://github.com/mrhello291/GenAIORD' },
      { label:'Slides', url:'https://canva.link/pe3u4njdza7phkb' },
      { label:'ORD paper', url:'https://arxiv.org/abs/2412.15657' }
    ] },
  { id:'hallucination-aligner', category:'research', status:'past',
    title:'Hallucination Aligner',
    summary:'Curriculum DPO-Positive on Llama 3.2 3B with easy-to-hard preference pairs, studying how far alignment can cut hallucinations before it starts costing truthfulness and instruction-following.',
    tags:['LLM alignment','DPO','Open dataset'], date:'Sep 2025 — Nov 2025',
    skillIds:['alignment','llm-eval','rag','deep-learning'], toolIds:['python','pytorch','huggingface','faiss'],
    details:{
      'Findings':'The curriculum-trained adapter cut HaluEval hallucination rate by 6.2% relative to the base model and raised BERTScore by 2.2%, but became more cautious and slipped on TruthfulQA. A second strategy reversed that: TruthfulQA generation truthfulness rose 3.1% with multiple-choice scores on par, but hallucinations rose and instruction-following weakened, a sign of catastrophic forgetting. Truthfulness, low hallucination and instructability have to be optimised together.',
      'Research question':'Can curriculum-ordered preference optimisation make a small instruct model hallucinate less without losing fluency or instruction-following?',
      'Dataset':'We built a retrieval corpus from the Wikipedia articles behind Natural Questions: sentence-aware 512-word chunks with overlap, embedded with MiniLM and indexed in FAISS, then re-ranked with a cross-encoder to pick five contexts per question. Together with a cleaned SQuAD v2 subset, these became preference pairs whose rejected answers are synthetic hallucinations at easy, medium and hard difficulty, with a Llama 3.1 8B teacher. We published them as LevelledPreferencePairs.',
      'Method':'LoRA adapters on Llama 3.2 3B Instruct trained with DPO-Positive, ordered from easy to hard pairs in the spirit of Curry DPO and synthetic-negative curricula.',
      'Evaluation':'HaluEval over 10,000 samples, scored with similarity metrics and with Vectara’s hallucination judge, plus TruthfulQA multiple choice (MC1/MC2) and generation scored by a dedicated truth judge.',
      'Next steps':'Train the newer strategy with the same curriculum on the improved data, aiming for balanced alignment: keep the TruthfulQA gains, keep reducing hallucinations, and reinforce instruction-following instead of overwriting it.'
    },
    links:[
      { label:'Code', url:'https://github.com/mrhello291/deepseek_aligner' },
      { label:'Dataset', url:'https://huggingface.co/datasets/mrhello291/LevelledPreferencePairs' },
      { label:'LoRA weights', url:'https://huggingface.co/mrhello291/llama3-3.2-instuct-dpop' }
    ] },
  { id:'laa-net-plus', category:'research', status:'past',
    title:'LAA-Net+: deepfake detection that survives noise',
    summary:'Making a state-of-the-art face-forgery detector robust to noisy, degraded images by adding CBAM attention and a Restormer restoration front-end to LAA-Net.',
    tags:['Computer vision','Face forgery','Team of four'], date:'Mar 2025 — May 2025',
    skillIds:['deep-learning'], toolIds:['python','pytorch'],
    details:{
      'Findings':'Under Gaussian noise (σ = 0.3) on FaceForensics++, AUC rose from 55.1 for LAA-Net to 70.2 with CBAM and 89.1 with Restormer preprocessing, and average precision from 53.6 to 89.7. On Celeb-DF v2 with the same noise, the Restormer variant kept AUC at 80.9.',
      'Research question':'LAA-Net detects face forgeries well on clean data but collapses under noise, like the compression and blur of real social-media images. Can attention and image restoration restore its robustness?',
      'Method':'Plugged lightweight CBAM blocks into intermediate LAA-Net layers to refine features along channels and space, and placed a Restormer transformer in front of the detector to denoise and deblur inputs. Variants were trained and compared on FaceForensics++ and Celeb-DF v2, clean and with Gaussian noise.',
      'Limitations':'Raw accuracy stays near 50% under heavy noise even when AUC recovers, so the decision threshold needs recalibrating, and Restormer costs some clean-data accuracy. Next: fine-tune restoration end-to-end with the detector, add compression and video-frame augmentation, and try frequency-domain fusion.'
    },
    gallery:[
      { src:'assets/work/laa-net/noisy-vs-restored.jpg', alt:'A noisy face image beside the same image after Restormer restoration', caption:'Restormer front-end: noisy input and restored image', fit:'contain' }
    ],
    links:[{ label:'Code', url:'https://github.com/Bhupesh-Khordia/Enhanced-LAA-Net' }] },

  /* ── Side quests ──────────────────────────────────────── */
  { id:'vectorledger', category:'side-quests', status:'ongoing',
    title:'VectorLedger',
    summary:'Prove that deleted or restricted RAG data is no longer retrievable, across every store your pipeline copied it into.',
    tags:['Apache-2.0','v0.2'], date:'Sep 2026 — present',
    skillIds:['backend','rag','distributed','databases','apis','containers'], toolIds:['python','fastapi','postgresql','qdrant','redis','docker'],
    details:{
      'The annoyance':'When a document is deleted or its permissions change, its chunks, vectors and cached answers usually live on in other stores, and nobody can prove they are gone.',
      'The solution':'A self-hosted consistency controller that sits beside an existing RAG pipeline. It receives lifecycle events, reconciles PostgreSQL, Qdrant and Redis, scans them independently for stale records, and emits signed, tamper-evident receipts.',
      'How it works':'Immutable document identity with monotonic versions, idempotent deletion and ACL propagation, immediate or reversible scheduled deletion with quarantine, metadata discovery of artifacts that were never registered, and periodic anti-entropy reconciliation behind a tenant-scoped API and CLI.',
      'Next step':'A connector conformance kit, retry and backoff policy, Azure AI Search and Elasticsearch connectors, and KMS-backed signing.'
    }, links:[{ label:'Repository', url:'https://github.com/mrhello291/VectorLedger' }] },
  { id:'acos', category:'side-quests', status:'ongoing',
    title:'ACOS: an AI-native Linux userspace',
    summary:'Apps ask for capabilities like Cognitive.Language.Reason; ACOS picks a model, manages its memory, and returns a normalised result.',
    tags:['Linux','AI infrastructure'], date:'Aug 2026 — present',
    skillIds:['linux-ipc','agents','rag'], toolIds:['python','ollama'],
    details:{
      'The annoyance':'Every app that wants AI bundles its own model, its own runtime and its own memory budget.',
      'The solution':'Make cognition a machine-wide Linux facility: a daemon that routes capability requests to registered local or remote models.',
      'How it works':'A versioned shared-memory ABI with async request/response rings over memfd, mmap, eventfd and Unix sockets; lease-based model lifecycle with RAM/VRAM admission and idle eviction; UID/GID-based policy via SO_PEERCRED; namespaced vector memory; mock, Ollama and OpenAI-compatible connectors; systemd packaging.',
      'Next step':'From working userspace foundation towards a real distribution.'
    }, links:[] },
  { id:'next-cf-problem', category:'side-quests', status:'past',
    title:'Next CF Problem',
    summary:'Picking the next Codeforces problem shouldn’t take longer than solving it. Recommends recent unsolved problems near your rating, tags hidden.',
    tags:['Static web app','Codeforces API'], date:'Sep 2026',
    skillIds:['frontend'], toolIds:['javascript'],
    details:{
      'The annoyance':'Choosing practice problems by hand, and seeing their tags before trying them.',
      'The solution':'Syncs your rating and accepted submissions in the browser, balances topics across greedy, graphs, DP, data structures, maths and strings, and records solved, hinted, editorial-assisted or skipped outcomes.',
      'How it works':'No backend: the public Codeforces API, local storage for history, WebMCP tools for compatible agents, and GitHub Pages hosting.'
    }, links:[
      { label:'Try it', url:'https://mrhello291.github.io/next-cf-problem-picker/' },
      { label:'Code', url:'https://github.com/mrhello291/next-cf-problem-picker' }
    ] },
  { id:'amazon-automator', category:'side-quests', status:'past',
    title:'Amazon Automator',
    summary:'Describe a shopping goal in plain words and an LLM drives a real browser on Amazon, step by step.',
    tags:['Browser agent'], date:'Aug 2025',
    skillIds:['backend','agents','apis'], toolIds:['python','fastapi','playwright','gemini'],
    details:{
      'The annoyance':'Repetitive searching, sorting and filtering on shopping sites.',
      'How it works':'Each step captures a reduced DOM, asks Gemini 2.5 Pro for the next one to four Playwright actions, filters unsafe patterns, and loops until done or a step limit. A small web UI shows the action history.'
    }, links:[{ label:'Code', url:'https://github.com/mrhello291/amazon_automator' }] },
  { id:'ppt-contradictions', category:'side-quests', status:'past',
    title:'PowerPoint Contradiction Detector',
    summary:'Finds conflicting numbers, claims and timelines across the slides of a deck, using text and slide images.',
    tags:['Multimodal LLM'], date:'Aug 2025',
    skillIds:['llm-eval'], toolIds:['python','gemini'],
    details:{
      'The annoyance':'Decks that say 20% growth on slide 3 and 15% on slide 9.',
      'How it works':'Extracts text, tables and metadata, sends slide images to Gemini 2.0 Flash, and reports numerical, textual, timeline and logical inconsistencies by severity as console, JSON or Markdown.'
    }, links:[{ label:'Code', url:'https://github.com/mrhello291/pptContradictionDetector' }] },
  /* ── Open source ──────────────────────────────────────── */
  { id:'genai-synthetic-data-contribs', category:'open-source', status:'past',
    title:'ORD synthetic data generator',
    summary:'Thirteen merged pull requests: latent-space restructuring, a vectorised ordinal loss, Optuna tuning and evaluation scripts.',
    tags:['Contributor','13 merged PRs'], date:'Apr 2026',
    skillIds:['generative'], toolIds:['python','pytorch','optuna'],
    details:{
      'Repository':'pihu26112005/GenAI-Synthetic-Data-Generator, the shared codebase behind our tabular generation research.',
      'What changed':'Integrated latent-space restructuring, vectorised the ordinal loss, made the distance matrix algebraically safe, added Optuna parameter search and evaluations, plus bug fixes.'
    }, links:[{ label:'Repository', url:'https://github.com/pihu26112005/GenAI-Synthetic-Data-Generator' }] },
  { id:'ecommerce-nav', category:'open-source', status:'past',
    title:'Responsive navigation for an e-commerce frontend',
    summary:'Made the navbar responsive with a slide-in hamburger menu.',
    tags:['Contributor','Merged'], date:'Oct 2024',
    skillIds:['frontend'], toolIds:['javascript'],
    details:{
      'Repository':'divyaagrawal261/E-Commerce-Frontend.',
      'What changed':'Replaced the fixed desktop navbar with a slide-in hamburger menu on small screens.'
    }, links:[{ label:'Pull request', url:'https://github.com/divyaagrawal261/E-Commerce-Frontend/pull/5' }] },

  /* ── Fun projects ─────────────────────────────────────── */
  { id:'simple-quad', category:'fun-projects', status:'past',
    title:'Simple Quad',
    summary:'A budget quadruped for the hills around campus: Raspberry Pi, twelve servos, aluminium legs, and a PS4 controller.',
    tags:['Robotics','Team build'], date:'Nov 2024 — Jun 2025',
    skillIds:['control','embedded'], toolIds:['python','raspberrypi','gazebo'],
    details:{
      'The idea':'Prove that a Dingo-style quadruped is possible for second-year undergrads on a student budget, rugged enough for hilly terrain.',
      'What we tried':'Dropped the Arduino Nano and drove twelve PWM servos straight from a Raspberry Pi 4B through a PCA9685, powered by a battery with two buck converters. Soft aluminium legs, a 2 mm aluminium sheet chassis, an IMU to fix drift, Gazebo for simulation, and a DualShock 4 over Bluetooth.',
      'Happy accidents':'It trots and rests. The jerky gait turned out to be mechanical, not the controller.',
      'What is next':'A mechanical overhaul, a smoother trot, and the Lidar and LCD that are wired but not yet integrated.'
    }, links:[
      { label:'Code', url:'https://github.com/mrhello291/SimpleQuad' },
      { label:'Watch it walk', url:'https://www.youtube.com/watch?v=v2JReG7R9UY' }
    ] },
  { id:'ascep', category:'fun-projects', status:'past',
    title:'ASCEP: arbitrage signal detection',
    summary:'A real-time microservices playground that watches price streams and flags triangular and cross-currency arbitrage.',
    tags:['Event processing','Microservices'], date:'Jul 2025',
    skillIds:['backend','distributed','frontend','deployment','containers'], toolIds:['react','docker','javascript'],
    details:{
      'The idea':'Experiment with finance data signals and complex event processing.',
      'How it works':'Services behind an API gateway take WebSocket feeds from Binance and mock sources, apply rule-based pattern detection, and push signals to a live React dashboard. Backend on Railway, frontend on Vercel.'
    }, links:[
      { label:'Live dashboard', url:'https://ascep.vercel.app' },
      { label:'Code', url:'https://github.com/mrhello291/ASCEP' }
    ] },
  { id:'tictactoe-rl', category:'fun-projects', status:'past',
    title:'Tic-tac-toe that learned by itself',
    summary:'Two RL agents played each other until they were good enough to play you.',
    tags:['Reinforcement learning'], date:'Feb 2025',
    skillIds:['rl'], toolIds:['python'],
    details:{
      'The idea':'Train a tic-tac-toe player with nothing but self-play.',
      'How it works':'Two agents learn state values through self-play, one always moving first, and store their tables. The GUI loads the agent trained for whichever side you leave it.',
      'Happy accidents':'It was bad until I exploited board symmetries. Also, the first player won 400–430 of every 500 games.'
    }, links:[{ label:'Code', url:'https://github.com/mrhello291/tic_tac_toe_RL' }] },
  { id:'pid-line-follower', category:'fun-projects', status:'past',
    title:'PID line follower',
    summary:'A robot that follows black lines through curves and crossings with a tuned PID controller and four IR sensors.',
    tags:['IC102P design practicum','Team of five'], date:'2024',
    skillIds:['control','embedded'], toolIds:['arduino','cpp'],
    details:{
      'The idea':'Make a line follower smooth rather than twitchy.',
      'How we built it':'Designed the chassis in SolidWorks, designed the PCB in EasyEDA and printed it, tested on a breadboard, then soldered it all together around an Arduino UNO, motor drivers, a LiPo battery and a buck converter.',
      'How it works':'Four IR sensors: the middle two follow the black line and the outer two the white. The PID output adjusts motor speeds; tuning Kp, Ki and Kd made the difference.',
      'What is next':'It already handles curves and crossing lines; both are on video above.'
    }, links:[
      { label:'Code', url:'https://github.com/mrhello291/IC102P-FDP' },
      { label:'Curved lines', url:'https://www.youtube.com/watch?v=1QRYZWzfOks' },
      { label:'Crossing lines', url:'https://www.youtube.com/watch?v=77Q0gCPeaZU' }
    ] }
];

PORTFOLIO.skillsDemo = false;
PORTFOLIO.skillCategories = [
  {id:'ai',name:'AI & Agents'}, {id:'ml',name:'Machine Learning'},
  {id:'backend',name:'Backend & Data'}, {id:'web',name:'Web Dev'},
  {id:'systems',name:'Systems'}, {id:'cloud',name:'Cloud & DevOps'},
  {id:'robotics',name:'Robotics'}
];
PORTFOLIO.skills = [
  {id:'agents',name:'Multi-agent systems',category:'ai'},
  {id:'rag',name:'Retrieval-augmented generation',category:'ai'},
  {id:'llm-eval',name:'LLM evaluation',category:'ai'},
  {id:'nlp',name:'NLP & conversational AI',category:'ai'},
  {id:'deep-learning',name:'Deep learning',category:'ml'},
  {id:'generative',name:'Generative modelling',category:'ml'},
  {id:'alignment',name:'LLM fine-tuning & alignment',category:'ml'},
  {id:'rl',name:'Reinforcement learning',category:'ml'},
  {id:'tabular',name:'Tabular ML & feature engineering',category:'ml'},
  {id:'backend',name:'Backend development',category:'backend'},
  {id:'apis',name:'API development',category:'backend'},
  {id:'data-pipelines',name:'Data pipelines',category:'backend'},
  {id:'databases',name:'Database design',category:'backend'},
  {id:'frontend',name:'Frontend development',category:'web'},
  {id:'dashboards',name:'Data dashboards',category:'web'},
  {id:'linux-ipc',name:'Linux systems programming',category:'systems'},
  {id:'distributed',name:'Distributed consistency',category:'systems'},
  {id:'deployment',name:'Cloud deployment',category:'cloud'},
  {id:'containers',name:'Containers & orchestration',category:'cloud'},
  {id:'control',name:'Control systems',category:'robotics'},
  {id:'embedded',name:'Embedded hardware',category:'robotics'}
];
// A tool can support several skills. Connections appear only when that work
// entry explicitly includes BOTH the toolId and the relevant skillId.
PORTFOLIO.tools = [
  {id:'python',name:'Python',skillIds:['nlp','tabular','agents','deep-learning','apis','data-pipelines','linux-ipc']},
  {id:'gbdt',name:'LightGBM / CatBoost / XGBoost',skillIds:['tabular']},
  {id:'modal',name:'Modal',skillIds:['deployment','tabular']},
  {id:'pytorch',name:'PyTorch',skillIds:['deep-learning','tabular','generative','alignment']},
  {id:'huggingface',name:'Hugging Face',skillIds:['nlp','alignment','deep-learning','rag']},
  {id:'optuna',name:'Optuna',skillIds:['generative','llm-eval']},
  {id:'langgraph',name:'LangChain / LangGraph',skillIds:['agents','rag']},
  {id:'mcp',name:'Model Context Protocol',skillIds:['agents']},
  {id:'gemini',name:'Gemini API',skillIds:['nlp','agents','llm-eval']},
  {id:'ollama',name:'Ollama',skillIds:['agents','rag']},
  {id:'pathway',name:'Pathway',skillIds:['rag','data-pipelines']},
  {id:'faiss',name:'FAISS',skillIds:['rag']},
  {id:'qdrant',name:'Qdrant',skillIds:['rag','distributed']},
  {id:'fastapi',name:'FastAPI',skillIds:['backend','apis']},
  {id:'playwright',name:'Playwright',skillIds:['agents']},
  {id:'pandas',name:'Pandas',skillIds:['data-pipelines','dashboards']},
  {id:'streamlit',name:'Streamlit',skillIds:['dashboards','apis']},
  {id:'mongodb',name:'MongoDB',skillIds:['databases','data-pipelines','rag']},
  {id:'postgresql',name:'PostgreSQL',skillIds:['databases','distributed']},
  {id:'redis',name:'Redis',skillIds:['distributed','databases']},
  {id:'kusto',name:'Kusto (KQL)',skillIds:['data-pipelines','agents']},
  {id:'javascript',name:'JavaScript',skillIds:['frontend','distributed']},
  {id:'react',name:'React',skillIds:['frontend']},
  {id:'typescript',name:'TypeScript',skillIds:['backend','frontend','apis']},
  {id:'nextjs',name:'Next.js',skillIds:['backend','frontend','apis','deployment']},
  {id:'trpc',name:'tRPC',skillIds:['backend','apis']},
  {id:'prisma',name:'Prisma',skillIds:['backend','databases']},
  {id:'supabase',name:'Supabase',skillIds:['databases','deployment']},
  {id:'clerk',name:'Clerk',skillIds:['backend','apis']},
  {id:'docker',name:'Docker',skillIds:['backend','containers','deployment','apis','distributed']},
  {id:'kubernetes',name:'Kubernetes',skillIds:['containers','deployment']},
  {id:'aspnet',name:'ASP.NET Core',skillIds:['backend','apis','agents']},
  {id:'azure',name:'Azure',skillIds:['deployment','agents']},
  {id:'raspberrypi',name:'Raspberry Pi',skillIds:['embedded','control']},
  {id:'arduino',name:'Arduino',skillIds:['embedded','control']},
  {id:'cpp',name:'C++',skillIds:['embedded','control']},
  {id:'gazebo',name:'Gazebo',skillIds:['control']}
];
