import test from 'node:test'
import assert from 'node:assert/strict'
import { BASEMAP_DEFINITIONS, OPERATIONAL_MAP_SERVICES, DOCUMENTED_DEM_SPECIFICATIONS } from '../src/data/mapLayerData.js'
import { PEER_REVIEWED_RESEARCH_LIBRARY } from '../src/data/researchLibraryData.js'
import { EDUCATIONAL_MODULES, CASE_STUDIES_SIMPLIFIED, PLANETARY_GLOSSARY } from '../src/data/learningCenterData.js'
import {
  getAllSubmissions,
  getDraftSubmissions,
  getReviewQueueSubmissions,
  saveDraftSubmission,
  submitForReview,
  updateSubmissionReview,
  publishSubmission,
  getPublicPublishedContributions,
  deleteSubmission,
  SUBMISSION_STATUSES,
  CONTRIBUTION_TYPES,
  PROTOTYPE_WORKFLOW_DISCLAIMER,
} from '../src/services/researchRecordService.js'

test('SECTION 1: Maps & Planetary Data Explorer Layer Auditing & Classification', () => {
  const layers = Object.values(BASEMAP_DEFINITIONS)
  assert.ok(layers.length >= 10, 'Catalog contains at least 10 documented planetary and terrestrial layers')

  // Visual Map Services vs. Metadata-Only Specifications
  const mapServices = layers.filter((l) => l.type === 'MAP_SERVICE')
  const metadataOnly = layers.filter((l) => l.type === 'METADATA_ONLY')

  assert.equal(mapServices.length, 5, 'Operational visual map services count is exactly 5 (3 Earth, 1 Mars MOLA, 1 Moon WAC)')
  assert.equal(metadataOnly.length, 6, 'Documented DEM specifications count is exactly 6 (USGS 3DEP, Copernicus, HRSC, CRISM, LOLA, LROC)')
  assert.equal(OPERATIONAL_MAP_SERVICES.length, 5, 'Exported OPERATIONAL_MAP_SERVICES array matches operational visual services')
  assert.equal(DOCUMENTED_DEM_SPECIFICATIONS.length, 6, 'Exported DOCUMENTED_DEM_SPECIFICATIONS matches metadata-only specifications')

  // Check Mars MOLA CRS definition
  const marsMola = BASEMAP_DEFINITIONS.marsMola
  assert.ok(marsMola, 'Mars MOLA layer is defined')
  assert.ok(
    marsMola.crs.includes('Gravitational Equipotential Areoid') &&
    marsMola.crs.includes('12,637,273') &&
    marsMola.crs.includes('distinct from'),
    'MOLA CRS explicitly distinguishes gravitational equipotential areoid (U₀ = 12,637,273 m²/s²) from 610 Pa Viking pressure datum'
  )

  for (const ms of mapServices) {
    assert.ok(ms.url && ms.url.startsWith('http'), `Visual service [${ms.id}] has valid tile URL`)
    assert.ok(ms.crs, `Service [${ms.id}] specifies coordinate reference system`)
  }

  for (const mo of metadataOnly) {
    assert.equal(mo.url, undefined, `Metadata specification [${mo.id}] must not claim active tile URL`)
    assert.ok(mo.description, `Metadata specification [${mo.id}] has transparent disclosure description`)
  }
})

