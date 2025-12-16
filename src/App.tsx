import { useMemo, useState } from 'react'
import './App.css'

type Attachment = {
  id: string
  name: string
}

type Price = {
  id: string
  label: string
  currency: string
  amount: number
  term: string
  tags?: string[]
}

type ContractOption = {
  id: string
  name: string
  region: string
  owner: string
}

const priceLibrary: Price[] = [
  { id: 'base', label: 'Base platform access', currency: 'USD', amount: 12000, term: 'annual', tags: ['core'] },
  { id: 'support+', label: 'Premium support (24/7)', currency: 'USD', amount: 4200, term: 'annual', tags: ['support'] },
  { id: 'payg', label: 'Usage-based compute', currency: 'USD', amount: 0.08, term: 'per hour', tags: ['usage', 'compute'] },
  { id: 'training', label: 'Onboarding & training', currency: 'USD', amount: 3000, term: 'one-time', tags: ['services'] },
]

const contracts: ContractOption[] = [
  { id: '123', name: 'Acme Renewable Energy', region: 'US-East', owner: 'D. Carter' },
  { id: '239', name: 'Northwind Logistics', region: 'EMEA-North', owner: 'M. Hegde' },
  { id: '441', name: 'Helios Telecom', region: 'APAC-South', owner: 'L. Chen' },
  { id: '998', name: 'Contoso Manufacturing', region: 'US-Central', owner: 'S. Patel' },
]

const defaultAttachments: Attachment[] = [
  { id: 'msa', name: 'Master Services Agreement.pdf' },
  { id: 'sow', name: 'Statement of Work v2.docx' },
]

const steps = [
  'Common data',
  'Contract selection',
  'Price allocation',
  'Review & submit',
]

function Pill({ label }: { label: string }) {
  return <span className="pill">{label}</span>
}

