/**
 * AEROKRYPT - Research Records & Researcher Workspace Service
 * 
 * Manages experiment definitions, saved site evaluations, field research records,
 * multi-stage contribution workflows (Draft -> Submitted -> Under Review -> Approved -> Published),
 * and role-based permissions (Viewer vs. Principal Investigator).
 */

import { MISSION_OBJECTIVES } from '../data/missionObjectives.js'

export const SUBMISSION_STATUSES = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  REVISION_REQUESTED: 'REVISION_REQUESTED',
  APPROVED: 'APPROVED',
  PUBLISHED: 'PUBLISHED',
}

export const CONTRIBUTION_TYPES = {
  RESEARCH_RECORD: 'RESEARCH_RECORD',
  SITE_ASSESSMENT: 'SITE_ASSESSMENT',
  PEER_EVALUATION: 'PEER_EVALUATION',
}

export const PROTOTYPE_WORKFLOW_DISCLAIMER =
  'PROTOTYPE STORAGE NOTICE: Submissions are stored locally in browser localStorage for demonstration purposes. This is not secure multi-user storage, authenticated identity management, or formal journal peer review.'

const STORAGE_KEYS = {
  RECORDS: 'aerokrypt_research_records_v1',
  EXPERIMENTS: 'aerokrypt_experiments_v1',
  SUBMISSIONS: 'aerokrypt_submissions_v1',
  ROLE: 'aerokrypt_user_role_v1',
}

// In-memory fallbacks for node / SSR environments where localStorage is absent or restricted
let inMemoryRole = 'RESEARCHER'
let inMemoryRecords = null
let inMemoryExperiments = null
let inMemorySubmissions = null

// Initial seed benchmark records based on authentic literature and evaluation benchmarks
const INITIAL_SAVED_EVALUATIONS = [
  {
    id: 'eval-rec-001',
    title: 'Jezero Crater Delta vs. Atacama Hyper-Arid Basin Geomorphic Benchmark',
    targetBody: 'Mars',
    planetaryTerrainId: 'mars-jezero-delta',
    earthLocationId: 'atacama-yungay',
    experimentId: 'extremophile-astrobiology',
    author: 'Dr. C. P. McKay (NASA ARC / Astrobiology Inst.)',
    date: '2026-10-18',
    compositeSimilarity: 82,
    suitabilityLevel: 'HIGH_SUITABILITY',
    verifiedStatus: 'PEER_REVIEWED_BENCHMARK',
    status: SUBMISSION_STATUSES.PUBLISHED,
    summary:
      'High mineralogical and hyper-aridity alignment for perchlorate-tolerant extremophile biosignature preservation testing. Slope gradient 2.0° matches Jezero basin floor.',
    doiReference: '10.1089/153110703769016460',
    tags: ['Astrobiology', 'Perchlorates', 'Jezero Delta', 'Atacama'],
  },
  {
    id: 'eval-rec-002',
    title: 'Meridiani Planum Jarosite vs. Río Tinto Iron-Sulfate Precipitation',
    targetBody: 'Mars',
    planetaryTerrainId: 'mars-meridiani-planum',
    earthLocationId: 'rio-tinto-basin',
    experimentId: 'in-situ-spectroscopy',
    author: 'Dr. R. Amils & Dr. D. C. Fernández-Remolar (CAB / INTA)',
    date: '2026-10-25',
    compositeSimilarity: 88,
    suitabilityLevel: 'HIGH_SUITABILITY',
    verifiedStatus: 'PEER_REVIEWED_BENCHMARK',
    status: SUBMISSION_STATUSES.PUBLISHED,
    summary:
      'Premier terrestrial spectroscopic analogue for Martian jarosite and goethite Mössbauer spectral calibration, matching Opportunity APXS data.',
    doiReference: '10.1016/j.epsl.2005.09.043',
    tags: ['Spectroscopy', 'Jarosite', 'Meridiani', 'Río Tinto'],
  },
  {
    id: 'eval-rec-003',
    title: 'Marius Hills Lunar Skylight vs. Mauna Loa Pyroduct Ingress Feasibility',
    targetBody: 'Moon',
    planetaryTerrainId: 'moon-marius-hills-skylight',
    earthLocationId: 'kilauea-basalts',
    experimentId: 'lava-tube-exploration',
    author: 'Dr. D. S. S. Lim & Dr. B. R. Shiro (NASA BASALT / HI-SEAS)',
    date: '2026-11-02',
    compositeSimilarity: 76,
    suitabilityLevel: 'HIGH_SUITABILITY',
    verifiedStatus: 'PARTIALLY_SUPPORTED_CONOPS',
    status: SUBMISSION_STATUSES.PUBLISHED,
    summary:
      'Surface basalt flow and tube morphology match Lunar mare basalts. ConOps crew sampling validated; autonomous robotic pit descent remains under active development.',
    doiReference: '10.1016/j.pss.2021.105409',
    tags: ['Lava Tubes', 'Moon', 'Marius Hills', 'BASALT'],
  },
  {
    id: 'eval-rec-004',
    title: 'Phoenix Vastitas Borealis vs. McMurdo Dry Valleys Cryo-Ice Drilling',
    targetBody: 'Mars',
    planetaryTerrainId: 'mars-vastitas-borealis',
    earthLocationId: 'mcmurdo-dry-valleys',
    experimentId: 'subsurface-coring',
    author: 'Dr. J. L. Heldmann (NASA Ames / IceBite)',
    date: '2026-11-09',
    compositeSimilarity: 85,
    suitabilityLevel: 'HIGH_SUITABILITY',
    verifiedStatus: 'PEER_REVIEWED_BENCHMARK',
    status: SUBMISSION_STATUSES.PUBLISHED,
    summary:
      'Dry permafrost active layer over vapor-diffusion ice-cemented sandstone regolith closely replicates Phoenix lander Trench "Dodo-Goldilocks" permafrost physics.',
    doiReference: '10.1016/j.pss.2013.05.019',
    tags: ['Permafrost', 'Cryogenic Drilling', 'Phoenix', 'University Valley'],
  },
]

