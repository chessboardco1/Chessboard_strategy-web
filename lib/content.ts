// Every piece of copy on the site lives here. Text in [square brackets] is a fact
// only the Chessboard team can supply; search for "[" before launch.

export const site = {
  name: 'Chessboard Strategy',
  url: 'https://chessboardstrategy.com',
  email: 'marketing@chessboardstrategy.com',
  phone: '+91 78889 67448',
  phoneHref: 'tel:+917888967448',
  whatsapp: 'https://wa.me/917888967448',
  address: ['307, Nemi Eminent, New City Light, Althan', 'Surat', 'Gujarat 395007'],
  instagram: 'https://www.instagram.com/chessboard.strategy/',
  facebook: 'https://www.facebook.com/profile.php?id=61587739146532',
  linkedin: '', // [LinkedIn company URL]
  description:
    'Chessboard Strategy is a Surat-based strategy partner that plans marketing, advertising, websites and sales follow-up as one connected system for growing brands.',
};

export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

export const pieces: { type: PieceType; name: string; title: string; text: string }[] = [
  { type: 'king', name: 'King', title: 'The brand', text: 'Every strategy and creative move protects and strengthens its long-term position' },
  { type: 'queen', name: 'Queen', title: 'The strategy', text: 'Powerful, flexible and precise. It connects insight, creativity and execution' },
  { type: 'rook', name: 'Rook', title: 'The reach', text: 'Media planning and digital presence carry the message with strength' },
  { type: 'bishop', name: 'Bishop', title: 'The creativity', text: 'The angles others miss, turned into distinctive stories and ideas people remember' },
  { type: 'knight', name: 'Knight', title: 'The innovation', text: 'Different thinking that breaks expected patterns and makes campaigns stand out' },
  { type: 'pawn', name: 'Pawn', title: 'The consistency', text: 'Small moves made every day, building momentum over time' },
];

type Service = {
  slug: string;
  name: string;
  line: string;
  piece: PieceType;
  intro: string;
  problem: string;
  structure: string[];
  outcome: string;
  insight?: string;
};

