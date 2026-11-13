export default function PlanetaryDivergenceTable({ planetaryDivergence, location }) {
  if (!planetaryDivergence || !planetaryDivergence.divergences) return null

  const { targetBody, divergences } = planetaryDivergence

  return (
    <div className="planetary-divergence-section">
      <div className="section-title-wrap">
        <div className="section-title-row">
          <h3 className="section-title font-mono text-cyan">
            &Delta; PLANETARY DIVERGENCE MATRIX: EARTH VS. {targetBody.toUpperCase()}
          </h3>
          <span className="badge-source font-mono">Fundamental Physical Boundaries</span>
        </div>
        <p className="section-subtitle">
          Terrestrial analogue environments reproduce surface lithology and geomorphology, but diverge fundamentally across macro-physical parameters. Hardware qualification tests must account for these scaling differences.
        </p>
      </div>

      <div className="divergence-table-container">
        <table className="divergence-table">
          <thead>
            <tr>
              <th>Physical Parameter</th>
              <th>Earth Analogue Baseline ({location.name})</th>
              <th>Target Planetary Condition ({targetBody})</th>
              <th>Divergence Ratio / Factor</th>
              <th>Engineering &amp; Protocol Impact</th>
            </tr>
          </thead>
          <tbody>
            {divergences.map((div, idx) => (
              <tr key={idx} className="divergence-row">
                <td className="div-param font-mono">
                  <strong>{div.parameter}</strong>
                </td>
                <td className="div-earth font-mono">{div.earthSite}</td>
                <td className="div-planet font-mono highlight-orange">{div.planetaryTarget}</td>
                <td className="div-ratio font-mono">{div.divergenceRatio}</td>
                <td className="div-impact">{div.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divergence-notice-box font-mono">
        <strong>AEROSPACE VALIDATION DIRECTIVE:</strong> High performance in an Earth analogue does not confirm flight readiness. Test ConOps must implement gravitational mass-offloading rigs for mobility tests, thermal-vacuum chambers (TVAC) for sublimation/heat dissipation, and radiation-shielded facilities for electronic component qualification.
      </div>
    </div>
  )
}