// Seed submissions demonstrating the contribution & review lifecycle
const INITIAL_SUBMISSIONS = [
  {
    id: 'sub-demo-001',
    type: CONTRIBUTION_TYPES.RESEARCH_RECORD,
    title: 'Autonomous Wheel Odometry Correction in Arctic Breccia (Devon Island)',
    researcherName: 'Dr. Pascal Lee',
    affiliation: 'Mars Institute / SETI / NASA HMP',
    studyLocation: 'Haughton Crater, Devon Island, Nunavut, Canada',
    targetBody: 'Mars',
    objective: 'Mitigate slip rates on loose dolomite ejecta fields during autonomous rover long-traverses.',
    methodology: 'Tri-axial wheel torque monitoring paired with downward optical visual odometry cameras.',
    findings: 'Visual odometry reduced dead-reckoning positional drift from 32% to 4.5% over 5.2 km traverses.',
    datasetReferences: 'MOLA 128 px/deg baseline; USGS Arctic DEM 2m grid.',
    doiLink: '10.1177/0278364911433135',
    supportingNotes: 'Field trials conducted during summer polar daylight window.',
    status: SUBMISSION_STATUSES.APPROVED,
    createdAt: '2026-11-04T09:00:00.000Z',
    updatedAt: '2026-11-06T14:30:00.000Z',
    submissionDate: '2026-11-04',
    reviewerName: 'Dr. G. Osinski (Western Univ.)',
    reviewerComments: 'Solid empirical slip telemetry. Recommended for publication in Public Discovery archive.',
    statusHistory: [
      {
        fromStatus: null,
        toStatus: SUBMISSION_STATUSES.DRAFT,
        timestamp: '2026-11-04T09:00:00.000Z',
        actor: 'Dr. Pascal Lee',
        note: 'Initial field trial draft saved in local workspace.',
      },
      {
        fromStatus: SUBMISSION_STATUSES.DRAFT,
        toStatus: SUBMISSION_STATUSES.SUBMITTED,
        timestamp: '2026-11-04T11:20:00.000Z',
        actor: 'Dr. Pascal Lee',
        note: 'Submitted for peer review queue.',
      },
      {
        fromStatus: SUBMISSION_STATUSES.SUBMITTED,
        toStatus: SUBMISSION_STATUSES.UNDER_REVIEW,
        timestamp: '2026-11-05T08:15:00.000Z',
        actor: 'Dr. G. Osinski (Western Univ.)',
        note: 'Assigned for visual odometry methodology evaluation.',
      },
      {
        fromStatus: SUBMISSION_STATUSES.UNDER_REVIEW,
        toStatus: SUBMISSION_STATUSES.APPROVED,
        timestamp: '2026-11-06T14:30:00.000Z',
        actor: 'Dr. G. Osinski (Western Univ.)',
        note: 'Solid empirical slip telemetry. Recommended for publication in Public Discovery archive.',
      },
    ],
    reviewComments: [
      {
        id: 'rc-001',
        reviewerName: 'Dr. G. Osinski',
        reviewerRole: 'Senior Planetary Geologist (Western Univ.)',
        comment: 'Solid empirical slip telemetry. Recommended for publication in Public Discovery archive.',
        date: '2026-11-06T14:30:00.000Z',
        action: SUBMISSION_STATUSES.APPROVED,
      },
    ],
  },
  {
    id: 'sub-demo-002',
    type: CONTRIBUTION_TYPES.SITE_ASSESSMENT,
    title: 'Subsurface Coring Feasibility in University Valley Dry Permafrost',
    analogueLocationId: 'mcmurdo-dry-valleys',
    targetBody: 'Mars',
    missionObjectiveId: 'subsurface-coring',
    parametersAssessed: 'Regolith shear strength, ice cementation depth (0.2m), core recovery intactness.',
    evidenceSources: 'Heldmann et al. (2013) PSS 85:53; Dickinson et al. (2011) Antarctic Science.',
    assessmentResults: 'HIGH_ALIGNMENT for Phoenix Trench stratigraphy; LOW_ALIGNMENT for Viking equatorial dust.',
    missingDataLimitations: 'Sub-meter surface boulder distribution uncataloged in valley center.',
    conclusion: 'University Valley is strictly verified for ice-bearing cryo-coring, not warm regolith sampling.',
    status: SUBMISSION_STATUSES.UNDER_REVIEW,
    createdAt: '2026-11-10T10:00:00.000Z',
    updatedAt: '2026-11-11T16:00:00.000Z',
    submissionDate: '2026-11-10',
    reviewerName: 'Peer Review Committee (AEROKRYPT)',
    reviewerComments: 'Evaluating moisture sublimation rate under 610 Pa Mars pressure discrepancy.',
    statusHistory: [
      {
        fromStatus: null,
        toStatus: SUBMISSION_STATUSES.DRAFT,
        timestamp: '2026-11-10T10:00:00.000Z',
        actor: 'Dr. Field Investigator',
        note: 'Draft site assessment created.',
      },
      {
        fromStatus: SUBMISSION_STATUSES.DRAFT,
        toStatus: SUBMISSION_STATUSES.SUBMITTED,
        timestamp: '2026-11-10T14:00:00.000Z',
        actor: 'Dr. Field Investigator',
        note: 'Submitted to evaluation pipeline.',
      },
      {
        fromStatus: SUBMISSION_STATUSES.SUBMITTED,
        toStatus: SUBMISSION_STATUSES.UNDER_REVIEW,
        timestamp: '2026-11-11T16:00:00.000Z',
        actor: 'Peer Review Committee (AEROKRYPT)',
        note: 'Evaluating moisture sublimation rate under 610 Pa Mars pressure discrepancy.',
      },
    ],
    reviewComments: [
      {
        id: 'rc-002',
        reviewerName: 'Peer Review Committee (AEROKRYPT)',
        reviewerRole: 'Cryogenic Permafrost Working Group',
        comment: 'Evaluating moisture sublimation rate under 610 Pa Mars pressure discrepancy.',
        date: '2026-11-11T16:00:00.000Z',
        action: SUBMISSION_STATUSES.UNDER_REVIEW,
      },
    ],
  },
  {
    id: 'sub-demo-003',
    type: CONTRIBUTION_TYPES.PEER_EVALUATION,
    title: 'Formal Methodological Review: Kīlauea Lava Tube Robotic Descent ConOps',
    evaluatedItemId: 'eval-rec-003',
    reviewerName: 'Dr. F. Sauro',
    reviewerRole: 'Planetary Speleology Expert (ESA CAVES / Univ. of Bologna)',
    evaluationCriteria: 'Structural roof stability, cave diameter scaling, tethered vs wireless comms.',
    scientificStrengths: 'Rigorous empirical crew EVA time-delay tracking under realistic NASA BASALT protocols.',
    methodologicalConcerns: 'Assumes manual crew rappel; robotic tetherless rover ingress requires autonomous LiDAR SLAM.',
    evidenceQuality: 'High (peer-reviewed in Planetary and Space Science 2021).',
    limitations: 'Earth gravity masks roof block collapse dynamics under 1/6th G lunar gravity.',
    recommendations: 'Include micro-gravity structural finite-element model before flight hardware qualification.',
    reviewerComments: 'Approved as terrestrial analogue ConOps baseline with explicit gravitational caveats.',
    status: SUBMISSION_STATUSES.PUBLISHED,
    createdAt: '2026-11-11T09:00:00.000Z',
    publishedAt: '2026-11-12T17:00:00.000Z',
    updatedAt: '2026-11-12T17:00:00.000Z',
    submissionDate: '2026-11-12',
    statusHistory: [
      {
        fromStatus: null,
        toStatus: SUBMISSION_STATUSES.DRAFT,
        timestamp: '2026-11-11T09:00:00.000Z',
        actor: 'Dr. F. Sauro',
        note: 'Draft evaluation initiated.',
      },
      {
        fromStatus: SUBMISSION_STATUSES.DRAFT,
        toStatus: SUBMISSION_STATUSES.SUBMITTED,
        timestamp: '2026-11-11T12:00:00.000Z',
        actor: 'Dr. F. Sauro',
        note: 'Submitted for editorial board review.',
      },
      {
        fromStatus: SUBMISSION_STATUSES.SUBMITTED,
        toStatus: SUBMISSION_STATUSES.APPROVED,
        timestamp: '2026-11-12T14:00:00.000Z',
        actor: 'Editorial Board (AEROKRYPT)',
        note: 'Approved as terrestrial analogue ConOps baseline with explicit gravitational caveats.',
      },
      {
        fromStatus: SUBMISSION_STATUSES.APPROVED,
        toStatus: SUBMISSION_STATUSES.PUBLISHED,
        timestamp: '2026-11-12T17:00:00.000Z',
        actor: 'Editorial Board (AEROKRYPT)',
        note: 'Published to Public Discovery archive.',
      },
    ],
    reviewComments: [
      {
        id: 'rc-003',
        reviewerName: 'Editorial Board (AEROKRYPT)',
        reviewerRole: 'Analogue Missions Editor',
        comment: 'Approved as terrestrial analogue ConOps baseline with explicit gravitational caveats.',
        date: '2026-11-12T14:00:00.000Z',
        action: SUBMISSION_STATUSES.APPROVED,
      },
    ],
  },
  {
    id: 'sub-demo-004',
    type: CONTRIBUTION_TYPES.RESEARCH_RECORD,
    title: 'In-situ Raman Spectroscopy Benchmarking in Svalbard Basalts (Draft)',
    researcherName: 'Dr. Jane Planetary',
    affiliation: 'Planetary Science Institute / AEROKRYPT',
    studyLocation: 'Bockfjorden, Svalbard, Norway',
    targetBody: 'Mars',
    objective: 'Initial calibration of deep-UV Raman spectroscopy on primitive olivine basalts.',
    methodology: 'Preliminary bench tests with 248 nm laser excitation on peridotite nodules.',
    findings: 'Draft protocol compiled; awaiting summer field campaign data verification.',
    datasetReferences: 'MOLA 128 px/deg baseline; USGS 3DEP.',
    doiLink: '10.1016/S0012-821X(02)00998-6',
    supportingNotes: 'Initial private draft stored in local researcher workspace.',
    status: SUBMISSION_STATUSES.DRAFT,
    createdAt: '2026-11-13T08:00:00.000Z',
    updatedAt: '2026-11-13T08:00:00.000Z',
    submissionDate: '2026-11-13',
    statusHistory: [
      {
        fromStatus: null,
        toStatus: SUBMISSION_STATUSES.DRAFT,
        timestamp: '2026-11-13T08:00:00.000Z',
        actor: 'Dr. Jane Planetary',
        note: 'Initial draft created in researcher workspace.',
      },
    ],
    reviewComments: [],
  },
]