export const services: Service[] = [
  {
    slug: 'strategic-marketing-planning',
    name: 'Strategic marketing planning',
    line: 'A clear roadmap for smarter growth',
    piece: 'queen',
    intro: 'We build a practical marketing roadmap before campaigns begin, so every move has a clear purpose, audience, channel and way to measure it',
    problem: 'Posting, spending and launching without a plan turns marketing into guesswork. Teams stay busy, yet nobody can say which move is working or what should come next.',
    structure: [
      'Market, competitor and audience analysis',
      'Positioning, messaging and offer clarity',
      'Campaign calendar and channel priorities',
      'KPI framework and tracking plan',
    ],
    outcome: 'A focused plan your team can execute without guessing what to post, spend, measure or improve next.',
    insight: 'strategy-before-spend',
  },
  {
    slug: 'business-growth-consulting',
    name: 'Business growth consulting',
    line: 'Systems, positioning and scale',
    piece: 'king',
    intro: 'We find the structural leaks across your offer, funnel, sales process and operations, then build systems that make growth predictable',
    problem: 'Growth stalls when marketing, sales and delivery each pull in a different direction. Leads leak between teams, and effort stops compounding.',
    structure: [
      'Growth audit and bottleneck mapping',
      'Customer journey and funnel architecture',
      'Lead management and follow-up systems',
      'Team priorities and execution rhythm',
    ],
    outcome: 'A sharper business engine where marketing, sales and delivery work together instead of in silos.',
    insight: 'leadership-alignment',
  },
  {
    slug: 'performance-advertising',
    name: 'Performance advertising',
    line: 'Campaigns built around return on spend',
    piece: 'rook',
    intro: 'We plan, launch and optimise paid campaigns around measurable acquisition, not vanity traffic or disconnected creative tests',
    problem: 'Launching ads is easy. Building a reliable acquisition channel takes discipline: the right message, a landing page that converts, and tracking that shows what really works.',
    structure: [
      'Audience and offer testing strategy',
      'Creative angles and landing page alignment',
      'Campaign setup across selected platforms',
      'Weekly optimisation and reporting cadence',
    ],
    outcome: 'Cleaner spend decisions, stronger campaign learning and a performance loop that improves with data.',
    insight: 'performance-advertising',
  },
  {
    slug: 'social-media-strategy',
    name: 'Social media strategy',
    line: 'Content with intent that converts',
    piece: 'bishop',
    intro: 'We turn social content into a system for trust, demand and conversion by defining what to say, where to say it and why it matters',
    problem: 'Consistency without direction is not strategy. A full calendar can still leave the audience unsure what the brand solves or why they should trust it.',
    structure: [
      'Content pillars and audience intent mapping',
      'Monthly calendar and campaign themes',
      'Creative direction for reels, posts and stories',
      'Engagement, lead capture and conversion paths',
    ],
    outcome: 'A social presence that feels consistent, useful and connected to business goals.',
    insight: 'social-media-with-intent',
  },
  {
    slug: 'website-strategy-and-development',
    name: 'Website strategy and development',
    line: 'Websites built to turn visits into leads',
    piece: 'knight',
    intro: 'We design website structure around clarity, trust and conversion, then build pages that support your marketing and sales process',
    problem: 'Many websites describe the company but do not guide the buyer. They look presentable, yet visitors leave unsure what is offered or what to do next.',
    structure: [
      'Website audit and conversion path planning',
      'Page hierarchy, copy flow and calls to action',
      'Responsive development and performance basics',
      'Tracking, forms and lead routing setup',
    ],
    outcome: 'A website that explains the business clearly and turns attention into qualified conversations.',
    insight: 'website-growth-asset',
  },
  {
    slug: 'revenue-and-sales-optimisation',
    name: 'Revenue and sales optimisation',
    line: 'Better follow-ups and a pipeline that flows',
    piece: 'pawn',
    intro: 'We improve every step after the lead arrives, so prospects are followed up, qualified, nurtured and converted more effectively',
    problem: 'Most revenue is lost after the lead comes in: slow follow-up, unclear qualification and handoffs that nobody owns.',
    structure: [
      'Lead qualification and pipeline stages',
      'Follow-up scripts, automations and reminders',
      'Sales handoff and CRM hygiene',
      'Conversion reporting and revenue review loops',
    ],
    outcome: 'A tighter revenue system where fewer leads are wasted and every conversation has a clear next move.',
    insight: 'revenue-engine',
  },
  {
    slug: 'd2c-growth',
    name: 'D2C growth',
    line: 'Direct-to-consumer brands, built to sell and repeat',
    piece: 'king',
    intro: 'We plan the full direct-to-consumer journey, from the first ad and product page to checkout, repeat purchase and loyalty, so every rupee of acquisition is tied to customer lifetime value',
    problem: 'D2C brands often spend heavily to acquire customers and then lose them at checkout or after the first order. Without a retention plan, every new customer costs the same again.',
    structure: [
      'Offer, pricing and product page conversion audit',
      'Acquisition plan across paid social, search and creators',
      'Checkout, abandoned cart and post-purchase flows',
      'Retention, repeat-purchase and loyalty programme',
    ],
    outcome: 'A direct-to-consumer engine that acquires customers profitably, converts them faster and brings them back.',
  },
];

export type Work = {
  slug: string;
  client: string;
  title: string;
  kind: string;
  video: string;
  poster: string;
  logo?: string;
  brief: string;
  moves: string[];
  result: string;
  services: string[];
  source?: { href: string; label: string };
};

const ankeshProjectNotes = {
  href: 'https://www.linkedin.com/in/ankeshprasad/',
  label: 'Project notes by Ankesh Prasad on LinkedIn',
};