test('SECTION 2: Peer-Reviewed Research Library Integrity & DOI Verification', () => {
  assert.ok(PEER_REVIEWED_RESEARCH_LIBRARY.length >= 10, 'Research library contains verified peer-reviewed publications')

  // 1. Verify Osinski et al. (2005)
  const osinskiPaper = PEER_REVIEWED_RESEARCH_LIBRARY.find((p) => p.id === 'res-osinski-2005')
  assert.ok(osinskiPaper, 'Osinski et al. (2005) paper is present')
  assert.equal(osinskiPaper.doi, '10.1111/j.1945-5100.2005.tb00147.x', 'Osinski et al. has corrected DOI 10.1111/j.1945-5100.2005.tb00147.x')
  assert.ok(osinskiPaper.title.includes('Impactites of the Haughton impact structure'), 'Osinski title is exact')
  assert.ok(osinskiPaper.authors.includes('Osinski, G. R.'), 'Osinski author list is accurate')

  // 2. Verify Amils et al. (2007)
  const amilsPaper = PEER_REVIEWED_RESEARCH_LIBRARY.find((p) => p.id === 'res-amils-2007')
  assert.ok(amilsPaper, 'Amils et al. (2007) paper is present')
  assert.equal(amilsPaper.doi, '10.1016/j.pss.2006.02.006', 'Amils et al. (2007) has DOI 10.1016/j.pss.2006.02.006')
  assert.ok(amilsPaper.title.includes('Extreme environments as Mars terrestrial analogs: The Rio Tinto case'), 'Amils title is exact')
  assert.ok(amilsPaper.journal.includes('Planetary and Space Science'), 'Amils journal is Planetary and Space Science')

  // 3. Verify Fernández-Remolar et al. (2005) is a distinct separate publication
  const fernandezPaper = PEER_REVIEWED_RESEARCH_LIBRARY.find((p) => p.id === 'res-fernandez-remolar-2005')
  assert.ok(fernandezPaper, 'Fernández-Remolar et al. (2005) paper is present as a distinct publication')
  assert.equal(fernandezPaper.doi, '10.1016/j.epsl.2005.09.043', 'Fernández-Remolar has DOI 10.1016/j.epsl.2005.09.043')
  assert.ok(fernandezPaper.title.includes('The Río Tinto Basin, Spain: Mineralogy'), 'Fernández-Remolar title is exact')
  assert.ok(fernandezPaper.journal.includes('Earth and Planetary Science Letters'), 'Fernández-Remolar journal is EPSL')
  assert.notEqual(amilsPaper.id, fernandezPaper.id, 'Amils 2007 and Fernández-Remolar 2005 are not merged')

  // 4. Verify Furgale et al. (2012)
  const furgalePaper = PEER_REVIEWED_RESEARCH_LIBRARY.find((p) => p.doi === '10.1177/0278364911433135')
  assert.ok(furgalePaper, 'Devon Island rover navigation dataset paper is present')
  assert.ok(furgalePaper.title.includes('The Devon Island rover navigation dataset'), 'Devon Island rover dataset title is exact')

  // 5. Verify Treiman et al. (2002)
  const treimanPaper = PEER_REVIEWED_RESEARCH_LIBRARY.find((p) => p.id === 'res-treiman-2002')
  assert.ok(treimanPaper, 'Treiman et al. (2002) paper is present')
  assert.equal(treimanPaper.doi, '10.1016/S0012-821X(02)00998-6', 'Treiman et al. has valid EPSL DOI')
  assert.ok(treimanPaper.title.includes('Hydrothermal origin for carbonate globules'), 'Treiman title is exact')

  // 6. Verify Heldmann et al. (2013)
  const heldmannPaper = PEER_REVIEWED_RESEARCH_LIBRARY.find((p) => p.id === 'res-heldmann-2013')
  assert.ok(heldmannPaper, 'Heldmann et al. (2013) paper is present')
  assert.equal(heldmannPaper.doi, '10.1016/j.pss.2013.05.019', 'Heldmann et al. has DOI 10.1016/j.pss.2013.05.019')
  assert.ok(heldmannPaper.title.includes('The high elevation Dry Valleys in Antarctica'), 'Heldmann title is exact')

  // 7. Verify Shiro et al. (2022)
  const shiroPaper = PEER_REVIEWED_RESEARCH_LIBRARY.find((p) => p.id === 'res-shiro-2022')
  assert.ok(shiroPaper, 'Shiro et al. (2022) paper is present')
  assert.equal(shiroPaper.doi, '10.1016/j.pss.2021.105409', 'Shiro et al. has DOI 10.1016/j.pss.2021.105409')
  assert.ok(shiroPaper.title.includes('HI-SEAS planetary analog mission simulations'), 'Shiro title is exact')

  // Check all papers have full metadata
  for (const paper of PEER_REVIEWED_RESEARCH_LIBRARY) {
    assert.ok(paper.title, `Paper [${paper.id}] has title`)
    assert.ok(paper.authors, `Paper [${paper.id}] has authors`)
    assert.ok(paper.year >= 1990, `Paper [${paper.id}] has valid year`)
    assert.ok(paper.doi, `Paper [${paper.id}] has valid DOI`)
    assert.ok(paper.originalUrl.startsWith('http'), `Paper [${paper.id}] has resolvable URL`)
    assert.ok(paper.objective, `Paper [${paper.id}] defines research objective`)
    assert.ok(paper.methods, `Paper [${paper.id}] defines methods`)
    assert.ok(paper.keyFindings, `Paper [${paper.id}] documents key findings`)
    assert.ok(paper.limitations, `Paper [${paper.id}] explicitly discloses data limitations`)
    assert.ok(paper.abstract, `Paper [${paper.id}] includes abstract`)
  }
})