/**
 * Loads all research records (combining seed data with user-saved records)
 */
export function getResearchRecords() {
  if (inMemoryRecords) {
    return inMemoryRecords
  }
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.RECORDS)
      if (stored) {
        const parsed = JSON.parse(stored)
        const existingIds = new Set(parsed.map((r) => r.id))
        const combined = [
          ...parsed,
          ...INITIAL_SAVED_EVALUATIONS.filter((r) => !existingIds.has(r.id)),
        ]
        inMemoryRecords = combined
        return combined
      }
    }
  } catch (err) {
    console.warn('Could not read from localStorage, using initial dataset:', err)
  }
  inMemoryRecords = [...INITIAL_SAVED_EVALUATIONS]
  return inMemoryRecords
}

/**
 * Saves a new evaluation result to Research Records
 */
export function saveEvaluationRecord(recordData) {
  const currentRecords = getResearchRecords()
  const newRecord = {
    id: `eval-rec-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    verifiedStatus: 'FIELD_EVALUATION_REPORT',
    status: SUBMISSION_STATUSES.SUBMITTED,
    ...recordData,
  }

  const updated = [newRecord, ...currentRecords]
  inMemoryRecords = updated
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(updated))
    }
  } catch (err) {
    console.warn('Could not persist to localStorage:', err)
  }
  return newRecord
}

/**
 * Deletes a research record
 */
export function deleteResearchRecord(recordId) {
  const currentRecords = getResearchRecords()
  const updated = currentRecords.filter((r) => r.id !== recordId)
  inMemoryRecords = updated
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(updated))
    }
  } catch (err) {
    console.warn('Could not persist to localStorage:', err)
  }
  return updated
}

/**
 * Loads all experiments (mission objectives + custom added experiments)
 */
export function getAllExperiments() {
  if (inMemoryExperiments) {
    return inMemoryExperiments
  }
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.EXPERIMENTS)
      if (stored) {
        const parsed = JSON.parse(stored)
        const existingIds = new Set(parsed.map((e) => e.id))
        const combined = [...MISSION_OBJECTIVES, ...parsed.filter((e) => !existingIds.has(e.id))]
        inMemoryExperiments = combined
        return combined
      }
    }
  } catch (err) {
    console.warn('Could not read experiments from localStorage:', err)
  }
  inMemoryExperiments = [...MISSION_OBJECTIVES]
  return inMemoryExperiments
}

export const getExperiments = getAllExperiments

/**
 * Adds a new experiment definition to the database (Researcher action)
 */
export function addCustomExperiment(experimentData) {
  const customId = `custom-exp-${Date.now()}`
  const newExp = {
    id: customId,
    ...experimentData,
    isCustom: true,
  }

  const current = getAllExperiments()
  inMemoryExperiments = [...current, newExp]

  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.EXPERIMENTS)
      const list = stored ? JSON.parse(stored) : []
      list.push(newExp)
      localStorage.setItem(STORAGE_KEYS.EXPERIMENTS, JSON.stringify(list))
    }
  } catch (err) {
    console.warn('Could not save custom experiment:', err)
  }
  return newExp
}

/* ==========================================================================
   SUBMISSIONS & REVIEW WORKFLOW (Section 4 & 5)
   ========================================================================== */

/**
 * Retrieves all submissions (combining initial demo seeds with local submissions)
 */
export function getAllSubmissions() {
  if (inMemorySubmissions) {
    return inMemorySubmissions
  }
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)
      if (stored) {
        const parsed = JSON.parse(stored)
        const existingIds = new Set(parsed.map((s) => s.id))
        const combined = [
          ...parsed,
          ...INITIAL_SUBMISSIONS.filter((s) => !existingIds.has(s.id)),
        ]
        inMemorySubmissions = combined
        return combined
      }
    }
  } catch (err) {
    console.warn('Could not read submissions from localStorage:', err)
  }
  inMemorySubmissions = [...INITIAL_SUBMISSIONS]
  return inMemorySubmissions
}

/**
 * Saves a new or edited contribution as a DRAFT (private to researcher workspace)
 */
export function saveDraftSubmission(submissionData) {
  const current = getAllSubmissions()
  const isExisting = Boolean(submissionData.id)
  const existing = isExisting ? current.find((i) => i.id === submissionData.id) : null
  const now = new Date().toISOString()
  const nowShort = now.split('T')[0]

  const historyEntry = {
    fromStatus: existing ? existing.status : null,
    toStatus: SUBMISSION_STATUSES.DRAFT,
    timestamp: now,
    actor: submissionData.researcherName || existing?.researcherName || 'Researcher',
    note: isExisting ? 'Draft updated in workspace' : 'Draft created in workspace',
  }

  const itemToSave = {
    id: submissionData.id || `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: existing?.createdAt || submissionData.createdAt || now,
    updatedAt: now,
    submissionDate: submissionData.submissionDate || existing?.submissionDate || nowShort,
    ...existing,
    ...submissionData,
    status: SUBMISSION_STATUSES.DRAFT,
    statusHistory: existing?.statusHistory ? [...existing.statusHistory, historyEntry] : [historyEntry],
    reviewComments: existing?.reviewComments || [],
  }

  let updated = []
  if (isExisting) {
    updated = current.map((item) => (item.id === itemToSave.id ? itemToSave : item))
  } else {
    updated = [itemToSave, ...current]
  }

  inMemorySubmissions = updated
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updated))
    }
  } catch (err) {
    console.warn('Could not persist draft submission:', err)
  }
  return itemToSave
}