export const work: Work[] = [
  {
    slug: 'kiran-hospital-heart-transplant',
    client: 'Kiran Hospital',
    title: 'A heart transplant, told as a human story',
    kind: 'Story film',
    video: '/media/kiran-heart-transplant.mp4',
    poster: '/media/kiran-heart-transplant.webp',
    brief: 'Kiran Hospital wanted to make its digital communications clearer and more useful for patients. This film tells the story of the hospital’s first heart transplant through the people involved.',
    moves: [
      'Develop patient-focused content that the hospital’s teams could use across channels',
      'Introduce the transplant through footage of the hospital and the care team',
      'Put the patient and clinicians on camera and identify who is speaking with on-screen titles',
    ],
    result: 'A short film that puts the patient and care team in the foreground of a hospital milestone.',
    services: ['social-media-strategy', 'strategic-marketing-planning'],
    source: ankeshProjectNotes,
  },
  {
    slug: '1990-by-crazy-bite',
    client: '1990 by Crazy Bite',
    title: 'A film that takes you inside 1990',
    kind: 'Brand film',
    video: '/media/1990-fast-cut.mp4',
    poster: '/media/1990-fast-cut.webp',
    brief: 'This short film introduces 1990 by Crazy Bite through the experience of a visit. It starts on the path into the restaurant and moves through the kitchen, tables and coffee counter.',
    moves: [
      'Open on the entrance to establish the place before showing the menu',
      'Cut between a pizza being made, a drink at the table and the finished dishes',
      'Bring the restaurant’s branding into the frame at the coffee counter',
    ],
    result: 'A restaurant film that gives equal attention to the setting, the food and the people enjoying it.',
    services: [],
  },
  {
    slug: 'topboy-event',
    client: 'TopBoy Pizza',
    title: 'Neapolitan pizza, from the kitchen to the event',
    kind: 'Event film',
    video: '/media/topboy-event.mp4',
    poster: '/media/topboy-event.webp',
    brief: 'TopBoy Pizza wanted to stand out in Surat as a premium Neapolitan pizzeria. The event film shows what that positioning looks like when the team cooks and serves outdoors.',
    moves: [
      'Use local customer and competitor research to shape the positioning and encourage return visits',
      'Cut from wide shots of the event to close-ups of the team making pizza by hand',
      'Show the branded stand after dark, when the venue becomes part of the story',
    ],
    result: 'An event film that expresses the brand’s positioning through the food, service and setting.',
    services: ['strategic-marketing-planning'],
    source: ankeshProjectNotes,
  },
  {
    slug: 'gagme-tyla',
    client: 'Gagme × Tyla',
    title: 'Gagme × Tyla',
    kind: 'Campaign film',
    video: '/media/gagme-tyla.mp4',
    poster: '/media/gagme-tyla.webp',
    logo: '/clients/gagme-mark.webp',
    brief: 'The Gagme × Tyla film centres on a graphic clothing collection. An industrial setting filled with car parts and machinery gives the clothes a backdrop with its own texture and movement.',
    moves: [
      'Establish the location with wide shots framed by tyres, tools and old vehicles',
      'Cut to close-ups of the prints and garments as the models move through the space',
      'Finish on a group shot followed by the Gagme mark',
    ],
    result: 'A fashion film that shows the collection across individual looks and brings them together in one closing frame.',
    services: [],
  },
  {
    slug: 'bhim',
    client: 'B-Him Medico',
    title: 'B-Him Medico',
    kind: 'Health education reel',
    video: '/media/Bhim.mp4',
    poster: '/media/bhim.webp',
    brief: 'B-Him Medico was launching a men’s sexual wellness platform from scratch. Its public-facing content needed to make personal health topics easier to discuss.',
    moves: [
      'Shape the brand and launch around clinical credibility and consultation enquiries',
      'Cut between the speaker, an illustrated nervous system and a bedroom scene to give the explanation context',
      'Use on-screen captions and pink highlights to carry the thread through each change of shot',
    ],
    result: 'The engagement set out a path from enquiry to consultation. The reel makes stress and intimacy the starting point for that conversation.',
    services: ['strategic-marketing-planning', 'revenue-and-sales-optimisation'],
    source: ankeshProjectNotes,
  },
  {
    slug: 'frameboxx',
    client: 'Frameboxx',
    title: 'Frameboxx',
    kind: 'Admissions reel',
    video: '/media/Framebox.mp4',
    poster: '/media/frameboxx.webp',
    brief: 'Frameboxx Himayat Nagar uses a playful opening to announce that admissions are open. The reel turns a small interaction around a wall switch into a reveal for the institute.',
    moves: [
      'Begin in black and white as the group gathers around the switch',
      'Introduce colour and the yellow Frameboxx identity as the scene changes',
      'Close with the campus name, the admissions message and phone numbers on a dedicated end card',
    ],
    result: 'An 11-second admissions reel with one visual payoff and a clear way to contact the Himayat Nagar campus.',
    services: [],
  },
  {
    slug: 'kc-fixit',
    client: 'KC Fixit',
    title: 'KC Fixit',
    kind: 'Product range film',
    video: '/media/kc-fixit.mp4',
    poster: '/media/kc-fixit.webp',
    brief: 'KC Fixit presents its tile adhesive range through conversations at a shop counter, where customers ask which product suits the job they have in mind.',
    moves: [
      'Stage the film as a series of customer conversations at a single counter',
      'Introduce Xtreme, Flex and Prime one by one, with each pack visible alongside the conversation',
      'Bring all three variants together in the closing product shot',
    ],
    result: 'A short product film that gives each adhesive its own moment and leaves viewers with a clear view of the range.',
    services: [],
  },
  {
    slug: 'kiran-solar',
    client: 'Kiran Solar',
    title: 'Kiran Solar',
    kind: 'Solar explainer',
    video: '/media/Kiran-solar.mp4',
    poster: '/media/kiran-solar.webp',
    brief: 'Kiran Solar’s demand-generation work focused on better-qualified enquiries, with campaigns shaped by location, buyer intent and project feasibility.',
    moves: [
      'Open on rows of solar panels to establish the subject at real-world scale',
      'Switch to a cutaway of a panel and an animated rooftop to show what happens inside the system',
      'Use short Hindi and English on-screen phrases to take viewers from sunlight to usable electricity',
    ],
    result: 'A vertical explainer that turns an invisible process into a sequence viewers can follow from panel to power.',
    services: ['performance-advertising', 'revenue-and-sales-optimisation'],
    source: ankeshProjectNotes,
  },
  {
    slug: 'macwin',
    client: 'Macwin',
    title: 'Macwin',
    kind: 'Manufacturing film',
    video: '/media/Macwin.mp4',
    poster: '/media/macwin.webp',
    brief: 'Macwin Solar Energy needed a more consistent way to turn enquiries into sales for its solar manufacturing business.',
    moves: [
      'Define how to qualify leads and follow up with prospects',
      'Alternate close views of moving parts with wider shots of the branded equipment and factory floor',
      'Use green text overlays to connect the production footage to the brand’s clean-energy message',
    ],
    result: 'Marketing and sales had shared measures to track the process. The factory tour shows the production work behind Macwin’s clean-energy message.',
    services: ['business-growth-consulting', 'revenue-and-sales-optimisation'],
    source: ankeshProjectNotes,
  },
  {
    slug: 'minicubs',
    client: 'Minicubs',
    title: 'Minicubs',
    kind: 'Product showcase',
    video: '/media/minicubs.mp4',
    poster: '/media/minicubs.webp',
    brief: 'Minicubs was looking to grow its ride-on toy business across more markets while giving its team more ownership of day-to-day growth.',
    moves: [
      'Prioritise markets based on costs and operational readiness',
      'Pair scooters in the same shot to make the colour and model differences easy to see',
      'Cut in close on handlebars, wheels and character-shaped fronts between full views of the scooters',
    ],
    result: 'A short, visual catalogue of the scooter range with enough detail to tell the models apart at a glance.',
    services: ['business-growth-consulting', 'd2c-growth'],
    source: ankeshProjectNotes,
  },
  {
    slug: 'netcarat',
    client: 'Netcarat',
    title: 'Netcarat',
    kind: 'Jewellery film',
    video: '/media/netcaret.mp4',
    poster: '/media/netcarat.webp',
    brief: 'Netcarat wanted to build an online jewellery business that could bring in customers and give them reasons to return.',
    moves: [
      'Align the brand, content and campaigns with how customers shop online',
      'Move closer as hands reach for the cup and stir the coffee, revealing the rings from different angles',
      'Finish on a simple Netcarat wordmark after the final jewellery close-up',
    ],
    result: 'A lifestyle film that shows how the rings look in motion and how several pieces can be worn together.',
    services: ['d2c-growth', 'strategic-marketing-planning'],
    source: ankeshProjectNotes,
  },
  {
    slug: 'sajori',
    client: 'Sajori',
    title: 'Sajori',
    kind: 'Food brand teaser',
    video: '/media/Sajori.mp4',
    poster: '/media/sajori.webp',
    brief: 'Sajori centres its teaser on “desi khana”. A red backdrop, brief type cues and tightly framed photographs introduce the food brand in under 15 seconds.',
    moves: [
      'Set the tone with the phrase “desi khana” on a solid red field',
      'Bring a plated dish and a glimpse of the interior into the frame as small photographic inserts',
      'Return to the rhythm of single words before revealing the Sajori wordmark',
    ],
    result: 'A short brand teaser that gives the food, the space and the Sajori name a distinct beat in the edit.',
    services: [],
  },
  {
    slug: 'the-grind',
    client: 'The Grind',
    title: 'The Grind',
    kind: 'Marketing commentary reel',
    video: '/media/The-grind.mp4',
    poster: '/media/the-grind.webp',
    brief: 'Hello Fitness Magazine needed a repeatable way to sell advertising across its digital channels and The Grind’s print edition.',
    moves: [
      'Package advertising inventory, refine prices and train the sales team',
      'Open the accompanying editorial reel with a UNICEF campaign that presented polluted water like a premium product',
      'Use short captions to carry the argument and emphasise the speaker’s key phrases',
    ],
    result: 'The sales team gained a process it could use across digital and print. The reel shows The Grind’s editorial work in practice.',
    services: ['business-growth-consulting', 'revenue-and-sales-optimisation'],
    source: ankeshProjectNotes,
  },
  {
    slug: 'z-eggss',
    client: 'Z-Eggss',
    title: 'Z-Eggss',
    kind: 'Food product reel',
    video: '/media/Zeggss.mp4',
    poster: '/media/z-eggss.webp',
    brief: 'Z-Eggss shows its eggs going from trays to branded cartons. The reel puts the handling and packaging process alongside a simple invitation to order.',
    moves: [
      'Open on hands handling the eggs, then follow the cartons as they are packed together',
      'Move outdoors for a close view of the branded carton and the eggs inside',
      'End with an order prompt as a hand picks up the carton',
    ],
    result: 'A short product reel that makes the packaging recognisable and gives viewers a clear next step.',
    services: [],
  },
];