function StepHeader({ currentStep }: { currentStep: number }) {
  return (
    <div className="stepper" aria-label="Agreement creation steps">
      {steps.map((label, index) => {
        const stepNumber = index + 1
        const isActive = currentStep === stepNumber
        const isComplete = currentStep > stepNumber
        return (
          <div className={`step ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`} key={label}>
            <div className="step-index">{isComplete ? '✓' : stepNumber}</div>
            <div>
              <div className="step-label">{label}</div>
              <div className="step-sub">{getStepSubCopy(stepNumber)}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function getStepSubCopy(step: number) {
  switch (step) {
    case 1:
      return 'Dates, attachments, baseline prices'
    case 2:
      return 'Pick the contracts to clone into'
    case 3:
      return 'Override or fine-tune prices per contract'
    case 4:
      return 'Validate payload and submit'
    default:
      return ''
  }
}

function PriceChip({ price, selected, onToggle }: { price: Price; selected: boolean; onToggle: () => void }) {
  return (
    <button className={`price-chip ${selected ? 'selected' : ''}`} type="button" onClick={onToggle}>
      <div className="price-chip__top">
        <span className="price-chip__label">{price.label}</span>
        <span className="price-chip__amount">
          {price.currency} {price.amount}
        </span>
      </div>
      <div className="price-chip__meta">{price.term}</div>
      <div className="price-chip__tags">
        {price.tags?.map((tag) => (
          <Pill key={tag} label={tag} />
        ))}
      </div>
    </button>
  )
}

function AttachmentStack({ attachments }: { attachments: Attachment[] }) {
  return (
    <div className="attachments">
      {attachments.map((file) => (
        <div key={file.id} className="attachment-row">
          <span className="dot" aria-hidden />
          <span className="attachment-name">{file.name}</span>
        </div>
      ))}
    </div>
  )
}

function UXGuidance() {
  return (
    <section className="guidance">
      <h2>Experience blueprint</h2>
      <div className="guidance-grid">
        <div className="guidance-card">
          <h3>1. Decide common vs. per-contract</h3>
          <p>
            Capture dates, attachments, and baseline prices once. Display a quick toggle in later steps to override any
            field per contract.
          </p>
          <ul>
            <li>Defaults flow from common data.</li>
            <li>Overrides are additive and only send deltas to the API.</li>
          </ul>
        </div>
        <div className="guidance-card">
          <h3>2. Price allocation canvas</h3>
          <p>
            In Step 3, place selected contracts in a grid where each row shows the inherited prices and allows adding or
            removing prices inline.
          </p>
          <ul>
            <li>Show inheritance: “2 prices inherited, 1 overridden”.</li>
            <li>Surface availability filtering by tag (e.g., core/support/usage).</li>
          </ul>
        </div>
        <div className="guidance-card">
          <h3>3. Submission preview</h3>
          <p>
            Render the JSON payload users will send. Highlight which contracts carry overrides so the data contract is
            transparent.
          </p>
        </div>
      </div>
    </section>
  )
}

function App() {
  const currentStep = 3
  const [commonData, setCommonData] = useState({
    startDate: '2025-01-01',
    endDate: '2030-01-01',
    attachments: defaultAttachments,
    prices: ['base', 'support+'],
  })
  const [selectedContracts, setSelectedContracts] = useState<string[]>(['123', '239'])
  const [contractOverrides, setContractOverrides] = useState<Record<string, { prices: string[] }>>({
    '239': { prices: ['base', 'payg'] },
  })

  const payload = useMemo(
    () => ({
      contracts: selectedContracts.map((contractId) => ({
        contractId,
        data: {
          prices: contractOverrides[contractId]?.prices ?? [],
        },
      })),
      data: commonData,
    }),
    [commonData, contractOverrides, selectedContracts],
  )

  const toggleContractSelection = (id: string) => {
    setSelectedContracts((prev) =>
      prev.includes(id) ? prev.filter((contractId) => contractId !== id) : [...prev, id],
    )
  }

  const toggleCommonPrice = (priceId: string) => {
    setCommonData((prev) => ({
      ...prev,
      prices: prev.prices.includes(priceId)
        ? prev.prices.filter((id) => id !== priceId)
        : [...prev.prices, priceId],
    }))
  }

  const toggleOverridePrice = (contractId: string, priceId: string) => {
    setContractOverrides((prev) => {
      const current = prev[contractId]?.prices ?? []
      const nextPrices = current.includes(priceId) ? current.filter((id) => id !== priceId) : [...current, priceId]
      return { ...prev, [contractId]: { prices: nextPrices } }
    })
  }

  return (
    <main className="page">
      <header>
        <p className="eyebrow">Multiple agreements</p>
        <h1>Design a guided creation flow for per-contract prices</h1>
        <p className="lede">
          A four-step experience that separates common data, contract targeting, price overrides, and submission preview.
          This demo surfaces both the UX and the JSON payload sent to the API.
        </p>
      </header>

      <StepHeader currentStep={currentStep} />

      <section className="panels">
        <div className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Step 1</p>
              <h2>Common data</h2>
              <p>Everything captured here cascades to every contract unless overridden later.</p>
            </div>
            <div className="date-grid">
              <label className="field">
                <span>Start date</span>
                <input
                  type="date"
                  value={commonData.startDate}
                  onChange={(e) => setCommonData({ ...commonData, startDate: e.target.value })}
                />
              </label>
              <label className="field">
                <span>End date</span>
                <input
                  type="date"
                  value={commonData.endDate}
                  onChange={(e) => setCommonData({ ...commonData, endDate: e.target.value })}
                />
              </label>
            </div>
          </div>
          <div className="grid two">
            <div>
              <p className="subhead">Attachments</p>
              <AttachmentStack attachments={commonData.attachments} />
              <button className="ghost" type="button">
                + Add attachment
              </button>
            </div>
            <div>
              <p className="subhead">Baseline prices</p>
              <div className="chip-grid">
                {priceLibrary.map((price) => (
                  <PriceChip
                    key={price.id}
                    price={price}
                    selected={commonData.prices.includes(price.id)}
                    onToggle={() => toggleCommonPrice(price.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Step 2</p>
              <h2>Pick contracts</h2>
              <p>Multi-select contracts to branch off agreements. Inherit all common data by default.</p>
            </div>
            <div className="grid two">
              {contracts.map((contract) => {
                const checked = selectedContracts.includes(contract.id)
                return (
                  <label key={contract.id} className={`contract-card ${checked ? 'checked' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleContractSelection(contract.id)}
                      aria-label={`Toggle ${contract.name}`}
                    />
                    <div>
                      <div className="contract-name">{contract.name}</div>
                      <div className="contract-meta">
                        <Pill label={contract.region} />
                        <span className="owner">Owner: {contract.owner}</span>
                      </div>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Step 3</p>
              <h2>Price allocation per contract</h2>
              <p>
                Override prices where needed. Contracts inherit common prices and show deltas as “overrides” for the API
                payload.
              </p>
            </div>
          </div>
          <div className="override-grid">
            {selectedContracts.map((contractId) => {
              const contract = contracts.find((c) => c.id === contractId)
              const overridePrices = contractOverrides[contractId]?.prices ?? []
              return (
                <div key={contractId} className="override-card">
                  <div className="override-head">
                    <div>
                      <p className="eyebrow">{contract?.region}</p>
                      <h3>{contract?.name}</h3>
                    </div>
                    <div className="pill-row">
                      <Pill label={`${commonData.prices.length} inherited`} />
                      <Pill label={`${overridePrices.length} override(s)`} />
                    </div>
                  </div>
                  <p className="subhead">Select prices for this contract</p>
                  <div className="chip-grid">
                    {priceLibrary.map((price) => {
                      const selected = overridePrices.includes(price.id)
                      return (
                        <PriceChip
                          key={price.id}
                          price={price}
                          selected={selected}
                          onToggle={() => toggleOverridePrice(contractId, price.id)}
                        />
                      )
                    })}
                  </div>
                  <p className="help">Unselected override prices fall back to the common selection.</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Step 4</p>
              <h2>Review & payload</h2>
              <p>Export-ready payload mirrors your API contract with clear separation of common data and overrides.</p>
            </div>
            <div className="json-box">
              <pre>{JSON.stringify(payload, null, 2)}</pre>
            </div>
          </div>
        </div>
      </section>

      <UXGuidance />
    </main>
  )
}

export default App