/**
 * Submits a draft for review (transitions status to SUBMITTED)
 */
export function submitForReview(submissionId, actorName = null) {
  const current = getAllSubmissions()
  const now = new Date().toISOString()
  const nowShort = now.split('T')[0]

  const updated = current.map((item) => {
    if (item.id === submissionId) {
      const historyEntry = {
        fromStatus: item.status,
        toStatus: SUBMISSION_STATUSES.SUBMITTED,
        timestamp: now,
        actor: actorName || item.researcherName || 'Researcher',
        note: 'Submitted for peer review queue',
      }
      return {
        ...item,
        status: SUBMISSION_STATUSES.SUBMITTED,
        submittedAt: nowShort,
        updatedAt: now,
        statusHistory: item.statusHistory ? [...item.statusHistory, historyEntry] : [historyEntry],
      }
    }
    return item
  })

  inMemorySubmissions = updated
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updated))
    }
  } catch (err) {
    console.warn('Could not persist submitted status:', err)
  }
  return updated.find((i) => i.id === submissionId)
}

/**
 * Reviewer inspection: transition status to UNDER_REVIEW, REVISION_REQUESTED, or APPROVED
 */
export function updateSubmissionReview(submissionId, { status, reviewerComments, reviewerName, reviewerRole }) {
  const current = getAllSubmissions()
  const now = new Date().toISOString()
  const nowShort = now.split('T')[0]

  const updated = current.map((item) => {
    if (item.id === submissionId) {
      const commentObj = reviewerComments
        ? [
            {
              id: `rc-${Date.now()}`,
              reviewerName: reviewerName || item.reviewerName || 'Peer Reviewer',
              reviewerRole: reviewerRole || 'Expert Reviewer',
              comment: reviewerComments,
              date: now,
              action: status,
            },
          ]
        : []

      const historyEntry = {
        fromStatus: item.status,
        toStatus: status,
        timestamp: now,
        actor: reviewerName || item.reviewerName || 'Peer Reviewer',
        note: reviewerComments || `Transitioned status from ${item.status} to ${status}`,
      }

      return {
        ...item,
        status,
        reviewerComments: reviewerComments || item.reviewerComments,
        reviewerName: reviewerName || item.reviewerName,
        reviewedAt: nowShort,
        updatedAt: now,
        reviewComments: item.reviewComments ? [...item.reviewComments, ...commentObj] : commentObj,
        statusHistory: item.statusHistory ? [...item.statusHistory, historyEntry] : [historyEntry],
      }
    }
    return item
  })

  inMemorySubmissions = updated
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updated))
    }
  } catch (err) {
    console.warn('Could not persist review update:', err)
  }
  return updated.find((i) => i.id === submissionId)
}