export const clients = [
  { name: '1990 by Crazy Bite', logo: '/clients/1990-black-logo.webp', ratio: 1.31 },
  { name: 'B-Him Medico', logo: '/clients/b-him-logo.webp', ratio: 3.37 },
  { name: 'Frameboxx', logo: '/clients/frameboxx-logo.webp', ratio: 3.27 },
  { name: 'KC Fixit', logo: '/clients/kc-fixit-logo.webp', ratio: 4.26 },
  { name: 'Kiran Hospital', logo: '/clients/kiran-hospital-logo.webp', ratio: 6.25 },
  { name: 'Kiran Solar', logo: '/clients/kiran-solar-logo.webp', ratio: 1.21 },
  { name: 'Macwin', logo: '/clients/macwin-logo.webp', ratio: 3.19 },
  { name: 'Minicubs', logo: '/clients/minicub-s.webp', ratio: 2.32 },
  { name: 'Netcarat', logo: '/clients/netcarat-logo.webp', ratio: 6.78 },
  { name: 'Sajori', logo: '/clients/sajori-logo.webp', ratio: 2.43 },
  { name: 'The Grind', logo: '/clients/the-grind-logo.webp', ratio: 4.12 },
  { name: 'TopBoy Pizza', logo: '/clients/topby-pizza-logo.webp', ratio: 0.7 },
  { name: 'Z-Eggss', logo: '/clients/z-eggss-logo.webp', ratio: 1.86 },
];