test('SECTION 3: Student & Public Learning Centre Accessibility & Case Study Verification', () => {
  assert.equal(EDUCATIONAL_MODULES.length, 4, 'Learning Centre contains 4 core educational modules')
  assert.equal(CASE_STUDIES_SIMPLIFIED.length, 2, 'Contains 2 simplified case studies')
  assert.ok(PLANETARY_GLOSSARY.length >= 7, 'Glossary contains key planetary definitions (Areoid, Regolith, etc.)')

  // Check Case Studies do NOT claim flight rovers operated on Earth
  for (const cs of CASE_STUDIES_SIMPLIFIED) {
    assert.ok(cs.title, `Case study [${cs.id}] has title`)
    assert.ok(cs.theStory, `Case study [${cs.id}] has story`)
    assert.ok(
      !cs.theStory.includes('Perseverance operated in Atacama') &&
      !cs.theStory.includes('Curiosity drove on Devon Island'),
      `Case study [${cs.id}] must not describe flight rover as physically operating at analogue site`
    )
  }

  // Check specific Yungay GPR/EMI case study
  const yungayCase = CASE_STUDIES_SIMPLIFIED.find((cs) => cs.id === 'case-yungay-subsurface-radar')
  assert.ok(yungayCase, 'Case study for Yungay GPR and EMI field surveys is present')
  assert.ok(yungayCase.theStory.includes('ground-penetrating radar'), 'Yungay case discusses GPR methodology')

  // Check specific Haughton rover testbed case study
  const haughtonCase = CASE_STUDIES_SIMPLIFIED.find((cs) => cs.id === 'case-haughton-rover-testbed')
  assert.ok(haughtonCase, 'Case study for Haughton autonomous rover testbed is present')
  assert.ok(haughtonCase.theStory.includes('testbed') || haughtonCase.theStory.includes('prototype'), 'Haughton case clarifies prototype/testbed trials')

  // Verify Areoid definition in glossary distinguishes gravitational equipotential from pressure
  const areoid = PLANETARY_GLOSSARY.find((g) => g.term === 'Areoid')
  assert.ok(areoid, 'Glossary defines Areoid')
  assert.ok(
    areoid.definition.includes('gravitational equipotential') &&
    areoid.definition.includes('12,637,273') &&
    areoid.definition.includes('distinct from'),
    'Glossary defines Areoid as gravitational equipotential datum distinct from 610 Pa pressure surface'
  )
})