/**
 * Publishes an approved submission to Public Discovery (transitions status to PUBLISHED)
 */
export function publishSubmission(submissionId, publisherName = null) {
  const current = getAllSubmissions()
  const target = current.find((i) => i.id === submissionId)
  if (!target || target.status !== SUBMISSION_STATUSES.APPROVED) {
    throw new Error('Only APPROVED submissions can be published to Public Discovery.')
  }

  const now = new Date().toISOString()
  const nowShort = now.split('T')[0]

  const updated = current.map((item) => {
    if (item.id === submissionId) {
      const historyEntry = {
        fromStatus: SUBMISSION_STATUSES.APPROVED,
        toStatus: SUBMISSION_STATUSES.PUBLISHED,
        timestamp: now,
        actor: publisherName || 'Editorial Coordinator',
        note: 'Published to Public Discovery archive',
      }
      return {
        ...item,
        status: SUBMISSION_STATUSES.PUBLISHED,
        publishedAt: nowShort,
        updatedAt: now,
        statusHistory: item.statusHistory ? [...item.statusHistory, historyEntry] : [historyEntry],
      }
    }
    return item
  })

  inMemorySubmissions = updated
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updated))
    }
  } catch (err) {
    console.warn('Could not persist publish status:', err)
  }
  return updated.find((i) => i.id === submissionId)
}