export const founder = {
  name: 'Ankesh Prasad',
  role: 'Founder, AI and marketing consultant',
  bio: [
    'Ankesh builds growth systems where marketing, sales and execution work as one.',
    'At Chessboard Strategy he fixes the structural leaks first, the funnels, the follow-ups and the decision flows, and applies AI only where it creates a real operating return.',
    'The aim is growth that compounds instead of spiking: predictable, with acquisition costs kept under control.',
  ],
};

/**
 * The team as chess pieces for the homepage Board Room.
 * `square` is where the piece stands, seen from the studio's side of the board.
 * MOCK: every role except the founder's is a placeholder; names and portraits are still to come.
 */
export type TeamMember = { piece: PieceType; square: string; name: string; role: string; line: string };

export const team: TeamMember[] = [
  { piece: 'king', square: 'e5', name: 'Ankesh Prasad', role: 'Founder', line: 'Sets the strategy and keeps every other piece working towards it.' },
  { piece: 'queen', square: 'd5', name: '', role: 'Strategy lead', line: 'Turns the plan into priorities, budgets and measures.' },
  { piece: 'rook', square: 'g5', name: '', role: 'Performance advertising', line: 'Runs paid media across Meta and Google, and owns the numbers.' },
  { piece: 'bishop', square: 'c4', name: '', role: 'Creative direction', line: 'Shapes how every campaign looks, sounds and feels.' },
  { piece: 'knight', square: 'f4', name: '', role: 'Content and social', line: 'Plans and writes what goes out every week, on every channel.' },
  { piece: 'pawn', square: 'c3', name: '', role: 'Video editing', line: 'Cuts the films, reels and ads.' },
  { piece: 'pawn', square: 'd3', name: '', role: 'Design', line: 'Builds the visuals, from posts to brand kits.' },
  { piece: 'pawn', square: 'e3', name: '', role: 'Production', line: 'Plans and runs every shoot.' },
  { piece: 'pawn', square: 'f3', name: '', role: 'Web development', line: 'Builds and looks after the websites.' },
];

