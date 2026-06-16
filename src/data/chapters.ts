export interface Slide {
  heading: string;
  body: string;
  keyFact: string;
  color: string;
}

export interface Topic {
  id: string;
  title: string;
  duration: string;
  slides: Slide[];
}

export interface Question {
  q: string;
  opts: string[];
  correct: number;
  exp: string;
}

export interface Chapter {
  id: number;
  title: string;
  shortTitle: string;
  icon: string;
  color: string;
  gradient: string;
  progress: number;
  description: string;
  topics: Topic[];
  questions: Question[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: 1, title: "The FAIS Act as a Regulatory Framework", shortTitle: "FAIS Framework",
    icon: "⚖️", color: "#1B4FD8", gradient: "from-blue-700 to-blue-900",
    progress: 0,
    description: "Understand the FAIS Act as market conduct regulation, role-players, and integration with the FSR Act.",
    topics: [
      { id:"1.1", title:"Purpose & Overview of FAIS Act", duration:"12 min",
        slides:[
          { heading:"What is the FAIS Act?", body:"The Financial Advisory & Intermediary Services Act (No. 37 of 2002) is a MARKET CONDUCT regulation. It sets minimum standards for how authorised financial services providers conduct business with clients.", keyFact:"Act Number: 37 of 2002 | Effective: 15 November 2002", color:"#1B4FD8" },
          { heading:"The TWO Clear Purposes", body:"1. PROFESSIONALISATION of the financial services sector\n2. PROTECTION of consumers\n\nThese are the twin pillars on which the entire FAIS Act rests.", keyFact:"Exam Tip: Both purposes appear together in exam questions — know them both!", color:"#1e40af" },
          { heading:"Functional vs Institutional Approach", body:"FAIS follows a FUNCTIONAL approach — it regulates FUNCTIONS across institutions (insurance companies, brokerages, banks).\n\nAn institutional approach focuses on specific institutions only (e.g., Banks Act = banks only).", keyFact:"The function of providing financial services is governed by FAIS — regardless of which institution provides it.", color:"#1d4ed8" },
          { heading:"Key Commencement Dates", body:"• Main Act: 15 November 2002\n• Sections 20–31: 8 March 2003\n• Section 13(1): 30 September 2004\n• Section 7: 30 September 2004\n\nAmended by Financial Services Law General Amendment Act 45 of 2013.", keyFact:"These dates frequently appear in multiple-choice questions!", color:"#2563eb" },
        ]
      },
      { id:"1.2", title:"Role-Players in the FAIS Act", duration:"15 min",
        slides:[
          { heading:"The 6 Key Role-Players", body:"1. FSCA — independent body overseeing non-banking financial services\n2. FSPs — must be licensed by FSCA\n3. Key Individuals — manage/oversee FAIS-related business\n4. Representatives — provide financial services to clients\n5. Compliance Officers — ensure FSP compliance\n6. FAIS Ombud — resolves client disputes", keyFact:"Know each role-player's specific function — the exam tests the distinctions!", color:"#7C3AED" },
          { heading:"The FAIS Registrar's Powers", body:"• Authorises and issues licenses to FSPs\n• Approves Key Individuals and Compliance Officers\n• Publishes Codes of Conduct\n• Enforces the Act and imposes penalties\n• ALL decisions must be in WRITTEN format", keyFact:"Critical: ANY decision by the Registrar is ONLY valid if it is in writing!", color:"#6d28d9" },
          { heading:"FSPs vs Representatives", body:"FSPs: Must be licensed by FSCA — the legal entity\nRepresentatives: NOT licensed by FSCA — appointed by FSPs\nKey Individuals: Manage/oversee FSP activities\n\nThe FSP is RESPONSIBLE for its representatives' actions.", keyFact:"FSCA licenses FSPs. FSPs appoint Representatives. Representatives are NOT licensed by FSCA.", color:"#5b21b6" },
        ]
      },
      { id:"1.3", title:"The FSR Act (2017) — Twin Peaks", duration:"18 min",
        slides:[
          { heading:"Twin Peaks Model", body:"The FSR Act 2017 introduced TWIN PEAKS regulation:\n\nPeak 1: PRUDENTIAL AUTHORITY — financial stability and soundness (under Reserve Bank)\nPeak 2: FSCA — market conduct and consumer protection\n\nBoth work together but have distinct mandates.", keyFact:"Prudential = Safety & Soundness | FSCA = Fair Treatment of Customers", color:"#059669" },
          { heading:"Key FSR Act Bodies", body:"• Financial Stability Oversight Committee — meets every 6 MONTHS\n• Financial System Council of Regulators — meets twice a year\n• Financial Services Tribunal — independent appeals body\n• Ombud Council — oversees ombud schemes", keyFact:"6-month meeting requirement for Financial Stability Oversight Committee appears in exams!", color:"#047857" },
          { heading:"Memoranda of Understanding (MOUs)", body:"Financial sector regulators and Reserve Bank MUST:\n• Enter into MOUs within 6 MONTHS of Chapter taking effect\n• Review MOUs at least every 3 YEARS\n• Publish each MOU and amendments\n• Report annually on cooperation measures", keyFact:"6 months to enter MOU + 3 years review cycle = common exam combination", color:"#065f46" },
          { heading:"FSR Act Licensing Requirements", body:"A person may NOT provide financial products/services as a business unless:\n(a) Licensed under a specific financial sector law, OR\n(b) Licensed under the FSR Act itself (if no specific law exists)\n\nCannot hold yourself out as licensed unless you ARE licensed.", keyFact:"This applies to ALL financial services — even if not covered by FAIS specifically.", color:"#064e3b" },
        ]
      },
      { id:"1.4", title:"Compliance Officers — Requirements", duration:"20 min",
        slides:[
          { heading:"When Must You Appoint a CO?", body:"An FSP MUST appoint a Compliance Officer when it has:\n• MORE THAN ONE Key Individual, OR\n• ONE OR MORE Representatives\n\nException: If only 1 KI and NO representatives, the FSP itself can manage compliance.", keyFact:"This is an OR condition — having either triggers the requirement!", color:"#DC2626" },
          { heading:"Two-Phase Approval Process", body:"PHASE I (Personal Qualifications):\n• Recognised qualification\n• Pass regulatory examination\n• 3+ years compliance/risk management experience\n• Meet honesty, integrity, good standing\n• 1+ year experience in specific FSP category\n\nPHASE II (Specific FSP Approval):\n• Phase I approval\n• Adequate resources + access to senior management", keyFact:"Phase I = WHO you are | Phase II = FIT for this specific FSP", color:"#b91c1c" },
          { heading:"Visit Frequency Requirements", body:"EXTERNAL CO — Category I & IV FSPs:\n• Not less than QUARTERLY visits to premises\n• Not less than TWICE A YEAR for rep visits\n\nEXTERNAL CO — Category II, IIA & III FSPs:\n• MONTHLY visits to premises and branches\n\nINTERNAL CO — Category I & IV:\n• ANNUAL visits to premises", keyFact:"External vs Internal CO have different visit frequency requirements!", color:"#991b1b" },
          { heading:"Supervision of Compliance Services", body:"Maximum period under supervision: 3 YEARS\n\nCategory I & IV:\n• Year 1: Cannot conduct unaccompanied monitoring\n• Years 2–3: Cannot sign off compliance reports\n\nCategory II, IIA & III:\n• Years 1–2: Cannot conduct unaccompanied monitoring\n• Year 3: Cannot sign off compliance reports", keyFact:"3-year maximum for compliance supervision is a key exam figure.", color:"#7f1d1d" },
        ]
      },
    ],
    questions:[
      { q:"The FAIS Act follows which type of approach?", opts:["Institutional approach regulating specific company types","Functional approach regulating certain functions across all institutions","Product-based approach focusing on financial products","Geographic approach based on location"], correct:1, exp:"FAIS follows a FUNCTIONAL approach — regulating the FUNCTION of providing financial services across ALL institutions (insurance, banks, brokerages), not just specific types." },
      { q:"An FSP must appoint a Compliance Officer when it has:", opts:["More than 5 representatives","More than 1 KI OR 1+ representatives","More than 1 KI AND 1+ representatives","Any representatives regardless of KI count"], correct:1, exp:"Section 17 requires appointment when the FSP has MORE THAN ONE key individual OR one or more representatives. It's an OR condition — either trigger is sufficient." },
      { q:"For Phase I approval, a Compliance Officer must have at least how many years of experience?", opts:["1 year","2 years","3 years","5 years"], correct:2, exp:"Board Notice 127 of 2010 requires at least THREE years' experience in compliance or risk management for Phase I approval." },
      { q:"ALL decisions taken by the Registrar under the FAIS Act are only valid if:", opts:["Approved by the Minister of Finance","Published in the Government Gazette","In written or durable format","Communicated to all FSPs in the industry"], correct:2, exp:"Section 3(1) of the FAIS Act states that any decision by the Registrar is ONLY VALID if reduced to a durable written or printed form, or correctly transmitted electronically in legible form." },
      { q:"The Financial Stability Oversight Committee under the FSR Act must meet at least:", opts:["Monthly","Quarterly","Every six months","Annually"], correct:2, exp:"The Financial Stability Oversight Committee must meet at least EVERY SIX MONTHS. This is a specific requirement that appears in exams." },
    ]
  },
  {
    id: 2, title: "Contributing Towards Maintaining an FSCA License", shortTitle: "FSP Licensing",
    icon: "📋", color: "#7C3AED", gradient: "from-purple-700 to-purple-900",
    progress: 0,
    description: "FSP licensing requirements, conditions, display obligations, suspension/withdrawal, and undesirable practices.",
    topics: [
      { id:"2.1", title:"FSP License Application Process", duration:"16 min",
        slides:[
          { heading:"Section 8 — The Application Steps", body:"1. SUBMIT APPLICATION: Lodge with Registrar using correct forms\n2. REGISTRAR CONSIDERS: May require additional information from external sources (if applicant can comment)\n3. DECISION: Grant if applicant and KIs comply; Refuse if not\n4. CONDITIONS: Registrar may impose conditions/restrictions\n5. LICENSE ISSUED or REFUSED with reasons", keyFact:"Registrar can use information from external sources — but must allow applicant to comment!", color:"#7C3AED" },
          { heading:"The Critical 15-Day Rule", body:"An FSP must notify the Registrar within 15 DAYS of ANY change, including:\n• Business name / trading name\n• Type of business / contact details\n• Key Individual changes\n• Compliance Officer changes\n• Representatives register changes\n• Auditor / shareholder / director changes", keyFact:"15 DAYS = the most frequently tested timeframe in RE5. Almost every notification uses this period.", color:"#6d28d9" },
          { heading:"Display of Licenses (Section 8(8))", body:"An FSP MUST display CERTIFIED COPIES of its license:\n• In a PROMINENT and DURABLE manner\n• In EVERY BUSINESS PREMISES\n• Must be referenced in ALL business documentation, advertisements, and promotional material\n• Must be available when requested for business relationships", keyFact:"CERTIFIED copies (not just copies) + EVERY premises (not just head office) = common wrong answers!", color:"#5b21b6" },
          { heading:"When You Cannot Use a License", body:"A license CANNOT be used for business purposes if:\n• The license has LAPSED\n• The license has been WITHDRAWN or PROVISIONALLY WITHDRAWN\n• During any time of PROVISIONAL OR FINAL SUSPENSION\n\nUsing a lapsed/suspended license is a CRIMINAL OFFENCE.", keyFact:"Using a lapsed license = criminal offence under Section 36 of the FAIS Act.", color:"#4c1d95" },
        ]
      },
      { id:"2.2", title:"Suspension, Withdrawal & Lapsing", duration:"18 min",
        slides:[
          { heading:"9 Grounds for Suspension/Withdrawal", body:"The Registrar may suspend/withdraw if the licensee:\n1. Doesn't meet fit and proper requirements\n2. Submitted false/incomplete information\n3. Failed to comply with any FAIS provision\n4. Owes unpaid levies/penalties/sanctions\n5. Has no approved KI\n6. Failed to comply with directives\n7. Failed to comply with conditions/restrictions", keyFact:"Know these grounds — exam may list them and ask which applies to a scenario.", color:"#DC2626" },
          { heading:"Normal vs Urgent Suspension Process", body:"NORMAL PROCESS:\n• Registrar informs licensee of intention and grounds\n• Minimum 1 MONTH for licensee to respond\n• Registrar considers response, makes final decision\n\nURGENT/PROVISIONAL (substantial prejudice to public):\n• Provisional suspension immediately\n• Licensee informed after the fact\n• Opportunity to respond — then finalised or lifted", keyFact:"Normal process = 1 month minimum. Urgent = immediate, respond after.", color:"#b91c1c" },
          { heading:"Lapsing vs Suspension — Key Differences", body:"SUSPENSION:\n• Initiated by REGISTRAR\n• Can be REINSTATED by Registrar\n• Person debarred from applying for new license\n• Medical Schemes accreditation also suspended\n\nLAPSING:\n• Initiated by FSP\n• NO provision for reinstatement\n• No debarment requirement\n• Medical Schemes accreditation also deemed lapsed", keyFact:"Lapsing = no reinstatement possible | Suspension = may be reinstated", color:"#991b1b" },
          { heading:"Levy Payment Rules", body:"FSCA Levies:\n• Due on or before 31 OCTOBER annually\n• Calculated based on KI + Rep numbers as at 31 AUGUST\n• Failure to pay = license may be WITHDRAWN\n\nCategory I/IV Formula:\nBase R3,182 + (A × R508)\nwhere A = number of KIs + Reps at 31 August", keyFact:"31 October (due date) and 31 August (calculation date) — both appear in exam!", color:"#7f1d1d" },
        ]
      },
      { id:"2.3", title:"Undesirable Practices & Offences", duration:"14 min",
        slides:[
          { heading:"4 Criteria for Undesirable Practice", body:"A practice is undesirable if it has, or is LIKELY TO HAVE, a direct or indirect effect resulting in:\n1. Harming relations between FSPs and clients\n2. Unreasonable prejudice to clients\n3. DECEIVING any client\n4. UNFAIRLY affecting any client\n\nAND if allowed to continue, it defeats objects of the FAIS Act.", keyFact:"All 4 criteria are tested — the 'likely to have' future-looking language is important!", color:"#D97706" },
          { heading:"The Declaration Process", body:"1. Registrar publishes INTENTION in the Gazette with reasons\n2. Written representations invited — must reach Registrar within 21 DAYS\n3. Registrar considers and makes decision\n4. Declaration published — FSP must STOP IMMEDIATELY\n5. If FSP continues: Registrar directs RECTIFICATION\n6. FSP must comply within 60 DAYS\n7. Non-compliance: R10,000,000 fine OR 10 years imprisonment", keyFact:"21 days for representations + 60 days to rectify + R10m/10 years penalty", color:"#b45309" },
          { heading:"FAIS Act Offences — Section 36", body:"Maximum: R10,000,000 OR 10 YEARS imprisonment OR BOTH\n\nKey offences:\n• Acting as FSP without a license\n• Conducting business with unlicensed person\n• Failure to display/refer to license\n• Not notifying Registrar within 15 days of changes\n• Failure to debar representatives\n• Making false/misleading statements", keyFact:"R10m/10 years is the maximum for FAIS offences. FICA maximum = 15 years OR R10m.", color:"#92400e" },
        ]
      },
    ],
    questions:[
      { q:"Within how many days must an FSP notify the Registrar of a change in its key individual?", opts:["7 days","10 days","15 days","30 days"], correct:2, exp:"The FAIS Act and licensing conditions require notification within 15 DAYS of virtually any change, including changes to Key Individuals." },
      { q:"A certified copy of an FSP license must be displayed:", opts:["At the registered head office only","At head office and main regional offices","In a prominent and durable manner in every business premises","On the FSP's website in digital format"], correct:2, exp:"Section 8(8) requires CERTIFIED COPIES displayed prominently and durably in EVERY business premises. Also referenced in all business documentation and promotional material." },
      { q:"The key difference between a lapsed license and a suspended license is:", opts:["A suspended license can be reinstated; a lapsed license cannot","A lapsed license can be reinstated; a suspended license cannot","Both can be reinstated under the same conditions","Neither can be reinstated once withdrawn"], correct:0, exp:"A SUSPENDED license may be reinstated by the Registrar under certain conditions. A LAPSED license has NO provisions for reinstatement in the Act." },
      { q:"Within how many days of publishing the intention to declare a practice undesirable must representations reach the Registrar?", opts:["7 days","14 days","21 days","30 days"], correct:2, exp:"Section 34 requires that written representations must reach the Registrar within 21 DAYS after the date of publication of the intention to declare." },
      { q:"FSCA levies are calculated based on numbers as at:", opts:["30 June","31 July","31 August","31 October"], correct:2, exp:"Levies are calculated based on the number of key individuals and representatives as at 31 AUGUST of the levy year. They are due on or before 31 October." },
    ]
  },
  {
    id: 3, title: "Operate as the Key Individual in terms of FAIS", shortTitle: "Key Individual",
    icon: "🔑", color: "#059669", gradient: "from-emerald-700 to-emerald-900",
    progress: 0,
    description: "Roles, responsibilities, fit and proper requirements, CPD, and competence standards for Key Individuals.",
    topics: [
      { id:"3.1", title:"Definition & Role of a Key Individual", duration:"12 min",
        slides:[
          { heading:"Who is a Key Individual?", body:"A Key Individual (KI) is any natural person responsible for MANAGING OR OVERSEEING (either alone or with others) the activities of an FSP relating to the rendering of financial services.\n\nFor entities with ONE natural person: that person IS the KI by definition.", keyFact:"KI must MANAGE OR OVERSEE — either function qualifies. You don't need to do both.", color:"#059669" },
          { heading:"KI Management Responsibilities", body:"A KI must ensure systems, processes, and controls are in place for:\n• Section 7: FSP licensing and authorisation\n• Section 13: Representative management and register\n• Section 14: Debarment processes\n• Section 17: Compliance officer appointment\n• Section 18: Record keeping\n• Section 19: Financial statements and audit", keyFact:"The KI is personally responsible for the FSP's compliance systems under Sections 7-42.", color:"#047857" },
          { heading:"KI + Representative Dual Role", body:"A KI can ALSO act as a representative. In this case:\n• Must meet the requirements for BOTH roles\n• Must complete RE1 (KI exam) AND RE5 (Representative exam)\n• Must have experience for both functions\n\nA sole proprietor FSP is both the KI and the FSP in one person.", keyFact:"Dual role = dual requirements. No shortcuts.", color:"#065f46" },
        ]
      },
      { id:"3.2", title:"Fit & Proper for Key Individuals", duration:"22 min",
        slides:[
          { heading:"4 Fit & Proper Components", body:"ALL Key Individuals must comply with:\n1. HONESTY, INTEGRITY AND GOOD STANDING\n2. COMPETENCE (Experience + Qualifications + Exams)\n3. OPERATIONAL ABILITY\n4. CONTINUOUS PROFESSIONAL DEVELOPMENT (CPD)\n\nNote: KIs do NOT need Financial Soundness (only FSPs do).", keyFact:"Financial Soundness is for FSPs, not individual KIs or Representatives.", color:"#7C3AED" },
          { heading:"Honesty Disqualification — 5-Year Rule", body:"A person CANNOT be approved as KI if within 5 YEARS:\n• Found guilty of fraud/dishonesty/breach of fiduciary duty\n• Found guilty by professional body of dishonesty/negligence\n• Denied professional body membership for dishonesty/negligence\n• Regulatory body found guilty of dishonesty/mismanagement\n• FSP had license withdrawn for dishonesty/negligence", keyFact:"The 5-year lookback period is critical — applies to both criminal AND civil proceedings.", color:"#6d28d9" },
          { heading:"Experience Requirements by Category", body:"Category I KI: Min 1 YEAR management/oversight experience\nCategory II/IIA: Must have actually PROVIDED the financial services\nCategory III: 3 YEARS Category III experience + 1 YEAR management\nCategory IV: Min 1 YEAR management/oversight experience\n\nIMPORTANT: Management experience CANNOT be gained under supervision!", keyFact:"Category III = 3 years specific + 1 year management = 4 years total requirement.", color:"#5b21b6" },
          { heading:"Qualification Rating System", body:"G (Generic) = Partially meets criteria → Must complete product-specific exam\nS (Specific) = 80% criteria match → Exam exemption ONLY for pre-2010 authorised\nSP (Specific Plus) = 100% match → Full exam exemption\n\nIf qualification not on FSCA list: Apply for recognition BEFORE submitting application.", keyFact:"SP = highest rating = full exam exemption. G = lowest = still need product exam.", color:"#4c1d95" },
        ]
      },
      { id:"3.3", title:"CPD Requirements", duration:"15 min",
        slides:[
          { heading:"CPD Hours Required", body:"CPD Cycle: 1 JUNE to 31 MAY each year\n\nMinimum hours per 12-month cycle:\n• More than 1 CLASS of business: 18 HOURS\n• More than 1 SUBCLASS within 1 class: 12 HOURS\n• Single SUBCLASS within 1 class: 6 HOURS\n\nUpdate CPD records within 30 DAYS after cycle ends.", keyFact:"18/12/6 pattern — more broad = more hours. 30 days to update records.", color:"#DC2626" },
          { heading:"What Counts for CPD?", body:"COUNTS:\n• Courses, conferences, seminars\n• Additional qualifications\n• Workshops\n• Structured self-study with assessment\n\nDOES NOT COUNT:\n• Product-specific training\n\nMust be accredited by a Professional Body and have allocated hourly value.", keyFact:"Product-specific training does NOT count for CPD — common exam distractor!", color:"#b91c1c" },
          { heading:"Pro-Rating and Exceptions", body:"Pro-Rating Formula:\n(Annual hours ÷ 12) × Months active = Required hours\n\nExceptions (NO CPD required):\n• Category I FSPs authorised ONLY for Long-term Insurance Subcategory A and/or Friendly Society Benefits\n\nPro-rating also applies for maternity leave, long-term illness/disability.", keyFact:"Remember the pro-rating formula — it can appear in calculation questions.", color:"#991b1b" },
          { heading:"Class of Business & Product Training", body:"CLASS OF BUSINESS TRAINING (from 1 August 2018):\n• Before rendering any financial service in relation to a product\n• Before managing/overseeing any financial service (KIs)\n\nPRODUCT SPECIFIC TRAINING (from 1 May 2018):\n• Before giving advice/providing intermediary service on specific product\n• Must include an ASSESSMENT component", keyFact:"Class of Business: 1 Aug 2018. Product Specific: 1 May 2018. Both required before rendering services.", color:"#7f1d1d" },
        ]
      },
    ],
    questions:[
      { q:"A Key Individual managing a Category III FSP requires as a minimum:", opts:["1 year Category III experience only","3 years Category III experience only","3 years Category III PLUS 1 year management experience","5 years combined experience in financial services"], correct:2, exp:"Category III KIs need 3 YEARS' practical Category III experience AND an additional 1 YEAR's management/oversight experience. Both are required simultaneously." },
      { q:"Which of the following does NOT count towards CPD hours?", opts:["Attending industry conferences","Completing an additional qualification","Product-specific training from a product supplier","Structured self-study programmes with assessment"], correct:2, exp:"Product-specific training does NOT count for CPD purposes, even though it is required before rendering services on specific products. CPD activities must be accredited by a Professional Body." },
      { q:"A KI is authorised across two different classes of business. Their minimum CPD requirement per cycle is:", opts:["6 hours","12 hours","18 hours","24 hours"], correct:2, exp:"When authorised across MORE THAN ONE CLASS of business, the minimum CPD requirement is 18 HOURS per 12-month cycle." },
      { q:"Management experience for a Key Individual:", opts:["Can be gained under supervision while performing KI duties","Must exist at date of approval — cannot be gained under supervision","Can be obtained within the first year after approval","Is not required for Category IV FSPs"], correct:1, exp:"Management and oversight experience CANNOT be obtained under supervision while fulfilling the duties of a Key Individual. It must exist at the date of approval by the Registrar." },
      { q:"CPD records must be updated within how many days after each cycle ends?", opts:["7 days","14 days","30 days","60 days"], correct:2, exp:"FSPs must update their CPD records in their Competence Register within 30 DAYS after each 12-month CPD cycle (which runs from 1 June to 31 May)." },
    ]
  },
  {
    id: 4, title: "Adhere to the General Code of Conduct", shortTitle: "Code of Conduct",
    icon: "📜", color: "#D97706", gradient: "from-amber-600 to-amber-900",
    progress: 0,
    description: "Conflict of interest, disclosures, custody of funds, advertising rules, and complaints handling under the General Code.",
    topics: [
      { id:"4.1", title:"Conflict of Interest Management", duration:"16 min",
        slides:[
          { heading:"Definition of Conflict of Interest", body:"A COI means a situation where a provider or representative has an ACTUAL OR POTENTIAL INTEREST that may:\n• Influence the objective exercising of obligations to the client, OR\n• Prevent the rendering of financial services in an unbiased and fair manner", keyFact:"Both actual AND potential conflicts must be disclosed — you don't need to wait for a conflict to materialise!", color:"#D97706" },
          { heading:"What Must Be Disclosed — COI", body:"At the first reasonable opportunity IN WRITING:\n• Personal interest in the relevant service\n• Any circumstance giving rise to actual or potential COI\n• Measures taken to avoid/mitigate the conflict\n• Any ownership or financial interest (except immaterial)\n• Any third-party relationship/arrangement", keyFact:"COI disclosure must be IN WRITING at the FIRST REASONABLE OPPORTUNITY.", color:"#b45309" },
          { heading:"Immaterial Financial Interest", body:"An immaterial financial interest is:\n• A financial interest that does NOT EXCEED R1,000\n• Over a CALENDAR YEAR period\n• FROM THE SAME THIRD PARTY\n\nFinancial interest includes: cash, vouchers, gifts, travel, hospitality, accommodation, sponsorship, incentives.", keyFact:"R1,000 threshold per calendar year per third party. Below this = immaterial.", color:"#92400e" },
          { heading:"What Providers MAY NOT Do", body:"A provider may NOT offer a representative financial interest for:\n1. Giving preference to QUANTITY of business over QUALITY of service\n2. Giving preference to a SPECIFIC PRODUCT SUPPLIER (where alternatives exist)\n3. Giving preference to a SPECIFIC PRODUCT (where alternatives exist)\n\nCOI Policy: Board-adopted, annually reviewed, published and accessible.", keyFact:"These 3 prohibited incentives all involve preference at the expense of client service quality.", color:"#78350f" },
        ]
      },
      { id:"4.2", title:"Disclosure Requirements", duration:"18 min",
        slides:[
          { heading:"Pre-Service Disclosure Obligations", body:"At the earliest reasonable opportunity, disclose:\n• Name, class/type of financial product\n• Nature and extent of benefits + how calculated\n• Investment value determination (for investment products)\n• All charges and fees (separately disclosed)\n• Client's monetary obligations to product supplier\n• Valuable consideration payable to the provider by the product supplier", keyFact:"Full and frank disclosure must enable the client to make an INFORMED DECISION.", color:"#1B4FD8" },
          { heading:"Past Performance — The Rule", body:"Past investment performance:\n• Only provide ON REQUEST (not automatically)\n• ALWAYS with mandatory warning: 'past performances are not necessarily indicative of future performances'\n\nReplacement products — MUST disclose:\n• ACTUAL AND POTENTIAL financial implications\n• COSTS of replacement\n• CONSEQUENCES (surrender penalties, waiting periods)", keyFact:"Past performance = on request ONLY. Always with the warning. Never voluntary disclosure.", color:"#1e40af" },
          { heading:"Under Supervision — Disclosure", body:"A representative working under supervision MUST disclose to clients:\n1. The signed authority from the FSP indicating fit and proper status\n2. That they are ACTING UNDER SUPERVISION\n\nThis is mandatory — concealing supervision status from clients is a violation of the Code.", keyFact:"Cannot hide the fact of being under supervision from clients. MUST disclose.", color:"#1d4ed8" },
        ]
      },
      { id:"4.3", title:"Custody of Funds & Complaints", duration:"20 min",
        slides:[
          { heading:"Custody of Client Funds — Section 10", body:"SEPARATE BANK ACCOUNT:\n• Designated for client funds ONLY — no FSP funds\n• ALL received funds deposited within ONE BUSINESS DAY\n• ALL INTEREST earned goes to the CLIENT\n• FSP pays bank charges EXCEPT client-specific deposit/withdrawal charges\n\nPaper: Issue WRITTEN CONFIRMATION when receiving title documents or cash.", keyFact:"1 business day + all interest to client + written confirmation — 3 rules tested together!", color:"#DC2626" },
          { heading:"Complaints Record Keeping", body:"An FSP MUST:\n• Request clients to complain IN WRITING\n• Maintain records of complaints for 5 YEARS\n• Handle complaints TIMELY AND FAIRLY\n• Investigate and respond PROMPTLY\n• Advise client of further steps if not resolved\n\nAfter unfavourable outcome: Client has 6 MONTHS to go to FAIS Ombud.", keyFact:"5 years complaint records + 6 months to Ombud after dismissal = key exam figures.", color:"#b91c1c" },
          { heading:"Waiver of Rights — PROHIBITED", body:"Section 21 of the General Code:\n• A provider CANNOT induce or request a client to waive any rights or benefits\n• Even if a client voluntarily waives, the FSP CANNOT act on it\n• Any waiver of rights under the General Code is NULL AND VOID\n\nThis is an absolute prohibition — no exceptions.", keyFact:"Waivers of General Code rights = automatically null and void. No exceptions.", color:"#991b1b" },
          { heading:"Termination of Agreements", body:"If a CLIENT requests to terminate:\n• FSP must give IMMEDIATE EFFECT to voluntary termination request\n• Must ensure client understands implications\n\nIf a REPRESENTATIVE stops operating:\n• FSP must IMMEDIATELY NOTIFY all affected clients\n• Must ensure outstanding business is COMPLETED or TRANSFERRED", keyFact:"'Immediate' is the key word for both client-initiated and representative-initiated termination.", color:"#7f1d1d" },
        ]
      },
      { id:"4.4", title:"Advertising & Direct Marketing", duration:"12 min",
        slides:[
          { heading:"Advertising Rules — Section 14", body:"Advertisements MUST NOT:\n• Contain fraudulent, untrue, or misleading statements/promises/forecasts\n\nAdvertisements WITH past performance data MUST:\n• Contain the warning: 'past performances are not necessarily indicative of future performances'\n\nInvestment value NOT guaranteed MUST:\n• Contain warning that no guarantees are provided", keyFact:"Every qualifying situation has a mandatory warning requirement — exam tests each scenario.", color:"#7C3AED" },
          { heading:"Telephone & Radio Advertising", body:"TELEPHONE ADS:\n• Must maintain voice-logged records of ALL communications\n• If no service rendered: records only kept for 45 DAYS\n• Copy of records to client/Registrar within 7 DAYS of request\n\nRADIO ADS:\n• Must include the BUSINESS NAME of the provider", keyFact:"45 days (no service rendered) vs 7 days (copy provision request) — different timeframes.", color:"#6d28d9" },
          { heading:"Direct Marketer Requirements", body:"When providing a financial service, direct marketer must provide:\n• Business/trade name\n• Confirmation of licensed status\n• Telephone contact details\n• Compliance department contact\n• Whether professional indemnity insurance is held\n\nIf info provided orally: Must confirm in WRITING within 30 DAYS.", keyFact:"30-day window to confirm telephone disclosures in writing for direct marketing.", color:"#5b21b6" },
        ]
      },
    ],
    questions:[
      { q:"When must client funds received by an FSP be deposited into the designated client account?", opts:["Same business day","Within one business day","Within two business days","Within three business days"], correct:1, exp:"Section 10(1)(d)(i) of the General Code requires funds to be paid into the designated client account within ONE BUSINESS DAY of receipt." },
      { q:"A client who receives an unfavourable complaint outcome has how long to pursue the matter with the FAIS Ombud?", opts:["3 months","6 months","12 months","3 years"], correct:1, exp:"When an FSP provides an unfavourable complaint outcome, the client must be advised they may pursue the matter with the Ombud within SIX MONTHS." },
      { q:"Interest earned on client funds in the designated separate account must be:", opts:["Split equally between FSP and client","Used to offset bank charges","Paid entirely to the client or owner of the funds","Reinvested into the client's financial product"], correct:2, exp:"Section 10(1)(d)(iv) requires ALL INTEREST accruing on funds in the separate client account to be payable to the CLIENT or the owner of the funds. The FSP has no claim to this interest." },
      { q:"An immaterial financial interest that a representative may accept from a third party is one that:", opts:["Does not exceed R500 per transaction","Does not exceed R1,000 over a calendar year from the same third party","Does not exceed R5,000 over a year from any sources","Does not exceed R2,000 per year from one product supplier"], correct:1, exp:"An immaterial financial interest does not exceed R1,000 over a CALENDAR YEAR PERIOD, paid by the SAME THIRD PARTY during that year." },
      { q:"Telephone advertisements for financial services where NO financial service is rendered require voice-logged records to be kept for:", opts:["7 days","14 days","30 days","45 days"], correct:3, exp:"Section 14(2) states that where no financial service is rendered as a result of the advertisement, the voice-logged record need not be maintained for a period exceeding 45 DAYS." },
    ]
  },
  {
    id: 5, title: "Comply with Regulated Record Keeping Requirements", shortTitle: "Record Keeping",
    icon: "🗂️", color: "#DC2626", gradient: "from-red-700 to-red-900",
    progress: 0,
    description: "FAIS Act and FICA record-keeping obligations, security requirements, reporting duties, and confidentiality.",
    topics: [
      { id:"5.1", title:"FAIS Act Record Keeping — Section 18", duration:"14 min",
        slides:[
          { heading:"5 Categories of Records — Section 18", body:"Authorised FSP must maintain records for MINIMUM 5 YEARS:\n(a) Known premature cancellations of transactions/products by clients\n(b) Complaints received + whether resolved\n(c) Continued compliance with licensing requirements (Section 8)\n(d) Cases of NON-COMPLIANCE with the Act + reasons\n(e) Continued compliance by representatives (Section 13)", keyFact:"Know all 5 categories by letter — exams test all of them individually.", color:"#DC2626" },
          { heading:"How Records Must Be Kept", body:"RETENTION:\n• 5 YEARS after termination of the product, OR\n• 5 YEARS after rendering of the financial service\n\nFORMAT: Appropriate electronic or recorded format — accessible and printable\n\nACCESSIBILITY: Available for inspection within 7 DAYS of Registrar's request\n\nOUTSOURCING: Permitted — but FSP remains responsible!", keyFact:"7 days to provide records to Registrar. Can outsource but cannot escape responsibility.", color:"#b91c1c" },
          { heading:"Confidentiality of Client Information", body:"An FSP MAY NOT disclose confidential client information UNLESS:\n1. Client has given WRITTEN CONSENT beforehand, OR\n2. Disclosure required in the PUBLIC INTEREST, OR\n3. Disclosure required by LAW\n\nRegistrar's own disclosures (debarments, withdrawals) are NOT contraventions of this rule.", keyFact:"Written consent BEFOREHAND (not after) is required for voluntary disclosure.", color:"#991b1b" },
        ]
      },
      { id:"5.2", title:"FICA Record Keeping & Reporting", duration:"18 min",
        slides:[
          { heading:"FICA Record Keeping — Section 22", body:"Accountable institutions must keep records of:\n• Business relationship documents (identity verification)\n• Single and additional transactions during relationships\n• Due diligence investigations\n\nRETENTION:\n• Business relationships: 5 YEARS from TERMINATION date\n• Transactions: 5 YEARS from TRANSACTION CONCLUDED date", keyFact:"5 years from TERMINATION (not commencement) of business relationship!", color:"#DC2626" },
          { heading:"Cash Transaction Reporting — R25,000", body:"Must report to FIC if cash amount EXCEEDS R24,999.99 (i.e., R25,000+):\n• Report within 2 DAYS of determining the transaction\n• Aggregated smaller amounts also reportable if linked\n\nR24,999.99 = the exact threshold. R25,000 and above MUST be reported.", keyFact:"Exact threshold: R24,999.99. Report within 2 DAYS. Aggregation of linked amounts counts!", color:"#b91c1c" },
          { heading:"Suspicious Transaction Reporting", body:"Must report if you KNOW OR SUSPECT the transaction:\n• Involves proceeds of unlawful activities\n• Has no apparent business purpose\n• Is conducted to avoid a reporting duty under FICA\n• May be relevant to tax evasion investigation\n\nReport within 5 DAYS. CANNOT inform the client you have reported.", keyFact:"5 days to report. NEVER tell the client. Tipping off = criminal offence.", color:"#991b1b" },
          { heading:"FICA vs FAIS Penalties", body:"FICA PENALTIES:\n• Maximum: 15 YEARS imprisonment OR R10,000,000 fine\n\nFAIS PENALTIES:\n• Maximum: 10 YEARS imprisonment OR R10,000,000 fine\n\nKey difference: FICA has 15 YEARS max imprisonment vs FAIS 10 YEARS.", keyFact:"FICA = 15 years max. FAIS = 10 years max. Same R10m fine limit for both.", color:"#7f1d1d" },
        ]
      },
    ],
    questions:[
      { q:"A suspicious transaction report must be submitted to the FIC within:", opts:["24 hours","2 days","5 days","7 days"], correct:2, exp:"Section 29 of FICA requires suspicious transaction reports to be submitted to the FIC as soon as possible, but no later than FIVE DAYS after knowledge or suspicion arose." },
      { q:"Which statement is CORRECT regarding outsourced record keeping under FICA?", opts:["Outsourcing discharges the institution's responsibility","Permitted if institution has free access and third party details given to FIC","Only allowed with prior FIC approval","Only records older than 2 years may be outsourced"], correct:1, exp:"Section 24 allows outsourcing IF the accountable institution has free and easy access, the institution remains liable (NOT discharged), and third party particulars MUST be provided to the FIC." },
      { q:"The mandatory cash reporting threshold under FICA is transactions in excess of:", opts:["R10,000","R15,000","R24,999.99","R50,000"], correct:2, exp:"The prescribed threshold under FICA Section 28 is R24,999.99, meaning all cash transactions of R25,000 or more must be reported to the FIC within 2 days." },
      { q:"FICA record keeping for business relationships must be retained for how long from termination?", opts:["2 years","3 years","5 years","7 years"], correct:2, exp:"FICA Section 23 requires records relating to a business relationship to be kept for at least FIVE YEARS from the date on which the business relationship was TERMINATED." },
      { q:"The maximum imprisonment penalty under FICA for non-compliance is:", opts:["5 years","10 years","15 years","20 years"], correct:2, exp:"FICA penalties for offences range up to 15 YEARS imprisonment or a fine of R10,000,000. Note that FAIS maximum is 10 years — FICA is more severe in terms of imprisonment." },
    ]
  },
  {
    id: 6, title: "Money Laundering and Terrorist Financing", shortTitle: "Anti-Money Laundering",
    icon: "🔍", color: "#7C2D12", gradient: "from-orange-900 to-red-900",
    progress: 0,
    description: "FICA obligations for FSPs: client identification, suspicious transactions, internal rules, and the 4 AML control obligations.",
    topics: [
      { id:"6.1", title:"Definition & 4 AML Obligations", duration:"14 min",
        slides:[
          { heading:"Money Laundering Defined", body:"Money laundering = any activity which has or is likely to have the effect of:\n• CONCEALING or DISGUISING the nature, source, location, disposition, or movement\n• Of the PROCEEDS OF UNLAWFUL ACTIVITIES\n• Or any interest which anyone has in such proceeds", keyFact:"Definition includes 'likely to have the effect' — doesn't require actual laundering to be proven.", color:"#7C2D12" },
          { heading:"The 4 AML Control Obligations", body:"ALL accountable institutions have 4 obligations:\n1. IDENTIFY AND VERIFY clients\n2. KEEP RECORDS of business relationships and transactions\n3. REPORTING DUTIES and allow access to information\n4. ADOPT MEASURES to promote compliance\n\nAll 4 apply to every accountable institution.", keyFact:"All 4 obligations must be known in order. They are the foundation of FICA compliance.", color:"#991b1b" },
          { heading:"Who is an Accountable Institution?", body:"FICA Schedule 1 includes FSPs authorised to provide:\n• Investment advice and intermediary services for investment products\n\nBUT EXCLUDES:\n• Short-term insurance contracts\n• Health service benefits (medical schemes)\n\nAlso includes: Banks, long-term insurers, estate agents, attorneys, forex dealers, money remitters.", keyFact:"FSPs are accountable for INVESTMENT services ONLY — not short-term insurance or medical schemes!", color:"#b45309" },
          { heading:"Section 20A — No Anonymous Clients", body:"Section 20A (inserted 2 October 2017):\n• Accountable institutions may NOT enter into any transaction with ANONYMOUS clients\n• Clients with FALSE OR FICTITIOUS names are also prohibited\n\nSection 21E: If you CANNOT verify identity → CANNOT establish or continue the relationship.", keyFact:"Anonymous transactions are completely prohibited. Cannot proceed without verifiable identity.", color:"#92400e" },
        ]
      },
    ],
    questions:[
      { q:"Which FSP would be classified as an accountable institution under FICA?", opts:["FSP authorised only to provide short-term insurance advice","FSP authorised to advise on health service benefits","FSP authorised to provide investment advice and intermediary services","A compliance practice rendering compliance services"], correct:2, exp:"FICA Schedule 1 includes FSPs authorised under FAIS to provide advice and intermediary services in respect of INVESTMENT products. Short-term insurance and health service benefits are specifically EXCLUDED." },
      { q:"An employee of an accountable institution suspects a client's transaction involves money laundering. The employee MUST:", opts:["Inform client and request explanation first","Refuse to process and tell client why","Report through internal procedures without informing the client","Wait until transaction is complete before reporting"], correct:2, exp:"Under FICA Section 29: Report via internal procedures and to FIC. The employee MAY NOT inform the client that the transaction has been reported. Tipping off is itself an offence." },
      { q:"The 4 money laundering control obligations for accountable institutions include all EXCEPT:", opts:["Duty to identify and verify clients","Duty to keep records of business relationships","Duty to investigate money laundering by competitors","Adoption of measures to promote compliance"], correct:2, exp:"The 4 AML obligations are: (1) Identify and verify clients, (2) Keep records, (3) Reporting duties and allow access to information, (4) Adopt compliance measures. Investigating competitors is NOT an obligation." },
    ]
  },
  {
    id: 7, title: "Deal with Complaints Submitted to the FAIS Ombud", shortTitle: "FAIS Ombud",
    icon: "⚖️", color: "#1E40AF", gradient: "from-blue-800 to-indigo-900",
    progress: 0,
    description: "Role, jurisdiction, powers, and complaint procedures of the FAIS Ombud.",
    topics: [
      { id:"7.1", title:"Role & Jurisdiction of the FAIS Ombud", duration:"16 min",
        slides:[
          { heading:"Purpose of the FAIS Ombud", body:"The FAIS Ombud resolves disputes where:\n• Provider FAILED TO COMPLY with the FAIS Act, OR\n• Provider acted WILFULLY OR NEGLIGENTLY causing prejudice, OR\n• Provider treated complainant UNFAIRLY\n\nObjective: FAIR, UNBIASED, REASONABLE, ECONOMICAL and EXPEDITIOUS relief at NO CHARGE.", keyFact:"3 bases for complaints + FREE service to clients. The Ombud operates independently.", color:"#1E40AF" },
          { heading:"Jurisdiction — When Ombud MUST Decline", body:"Ombud MUST decline if:\n1. Act/omission occurred MORE THAN 3 YEARS before complaint received\n   (3 years from when complainant KNEW or SHOULD HAVE KNOWN)\n2. Court proceedings ALREADY INSTITUTED for the same matter\n3. Monetary claim EXCEEDS R800,000\n   (unless respondent agrees in writing or complainant abandons excess)", keyFact:"3 years from KNOWLEDGE (not from the event). R800,000 limit with exceptions.", color:"#1d4ed8" },
          { heading:"Ombud Investigation Process", body:"1. Complaint submitted in writing\n2. Ombud informs all interested parties\n3. All parties given opportunity to respond\n4. Ombud explores CONCILIATED SETTLEMENT first\n5. May make recommendation — parties confirm acceptance\n6. Accepted recommendation = FINAL DETERMINATION\n7. If no settlement: FORMAL DETERMINATION\n   → Dismiss OR uphold (wholly or partially)", keyFact:"Conciliation first, then formal determination. Accepted recommendation = binding.", color:"#2563eb" },
          { heading:"Legal Effect of Determinations", body:"A determination has the SAME LEGAL EFFECT as a civil court judgment:\n• Recorded by the clerk of court\n• Warrant of execution can issue after 2 WEEKS from determination\n• Interest and costs form part of the final determination\n• Annual report submitted to FSCA within 6 MONTHS of financial year end", keyFact:"2 weeks before warrant of execution. 6 months for annual report to FSCA.", color:"#3b82f6" },
        ]
      },
    ],
    questions:[
      { q:"The FAIS Ombud must decline to investigate a complaint if:", opts:["The complaint is about investment advice only","It relates to an act that occurred more than 3 years before the complaint was received","The FSP has offered some compensation","The complainant has legal representation"], correct:1, exp:"The Ombud MUST decline complaints relating to acts or omissions that occurred MORE THAN 3 YEARS before receipt. The 3-year period starts when the complainant BECAME AWARE or OUGHT REASONABLY to have become aware of the problem." },
      { q:"A client institutes civil action against an FSP AND opens a complaint with the FAIS Ombud for the same matter. The Ombud:", opts:["Handles both to ensure best outcome for client","Must decline — court proceedings already instituted","Prioritises the Ombud complaint over court","Handles it jointly with the court"], correct:1, exp:"The FAIS Ombud MUST decline to investigate if proceedings have ALREADY BEEN INSTITUTED IN ANY COURT for the same matter. Client cannot pursue both simultaneously." },
      { q:"A determination made by the FAIS Ombud:", opts:["Is merely advisory and cannot be enforced","Must be ratified by a court first","Has the same legal effect as a civil court judgment","Can only be enforced by the FSCA"], correct:2, exp:"A determination by the FAIS Ombud has THE SAME LEGAL EFFECT AS A CIVIL COURT JUDGMENT. A warrant of execution can issue after 2 weeks from the date of determination." },
      { q:"A warrant of execution based on a FAIS Ombud determination can be issued after:", opts:["Immediately after determination","3 days after determination","2 weeks after determination","1 month after determination"], correct:2, exp:"Section 28(6) of the FAIS Act states that a warrant of execution may be executed by the Sheriff of the Court after the expiration of 2 WEEKS after the date of the determination." },
    ]
  },
  {
    id: 8, title: "Operate as a Representative in terms of the FAIS Act", shortTitle: "Representatives",
    icon: "👤", color: "#065F46", gradient: "from-emerald-800 to-teal-900",
    progress: 0,
    description: "Definition, roles, fit and proper requirements, supervision, debarment, and the representative register.",
    topics: [
      { id:"8.1", title:"Definition & Responsibilities", duration:"14 min",
        slides:[
          { heading:"Definition of a Representative", body:"A REPRESENTATIVE is any person who:\n• RENDERS A FINANCIAL SERVICE to a client\n• FOR OR ON BEHALF of an FSP\n• Under employment or mandate\n\nNOT a representative if:\n• Service requires NO JUDGMENT, AND\n• Does NOT lead client to a specific financial product transaction", keyFact:"Both exclusion criteria must apply to be excluded. Either requiring judgment OR leading to transactions = representative.", color:"#065F46" },
          { heading:"Key Responsibilities", body:"1. Render financial services (advice OR intermediary) on behalf of FSP\n2. Confirm employment/mandate agreement to clients — certified by FSP\n3. FSP ACCEPTS RESPONSIBILITY for the representative's activities\n4. Be fit and proper as required by FAIS\n5. May work under supervision if not yet fully qualified\n6. If also a KI: meet BOTH sets of requirements", keyFact:"FSP is responsible for the representative's actions. Representatives act in the FSP's name.", color:"#047857" },
          { heading:"Representative Register", body:"Every FSP must maintain a register updated within 15 DAYS of any change.\n\nRegister must include:\n• ID number and personal details\n• Date of appointment\n• Categories/subcategories (Advice=A; Intermediary=B)\n• Qualifications and regulatory exams completed\n• Supervision status\n• Debarment information (if any)", keyFact:"Register sent to Registrar within 15 DAYS of any amendment. Always.", color:"#065f46" },
        ]
      },
      { id:"8.2", title:"Fit & Proper for Representatives", duration:"18 min",
        slides:[
          { heading:"Date of First Appointment", body:"'Date of first appointment' = the date when the person was FIRST DEPLOYED in a FAIS role at ANY FSP in the industry.\n\nNOT the current employer's appointment date.\n\nExample: Started at Company A in June 2006 (admin). Started as FAIS representative at Company B in September 2008. Date of first appointment = September 2008.", keyFact:"First FAIS role in the INDUSTRY — not just at the current employer!", color:"#065F46" },
          { heading:"Experience Requirements by Category", body:"Category IIA: 3 YEARS practical experience\nCategory III: 3 YEARS practical experience in Category III\nCategory IV: 1 YEAR practical experience\n\nExperience can be gained:\n• While under supervision\n• Within OR outside South Africa\n• In intermittent periods (within last 5 years)\n• Simultaneously in multiple subcategories", keyFact:"Experience can be gained simultaneously across subcategories = efficient pathway!", color:"#047857" },
          { heading:"5-Year Experience Lapsing Rule", body:"If a representative has NOT rendered financial services in a particular category for 5 CONSECUTIVE YEARS:\n→ The experience LAPSES\n→ Must be regained to meet fit and proper requirements\n\nThis ensures only actively practising individuals hold their experience status.", keyFact:"5 consecutive years of non-practice = lapsed experience. Must start again.", color:"#065f46" },
          { heading:"RE5 Exam — The Representative Exam", body:"RE5 (First-Level Regulatory Exam for Representatives):\n• COMPULSORY for ALL representatives\n• Must be completed within 2 YEARS of appointment (if under supervision)\n• Can be appointed WITHOUT having passed if working UNDER SUPERVISION\n\nCategory: Applies to all Category I, II, IIA, III, and IV representatives.", keyFact:"RE5 = The exam you are studying for RIGHT NOW. Must pass within 2 years of appointment.", color:"#064e3b" },
        ]
      },
      { id:"8.3", title:"Supervision & Debarment", duration:"20 min",
        slides:[
          { heading:"Maximum Supervision Period", body:"OVERALL MAXIMUM: 6 YEARS from date of appointment\n\nDirect Supervision (daily-to-weekly):\n• Subcategories 1.1-1.3: First 2 MONTHS\n• Subcategories 1.8-1.15 (Securities/Forex): First 4 MONTHS\n• Subcategories 1.17-1.18 (Deposits): First 6 WEEKS\n• Subcategory 1.19 (Friendly Society): First 2 WEEKS", keyFact:"6-year maximum total. Direct supervision periods vary by subcategory.", color:"#DC2626" },
          { heading:"Interruption Rule", body:"Significant interruption:\n• 8 CONSECUTIVE WEEKS or longer = significant interruption\n• Must compensate with ADDITIONAL supervision equal to the interruption period\n\nMultiple categories:\n• Can work under supervision in multiple categories simultaneously\n• Must meet requirements of the MOST ONEROUS category", keyFact:"8 consecutive weeks = adds equal time to supervision. Most onerous category prevails.", color:"#b91c1c" },
          { heading:"Debarment by FSP — When & How", body:"FSP MUST debar a representative who:\n• No longer complies with fit and proper requirements, OR\n• Contravened the Act in a MATERIAL manner\n\nProcess:\n1. Withdraw authority to act for FSP\n2. Remove from representative register\n3. Protect client interests + complete outstanding business\n4. Notify Registrar within 15 DAYS with reasons", keyFact:"15 days to notify Registrar after FSP-initiated debarment.", color:"#991b1b" },
          { heading:"Debarment by Registrar — Section 14A", body:"Registrar gives person 14 DAYS to respond before debarring.\nFSP must remove debarred rep from register within 5 DAYS of being informed by Registrar.\n\nReappointment requirements:\n• Min 12 MONTHS since debarment elapsed\n• All unconcluded business properly completed\n• All client complaints/legal proceedings concluded\n• All fit and proper requirements met", keyFact:"14 days response + 5 days to update register + 12 months min before reappointment.", color:"#7f1d1d" },
        ]
      },
    ],
    questions:[
      { q:"A person who provides only administrative services requiring NO judgment and NOT leading clients to financial product transactions:", opts:["Is a representative and must be registered","Is NOT a representative and need not be registered","Must work under supervision before classification","Is an associate subject to COI rules"], correct:1, exp:"Both exclusion criteria must apply: NO judgment required AND does NOT lead clients to specific transactions. If BOTH are met, the person is NOT a representative." },
      { q:"A representative appointed on 1 March 2020 working under supervision must complete RE5 no later than:", opts:["1 March 2021","1 March 2022","1 March 2023","1 March 2026"], correct:1, exp:"Representatives working under supervision must complete RE5 within 2 YEARS of appointment. For a representative appointed 1 March 2020, the deadline is 1 March 2022." },
      { q:"After the FAIS Registrar issues a debarment order, an FSP must remove the debarred representative from the register within:", opts:["2 days","5 days","10 days","15 days"], correct:1, exp:"Section 14A(3) requires FSPs to remove debarred representatives from the register within 5 DAYS of being informed by the Registrar. (Note: When FSP initiates debarment, they notify Registrar within 15 days.)" },
      { q:"An experience interruption of what period triggers additional supervision of equal length?", opts:["4 consecutive weeks","6 consecutive weeks","8 consecutive weeks","12 consecutive weeks"], correct:2, exp:"Board Notice 104 of 2008: Any significant interruption of 8 CONSECUTIVE WEEKS or longer must be compensated by an additional supervision period equal to the length of the interrupted period." },
      { q:"The MINIMUM period before a debarred representative can be considered for reappointment is:", opts:["6 months","12 months","24 months","36 months"], correct:1, exp:"At least 12 MONTHS since debarment must elapse before reappointment can be considered. Exception: if debarred for competency reasons and requirements are met within the period, may apply sooner." },
    ]
  },
];