/**
 * Returns strictly PUBLISHED items for public viewers (ensures drafts & under-review items stay private)
 */
export function getPublicPublishedContributions() {
  const allSubmissions = getAllSubmissions()
  return allSubmissions.filter((s) => s.status === SUBMISSION_STATUSES.PUBLISHED)
}

/**
 * Returns strictly DRAFT items for private researcher workspace
 */
export function getDraftSubmissions() {
  const allSubmissions = getAllSubmissions()
  return allSubmissions.filter((s) => s.status === SUBMISSION_STATUSES.DRAFT)
}

/**
 * Returns items in the review queue (SUBMITTED, UNDER_REVIEW, REVISION_REQUESTED, APPROVED)
 */
export function getReviewQueueSubmissions() {
  const all = getAllSubmissions()
  return all.filter((s) => s.status !== SUBMISSION_STATUSES.DRAFT)
}

/**
 * Deletes a submission from the workspace
 */
export function deleteSubmission(submissionId) {
  const current = getAllSubmissions()
  const updated = current.filter((s) => s.id !== submissionId)
  inMemorySubmissions = updated
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updated))
    }
  } catch (err) {
    console.warn('Could not persist delete submission:', err)
  }
  return updated
}

/* ==========================================================================
   ROLE AND UTILITIES
   ========================================================================== */