/**
 * A small chess position for each note, drawn in code. `position` lists pieces as letter + square
 * (K Q R B N P; uppercase plays from the bottom). `moves` play together on hover (two for castling).
 */
type Diagram = { position: string; moves: [string, string][]; caption: string };

export const diagrams: Record<string, Diagram> = {
  'strategy-before-spend': {
    position: 'Ke1 Qd1 Bc1 Bf1 Nb1 Ng1 Pc2 Pd4 Pe4 Pf2 ke8 qd8 bc8 nb8 pc7 pd6 pe5 pf7',
    moves: [['g1', 'f3']],
    caption: 'Develop a piece before you attack',
  },
  'revenue-engine': {
    position: 'Kg1 Ra1 Rf1 Qe2 Nf3 Bc4 Pd3 Pe4 Pf2 Pg2 Ph2 kg8 ra8 rf8 qd8 nc6 pd6 pe5 pf7 pg7',
    moves: [['a1', 'e1']],
    caption: 'Connect the rooks so every piece supports the next',
  },
  'social-media-with-intent': {
    position: 'Ke1 Qd1 Bf1 Ng1 Pc2 Pd2 Pe2 Pf2 ke8 qd8 nb8 pc7 pd7 pe7',
    moves: [['e2', 'e4']],
    caption: 'Every move claims the centre for a reason',
  },
  'performance-advertising': {
    position: 'Ke1 Qd1 Bc1 Nc3 Pd4 Pe2 ke8 qd8 be7 nf6 pd5 pe6',
    moves: [['c1', 'g5']],
    caption: 'Spend where the pressure lands',
  },
  'website-growth-asset': {
    position: 'Ke1 Rh1 Be2 Nf3 Pd3 Pe4 Pf2 Pg2 Ph2 kg8 rf8 qd8 pf7 pg7 ph7',
    moves: [['e1', 'g1'], ['h1', 'f1']],
    caption: 'Make the base safe before you build on it',
  },
  'leadership-alignment': {
    position: 'Kg1 Rd1 Ra2 Qe2 Pf2 Pg2 Ph2 kg8 rc8 qc7 pb7 pf7 pg7 ph7',
    moves: [['a2', 'd2']],
    caption: 'Line the pieces up behind one plan',
  },
};