test('SECTION 4: Research Workflow Lifecycle, Draft Separation, Audit History, and Review Comments', () => {
  // Verify explicit prototype workflow disclaimer
  assert.ok(PROTOTYPE_WORKFLOW_DISCLAIMER.includes('PROTOTYPE STORAGE NOTICE'), 'Disclaimer explicitly flags prototype storage')
  assert.ok(PROTOTYPE_WORKFLOW_DISCLAIMER.includes('localStorage'), 'Disclaimer specifies browser localStorage')

  // Verify drafts are partitioned
  const drafts = getDraftSubmissions()
  const reviewQueue = getReviewQueueSubmissions()
  const published = getPublicPublishedContributions()

  assert.ok(drafts.length >= 1, 'Initial seeds contain at least 1 private draft')
  assert.ok(reviewQueue.length >= 1, 'Initial seeds contain active review queue items')
  assert.ok(published.length >= 1, 'Initial seeds contain at least 1 published public record')

  for (const d of drafts) {
    assert.equal(d.status, SUBMISSION_STATUSES.DRAFT, `Draft [${d.id}] has DRAFT status`)
  }

  for (const q of reviewQueue) {
    assert.notEqual(q.status, SUBMISSION_STATUSES.DRAFT, `Review queue item [${q.id}] must not be DRAFT`)
  }

  for (const p of published) {
    assert.equal(p.status, SUBMISSION_STATUSES.PUBLISHED, `Published item [${p.id}] must have PUBLISHED status`)
  }

  // Lifecycle Test: Create Draft -> Submit -> Review -> Approve -> Publish
  // 1. Create Draft
  const testDraft = saveDraftSubmission({
    type: CONTRIBUTION_TYPES.RESEARCH_RECORD,
    title: 'Audit Lifecycle Test: Atacama Perchlorate Survey',
    researcherName: 'Dr. Test Investigator',
    affiliation: 'Planetary Testing Institute',
    targetBody: 'Mars',
    objective: 'Validate complete status audit history and comment logging.',
  })

  assert.equal(testDraft.status, SUBMISSION_STATUSES.DRAFT, 'New draft initializes with DRAFT status')
  assert.ok(testDraft.createdAt, 'New draft has createdAt timestamp')
  assert.ok(testDraft.updatedAt, 'New draft has updatedAt timestamp')
  assert.ok(Array.isArray(testDraft.statusHistory), 'New draft initializes statusHistory array')
  assert.ok(testDraft.statusHistory.length >= 1, 'Draft statusHistory logs initial creation')

  // Check Draft Privacy from Public Discovery
  assert.equal(
    getPublicPublishedContributions().some((p) => p.id === testDraft.id),
    false,
    'Private DRAFT must never be visible in public published archive'
  )

  // 2. Submit for Review
  const submitted = submitForReview(testDraft.id, 'Dr. Test Investigator')
  assert.equal(submitted.status, SUBMISSION_STATUSES.SUBMITTED, 'Transitions to SUBMITTED')
  assert.ok(
    submitted.statusHistory.some((h) => h.toStatus === SUBMISSION_STATUSES.SUBMITTED),
    'Submission transition is logged in statusHistory'
  )

  // Check Submitted item is still private from Public Discovery
  assert.equal(
    getPublicPublishedContributions().some((p) => p.id === testDraft.id),
    false,
    'SUBMITTED manuscript remains private from public archive'
  )

  // 3. Reviewer marks Under Review
  const underReview = updateSubmissionReview(testDraft.id, {
    status: SUBMISSION_STATUSES.UNDER_REVIEW,
    reviewerComments: 'Inspecting sensor noise baseline and perchlorate extraction telemetry.',
    reviewerName: 'Dr. Senior Reviewer',
    reviewerRole: 'Astrobiology Specialist',
  })
  assert.equal(underReview.status, SUBMISSION_STATUSES.UNDER_REVIEW, 'Transitions to UNDER_REVIEW')
  assert.ok(underReview.reviewComments.length >= 1, 'Review comment is appended to reviewComments array')
  assert.equal(underReview.reviewComments[0].reviewerName, 'Dr. Senior Reviewer', 'Review comment records reviewer identity')

  // 4. Reviewer Approves
  const approved = updateSubmissionReview(testDraft.id, {
    status: SUBMISSION_STATUSES.APPROVED,
    reviewerComments: 'Extraction telemetry verified. Approved for public dissemination.',
    reviewerName: 'Dr. Senior Reviewer',
    reviewerRole: 'Astrobiology Specialist',
  })
  assert.equal(approved.status, SUBMISSION_STATUSES.APPROVED, 'Transitions to APPROVED')
  assert.equal(approved.reviewComments.length, 2, 'Second review comment is appended')
  assert.ok(
    approved.statusHistory.some((h) => h.toStatus === SUBMISSION_STATUSES.APPROVED),
    'Approval is logged in statusHistory'
  )

  // Check APPROVED but not yet published item is STILL private from public archive
  assert.equal(
    getPublicPublishedContributions().some((p) => p.id === testDraft.id),
    false,
    'APPROVED item must not appear in public archive until explicitly published'
  )

  // 5. Attempting to publish an unapproved item throws an error
  const unapprovedDraft = saveDraftSubmission({
    type: CONTRIBUTION_TYPES.RESEARCH_RECORD,
    title: 'Unapproved Draft Attempt',
  })
  assert.throws(
    () => publishSubmission(unapprovedDraft.id),
    /Only APPROVED submissions can be published/,
    'Publishing non-APPROVED submission must throw validation error'
  )
  deleteSubmission(unapprovedDraft.id)

  // 6. Publish to Public Discovery
  const publishedItem = publishSubmission(testDraft.id, 'Editorial Board')
  assert.equal(publishedItem.status, SUBMISSION_STATUSES.PUBLISHED, 'Transitions to PUBLISHED')
  assert.ok(publishedItem.publishedAt, 'Published item records publishedAt timestamp')
  assert.ok(
    publishedItem.statusHistory.some((h) => h.toStatus === SUBMISSION_STATUSES.PUBLISHED),
    'Publish event is logged in statusHistory'
  )

  // Verify PUBLISHED item is now visible in the Public Discovery archive
  assert.ok(
    getPublicPublishedContributions().some((p) => p.id === testDraft.id),
    'PUBLISHED item is now visible in the Public Discovery archive'
  )

  // Clean up test submission
  deleteSubmission(testDraft.id)
  assert.equal(
    getAllSubmissions().some((s) => s.id === testDraft.id),
    false,
    'Test submission cleanly deleted'
  )
})