/**
 * Get current user role: 'VIEWER' or 'RESEARCHER'
 */
export function getCurrentRole() {
  try {
    if (typeof localStorage !== 'undefined') {
      const val = localStorage.getItem(STORAGE_KEYS.ROLE)
      if (val) return val
    }
  } catch {
    // fallback
  }
  return inMemoryRole
}

/**
 * Set user role
 */
export function setCurrentRole(role) {
  inMemoryRole = role
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ROLE, role)
    }
  } catch {
    // ignore
  }
}

/**
 * Export research report as downloadable JSON or Markdown text
 */
export function exportReportAsFile(record, format = 'json') {
  let content = ''
  let filename = ''
  let mimeType = 'text/plain'

  if (format === 'json') {
    content = JSON.stringify(record, null, 2)
    filename = `${record.id || 'aerokrypt-record'}.json`
    mimeType = 'application/json'
  } else {
    content = `# AEROKRYPT RESEARCH RECORD: ${record.title}\n\n`
    content += `**Target Body:** ${record.targetBody || 'N/A'}\n`
    content += `**Author:** ${record.author || record.researcherName || 'AEROKRYPT Investigator'}\n`
    content += `**Date:** ${record.date || record.submissionDate || 'N/A'}\n`
    content += `**Status:** ${record.status || record.verifiedStatus || 'VERIFIED'}\n`
    content += `**DOI Reference:** ${record.doiReference || record.doiLink || 'N/A'}\n\n`
    content += `## Summary / Abstract\n${record.summary || record.findings || 'No summary available.'}\n\n`
    content += `*Generated by AEROKRYPT Planetary Analogue Research Platform*\n`
    filename = `${record.id || 'aerokrypt-record'}.md`
    mimeType = 'text/markdown'
  }

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
