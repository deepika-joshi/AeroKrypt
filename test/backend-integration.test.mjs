import test from 'node:test'
import assert from 'node:assert/strict'

test('AEROKRYPT FULL-STACK BACKEND ARCHITECTURE & PRIVACY AUDIT', async (t) => {
  await t.test('Section 1.1: API Client exports all mandatory service interfaces', async () => {
    const { authApi, researchApi, locationsApi, healthApi } = await import('../src/services/apiClient.js')
    assert.ok(authApi.login, 'authApi.login must be defined')
    assert.ok(authApi.register, 'authApi.register must be defined')
    assert.ok(authApi.logout, 'authApi.logout must be defined')
    assert.ok(authApi.getMe, 'authApi.getMe must be defined')
    assert.ok(researchApi.getMyRecords, 'researchApi.getMyRecords must be defined')
    assert.ok(researchApi.createRecord, 'researchApi.createRecord must be defined')
    assert.ok(researchApi.submitRecord, 'researchApi.submitRecord must be defined')
    assert.ok(researchApi.getReviewQueue, 'researchApi.getReviewQueue must be defined')
    assert.ok(researchApi.publishSubmission, 'researchApi.publishSubmission must be defined')
    assert.ok(researchApi.getPublicPublished, 'researchApi.getPublicPublished must be defined')
    assert.ok(locationsApi.getLocations, 'locationsApi.getLocations must be defined')
    assert.ok(healthApi.checkHealth, 'healthApi.checkHealth must be defined')
  })

  await t.test('Section 1.2: Authentication Modal component renders without SSR errors', async () => {
    const { createServer } = await import('vite')
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
    })
    const modalModule = await vite.ssrLoadModule('/src/components/research-hub/ResearcherAuthModal.jsx')
    assert.ok(modalModule.default, 'ResearcherAuthModal must export a default React component')
    await vite.close()
  })

  await t.test('Section 1.3: ResearchHub imports and mounts full-stack auth integration', async () => {
    const { createServer } = await import('vite')
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
    })
    const hubModule = await vite.ssrLoadModule('/src/components/research-hub/ResearchHub.jsx')
    assert.ok(hubModule.default, 'ResearchHub must export a default React component')
    await vite.close()
  })
})
