import os
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def generate_full_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]
    
    # ------------------ COLOR PALETTE ------------------
    BG_DARK = RGBColor(10, 17, 40)        # #0A1128 Deep Tech Navy
    SURFACE_DARK = RGBColor(20, 30, 60)   # #141E3C
    CARD_DARK = RGBColor(26, 38, 74)      # #1A264A
    
    BG_LIGHT = RGBColor(248, 250, 252)    # #F8FAFC
    CARD_LIGHT = RGBColor(255, 255, 255)  # #FFFFFF
    
    TEXT_DARK = RGBColor(15, 23, 42)      # #0F172A
    TEXT_MUTED = RGBColor(71, 85, 105)    # #475569
    TEXT_LIGHT = RGBColor(255, 255, 255)  # #FFFFFF
    TEXT_LIGHT_MUTED = RGBColor(148, 163, 184) # #94A3B8
    
    PRIMARY_BLUE = RGBColor(30, 58, 138)  # #1E3A8A
    CYAN_ACCENT = RGBColor(14, 165, 233)  # #0EA5E9
    CYAN_LIGHT = RGBColor(56, 189, 248)   # #38BDF8
    INDIGO = RGBColor(99, 102, 241)       # #6366F1
    EMERALD = RGBColor(16, 185, 129)      # #10B981
    AMBER = RGBColor(245, 158, 11)        # #F59E0B
    ROSE = RGBColor(244, 63, 94)          # #F43F5E
    
    # ------------------ HELPER FUNCTIONS ------------------
    def set_slide_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_logo_placeholder(slide, dark_theme=False):
        box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.8), Inches(0.35), Inches(2.1), Inches(0.8))
        box.fill.solid()
        if dark_theme:
            box.fill.fore_color.rgb = RGBColor(20, 30, 60)
            box.line.color.rgb = RGBColor(56, 189, 248)
            text_color = RGBColor(148, 163, 184)
        else:
            box.fill.fore_color.rgb = RGBColor(241, 245, 249)
            box.line.color.rgb = RGBColor(203, 213, 225)
            text_color = RGBColor(100, 116, 139)
        box.line.width = Pt(1.5)
        tf = box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = '[ ABES LOGO HERE ]'
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = text_color
        p.alignment = PP_ALIGN.CENTER

    def add_header(slide, title, category='CAREEROS • ACADEMIC INTELLIGENCE PLATFORM', dark_theme=False):
        add_logo_placeholder(slide, dark_theme)
        
        # Category Pill / Tag
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(9.5), Inches(0.35))
        tf_c = cat_box.text_frame
        p_c = tf_c.paragraphs[0]
        p_c.text = category.upper()
        p_c.font.size = Pt(10)
        p_c.font.bold = True
        p_c.font.color.rgb = CYAN_LIGHT if dark_theme else CYAN_ACCENT
        
        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.65), Inches(9.8), Inches(0.75))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(24)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_LIGHT if dark_theme else PRIMARY_BLUE

    # ----------------------------------------------------
    # SLIDE 1: Title & Hero Cover Slide (Dark Modern Theme)
    # ----------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, BG_DARK)
    add_logo_placeholder(s1, dark_theme=True)
    
    # Hero Title Card
    hero_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.3), Inches(11.733), Inches(3.2))
    hero_card.fill.solid()
    hero_card.fill.fore_color.rgb = SURFACE_DARK
    hero_card.line.color.rgb = CYAN_LIGHT
    hero_card.line.width = Pt(1.5)
    
    tf1 = hero_card.text_frame
    tf1.word_wrap = True
    tf1.margin_left = Inches(0.5)
    tf1.margin_top = Inches(0.3)
    
    p = tf1.paragraphs[0]
    p.text = 'CAREEROS'
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = CYAN_LIGHT
    
    p2 = tf1.add_paragraph()
    p2.text = 'AI-Powered Career Operating System & Academic Intelligence Platform'
    p2.font.size = Pt(22)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_LIGHT
    p2.space_before = Pt(8)
    
    p3 = tf1.add_paragraph()
    p3.text = 'Mini Project Presentation • 5th Semester • Course Code: BCS554'
    p3.font.size = Pt(14)
    p3.font.color.rgb = TEXT_LIGHT_MUTED
    p3.space_before = Pt(8)
    
    # Student Box (Left)
    card_st = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.7), Inches(5.7), Inches(2.3))
    card_st.fill.solid()
    card_st.fill.fore_color.rgb = CARD_DARK
    card_st.line.color.rgb = INDIGO
    card_st.line.width = Pt(1)
    
    tf_st = card_st.text_frame
    tf_st.word_wrap = True
    tf_st.margin_left = Inches(0.3)
    tf_st.margin_top = Inches(0.2)
    
    p = tf_st.paragraphs[0]
    p.text = '👨‍💻 STUDENT CREDENTIALS'
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = CYAN_LIGHT
    
    st_lines = [
        '1. Shahab Ahmad  |  Roll No: 2200680100206',
        '2. Student Name 2 |  Roll No: 2200680100XXX',
        '3. Student Name 3 |  Roll No: 2200680100XXX',
        'Department of Computer Science & Engineering'
    ]
    for line in st_lines:
        p_l = tf_st.add_paragraph()
        p_l.text = line
        p_l.font.size = Pt(12)
        p_l.font.color.rgb = TEXT_LIGHT
        p_l.space_before = Pt(4)
        
    # Supervisor Box (Right)
    card_sup = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.833), Inches(4.7), Inches(5.7), Inches(2.3))
    card_sup.fill.solid()
    card_sup.fill.fore_color.rgb = CARD_DARK
    card_sup.line.color.rgb = EMERALD
    card_sup.line.width = Pt(1)
    
    tf_sup = card_sup.text_frame
    tf_sup.word_wrap = True
    tf_sup.margin_left = Inches(0.3)
    tf_sup.margin_top = Inches(0.2)
    
    p = tf_sup.paragraphs[0]
    p.text = '🎓 SUPERVISION & INSTITUTION'
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = EMERALD
    
    sup_lines = [
        'Project Supervisor: Dr. / Prof. [Supervisor Name]',
        'Designation: Assistant / Associate Professor',
        'Department: Computer Science & Engineering',
        'ABES Engineering College, Ghaziabad'
    ]
    for line in sup_lines:
        p_l = tf_sup.add_paragraph()
        p_l.text = line
        p_l.font.size = Pt(12)
        p_l.font.color.rgb = TEXT_LIGHT
        p_l.space_before = Pt(4)

    # ----------------------------------------------------
    # SLIDE 2: Executive Summary & Problem vs Solution
    # ----------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, BG_LIGHT)
    add_header(s2, 'Executive Summary: Bridging Academic & Career Gaps')
    
    # Left Card: Problem Statement
    c_prob = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.3))
    c_prob.fill.solid()
    c_prob.fill.fore_color.rgb = CARD_LIGHT
    c_prob.line.color.rgb = ROSE
    c_prob.line.width = Pt(1.5)
    
    tf = c_prob.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.35)
    tf.margin_top = Inches(0.3)
    
    p = tf.paragraphs[0]
    p.text = '⚠️ THE CHALLENGE: STUDENT FRAGMENTATION'
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = ROSE
    
    probs = [
        ('Siloed Career Prep', 'Students navigate 5+ disjoint platforms (LinkedIn, LeetCode, GitHub, college portals, job boards) with no unified tracking.'),
        ('Static PDF Syllabi & Notes', 'Heavy textbooks and lecture PDFs remain passive, non-interactive documents that cannot be queried or quizzed dynamically.'),
        ('Generic Advice Engines', 'Standard chatbots lack grounding in the student actual university year, branch, verified skill levels, or past projects.'),
        ('Dispersed Job Boards', 'Scattered job portals result in information overload, expired listings, and untracked job application statuses.')
    ]
    for title, desc in probs:
        p_t = tf.add_paragraph()
        p_t.text = f'• {title}: '
        p_t.font.bold = True
        p_t.font.size = Pt(12.5)
        p_t.font.color.rgb = TEXT_DARK
        p_t.space_before = Pt(8)
        run = p_t.add_run()
        run.text = desc
        run.font.bold = False
        run.font.size = Pt(12)
        run.font.color.rgb = TEXT_MUTED

    # Right Card: The CareerOS Solution
    c_sol = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.833), Inches(1.6), Inches(5.7), Inches(5.3))
    c_sol.fill.solid()
    c_sol.fill.fore_color.rgb = CARD_LIGHT
    c_sol.line.color.rgb = EMERALD
    c_sol.line.width = Pt(1.5)
    
    tf = c_sol.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.35)
    tf.margin_top = Inches(0.3)
    
    p = tf.paragraphs[0]
    p.text = '✅ THE SOLUTION: CAREEROS ECOSYSTEM'
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = EMERALD
    
    sols = [
        ('Unified Career Operating System', 'Single integrated dashboard combining Student Profile, RAG Study Room, Coding Profiles, and Live Job Tracker.'),
        ('Multimodal RAG Study Room', 'Chat natively with uploaded syllabus PDFs with pgvector cosine similarity, smart OCR fallback, and auto-generated quizzes.'),
        ('Autonomous AI Career Mentor', 'Personalized advice engine grounded in verified student profile, university semester, and career goals with multi-model fallback.'),
        ('Live Multi-Provider Aggregator', 'Automated background cron synchronization with Adzuna, Remotive, and Arbeitnow with application event tracking.')
    ]
    for title, desc in sols:
        p_t = tf.add_paragraph()
        p_t.text = f'• {title}: '
        p_t.font.bold = True
        p_t.font.size = Pt(12.5)
        p_t.font.color.rgb = TEXT_DARK
        p_t.space_before = Pt(8)
        run = p_t.add_run()
        run.text = desc
        run.font.bold = False
        run.font.size = Pt(12)
        run.font.color.rgb = TEXT_MUTED

    # ----------------------------------------------------
    # SLIDE 3: Key Objectives & Core Pillars (4 Grid Cards)
    # ----------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, BG_LIGHT)
    add_header(s3, 'Project Objectives: 4 Architectural Pillars')
    
    pillars = [
        ('Pillar 1: AI Career Mentor', 'Dynamic Contextual Guidance', CYAN_ACCENT, [
            'Tailored technical interview roadmaps.',
            'Understands student graduation year & branch.',
            'Resume optimization and project architecture advice.',
            'Zero generic responses: grounded in personal goals.'
        ]),
        ('Pillar 2: RAG Study Room', 'Multimodal Syllabus Assistant', INDIGO, [
            'Vector search using pgvector (768-dim embeddings).',
            'Full PDF parsing with Gemini OCR fallback.',
            'Generates custom 3-question MCQ quizzes instantly.',
            'Chapter explanations & technical conceptual deep-dives.'
        ]),
        ('Pillar 3: Job Aggregator', 'Real-Time Opportunity Engine', EMERALD, [
            'Aggregates Adzuna, Remotive, and Arbeitnow.',
            'Tracks applications: Applied, Interviewing, Offer.',
            'Skill requirement matching with target levels.',
            'Automated background cron sync without server load.'
        ]),
        ('Pillar 4: Developer Hub', 'Coding & Portfolio Synchronization', AMBER, [
            'Centralizes LeetCode, CodeChef & HackerRank stats.',
            'Live GitHub repository star/fork and activity tracking.',
            '1–10 Skill Level & Confidence Matrix.',
            'Step-by-step milestone roadmaps (Learn, Build, Apply).'
        ])
    ]
    
    coords = [
        (0.8, 1.6), (6.833, 1.6),
        (0.8, 4.4), (6.833, 4.4)
    ]
    
    for i, (title, sub, color, points) in enumerate(pillars):
        x, y = coords[i]
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(5.7), Inches(2.6))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_LIGHT
        card.line.color.rgb = color
        card.line.width = Pt(1.5)
        
        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.3)
        tf.margin_top = Inches(0.2)
        
        p = tf.paragraphs[0]
        p.text = title.upper()
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = color
        
        p_sub = tf.add_paragraph()
        p_sub.text = sub
        p_sub.font.size = Pt(11)
        p_sub.font.bold = True
        p_sub.font.color.rgb = TEXT_DARK
        
        for pt in points:
            p_p = tf.add_paragraph()
            p_p.text = f'✓ {pt}'
            p_p.font.size = Pt(11)
            p_p.font.color.rgb = TEXT_MUTED
            p_p.space_before = Pt(2)

    # ----------------------------------------------------
    # SLIDE 4: System Architecture & Layered Diagram
    # ----------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, BG_DARK)
    add_header(s4, 'System Architecture: 3-Tier Layered Design', dark_theme=True)
    
    arch_img_path = '/Users/shahabahmad/Desktop/BackendClass/CareerOS-main/PPT_FOLDER/assets/diagram_architecture.png'
    if os.path.exists(arch_img_path):
        s4.shapes.add_picture(arch_img_path, Inches(0.8), Inches(1.5), Inches(11.733), Inches(5.4))

    # ----------------------------------------------------
    # SLIDE 5: Deep Dive: Multimodal RAG Study Room
    # ----------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, BG_LIGHT)
    add_header(s5, 'Technical Deep Dive: Multimodal RAG Study Pipeline')
    
    rag_img_path = '/Users/shahabahmad/Desktop/BackendClass/CareerOS-main/PPT_FOLDER/assets/diagram_rag_flow.png'
    if os.path.exists(rag_img_path):
        s5.shapes.add_picture(rag_img_path, Inches(0.8), Inches(1.5), Inches(11.733), Inches(2.9))
        
    box_tech = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.6), Inches(11.733), Inches(2.4))
    box_tech.fill.solid()
    box_tech.fill.fore_color.rgb = CARD_LIGHT
    box_tech.line.color.rgb = CYAN_ACCENT
    box_tech.line.width = Pt(1.5)
    
    tf = box_tech.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.35)
    tf.margin_top = Inches(0.2)
    
    p = tf.paragraphs[0]
    p.text = '🔍 KEY PIPELINE INNOVATIONS & ALGORITHMS'
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_BLUE
    
    rag_points = [
        ('Hybrid Extraction & Vision OCR', 'Utilizes pdf-parse v2 for instant digital text; automatically invokes Gemini Multimodal Vision if text is < 80 characters (handles scanned notes/slides seamlessly).'),
        ('High-Density Vector Space', 'Generates 768-dimensional embeddings via gemini-embedding-001 stored natively in PostgreSQL using the pgvector extension.'),
        ('Cosine Similarity Search', 'Executes SQL cosine distance queries (embedding <=> query::vector) to retrieve top context chunks in under 25ms.'),
        ('Overview & Quiz Generation', 'Provides complete document context for global queries (explain it, summarize, generate 3-question MCQ quiz) with explanations and answer keys.')
    ]
    for h, d in rag_points:
        p_t = tf.add_paragraph()
        p_t.text = f'• {h}: '
        p_t.font.bold = True
        p_t.font.size = Pt(11.5)
        p_t.font.color.rgb = TEXT_DARK
        p_t.space_before = Pt(3)
        run = p_t.add_run()
        run.text = d
        run.font.bold = False
        run.font.size = Pt(11.5)
        run.font.color.rgb = TEXT_MUTED

    # ----------------------------------------------------
    # SLIDE 6: Autonomous AI Career Mentor Engine
    # ----------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, BG_LIGHT)
    add_header(s6, 'AI Career Mentor: Context-Aware Intelligence')
    
    c_ground = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.3))
    c_ground.fill.solid()
    c_ground.fill.fore_color.rgb = CARD_LIGHT
    c_ground.line.color.rgb = INDIGO
    c_ground.line.width = Pt(1.5)
    
    tf = c_ground.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.35)
    tf.margin_top = Inches(0.3)
    
    p = tf.paragraphs[0]
    p.text = '🧠 DYNAMIC PROFILE GROUNDING'
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = INDIGO
    
    grounds = [
        ('Academic Metadata Injection', 'Injects student college, branch, current year, semester, and career goals into system prompt dynamically.'),
        ('Zero Hallucination Inquiries', 'Instructs LLM to never ask repetitive background questions when profile details are already stored.'),
        ('Interactive Memory Sessions', 'Maintains persistent MentorSession and ChatMessage history in PostgreSQL for continuous multi-turn conversations.'),
        ('Targeted Guidance', 'Offers specific suggestions for tier-1 projects, interview questions, and tech stack choices for backend, full-stack, and AI engineering.')
    ]
    for h, d in grounds:
        p_t = tf.add_paragraph()
        p_t.text = f'• {h}: '
        p_t.font.bold = True
        p_t.font.size = Pt(12)
        p_t.font.color.rgb = TEXT_DARK
        p_t.space_before = Pt(8)
        run = p_t.add_run()
        run.text = d
        run.font.bold = False
        run.font.size = Pt(12)
        run.font.color.rgb = TEXT_MUTED

    c_fall = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.833), Inches(1.6), Inches(5.7), Inches(5.3))
    c_fall.fill.solid()
    c_fall.fill.fore_color.rgb = CARD_LIGHT
    c_fall.line.color.rgb = CYAN_ACCENT
    c_fall.line.width = Pt(1.5)
    
    tf = c_fall.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.35)
    tf.margin_top = Inches(0.3)
    
    p = tf.paragraphs[0]
    p.text = '🛡️ MULTI-MODEL FALLBACK CHAIN'
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_BLUE
    
    falls = [
        ('100% Uptime Guarantee', 'Built-in resilience prevents 503 Provider High-Demand Spikes or 404 Model Retirement outages.'),
        ('Candidate Priority Chain', 'Sequentially tries: gemini-3.5-flash ➔ gemini-3.7-flash ➔ gemini-flash-latest ➔ gemini-flash-lite-latest.'),
        ('Graceful Error Logging', 'Structured Pino logging captures provider latency and failure events without interrupting student workflow.'),
        ('Instant Response Times', 'Average chat latency of under 1.2 seconds across mentorship and document QA sessions.')
    ]
    for h, d in falls:
        p_t = tf.add_paragraph()
        p_t.text = f'• {h}: '
        p_t.font.bold = True
        p_t.font.size = Pt(12)
        p_t.font.color.rgb = TEXT_DARK
        p_t.space_before = Pt(8)
        run = p_t.add_run()
        run.text = d
        run.font.bold = False
        run.font.size = Pt(12)
        run.font.color.rgb = TEXT_MUTED

    # ----------------------------------------------------
    # SLIDE 7: Job Aggregation & Developer Portfolio Tracker
    # ----------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7, BG_LIGHT)
    add_header(s7, 'Opportunities Aggregator & Coding Profiles')
    
    c_job = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.3))
    c_job.fill.solid()
    c_job.fill.fore_color.rgb = CARD_LIGHT
    c_job.line.color.rgb = EMERALD
    c_job.line.width = Pt(1.5)
    
    tf = c_job.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.35)
    tf.margin_top = Inches(0.3)
    
    p = tf.paragraphs[0]
    p.text = '💼 OPPORTUNITY SYNC ENGINE'
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = EMERALD
    
    jobs = [
        ('Multi-Source Aggregation', 'Fetches software and internship postings from Adzuna, Remotive, and Arbeitnow APIs.'),
        ('Automated Cron Scheduling', 'Syncs listings in the background without blocking student HTTP requests.'),
        ('Application Tracking Pipeline', 'Tracks lifecycle: APPLIED ➔ INTERVIEWING ➔ OFFER ➔ REJECTED with note logs.'),
        ('Skill Match Scoring', 'Calculates match percentage based on student verified skills vs job requirement levels.')
    ]
    for h, d in jobs:
        p_t = tf.add_paragraph()
        p_t.text = f'• {h}: '
        p_t.font.bold = True
        p_t.font.size = Pt(12)
        p_t.font.color.rgb = TEXT_DARK
        p_t.space_before = Pt(8)
        run = p_t.add_run()
        run.text = d
        run.font.bold = False
        run.font.size = Pt(12)
        run.font.color.rgb = TEXT_MUTED

    c_code = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.833), Inches(1.6), Inches(5.7), Inches(5.3))
    c_code.fill.solid()
    c_code.fill.fore_color.rgb = CARD_LIGHT
    c_code.line.color.rgb = AMBER
    c_code.line.width = Pt(1.5)
    
    tf = c_code.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.35)
    tf.margin_top = Inches(0.3)
    
    p = tf.paragraphs[0]
    p.text = '⚡ CODING & GITHUB INTELLIGENCE'
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = AMBER
    
    codes = [
        ('Competitive Coding Stats', 'Consolidates solved problems, ranking, contest rating, and streaks across LeetCode, CodeChef, HackerRank, Codeforces, and GeeksforGeeks.'),
        ('GitHub Portfolio Sync', 'Fetches public repositories, primary languages, total stars, forks, and followers via GitHub REST API.'),
        ('1–10 Skill Level Matrix', 'Visualizes proficiencies across Frontend, Backend, AI/ML, and Core CS.'),
        ('Roadmap Milestones', 'Interactive roadmap steps (Learn, Build, Apply) with percentage progress tracking.')
    ]
    for h, d in codes:
        p_t = tf.add_paragraph()
        p_t.text = f'• {h}: '
        p_t.font.bold = True
        p_t.font.size = Pt(12)
        p_t.font.color.rgb = TEXT_DARK
        p_t.space_before = Pt(8)
        run = p_t.add_run()
        run.text = d
        run.font.bold = False
        run.font.size = Pt(12)
        run.font.color.rgb = TEXT_MUTED

    # ----------------------------------------------------
    # SLIDE 8: Competitive Analysis Table Matrix
    # ----------------------------------------------------
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8, BG_LIGHT)
    add_header(s8, 'Competitive Analysis: CareerOS vs Industry Alternatives')
    
    rows = 6
    cols = 5
    tbl_shape = s8.shapes.add_table(rows, cols, Inches(0.8), Inches(1.6), Inches(11.733), Inches(5.2))
    tbl = tbl_shape.table
    
    tbl.columns[0].width = Inches(3.2)
    tbl.columns[1].width = Inches(2.2)
    tbl.columns[2].width = Inches(2.1)
    tbl.columns[3].width = Inches(2.1)
    tbl.columns[4].width = Inches(2.133)
    
    headers = ['Feature / Capability', 'CareerOS (Ours)', 'LinkedIn / Handshake', 'Generic AI (ChatGPT)', 'Coding Sites (LeetCode)']
    data = [
        ['Unified Academic + Career Dashboard', '✅ Yes (All-in-One)', '❌ No (Career Only)', '❌ No (Chat Only)', '❌ No (Coding Only)'],
        ['Multimodal RAG Syllabus Study Room', '✅ Yes (pgvector + OCR)', '❌ No', '⚠️ Partial (No Vector DB)', '❌ No'],
        ['Personalized AI Career Mentorship', '✅ Yes (Profile Grounded)', '❌ No', '⚠️ Generic Prompting', '❌ No'],
        ['Live Multi-Source Job Aggregation', '✅ Yes (3+ Job Boards)', '⚠️ Single Platform', '❌ No', '❌ No'],
        ['Integrated Coding & GitHub Tracker', '✅ Yes (Unified Metrics)', '❌ No', '❌ No', '⚠️ Siloed Platform']
    ]
    
    for c_idx, h_text in enumerate(headers):
        cell = tbl.cell(0, c_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = PRIMARY_BLUE if c_idx != 1 else CYAN_ACCENT
        p = cell.text_frame.paragraphs[0]
        p.text = h_text
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_LIGHT
        p.alignment = PP_ALIGN.CENTER
        
    for r_idx, row_data in enumerate(data):
        for c_idx, val in enumerate(row_data):
            cell = tbl.cell(r_idx + 1, c_idx)
            cell.fill.solid()
            if c_idx == 1:
                cell.fill.fore_color.rgb = RGBColor(238, 242, 255)
            else:
                cell.fill.fore_color.rgb = CARD_LIGHT if r_idx % 2 == 0 else RGBColor(241, 245, 249)
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.size = Pt(11)
            p.font.bold = (c_idx == 1 or c_idx == 0)
            p.font.color.rgb = TEXT_DARK if c_idx != 1 else PRIMARY_BLUE
            p.alignment = PP_ALIGN.CENTER if c_idx > 0 else PP_ALIGN.LEFT

    # ----------------------------------------------------
    # SLIDE 9: Security, Performance & Code Quality
    # ----------------------------------------------------
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9, BG_LIGHT)
    add_header(s9, 'Enterprise Security & Performance Architecture')
    
    sec_pillars = [
        ('1. Authentication & Session Security', PRIMARY_BLUE, [
            'Argon2id password hashing (resistant to GPU attacks).',
            'Dual JWT system: Access Token (15m) + HTTP-only Refresh Token (7d).',
            'Automatic Axios 401 retry queue eliminates expired session popups.',
            'Optional Google OAuth 2.0 Single Sign-On (SSO).'
        ]),
        ('2. Network & API Protection', INDIGO, [
            'Helmet security headers with Cross-Origin Resource Policy.',
            'CORS origin isolation configured for frontend dev/prod.',
            'Express Rate Limiting (100 req/min per IP) to prevent DDoS.',
            'Zod strict schema validation on all incoming request payloads.'
        ]),
        ('3. Scalable Data & Vector Store', EMERALD, [
            'PostgreSQL relational schema managed via Prisma ORM.',
            'pgvector vector database supporting 768-dimensional embeddings.',
            'Connection pooling with pg.Pool preventing connection exhaustion.',
            'Async file processing: PDF text indexing runs without blocking API.'
        ]),
        ('4. Observability & Graceful Shutdown', AMBER, [
            'Pino structured high-speed JSON logging with unique X-Request-ID.',
            'Async handler wrapping all controllers to eliminate unhandled crashes.',
            'Graceful SIGINT/SIGTERM handlers for zero-downtime restarts.',
            'Health check endpoints (/api/v1/health, /live, /ready).'
        ])
    ]
    
    for i, (title, color, points) in enumerate(sec_pillars):
        x, y = coords[i]
        card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(5.7), Inches(2.6))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_LIGHT
        card.line.color.rgb = color
        card.line.width = Pt(1.5)
        
        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.3)
        tf.margin_top = Inches(0.2)
        
        p = tf.paragraphs[0]
        p.text = title.upper()
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = color
        
        for pt in points:
            p_p = tf.add_paragraph()
            p_p.text = f'🔒 {pt}'
            p_p.font.size = Pt(11)
            p_p.font.color.rgb = TEXT_MUTED
            p_p.space_before = Pt(2)

    # ----------------------------------------------------
    # SLIDE 10: Limitations & Future Roadmap
    # ----------------------------------------------------
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10, BG_LIGHT)
    add_header(s10, 'Project Limitations & Future Enhancement Scope')
    
    c_lim = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.3))
    c_lim.fill.solid()
    c_lim.fill.fore_color.rgb = CARD_LIGHT
    c_lim.line.color.rgb = ROSE
    c_lim.line.width = Pt(1.5)
    
    tf = c_lim.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.35)
    tf.margin_top = Inches(0.3)
    
    p = tf.paragraphs[0]
    p.text = '⚠️ CURRENT LIMITATIONS'
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = ROSE
    
    lims = [
        ('Third-Party AI Rate Limits', 'Subject to external Google Gemini API rate quotas and network latency during high-traffic intervals.'),
        ('Heavily Degraded Scans', 'Extremely low-resolution, warped, or non-standard cursive handwritten scans require advanced vision preprocessing.'),
        ('Aggregator Schema Normalization', 'Heterogeneous external job boards (Adzuna, Remotive) require ongoing schema sanitization and maintenance.'),
        ('Vector Index Scaling', 'As document chunks expand into millions, requires dedicated HNSW/IVFFlat index tuning on PostgreSQL.')
    ]
    for h, d in lims:
        p_t = tf.add_paragraph()
        p_t.text = f'• {h}: '
        p_t.font.bold = True
        p_t.font.size = Pt(12)
        p_t.font.color.rgb = TEXT_DARK
        p_t.space_before = Pt(8)
        run = p_t.add_run()
        run.text = d
        run.font.bold = False
        run.font.size = Pt(12)
        run.font.color.rgb = TEXT_MUTED

    c_fut = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.833), Inches(1.6), Inches(5.7), Inches(5.3))
    c_fut.fill.solid()
    c_fut.fill.fore_color.rgb = CARD_LIGHT
    c_fut.line.color.rgb = CYAN_ACCENT
    c_fut.line.width = Pt(1.5)
    
    tf = c_fut.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.35)
    tf.margin_top = Inches(0.3)
    
    p = tf.paragraphs[0]
    p.text = '🚀 FUTURE ENHANCEMENT ROADMAP'
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_BLUE
    
    futs = [
        ('Real-Time Audio/Video Mock Interviews', 'Integrate WebSockets & WebRTC for speech-to-text live technical and behavioral interview simulations.'),
        ('Native Cross-Platform Mobile App', 'Develop iOS & Android applications using React Native / Expo for on-the-go offline syllabus review.'),
        ('Automated ATS Resume Scorer', 'Direct algorithmic comparison of student resume against targeted job descriptions with missing keyword insights.'),
        ('Collaborative Peer Study Rooms', 'Multi-user real-time study sessions with synchronized PDF viewers and interactive shared whiteboards.')
    ]
    for h, d in futs:
        p_t = tf.add_paragraph()
        p_t.text = f'• {h}: '
        p_t.font.bold = True
        p_t.font.size = Pt(12)
        p_t.font.color.rgb = TEXT_DARK
        p_t.space_before = Pt(8)
        run = p_t.add_run()
        run.text = d
        run.font.bold = False
        run.font.size = Pt(12)
        run.font.color.rgb = TEXT_MUTED

    # ----------------------------------------------------
    # SLIDE 11: Conclusion & Project Milestones
    # ----------------------------------------------------
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11, BG_DARK)
    add_header(s11, 'Conclusion: Impact & Key Takeaways', dark_theme=True)
    
    metrics = [
        ('100% Unified', 'Single Operating System', 'Eliminated fragmented student tooling by merging Career, Academic Study, and Portfolio Tracking.', CYAN_LIGHT),
        ('< 25ms Retrieval', 'Sub-Second pgvector Search', 'High-speed cosine similarity search over thousands of document text chunks.', EMERALD),
        ('Zero-Downtime AI', 'Multi-Model Fallback', 'Resilient architecture guaranteeing 100% mentorship and RAG QA response availability.', INDIGO)
    ]
    
    m_w = Inches(3.644)
    m_h = Inches(5.1)
    
    for i, (m_val, m_title, m_desc, color) in enumerate(metrics):
        x = Inches(0.8 + i * 4.044)
        card = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.7), m_w, m_h)
        card.fill.solid()
        card.fill.fore_color.rgb = SURFACE_DARK
        card.line.color.rgb = color
        card.line.width = Pt(1.5)
        
        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.3)
        tf.margin_top = Inches(0.4)
        
        p = tf.paragraphs[0]
        p.text = m_val
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = color
        p.alignment = PP_ALIGN.CENTER
        
        p_t = tf.add_paragraph()
        p_t.text = m_title
        p_t.font.size = Pt(16)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_LIGHT
        p_t.alignment = PP_ALIGN.CENTER
        p_t.space_before = Pt(8)
        
        p_d = tf.add_paragraph()
        p_d.text = m_desc
        p_d.font.size = Pt(13)
        p_d.font.color.rgb = TEXT_LIGHT_MUTED
        p_d.alignment = PP_ALIGN.CENTER
        p_d.space_before = Pt(16)

    # ----------------------------------------------------
    # SLIDE 12: References & Acknowledgements
    # ----------------------------------------------------
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_background(s12, BG_LIGHT)
    add_header(s12, 'References & Technical Documentation')
    
    box_ref = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(11.733), Inches(4.0))
    box_ref.fill.solid()
    box_ref.fill.fore_color.rgb = CARD_LIGHT
    box_ref.line.color.rgb = PRIMARY_BLUE
    box_ref.line.width = Pt(1.5)
    
    tf = box_ref.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.35)
    tf.margin_top = Inches(0.25)
    
    p = tf.paragraphs[0]
    p.text = '📚 BIBLIOGRAPHY & TECHNICAL STANDARDS'
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_BLUE
    
    refs = [
        ('1. Google DeepMind AI Documentation', 'Gemini Multimodal 2.5/3.5 and Vector Embeddings API Specifications (2025/2026).'),
        ('2. PostgreSQL pgvector Specification', 'Open-Source Vector Similarity Search Extension for PostgreSQL (Cosine Distance <=> Operator).'),
        ('3. Lewis, P., et al. (NeurIPS)', '\"Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks\", Advances in Neural Information Processing Systems.'),
        ('4. Prisma ORM & Express.js Architectural Standards', 'Type-Safe ORM Schema Design, Middleware Layering, and Scalable REST APIs.'),
        ('5. React 18 & Vite Technical Documentation', 'Single Page Application Performance, State Interceptors, and Component Hierarchy.')
    ]
    for h, d in refs:
        p_t = tf.add_paragraph()
        p_t.text = f'{h}: '
        p_t.font.bold = True
        p_t.font.size = Pt(12)
        p_t.font.color.rgb = TEXT_DARK
        p_t.space_before = Pt(6)
        run = p_t.add_run()
        run.text = d
        run.font.bold = False
        run.font.size = Pt(12)
        run.font.color.rgb = TEXT_MUTED

    box_ty = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.8), Inches(11.733), Inches(1.1))
    box_ty.fill.solid()
    box_ty.fill.fore_color.rgb = PRIMARY_BLUE
    box_ty.line.fill.background()
    
    tf_ty = box_ty.text_frame
    tf_ty.word_wrap = True
    p = tf_ty.paragraphs[0]
    p.text = 'THANK YOU! • QUESTIONS & ANSWERS (Q&A)'
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = TEXT_LIGHT
    p.alignment = PP_ALIGN.CENTER
    
    p_sub = tf_ty.add_paragraph()
    p_sub.text = 'Department of Computer Science & Engineering • ABES Engineering College'
    p_sub.font.size = Pt(12)
    p_sub.font.color.rgb = CYAN_LIGHT
    p_sub.alignment = PP_ALIGN.CENTER
    p_sub.space_before = Pt(2)

    # Save presentation
    final_output = '/Users/shahabahmad/Desktop/BackendClass/CareerOS-main/PPT_FOLDER/CareerOS_Executive_Presentation.pptx'
    prs.save(final_output)
    print(f'Master Executive Presentation generated successfully at:\n{final_output}')

if __name__ == '__main__':
    generate_full_deck()
