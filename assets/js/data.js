/* ==========================================================================
   PRAGATI ACADEMY — Demo dataset
   Every record here is FICTIONAL, created for a portfolio demonstration.
   No real student, parent, counsellor or result is represented.
   ========================================================================== */
window.DATA = (function () {
  'use strict';

  /* ---------- Programs --------------------------------------------------- */
  var programs = [
    {
      id: 'neet-2027', code: 'PA / 01', name: 'NEET 2027', accent: '#241CE0',
      duration: '12 Months', mode: 'Classroom + Online', batch: '14 September 2026',
      fee: 78000, seats: 60, filled: 47, level: 'Class 12 + Droppers',
      desc: 'A full-length medical entrance program built around NCERT mastery, weekly full syllabus testing and one-to-one mentorship.',
      subjects: ['Physics', 'Chemistry', 'Biology'],
      href: 'program.html?p=neet-2027'
    },
    {
      id: 'jee-2027', code: 'PA / 02', name: 'JEE 2027', accent: '#FF4D18',
      duration: '12 Months', mode: 'Classroom + Online', batch: '21 September 2026',
      fee: 82000, seats: 60, filled: 39, level: 'Class 12 + Droppers',
      desc: 'Advanced problem-solving for JEE Main and Advanced, with pattern-wise practice sets and rank-linked mentor reviews.',
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      href: 'program.html?p=jee-2027'
    },
    {
      id: 'upsc-foundation', code: 'PA / 03', name: 'UPSC Foundation', accent: '#0FB981',
      duration: '18 Months', mode: 'Classroom', batch: '5 October 2026',
      fee: 96000, seats: 45, filled: 31, level: 'Graduates + Final Year',
      desc: 'Prelims and Mains built together from day one — static syllabus, current affairs discipline and weekly answer writing.',
      subjects: ['Polity', 'Economy', 'History', 'Geography', 'Ethics'],
      href: 'program.html?p=upsc-foundation'
    },
    {
      id: 'foundation-9-10', code: 'PA / 04', name: 'Class 9–10 Foundation', accent: '#E8B44A',
      duration: '24 Months', mode: 'Classroom + Online', batch: '1 September 2026',
      fee: 46000, seats: 80, filled: 68, level: 'Class 9 & 10',
      desc: 'Early conceptual grounding for students who will attempt NEET, JEE or Olympiads — school syllabus stays fully covered.',
      subjects: ['Science', 'Mathematics', 'Mental Ability'],
      href: 'program.html?p=foundation-9-10'
    },
    {
      id: 'data-technology', code: 'PA / 05', name: 'Data & Technology', accent: '#38BDF8',
      duration: '9 Months', mode: 'Hybrid', batch: '28 September 2026',
      fee: 58000, seats: 40, filled: 22, level: 'Class 11 to Graduates',
      desc: 'Python, data analysis, applied statistics and an AI literacy track, taught project-first with a reviewed portfolio.',
      subjects: ['Python', 'Data Analysis', 'Statistics', 'Applied AI'],
      href: 'program.html?p=data-technology'
    },
    {
      id: 'career-programs', code: 'PA / 06', name: 'Career Programs', accent: '#A855F7',
      duration: '3–6 Months', mode: 'Online + Weekend', batch: 'Rolling admissions',
      fee: 24000, seats: 120, filled: 74, level: 'Class 10 to Graduates',
      desc: 'Short, decisive programs — aptitude, communication, stream selection and career mapping with a documented plan.',
      subjects: ['Aptitude', 'Communication', 'Career Mapping'],
      href: 'program.html?p=career-programs'
    }
  ];

  /* ---------- Faculty ---------------------------------------------------- */
  var faculty = [
    { name: 'Dr. Neeraj Verma',        role: 'NEET Faculty · Biology',   exp: '18 yrs', spec: 'Human Physiology, Genetics', students: '11,400+', seed: 7 },
    { name: 'Prof. Anjali Srivastava', role: 'Chemistry',                exp: '15 yrs', spec: 'Physical & Organic Chemistry', students: '9,200+',  seed: 21 },
    { name: 'Mr. Rohit Bansal',        role: 'Physics',                  exp: '12 yrs', spec: 'Mechanics, Electrodynamics',  students: '8,600+',  seed: 34 },
    { name: 'Dr. Meera Chauhan',       role: 'UPSC Faculty · Polity',    exp: '14 yrs', spec: 'Indian Polity, Governance',   students: '4,100+',  seed: 12 },
    { name: 'Mr. Aakash Tiwari',       role: 'Mathematics · JEE',        exp: '11 yrs', spec: 'Calculus, Coordinate Geometry', students: '7,300+', seed: 45 },
    { name: 'Ms. Ritu Khanna',         role: 'Data & Technology',        exp: '9 yrs',  spec: 'Python, Applied Statistics',  students: '2,800+',  seed: 58 }
  ];

  /* ---------- Results (clearly labelled demonstration data) --------------- */
  var results = [
    { v: 'AIR 128',  l: 'NEET 2026', n: 'Ishaan Dwivedi · Classroom Batch A' },
    { v: 'AIR 421',  l: 'JEE Advanced 2026', n: 'Tanvi Agrawal · Classroom Batch C' },
    { v: '95.8%',    l: 'Selection Rate', n: 'Foundation cohort → target board score' },
    { v: '94.2%',    l: 'Attendance', n: 'Average across all classroom batches' }
  ];

  /* ---------- Testimonials ------------------------------------------------ */
  var testimonials = [
    { q: 'The weekly mock test review was the turning point. I stopped guessing what to fix — my mentor showed me exactly which chapters were costing me marks.', n: 'Aarushi Gupta', m: 'Lucknow · NEET 2026', badge: 'AIR 128 batch', seed: 3 },
    { q: 'I joined in Class 9. By Class 11 the JEE syllabus felt like revision instead of a new mountain. That head start is the whole thing.', n: 'Karan Mishra', m: 'Kanpur · JEE 2026', badge: 'Foundation → JEE', seed: 19 },
    { q: 'Doubt solving within the same day meant I never carried a backlog into the next chapter. Attendance and performance were visible to my parents too.', n: 'Mehak Agarwal', m: 'Jaipur · NEET 2027', badge: 'Current batch', seed: 41 }
  ];

  /* ---------- Journal ----------------------------------------------------- */
  var journal = [
    { t: 'How to Build a Better Study Routine', c: 'Method', d: '12 Aug 2026', r: '6 min read' },
    { t: 'NEET Preparation Roadmap', c: 'NEET', d: '4 Aug 2026', r: '11 min read' },
    { t: 'How Mock Tests Improve Performance', c: 'Assessment', d: '27 Jul 2026', r: '8 min read' },
    { t: 'Choosing the Right Career Path', c: 'Guidance', d: '19 Jul 2026', r: '9 min read' }
  ];

  /* ---------- Counsellors -------------------------------------------------- */
  var counsellors = [
    { id: 'c1', name: 'Neha Singh',      leads: 214, conv: 22, sessions: 61, rating: 4.8 },
    { id: 'c2', name: 'Vikram Dubey',    leads: 198, conv: 17, sessions: 54, rating: 4.6 },
    { id: 'c3', name: 'Priya Rastogi',   leads: 186, conv: 14, sessions: 47, rating: 4.7 },
    { id: 'c4', name: 'Arjun Nigam',     leads: 173, conv: 11, sessions: 39, rating: 4.4 },
    { id: 'c5', name: 'Shalini Awasthi', leads: 161, conv: 9,  sessions: 33, rating: 4.5 }
  ];

  /* ---------- Pipeline stages ---------------------------------------------- */
  var stages = [
    { id: 'new',    label: 'New Lead',            color: '#3B2AE0' },
    { id: 'qual',   label: 'Qualified',           color: '#0E86C4' },
    { id: 'couns',  label: 'Counselling Scheduled', color: '#B0801E' },
    { id: 'fee',    label: 'Fee Discussion',      color: '#E8410F' },
    { id: 'app',    label: 'Application',         color: '#C13584' },
    { id: 'enrol',  label: 'Enrolled',            color: '#0E9E6E' }
  ];
  var stagePill = { new: 'p-new', qual: 'p-qual', couns: 'p-couns', fee: 'p-fee', app: 'p-app', enrol: 'p-enrol', lost: 'p-lost' };

  /* ---------- Leads --------------------------------------------------------- */
  function L(id, name, course, city, source, couns, stage, next, score, phone, note) {
    return { id: id, name: name, course: course, city: city, source: source, counsellor: couns, stage: stage, next: next, score: score, phone: phone, note: note };
  }
  var leads = [
    L('PA-1041', 'Aditya Verma',      'NEET 2027',            'Lucknow',    'Instagram',    'Neha Singh',      'couns', 'Tomorrow, 4:00 PM', 88, '+91 98••• ••214', 'Father joined the first call. Wants hostel details and the exact test calendar before the counselling session.'),
    L('PA-1042', 'Sneha Gupta',       'JEE 2027',             'Kanpur',     'Google Search','Vikram Dubey',    'fee',   'Today, 6:30 PM',    91, '+91 99••• ••870', 'Comparing our fee against two local institutes. Asked whether the instalment plan can move to three parts.'),
    L('PA-1043', 'Rahul Srivastava',  'UPSC Foundation',      'Prayagraj',  'Referral',     'Priya Rastogi',   'new',   'Tomorrow, 11:00 AM',64, '+91 87••• ••556', 'Final-year graduate. First contact came through an existing student referral.'),
    L('PA-1044', 'Ananya Pandey',     'NEET 2027',            'Lucknow',    'Walk-in',      'Neha Singh',      'app',   'Friday, 1:00 PM',   94, '+91 96••• ••331', 'Application form submitted. Documents pending — Class 12 marksheet and photograph.'),
    L('PA-1045', 'Harsh Tandon',      'Class 9–10 Foundation','Lucknow',    'Instagram',    'Arjun Nigam',     'qual',  'Thursday, 5:00 PM', 72, '+91 91••• ••209', 'Parent enquiry for a Class 9 student. Wants weekend-only batch options.'),
    L('PA-1046', 'Divya Mehrotra',    'JEE 2027',             'Barabanki',  'WhatsApp',     'Vikram Dubey',    'couns', 'Tomorrow, 12:30 PM',79, '+91 82••• ••644', 'Travels 28 km daily — asked about the online-hybrid attendance policy.'),
    L('PA-1047', 'Mohd. Faizan',      'Data & Technology',    'Lucknow',    'LinkedIn',     'Shalini Awasthi', 'new',   'Today, 8:00 PM',    58, '+91 70••• ••127', 'B.Tech second year. Interested in the applied AI track specifically.'),
    L('PA-1048', 'Ritika Chaudhary',  'NEET 2027',            'Sitapur',    'YouTube',      'Neha Singh',      'enrol', 'Enrolled',          97, '+91 78••• ••903', 'Enrolled on 9 August. First instalment of ₹40,000 cleared by UPI.'),
    L('PA-1049', 'Saurabh Yadav',     'UPSC Foundation',      'Prayagraj',  'Google Search','Priya Rastogi',   'fee',   'Monday, 3:00 PM',   83, '+91 93••• ••418', 'Requested the scholarship test date and eligibility criteria.'),
    L('PA-1050', 'Nikita Sahu',       'Career Programs',      'Gorakhpur',  'Instagram',    'Arjun Nigam',     'qual',  'Wednesday, 4:30 PM',61, '+91 95••• ••772', 'Class 12 student, undecided between commerce and design. Wants the aptitude assessment.'),
    L('PA-1051', 'Kabir Malhotra',    'JEE 2027',             'Lucknow',    'Referral',     'Vikram Dubey',    'app',   'Today, 5:15 PM',    89, '+91 88••• ••045', 'Sibling of a current Foundation student — referral discount applied to the quote.'),
    L('PA-1052', 'Pooja Bhargava',    'NEET 2027',            'Unnao',      'Walk-in',      'Neha Singh',      'couns', 'Saturday, 10:00 AM',76, '+91 90••• ••388', 'Repeater candidate. Previous attempt score shared, wants a gap analysis first.'),
    L('PA-1053', 'Aryan Kapoor',      'Data & Technology',    'Lucknow',    'Instagram',    'Shalini Awasthi', 'new',   'Tomorrow, 2:00 PM', 55, '+91 99••• ••501', 'Asked whether the program is recorded for later viewing.'),
    L('PA-1054', 'Ishita Rawat',      'Class 9–10 Foundation','Lucknow',    'WhatsApp',     'Arjun Nigam',     'fee',   'Thursday, 6:00 PM', 81, '+91 79••• ••229', 'Two siblings enrolling together — asked for a combined fee quote.'),
    L('PA-1055', 'Vivek Shukla',      'UPSC Foundation',      'Lucknow',    'Google Search','Priya Rastogi',   'qual',  'Friday, 11:30 AM',  69, '+91 97••• ••614', 'Working professional. Only evening batches are workable.'),
    L('PA-1056', 'Simran Kaur',       'NEET 2027',            'Lucknow',    'YouTube',      'Neha Singh',      'enrol', 'Enrolled',          95, '+91 98••• ••757', 'Enrolled 6 August. Full fee paid upfront, 5% early-payment adjustment applied.'),
    L('PA-1057', 'Devansh Awasthi',   'JEE 2027',             'Raebareli',  'Instagram',    'Vikram Dubey',    'couns', 'Monday, 12:00 PM',  74, '+91 84••• ••193', 'Hostel accommodation is the deciding factor.'),
    L('PA-1058', 'Tanya Saxena',      'Career Programs',      'Lucknow',    'Walk-in',      'Shalini Awasthi', 'app',   'Tomorrow, 3:30 PM', 86, '+91 92••• ••860', 'Application started in the counselling session; payment link sent.'),
    L('PA-1059', 'Nishant Rai',       'NEET 2027',            'Hardoi',     'Referral',     'Neha Singh',      'qual',  'Wednesday, 9:00 AM',67, '+91 89••• ••472', 'Wants to sit the scholarship test before committing.'),
    L('PA-1060', 'Alisha Khan',       'Data & Technology',    'Lucknow',    'LinkedIn',     'Shalini Awasthi', 'fee',   'Today, 7:00 PM',    84, '+91 96••• ••318', 'Company sponsorship possible — asked for a GST invoice format.'),
    L('PA-1061', 'Rohan Trivedi',     'JEE 2027',             'Lucknow',    'Google Search','Vikram Dubey',    'new',   'Tomorrow, 10:30 AM',52, '+91 81••• ••607', 'Downloaded the syllabus PDF, no call connected yet.'),
    L('PA-1062', 'Mahek Ansari',      'Class 9–10 Foundation','Lucknow',    'Instagram',    'Arjun Nigam',     'enrol', 'Enrolled',          92, '+91 73••• ••984', 'Enrolled 11 August. Instalment two scheduled for 10 November.')
  ];

  /* ---------- CRM metrics ---------------------------------------------------- */
  var crm = {
    metrics: [
      { k: 'Enquiries',            v: 1284, d: 12.4, up: true,  note: 'Last 30 days',   spark: [720, 810, 790, 880, 940, 1010, 1120, 1284], color: '#3B2AE0' },
      { k: 'Qualified',            v: 428,  d: 8.1,  up: true,  note: '33.3% of enquiries', spark: [210, 246, 262, 288, 318, 356, 392, 428], color: '#0E86C4' },
      { k: 'Counselling Sessions', v: 176,  d: 5.6,  up: true,  note: '41.1% of qualified', spark: [96, 104, 118, 126, 141, 152, 168, 176], color: '#B0801E' },
      { k: 'Applications',         v: 94,   d: 2.2,  up: false, note: '53.4% of sessions',  spark: [58, 66, 71, 79, 88, 96, 91, 94], color: '#C13584' },
      { k: 'Enrolments',           v: 61,   d: 14.9, up: true,  note: '64.9% of applications', spark: [28, 33, 38, 42, 47, 52, 56, 61], color: '#0E9E6E' }
    ],
    funnel: [
      { label: 'Enquiries', value: 1284 },
      { label: 'Qualified', value: 428 },
      { label: 'Counselling Sessions', value: 176 },
      { label: 'Applications', value: 94 },
      { label: 'Enrolments', value: 61 }
    ],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    trend: [
      { name: 'Enquiries', data: [720, 812, 786, 884, 941, 1013, 1122, 1284] },
      { name: 'Qualified', data: [214, 248, 262, 291, 318, 357, 392, 428] },
      { name: 'Enrolments', data: [28, 33, 38, 42, 47, 52, 56, 61] }
    ],
    sources: [
      { label: 'Instagram', value: 412 },
      { label: 'Google Search', value: 318 },
      { label: 'Referral', value: 227 },
      { label: 'Walk-in', value: 154 },
      { label: 'YouTube', value: 108 },
      { label: 'LinkedIn', value: 65 }
    ],
    courses: [
      { label: 'NEET 2027', value: 486 },
      { label: 'JEE 2027', value: 371 },
      { label: 'Foundation 9–10', value: 208 },
      { label: 'UPSC Foundation', value: 114 },
      { label: 'Data & Technology', value: 63 },
      { label: 'Career Programs', value: 42 }
    ],
    cities: [
      { label: 'Lucknow', value: 641 },
      { label: 'Kanpur', value: 198 },
      { label: 'Prayagraj', value: 143 },
      { label: 'Barabanki', value: 96 },
      { label: 'Sitapur', value: 71 },
      { label: 'Other', value: 135 }
    ],
    /* Counsellor dashboard */
    today: {
      calls: 18, callsDone: 11,
      followups: 24, followupsDone: 15,
      sessions: 6, sessionsDone: 3,
      applications: 4,
      conversions: 3,
      pendingPayments: 7, pendingValue: 386000
    },
    callsByHour: {
      labels: ['9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p'],
      data: [4, 9, 12, 8, 3, 7, 11, 14, 16, 12, 6]
    },
    convWeeks: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
    convSeries: [
      { name: 'Counselling → Application', data: [44, 47, 51, 49, 54, 58, 55, 61] },
      { name: 'Application → Enrolment',   data: [58, 61, 59, 64, 66, 63, 68, 71] }
    ],
    pendingPayments: [
      { name: 'Sneha Gupta',    course: 'JEE 2027',   due: '18 Aug 2026', amount: 42000, status: 'Instalment 2' },
      { name: 'Ishita Rawat',   course: 'Foundation', due: '20 Aug 2026', amount: 23000, status: 'Instalment 2' },
      { name: 'Alisha Khan',    course: 'Data & Tech',due: '22 Aug 2026', amount: 29000, status: 'Instalment 1' },
      { name: 'Kabir Malhotra', course: 'JEE 2027',   due: '25 Aug 2026', amount: 41000, status: 'Instalment 2' },
      { name: 'Saurabh Yadav',  course: 'UPSC',       due: '28 Aug 2026', amount: 48000, status: 'Instalment 1' },
      { name: 'Tanya Saxena',   course: 'Career',     due: '30 Aug 2026', amount: 12000, status: 'Instalment 2' },
      { name: 'Mahek Ansari',   course: 'Foundation', due: '10 Nov 2026', amount: 23000, status: 'Instalment 2' }
    ],
    activity: [
      { t: 'Counselling session completed', d: 'Aditya Verma · NEET 2027 with Neha Singh', m: '11 minutes ago', c: '#B0801E' },
      { t: 'Fee quote sent on WhatsApp',    d: 'Sneha Gupta · JEE 2027 — 3-instalment plan', m: '34 minutes ago', c: '#E8410F' },
      { t: 'New enquiry from Instagram',    d: 'Rohan Trivedi · JEE 2027 · Lucknow', m: '1 hour ago', c: '#3B2AE0' },
      { t: 'Enrolment confirmed',           d: 'Ritika Chaudhary · NEET 2027 — ₹40,000 received', m: '2 hours ago', c: '#0E9E6E' },
      { t: 'Application submitted',         d: 'Ananya Pandey · NEET 2027 — documents pending', m: '3 hours ago', c: '#C13584' },
      { t: 'Automated follow-up delivered', d: '24-hour counselling reminder · 38 recipients', m: '5 hours ago', c: '#0E86C4' }
    ]
  };

  /* ---------- WhatsApp automation --------------------------------------------- */
  var whatsapp = {
    stats: [
      { k: 'Messages Sent',   v: 8462, note: 'Last 30 days' },
      { k: 'Delivery Rate',   v: 98.6, suf: '%', note: 'Business API' },
      { k: 'Reply Rate',      v: 41.3, suf: '%', note: 'Within 24 hours' },
      { k: 'Sessions Booked', v: 176,  note: 'Straight from chat' }
    ],
    flow: [
      { when: 'Immediately', t: 'Course Information', d: 'The enquiry lands in the CRM and the matching program card goes out in under five seconds.',
        msg: 'Hi Aditya 👋 Welcome to Pragati Academy. The next NEET 2027 batch begins on 14 September. What would you like to know?',
        sent: 1284, opened: 1247, replied: 531, icon: 'bolt' },
      { when: '24 hours', t: 'Counselling Reminder', d: 'Anyone who has not booked a session gets a single reminder with two open slots attached.',
        msg: 'Two counselling slots are open this week — Thursday 4:00 PM and Saturday 11:00 AM. Reply with a number to reserve one.',
        sent: 918, opened: 861, replied: 294, icon: 'clock' },
      { when: '3 days', t: 'Counsellor Follow-up', d: 'The assigned counsellor takes over personally. Automation pauses the moment a human replies.',
        msg: 'Hi, this is Neha from Pragati Academy. I looked at your NEET 2027 enquiry — would a short call this evening work?',
        sent: 642, opened: 604, replied: 233, icon: 'user' },
      { when: '7 days', t: 'Batch Reminder', d: 'Seat-count urgency, but honest — the number quoted is the live number from the CRM.',
        msg: '13 of 60 seats are still open in the NEET 2027 classroom batch starting 14 September. Shall I hold one for you?',
        sent: 471, opened: 428, replied: 141, icon: 'calendar' },
      { when: '14 days', t: 'Last Follow-up', d: 'One final message, then the lead moves to a quarterly nurture list and stops receiving sequence messages.',
        msg: 'We will stop messaging about this batch now. If you would like the syllabus and fee structure for later intakes, reply KEEP.',
        sent: 318, opened: 271, replied: 74, icon: 'archive' }
    ],
    replies: {
      'COURSE DETAILS': {
        text: '<b class="wa-hdr">NEET 2027 — Classroom + Online</b>• 12 months, 14 Sept 2026 → Aug 2027<br>• 6 days a week, 4 hrs daily<br>• 42 full-syllabus mock tests<br>• Daily doubt-solving desk, 5–7 PM<br>• Assigned mentor, fortnightly reviews',
        buttons: ['FEE STRUCTURE', 'BOOK COUNSELLING']
      },
      'FEE STRUCTURE': {
        text: '<b class="wa-hdr">Fee Structure — NEET 2027</b>Course fee: ₹78,000<br>Instalment 1: ₹40,000 at admission<br>Instalment 2: ₹38,000 by 10 January<br><br>Scholarship test on 31 August can reduce this by up to 30%.',
        buttons: ['BOOK COUNSELLING', 'TALK TO COUNSELLOR']
      },
      'TALK TO COUNSELLOR': {
        text: 'Connecting you with <b>Neha Singh</b>, senior counsellor for NEET.<br><br>She is free after 4:00 PM today. Shall I ask her to call you?',
        buttons: ['YES, CALL ME', 'BOOK COUNSELLING']
      },
      'BOOK COUNSELLING': {
        text: '<b class="wa-hdr">Choose a slot</b>Thursday, 14 Aug · 4:00 PM<br>Saturday, 16 Aug · 11:00 AM<br>Sunday, 17 Aug · 1:00 PM',
        buttons: ['THU 4:00 PM', 'SAT 11:00 AM']
      },
      'YES, CALL ME': {
        text: 'Done ✅ Neha will call you today after 4:00 PM on this number.<br><br>Your enquiry ID is <b>PA-1041</b>.',
        buttons: ['COURSE DETAILS', 'FEE STRUCTURE']
      },
      'THU 4:00 PM': {
        text: '<b class="wa-hdr">Counselling confirmed ✅</b>Thursday, 14 August · 4:00 PM<br>Pragati Academy, Gomti Nagar, Lucknow<br>Counsellor: Neha Singh<br><br>A reminder will arrive two hours before.',
        buttons: []
      },
      'SAT 11:00 AM': {
        text: '<b class="wa-hdr">Counselling confirmed ✅</b>Saturday, 16 August · 11:00 AM<br>Pragati Academy, Gomti Nagar, Lucknow<br>Counsellor: Neha Singh<br><br>A reminder will arrive two hours before.',
        buttons: []
      }
    }
  };

  /* ---------- Student portal ---------------------------------------------------- */
  function calMonth() {
    // August 2026 — 1 Aug is a Saturday
    var days = [];
    for (var i = 0; i < 5; i++) days.push({ state: 'off' });        // Mon–Fri lead-in
    var pattern = ['p','p','off','p','p','p','p','p','off','p','a','p','p','p','p','off','p','p','p','l','p','p','off','p','p','p','p','p','off','p','p'];
    for (var d = 1; d <= 31; d++) {
      var s = pattern[d - 1];
      days.push({
        day: d,
        state: s === 'p' ? 'present' : s === 'a' ? 'absent' : s === 'l' ? 'late' : 'off',
        hours: s === 'l' ? '3h 10m · late by 50m' : s === 'a' ? 'No class attended' : '4h 30m'
      });
    }
    return days;
  }

  var portal = {
    student: { name: 'Aditya Verma', id: 'PA/2027/0412', batch: 'NEET 2027 · Classroom Batch A', joined: 'March 2026', mentor: 'Dr. Neeraj Verma' },
    dash: { attendance: 91, mock: 84, assignmentsDone: 17, assignmentsTotal: 20, rank: 124, rankOf: 1840, rankPrev: 167, nextTest: 'Physics — Sunday, 24 August · 10:00 AM' },
    subjects: [
      { name: 'Physics',   short: 'PH', color: '#3B2AE0', score: 78, rank: 186, accuracy: 71, time: '2h 41m', improve: +6,
        tests: [62, 66, 61, 70, 68, 74, 72, 78], weak: ['Rotational Motion', 'Modern Physics'] },
      { name: 'Chemistry', short: 'CH', color: '#E8410F', score: 88, rank: 94,  accuracy: 84, time: '2h 12m', improve: +11,
        tests: [70, 74, 73, 79, 82, 81, 86, 88], weak: ['Coordination Compounds'] },
      { name: 'Biology',   short: 'BI', color: '#0E9E6E', score: 86, rank: 112, accuracy: 82, time: '2h 28m', improve: +4,
        tests: [76, 79, 78, 81, 80, 84, 83, 86], weak: ['Plant Physiology', 'Ecology'] }
    ],
    testLabels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'],
    overall: [
      { name: 'Overall %', data: [69, 73, 71, 77, 77, 80, 80, 84] }
    ],
    rankTrend: [{ name: 'Batch rank', data: [412, 368, 341, 296, 247, 201, 167, 124] }],
    classes: [
      { t: 'Physics — Rotational Motion II',   m: 'Mr. Rohit Bansal · Room 204',    time: 'Today · 9:00 AM',  state: 'done',  ic: 'atom',  c: '#3B2AE0' },
      { t: 'Chemistry — Aldehydes & Ketones',  m: 'Prof. Anjali Srivastava · Room 204', time: 'Today · 11:00 AM', state: 'live', ic: 'flask', c: '#E8410F' },
      { t: 'Biology — Human Reproduction',     m: 'Dr. Neeraj Verma · Room 204',    time: 'Today · 2:00 PM',  state: 'next',  ic: 'leaf',  c: '#0E9E6E' },
      { t: 'Doubt Desk — open session',        m: 'All faculty · Lab 1',            time: 'Today · 5:00 PM',  state: 'next',  ic: 'chat',  c: '#B0801E' },
      { t: 'Physics — Full Syllabus Mock 09',  m: 'Assessment cell · Hall B',       time: 'Sunday · 10:00 AM', state: 'next', ic: 'test',  c: '#0E86C4' }
    ],
    assignments: [
      { t: 'Rotational Motion — Problem Set 7', s: 'Physics',   due: 'Due tomorrow',    done: false, score: null, c: '#3B2AE0' },
      { t: 'Aldehydes — Reaction Mechanisms',   s: 'Chemistry', due: 'Due 21 Aug',      done: false, score: null, c: '#E8410F' },
      { t: 'Human Reproduction — Diagram Set',  s: 'Biology',   due: 'Due 23 Aug',      done: false, score: null, c: '#0E9E6E' },
      { t: 'Thermodynamics — Numericals',       s: 'Physics',   due: 'Submitted 12 Aug', done: true, score: '18/20', c: '#3B2AE0' },
      { t: 'Chemical Kinetics — Worksheet 4',   s: 'Chemistry', due: 'Submitted 10 Aug', done: true, score: '19/20', c: '#E8410F' },
      { t: 'Plant Physiology — Short Notes',    s: 'Biology',   due: 'Submitted 8 Aug',  done: true, score: '16/20', c: '#0E9E6E' }
    ],
    mocks: [
      { n: 'Full Syllabus Mock 08', d: '10 Aug 2026', score: 612, total: 720, rank: 124, acc: 79, time: '2h 54m' },
      { n: 'Full Syllabus Mock 07', d: '3 Aug 2026',  score: 578, total: 720, rank: 167, acc: 76, time: '2h 58m' },
      { n: 'Subject Test — Biology', d: '30 Jul 2026', score: 320, total: 360, rank: 112, acc: 82, time: '1h 22m' },
      { n: 'Full Syllabus Mock 06', d: '27 Jul 2026', score: 561, total: 720, rank: 201, acc: 74, time: '2h 59m' },
      { n: 'Subject Test — Physics', d: '23 Jul 2026', score: 122, total: 180, rank: 186, acc: 68, time: '55m' }
    ],
    attendanceDays: calMonth(),
    attendanceMonths: {
      labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      series: [{ name: 'Attendance', data: [86, 89, 92, 88, 94, 91] }]
    },
    attendanceSummary: { attended: 142, missed: 14, total: 156 },
    fees: { total: 78000, paid: 50000, due: 28000, nextDue: '10 September 2026',
      history: [
        { d: '12 March 2026', amt: 30000, mode: 'UPI · HDFC', ref: 'PA-PAY-20481', state: 'Paid' },
        { d: '18 June 2026',  amt: 20000, mode: 'Net Banking · SBI', ref: 'PA-PAY-21663', state: 'Paid' },
        { d: '10 Sept 2026',  amt: 28000, mode: 'Instalment 3', ref: '—', state: 'Due' }
      ]
    },
    messages: [
      { f: 'Dr. Neeraj Verma', t: 'Your Biology gap analysis', p: 'Plant Physiology needs one more revision cycle before Mock 09. I have attached...', time: '2h', unread: true, seed: 7 },
      { f: 'Assessment Cell',  t: 'Mock 09 seat allotment',    p: 'Hall B, seat 42. Report by 9:30 AM with your admit card and a transparent...', time: '5h', unread: true, seed: 30 },
      { f: 'Neha Singh',       t: 'Fee instalment 3 reminder', p: '₹28,000 is due on 10 September. The payment link stays active until...', time: '1d', unread: false, seed: 15 },
      { f: 'Mr. Rohit Bansal', t: 'Problem Set 7 clarification', p: 'For Q14 use the parallel axis theorem — the pivot is not at the centre...', time: '2d', unread: false, seed: 34 },
      { f: 'Pragati Academy',  t: 'Independence Day holiday',  p: 'The campus will remain closed on 15 August. Sunday mock test schedule is...', time: '3d', unread: false, seed: 1 }
    ]
  };

  return {
    programs: programs, faculty: faculty, results: results, testimonials: testimonials,
    journal: journal, counsellors: counsellors, stages: stages, stagePill: stagePill,
    leads: leads, crm: crm, whatsapp: whatsapp, portal: portal
  };
})();