export const process = [
  { title: 'Read the board', text: 'We study the market, the competition, your audience and your numbers before suggesting a single move.' },
  { title: 'Plan the opening', text: 'Positioning, offer and a roadmap your team can actually run, with clear priorities and measures.' },
  { title: 'Play the moves', text: 'Campaigns, content, website and follow-up, executed as one system rather than separate tasks.' },
  { title: 'Review every game', text: 'A steady review rhythm: what worked, what leaked, and the next move to make.' },
];

type Block = { h2: string } | { p: string } | { ul: string[] };
export type Insight = { slug: string; category: string; title: string; summary: string; body: Block[] };

export const insights: Insight[] = [
  {
    slug: 'strategy-before-spend',
    category: 'Strategy',
    title: 'Strategy before spend: why clarity beats budget',
    summary: 'Money can increase reach, but it cannot fix unclear positioning, weak offers or a disconnected sales process.',
    body: [
      { p: 'Many businesses try to solve growth problems by spending more. They increase ad budgets, publish more content or launch new campaigns without first asking whether the core system is clear. The result is activity without compounding returns.' },
      { h2: 'Clarity comes first' },
      { p: 'Before a campaign goes live, the business needs a sharp answer to four questions: who the offer is for, why they should care now, what makes the offer credible, and what action they should take next. Without this, marketing becomes guesswork.' },
      { h2: 'Budget amplifies the system' },
      { p: 'Ad spend does not create strategy. It amplifies whatever strategy already exists. If the offer is confusing, the funnel is leaking or the follow-up process is slow, more budget simply exposes those weaknesses faster.' },
      { h2: 'What to fix before scaling' },
      { ul: ['Positioning that explains the business in simple, buyer-focused language', 'An offer that connects to a clear pain point or desired outcome', 'Landing pages that remove friction and answer objections', 'Follow-up systems that turn interest into qualified conversations'] },
      { p: 'At Chessboard Strategy we look at growth like a board. Every move should support the next one. When strategy is clear, marketing spend becomes more controlled, measurable and useful.' },
    ],
  },
  {
    slug: 'revenue-engine',
    category: 'Growth',
    title: 'Build a revenue engine, not random campaigns',
    summary: 'Campaigns create movement. A revenue engine creates rhythm, accountability and repeatable growth.',
    body: [
      { p: 'A campaign can generate leads for a short period, but a revenue engine keeps learning after every touchpoint. It connects marketing, sales, content, tracking and operations into one system.' },
      { h2: 'What makes it an engine' },
      { p: 'A revenue engine has inputs, movement, measurement and feedback. Content creates attention. Ads create controlled reach. Landing pages convert interest. Sales follow-up qualifies demand. Reporting shows what should be improved next.' },
      { h2: 'Where random campaigns fail' },
      { p: 'Random campaigns usually fail because each activity is isolated. A social post is not connected to an offer. An ad is not connected to sales feedback. A landing page is not connected to lead quality. The business gets noise instead of learning.' },
      { h2: 'The Chessboard approach' },
      { ul: ['Map the buyer journey before creating assets', 'Define the role of every channel in the journey', 'Track qualified outcomes, not only clicks or reach', 'Use feedback from sales to improve targeting and messaging'] },
      { p: 'When the system works as one, every marketing move has a purpose. Growth becomes less dependent on bursts of activity and more dependent on consistent execution.' },
    ],
  },
  {
    slug: 'social-media-with-intent',
    category: 'Social',
    title: 'Social media with intent: from content to conversion',
    summary: 'Social content should do more than fill a calendar. It should build trust, shape demand and move buyers closer to action.',
    body: [
      { p: 'Posting consistently is useful, but consistency without direction is not strategy. A brand needs content that explains what it solves, why it matters and why the audience should trust it.' },
      { h2: 'Every post needs a job' },
      { p: 'Some posts should educate. Some should prove credibility. Some should handle objections. Some should direct people toward a conversation, offer or next step. When every post has a job, the content system becomes easier to measure.' },
      { h2: 'Move past vanity metrics' },
      { p: 'Likes and views can show attention, but they do not automatically show business progress. Strong social strategy looks at saves, shares, profile visits, qualified enquiries and how content supports the larger funnel.' },
      { h2: 'A better content mix' },
      { ul: ['Problem-aware content that names the audience’s pain clearly', 'Authority content that shows expertise and proof', 'Offer content that explains what the business actually sells', 'Conversion content that invites the right next step'] },
      { p: 'Social media works best when it is connected to a real growth system. The goal is not simply to post more. The goal is to make every visible move support trust and conversion.' },
    ],
  },
  {
    slug: 'performance-advertising',
    category: 'Performance',
    title: 'Performance advertising that actually performs',
    summary: 'Better ads are not only about budget. They are about message, measurement, funnel quality and disciplined learning.',
    body: [
      { p: 'Performance advertising becomes expensive when it is treated like a button instead of a system. Launching ads is easy. Building a reliable acquisition channel requires much more discipline.' },
      { h2: 'Target the right problem' },
      { p: 'If the message is too broad, the wrong audience clicks. If the landing page is vague, the right audience leaves. If the offer is weak, the campaign cannot create strong intent. The campaign must match the buyer’s stage and pain point.' },
      { h2: 'Creative testing needs structure' },
      { p: 'Testing more creatives is not enough. Each test should answer a question. Does the buyer respond to pain, outcome, proof, urgency or authority? Structured testing turns ad spend into learning.' },
      { h2: 'What to track' },
      { ul: ['Cost per qualified lead, not only cost per form fill', 'Landing page conversion rate and drop-off points', 'Lead quality feedback from sales', 'Creative themes that create high-intent responses'] },
      { p: 'When performance advertising is connected to strategy, sales and tracking, the business can scale with more confidence and less waste.' },
    ],
  },
  {
    slug: 'website-growth-asset',
    category: 'Web',
    title: 'Your website is a growth asset, not a brochure',
    summary: 'A website should do more than look polished. It should help the right visitor understand, trust and act.',
    body: [
      { p: 'Many websites describe the company but do not guide the buyer. They look presentable, yet they leave visitors unsure about what is offered, why it matters or what to do next.' },
      { h2: 'Conversion starts with clarity' },
      { p: 'The first screen should make the offer easy to understand. Visitors should quickly know who the business helps, what outcome it creates and where to click next.' },
      { h2: 'Structure builds confidence' },
      { p: 'A strong website answers questions in the order a buyer naturally asks them. What do you do? Is this for me? Why should I trust you? What happens next? This flow matters more than decorative sections.' },
      { h2: 'Key website growth elements' },
      { ul: ['A clear headline and a direct call to action', 'Service pages that explain value, process and outcomes', 'Proof points that reduce doubt', 'Forms and contact paths that are simple to use'] },
      { p: 'Your website should work even when your team is offline. Built strategically, it becomes a quiet sales asset that supports every campaign and every referral.' },
    ],
  },
  {
    slug: 'leadership-alignment',
    category: 'Leadership',
    title: 'Leadership alignment: the hidden growth multiplier',
    summary: 'Growth gets easier when leadership, marketing, sales and operations agree on the same direction.',
    body: [
      { p: 'Marketing problems are often business alignment problems in disguise. If leadership, sales and marketing define success differently, the business will struggle to execute with focus.' },
      { h2: 'Alignment reduces waste' },
      { p: 'When teams agree on the ideal customer, core offer, pricing logic, funnel stages and follow-up expectations, execution becomes cleaner. Content gets sharper. Sales conversations improve. Reporting becomes more meaningful.' },
      { h2: 'The cost of misalignment' },
      { p: 'Misalignment creates mixed messaging, slow decisions, weak handoffs and unclear accountability. The business may be active, but the work does not compound because each team is optimising for a different target.' },
      { h2: 'What leaders should clarify' },
      { ul: ['The audience the business wants to win', 'The offer that should receive the most focus', 'The metrics that define quality growth', 'The operating rhythm for review and improvement'] },
      { p: 'Leadership alignment is not a soft issue. It is one of the biggest multipliers for execution. When the board is clear, every move becomes easier to coordinate.' },
    ],
  },
];

export function readingMinutes(post: Insight) {
  const words = post.body
    .map((b) => ('p' in b ? b.p : 'h2' in b ? b.h2 : b.ul.join(' ')))
    .join(' ')
    .split(/\s+/).length;
  return Math.max(2, Math.round(words / 220));
}

export const nav = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/insights', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
];