test('SECTION 5: Expanded Earth Analogue Location Database & Multi-Body Classification Verification', async () => {
  const { ANALOGUE_LOCATIONS } = await import('../src/data/locationsData.js')
  const { matchLocations } = await import('../src/services/locationMatcher.js')

  // 1. Total Curated Locations Count
  assert.equal(ANALOGUE_LOCATIONS.length, 20, 'Curated Earth Analogue database contains exactly 20 locations')

  // 2. Zero Duplicates
  const ids = ANALOGUE_LOCATIONS.map((l) => l.id)
  const names = ANALOGUE_LOCATIONS.map((l) => l.name)
  assert.equal(new Set(ids).size, 20, 'Zero duplicate location IDs across the 20 sites')
  assert.equal(new Set(names).size, 20, 'Zero duplicate location names across the 20 sites')

  // 3. Schema Completeness for All 20 Locations
  for (const loc of ANALOGUE_LOCATIONS) {
    assert.ok(
      loc.locationCategory === 'NATURAL_SITE' || loc.locationCategory === 'RESEARCH_FACILITY',
      `Site [${loc.id}] has valid locationCategory ('NATURAL_SITE' or 'RESEARCH_FACILITY')`
    )
    assert.ok(
      loc.analogueRelevance === 'MARS' || loc.analogueRelevance === 'MOON' || loc.analogueRelevance === 'BOTH',
      `Site [${loc.id}] has valid analogueRelevance ('MARS', 'MOON', or 'BOTH')`
    )
    assert.ok(
      loc.verificationStatus === 'VERIFIED' || loc.verificationStatus === 'PARTIALLY_VERIFIED' || loc.verificationStatus === 'UNVERIFIED',
      `Site [${loc.id}] has valid verificationStatus`
    )
    assert.ok(
      loc.userSuppliedCoordinates &&
      typeof loc.userSuppliedCoordinates.latitude === 'number' &&
      typeof loc.userSuppliedCoordinates.longitude === 'number',
      `Site [${loc.id}] preserves userSuppliedCoordinates { latitude, longitude }`
    )
  }

  // 4. Research Facilities vs Natural Sites Classification
  const facilities = ANALOGUE_LOCATIONS.filter((l) => l.locationCategory === 'RESEARCH_FACILITY')
  const naturalSites = ANALOGUE_LOCATIONS.filter((l) => l.locationCategory === 'NATURAL_SITE')
  assert.equal(facilities.length, 4, 'Exactly 4 sites classified as RESEARCH_FACILITY (MDRS, HI-SEAS, LUNA, Cinder Lake)')
  assert.equal(naturalSites.length, 16, 'Exactly 16 sites classified as NATURAL_SITE')

  const facilityIds = facilities.map((f) => f.id).sort()
  assert.deepEqual(
    facilityIds,
    ['cinder-lake-crater-field', 'luna-facility-cologne', 'mauna-loa-hi-seas', 'san-rafael-mdrs'].sort(),
    'Specific facilities match documented human-built/engineered testing centers'
  )

  // 5. Namakkal Anorthosite Investigation (Lunar Highland, NOT Mars)
  const namakkal = ANALOGUE_LOCATIONS.find((l) => l.id === 'namakkal-anorthosite')
  assert.ok(namakkal, 'Namakkal anorthosite location is present')
  assert.equal(namakkal.analogueRelevance, 'MOON', 'Namakkal is classified as MOON analogue, NOT Mars')
  assert.equal(namakkal.targetBodies.includes('Mars'), false, 'Namakkal does NOT target Mars')
  assert.ok(namakkal.targetBodies.includes('Moon'), 'Namakkal targets Moon')
  assert.ok(
    namakkal.lithology.some((r) => r.toLowerCase().includes('anorthosite') || r.toLowerCase().includes('plagioclase')),
    'Namakkal lithology features anorthosite / calcic plagioclase'
  )
  assert.ok(
    namakkal.scientificFidelity.some((f) => f.includes('LSS-ISRO') || f.includes('Chandrayaan')),
    'Namakkal documents LSS-ISRO lunar soil simulant production for Chandrayaan-2/3'
  )

  // 6. Tso Kar Valley & Ladakh Cold Desert (ISRO HOPE Mission Verification)
  const ladakh = ANALOGUE_LOCATIONS.find((l) => l.id === 'ladakh-tso-kar')
  assert.ok(ladakh, 'Ladakh Tso Kar location is present')
  assert.ok(ladakh.elevation.value >= 4500, 'Tso Kar elevation is >= 4,500 m')
  assert.ok(ladakh.atmosphericPressure.value <= 60.0, 'Tso Kar barometric pressure is hypobaric (<= 60.0 kPa)')
  assert.ok(
    ladakh.scientificFidelity.some((f) => f.includes('HOPE') || f.includes('ISRO')),
    'Ladakh documents verified ISRO HOPE analogue mission'
  )
  assert.ok(
    ladakh.sourceVerificationRegistry.some((r) => r.claimSupported.includes('HOPE')),
    'Ladakh source verification registry cites ISRO HOPE mission verification'
  )

  // 7. Meteor Crater vs Cinder Lake Separation
  const meteorCrater = ANALOGUE_LOCATIONS.find((l) => l.id === 'meteor-crater-arizona')
  const cinderLake = ANALOGUE_LOCATIONS.find((l) => l.id === 'cinder-lake-crater-field')
  assert.ok(meteorCrater, 'Meteor Crater is present')
  assert.ok(cinderLake, 'Cinder Lake is present')
  assert.notEqual(meteorCrater.id, cinderLake.id, 'Meteor Crater and Cinder Lake are separate locations')
  assert.equal(meteorCrater.locationCategory, 'NATURAL_SITE', 'Meteor Crater is a natural impact crater')
  assert.equal(cinderLake.locationCategory, 'RESEARCH_FACILITY', 'Cinder Lake is an artificial crater field')

  // 8. Krafla vs Vatnajökull Separation
  const krafla = ANALOGUE_LOCATIONS.find((l) => l.id === 'iceland-krafla')
  const vatnajokull = ANALOGUE_LOCATIONS.find((l) => l.id === 'iceland-vatnajokull')
  assert.ok(krafla, 'Krafla is present')
  assert.ok(vatnajokull, 'Vatnajökull is present')
  assert.notEqual(krafla.id, vatnajokull.id, 'Krafla and Vatnajökull are separate locations')
  assert.ok(krafla.lithology.some((l) => l.toLowerCase().includes('silica') || l.toLowerCase().includes('sulfur')), 'Krafla features hydrothermal silica/sulfate')
  assert.ok(vatnajokull.lithology.some((l) => l.toLowerCase().includes('hyaloclastite') || l.toLowerCase().includes('ice')), 'Vatnajökull features glaciovolcanic hyaloclastites')

  // 9. Sudbury vs Mistastin Separation
  const sudbury = ANALOGUE_LOCATIONS.find((l) => l.id === 'sudbury-basin')
  const mistastin = ANALOGUE_LOCATIONS.find((l) => l.id === 'mistastin-crater')
  assert.ok(sudbury, 'Sudbury is present')
  assert.ok(mistastin, 'Mistastin is present')
  assert.notEqual(sudbury.id, mistastin.id, 'Sudbury and Mistastin are separate locations')
  assert.ok(
    mistastin.lithology.some((l) => l.toLowerCase().includes('maskelynite') || l.toLowerCase().includes('anorthosite')),
    'Mistastin features shocked anorthosite and maskelynite'
  )

  // 10. Reykjanes vs Askja Separation
  const reykjanes = ANALOGUE_LOCATIONS.find((l) => l.id === 'iceland-reykjanes')
  const askja = ANALOGUE_LOCATIONS.find((l) => l.id === 'iceland-askja')
  assert.ok(reykjanes, 'Reykjanes is present')
  assert.ok(askja, 'Askja is present')
  assert.notEqual(reykjanes.id, askja.id, 'Reykjanes and Askja are separate locations')
  assert.ok(
    askja.scientificFidelity.some((f) => f.includes('Apollo') && (f.includes('Armstrong') || f.includes('32'))),
    'Askja documents historic Apollo astronaut training (Neil Armstrong)'
  )

  // 11. Datong Volcanic Group Verification
  const datong = ANALOGUE_LOCATIONS.find((l) => l.id === 'datong-volcanic-group')
  assert.ok(datong, 'Datong is present')
  assert.equal(datong.verificationStatus, 'PARTIALLY_VERIFIED', 'Datong is classified as PARTIALLY_VERIFIED')
  assert.equal(datong.primaryTarget, 'Moon', 'Datong primary target is Moon')

  // 12. Category-Aware Filtering
  const facilityMatches = matchLocations(ANALOGUE_LOCATIONS, { locationCategory: 'RESEARCH_FACILITY' })
  const facilityMatchedSites = facilityMatches.filter((m) => m.overallAlignment.key === 'HIGH_ALIGNMENT')
  assert.equal(facilityMatchedSites.length, 4, 'Matching on RESEARCH_FACILITY filters exactly 4 facility sites')
  for (const m of facilityMatchedSites) {
    assert.equal(m.location.locationCategory, 'RESEARCH_FACILITY', `Matched site [${m.location.id}] is a RESEARCH_FACILITY`)
  }
})
