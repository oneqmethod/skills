# Chart Component Templates

All components use Recharts and are styled for Brainshop's dark navy UI.

## Brainshop Theme Constants

Always include these at the top of any generated component file:

```tsx
// Brainshop dark theme
const THEME = {
  bg: '#0d1117',
  card: '#161b22',
  cardBorder: '#30363d',
  text: '#e6edf3',
  textMuted: '#8b949e',
  accent: '#3b82f6',
  accentGreen: '#00d26a',
  accentAmber: '#f59e0b',
  accentRed: '#ef4444',
  accentPurple: '#a855f7',
  grid: '#21262d',
};
```

---

## 1. MVP Validation Curve (J-Curve)

### When to use
When the conversation covers: MVP build cost, time to launch, and when the first paying customer might arrive.

### Required inputs
| Variable | Example | Fallback if missing |
|----------|---------|---------------------|
| `totalBurnCost` | 5000 | 3000 (label as estimate) |
| `weeksToLaunch` | 8 | 6 (label as estimate) |
| `firstCustomerWeek` | 12 | `weeksToLaunch + 4` |
| `pricePerCustomer` | 50 | 49 (label as estimate) |

### Component Template

```tsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Area, AreaChart
} from 'recharts';

const THEME = {
  bg: '#0d1117', card: '#161b22', cardBorder: '#30363d',
  text: '#e6edf3', textMuted: '#8b949e', accent: '#3b82f6',
  accentGreen: '#00d26a', accentAmber: '#f59e0b', grid: '#21262d',
};

// ─── Customize these values from the conversation ───────────────────────────
const CONFIG = {
  totalBurnCost: 5000,       // Total cost to reach MVP launch ($)
  weeksToLaunch: 8,          // Weeks from start to launch
  firstCustomerWeek: 12,     // Week when first paying customer arrives
  pricePerCustomer: 50,      // Revenue from first paying customer ($)
  currency: '$',
  timeUnit: 'Week',
};
// ────────────────────────────────────────────────────────────────────────────

function buildJCurveData(cfg: typeof CONFIG) {
  const { totalBurnCost, weeksToLaunch, firstCustomerWeek, pricePerCustomer } = cfg;
  const burnPerWeek = totalBurnCost / weeksToLaunch;
  const data = [];

  // Phase 1: Investment (going down)
  for (let w = 0; w <= weeksToLaunch; w++) {
    data.push({
      week: w,
      value: Math.round(-(burnPerWeek * w)),
      phase: 'investment',
      label: w === 0 ? 'Start' : w === weeksToLaunch ? 'MVP Launch' : undefined,
    });
  }

  // Phase 2: Post-launch drift (still negative, searching for customers)
  for (let w = weeksToLaunch + 1; w < firstCustomerWeek; w++) {
    const drift = totalBurnCost * 0.05 * (w - weeksToLaunch);
    data.push({
      week: w,
      value: Math.round(-(totalBurnCost + drift)),
      phase: 'searching',
    });
  }

  // Phase 3: First customer + recovery curve
  const bottomValue = data[data.length - 1].value;
  const weeksShown = firstCustomerWeek + 6;
  for (let w = firstCustomerWeek; w <= weeksShown; w++) {
    const weeksAfter = w - firstCustomerWeek;
    const recovery = pricePerCustomer * weeksAfter * 1.4;
    data.push({
      week: w,
      value: Math.round(bottomValue + recovery),
      phase: 'recovery',
      label: w === firstCustomerWeek ? 'First Customer!' : undefined,
    });
  }

  return data;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div style={{
      background: THEME.card, border: `1px solid ${THEME.cardBorder}`,
      borderRadius: 8, padding: '10px 14px',
    }}>
      <p style={{ color: THEME.textMuted, margin: 0, fontSize: 12 }}>
        {CONFIG.timeUnit} {label}
      </p>
      <p style={{
        color: val >= 0 ? THEME.accentGreen : THEME.accentAmber,
        margin: '4px 0 0', fontWeight: 600, fontSize: 15,
      }}>
        {val >= 0 ? '+' : ''}{CONFIG.currency}{val.toLocaleString()}
      </p>
    </div>
  );
};

export function MVPValidationCurve() {
  const data = buildJCurveData(CONFIG);
  const minVal = Math.min(...data.map(d => d.value));
  const maxVal = Math.max(...data.map(d => d.value));

  return (
    <div style={{
      background: THEME.card, border: `1px solid ${THEME.cardBorder}`,
      borderRadius: 12, padding: 24, fontFamily: 'system-ui, sans-serif',
    }}>
      <h3 style={{ color: THEME.text, margin: '0 0 4px', fontSize: 18, fontWeight: 600 }}>
        MVP Validation Curve
      </h3>
      <p style={{ color: THEME.textMuted, margin: '0 0 24px', fontSize: 13 }}>
        Your startup journey from first line of code to first paying customer
      </p>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 60 }}>
          <defs>
            <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={THEME.accent} stopOpacity={0.15} />
              <stop offset="95%" stopColor={THEME.accent} stopOpacity={0.01} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={THEME.grid} />
          <XAxis
            dataKey="week"
            stroke={THEME.textMuted}
            tick={{ fill: THEME.textMuted, fontSize: 12 }}
            label={{ value: 'Time (Weeks)', position: 'insideBottom', offset: -10, fill: THEME.textMuted, fontSize: 12 }}
          />
          <YAxis
            stroke={THEME.textMuted}
            tick={{ fill: THEME.textMuted, fontSize: 12 }}
            tickFormatter={v => `${CONFIG.currency}${Math.abs(v) >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}`}
            domain={[minVal * 1.15, maxVal * 1.15]}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Zero line */}
          <ReferenceLine y={0} stroke={THEME.textMuted} strokeDasharray="4 4" strokeWidth={1} />

          {/* MVP Launch marker */}
          <ReferenceLine
            x={CONFIG.weeksToLaunch}
            stroke={THEME.accentAmber}
            strokeWidth={2}
            label={{ value: 'MVP Launch', position: 'top', fill: THEME.accentAmber, fontSize: 11 }}
          />

          {/* First customer marker */}
          <ReferenceLine
            x={CONFIG.firstCustomerWeek}
            stroke={THEME.accentGreen}
            strokeWidth={2}
            strokeDasharray="6 3"
            label={{ value: '🎉 First Customer', position: 'top', fill: THEME.accentGreen, fontSize: 11 }}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke={THEME.accent}
            strokeWidth={2.5}
            fill="url(#curveGradient)"
            dot={false}
            activeDot={{ r: 5, fill: THEME.accent, stroke: THEME.card, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Key metrics row */}
      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        {[
          { label: 'Total Burn', value: `${CONFIG.currency}${CONFIG.totalBurnCost.toLocaleString()}`, color: THEME.accentAmber },
          { label: 'Weeks to Launch', value: `${CONFIG.weeksToLaunch}w`, color: THEME.accent },
          { label: 'First Revenue', value: `${CONFIG.currency}${CONFIG.pricePerCustomer}`, color: THEME.accentGreen },
        ].map(m => (
          <div key={m.label} style={{
            flex: 1, background: THEME.bg, borderRadius: 8,
            padding: '12px 16px', border: `1px solid ${THEME.cardBorder}`,
          }}>
            <p style={{ color: THEME.textMuted, margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</p>
            <p style={{ color: m.color, margin: '4px 0 0', fontSize: 20, fontWeight: 700 }}>{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MVPValidationExplanation() {
  return (
    <div style={{
      background: THEME.card, border: `1px solid ${THEME.cardBorder}`,
      borderRadius: 12, padding: 24, marginTop: 12,
      fontFamily: 'system-ui, sans-serif',
    }}>
      <h4 style={{ color: THEME.text, margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>
        How to read this chart
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          {
            color: THEME.accentAmber,
            label: 'The Trough (Going Down)',
            text: 'Every dollar spent and hour worked before launch. You are running entirely on assumptions here — no market signal yet.',
          },
          {
            color: THEME.accentAmber,
            label: 'MVP Launch (Orange Line)',
            text: 'The maximum resource spent without return. The product is live, but proof of viability is still zero.',
          },
          {
            color: THEME.accentGreen,
            label: 'First Paying Customer (Green Line)',
            text: 'The inflection point. Someone chose your product over every alternative and paid for it. The trajectory of the business has permanently changed — you now have a fact, not a theory.',
          },
          {
            color: THEME.accent,
            label: 'The Curve After',
            text: 'The upward slope represents compounding validation. You are still in the negative (below the dotted zero line) until break-even, but the direction is everything.',
          },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 3, minWidth: 3, borderRadius: 2, alignSelf: 'stretch',
              background: item.color,
            }} />
            <div>
              <p style={{ color: THEME.text, margin: '0 0 2px', fontSize: 13, fontWeight: 600 }}>{item.label}</p>
              <p style={{ color: THEME.textMuted, margin: 0, fontSize: 13, lineHeight: 1.5 }}>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 2. Break-Even Analysis

### When to use
When the conversation has concrete cost and pricing numbers and the question is "how many users do we need?"

### Required inputs
| Variable | Example | Fallback if missing |
|----------|---------|---------------------|
| `fixedCost` | 5000 | 2000 (label as estimate) |
| `variableCostPerUser` | 5 | 3 (label as estimate) |
| `pricePerUser` | 15 | ask or use 29 as SaaS default |
| `maxUsers` | 500 | auto-calculated (2× break-even) |

### Component Template

```tsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, Legend, ResponsiveContainer
} from 'recharts';

const THEME = {
  bg: '#0d1117', card: '#161b22', cardBorder: '#30363d',
  text: '#e6edf3', textMuted: '#8b949e', accent: '#3b82f6',
  accentGreen: '#00d26a', accentAmber: '#f59e0b', accentRed: '#ef4444',
  accentPurple: '#a855f7', grid: '#21262d',
};

// ─── Customize these values from the conversation ───────────────────────────
const CONFIG = {
  fixedCost: 5000,            // One-time cost to build and launch ($)
  variableCostPerUser: 5,     // Cost to support each additional user ($/user)
  pricePerUser: 15,           // Monthly revenue per paying user ($/user)
  currency: '$',
  userLabel: 'users',
};
// ────────────────────────────────────────────────────────────────────────────

function buildBreakEvenData(cfg: typeof CONFIG) {
  const { fixedCost, variableCostPerUser, pricePerUser } = cfg;
  const margin = pricePerUser - variableCostPerUser;
  if (margin <= 0) return { data: [], breakEvenPoint: null };

  const breakEvenPoint = Math.ceil(fixedCost / margin);
  const maxUsers = Math.ceil(breakEvenPoint * 2.2);
  const data = [];

  for (let u = 0; u <= maxUsers; u += Math.max(1, Math.ceil(maxUsers / 40))) {
    data.push({
      users: u,
      totalCost: fixedCost + variableCostPerUser * u,
      revenue: pricePerUser * u,
    });
  }
  // Ensure break-even point is in dataset
  data.push({
    users: breakEvenPoint,
    totalCost: fixedCost + variableCostPerUser * breakEvenPoint,
    revenue: pricePerUser * breakEvenPoint,
  });
  data.sort((a, b) => a.users - b.users);

  return { data, breakEvenPoint };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: THEME.card, border: `1px solid ${THEME.cardBorder}`,
      borderRadius: 8, padding: '10px 14px',
    }}>
      <p style={{ color: THEME.textMuted, margin: 0, fontSize: 12 }}>
        {label} {CONFIG.userLabel}
      </p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color, margin: '4px 0 0', fontWeight: 600, fontSize: 14 }}>
          {p.name}: {CONFIG.currency}{p.value.toLocaleString()}
        </p>
      ))}
      {payload[0] && payload[1] && (
        <p style={{
          color: payload[1].value > payload[0].value ? THEME.accentGreen : THEME.accentRed,
          margin: '6px 0 0', fontSize: 12, borderTop: `1px solid ${THEME.cardBorder}`, paddingTop: 6,
        }}>
          {payload[1].value > payload[0].value
            ? `+${CONFIG.currency}${(payload[1].value - payload[0].value).toLocaleString()} profit`
            : `${CONFIG.currency}${(payload[0].value - payload[1].value).toLocaleString()} loss`}
        </p>
      )}
    </div>
  );
};

export function BreakEvenChart() {
  const { data, breakEvenPoint } = buildBreakEvenData(CONFIG);
  const margin = CONFIG.pricePerUser - CONFIG.variableCostPerUser;

  if (margin <= 0) {
    return (
      <div style={{ background: THEME.card, borderRadius: 12, padding: 24 }}>
        <p style={{ color: THEME.accentRed }}>
          Warning: Price per user ({CONFIG.currency}{CONFIG.pricePerUser}) must exceed variable cost
          ({CONFIG.currency}{CONFIG.variableCostPerUser}) to reach break-even.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: THEME.card, border: `1px solid ${THEME.cardBorder}`,
      borderRadius: 12, padding: 24, fontFamily: 'system-ui, sans-serif',
    }}>
      <h3 style={{ color: THEME.text, margin: '0 0 4px', fontSize: 18, fontWeight: 600 }}>
        Break-Even Analysis
      </h3>
      <p style={{ color: THEME.textMuted, margin: '0 0 24px', fontSize: 13 }}>
        You need <strong style={{ color: THEME.accentGreen }}>{breakEvenPoint} {CONFIG.userLabel}</strong> to
        cover all costs at {CONFIG.currency}{CONFIG.pricePerUser}/user
      </p>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={THEME.grid} />
          <XAxis
            dataKey="users"
            stroke={THEME.textMuted}
            tick={{ fill: THEME.textMuted, fontSize: 12 }}
            label={{ value: `Number of ${CONFIG.userLabel}`, position: 'insideBottom', offset: -10, fill: THEME.textMuted, fontSize: 12 }}
          />
          <YAxis
            stroke={THEME.textMuted}
            tick={{ fill: THEME.textMuted, fontSize: 12 }}
            tickFormatter={v => `${CONFIG.currency}${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ color: THEME.textMuted, fontSize: 13, paddingTop: 12 }}
          />

          {/* Break-even reference line */}
          {breakEvenPoint && (
            <ReferenceLine
              x={breakEvenPoint}
              stroke={THEME.accentGreen}
              strokeWidth={2}
              strokeDasharray="6 3"
              label={{ value: `Break-Even: ${breakEvenPoint}`, position: 'top', fill: THEME.accentGreen, fontSize: 11 }}
            />
          )}

          <Line
            type="monotone"
            dataKey="totalCost"
            name="Total Cost"
            stroke={THEME.accentRed}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke={THEME.accentGreen}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Metric cards */}
      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        {[
          { label: 'Fixed Cost', value: `${CONFIG.currency}${CONFIG.fixedCost.toLocaleString()}`, color: THEME.accentRed, sub: 'to build & launch' },
          { label: 'Margin / User', value: `${CONFIG.currency}${margin}/mo`, color: THEME.accent, sub: `price − variable cost` },
          { label: 'Break-Even', value: `${breakEvenPoint} users`, color: THEME.accentGreen, sub: 'to reach profitability' },
        ].map(m => (
          <div key={m.label} style={{
            flex: 1, background: THEME.bg, borderRadius: 8,
            padding: '12px 16px', border: `1px solid ${THEME.cardBorder}`,
          }}>
            <p style={{ color: THEME.textMuted, margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</p>
            <p style={{ color: m.color, margin: '4px 0 2px', fontSize: 18, fontWeight: 700 }}>{m.value}</p>
            <p style={{ color: THEME.textMuted, margin: 0, fontSize: 11 }}>{m.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BreakEvenExplanation() {
  const margin = CONFIG.pricePerUser - CONFIG.variableCostPerUser;
  const breakEvenPoint = margin > 0 ? Math.ceil(CONFIG.fixedCost / margin) : null;

  return (
    <div style={{
      background: THEME.card, border: `1px solid ${THEME.cardBorder}`,
      borderRadius: 12, padding: 24, marginTop: 12,
      fontFamily: 'system-ui, sans-serif',
    }}>
      <h4 style={{ color: THEME.text, margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>
        How to read this chart
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          {
            color: THEME.accentRed,
            label: 'Red Line — Total Cost',
            text: `Starts at ${CONFIG.currency}${CONFIG.fixedCost.toLocaleString()} (your fixed investment) and rises by ${CONFIG.currency}${CONFIG.variableCostPerUser} for every user you add. This is what reality costs.`,
          },
          {
            color: THEME.accentGreen,
            label: 'Green Line — Revenue',
            text: `Starts at $0 and grows by ${CONFIG.currency}${CONFIG.pricePerUser} per user. It begins below the cost line because your fixed costs are already paid before user #1.`,
          },
          {
            color: THEME.accentGreen,
            label: `The Crossing Point — ${breakEvenPoint ? `${breakEvenPoint} Users` : 'Break-Even'}`,
            text: 'Where the green line crosses the red. Before this point, every user reduces your loss. After this point, every user adds pure profit. This is the number to obsess over.',
          },
          {
            color: THEME.textMuted,
            label: 'What this does NOT show',
            text: 'Churn (users leaving), growth rate, or time. This is a snapshot of the math, not a forecast. To make it real, estimate how many users you can realistically acquire per month.',
          },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 3, minWidth: 3, borderRadius: 2, alignSelf: 'stretch',
              background: item.color,
            }} />
            <div>
              <p style={{ color: THEME.text, margin: '0 0 2px', fontSize: 13, fontWeight: 600 }}>{item.label}</p>
              <p style={{ color: THEME.textMuted, margin: 0, fontSize: 13, lineHeight: 1.5 }}>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 3. Viability Matrix (2×2 Scatter)

### When to use
When the conversation involves a list of features/solutions and there's debate about what to build first.

### Required inputs
| Variable | Example | Notes |
|----------|---------|-------|
| `features` | Array of features | Extract from conversation; estimate scores if not given |
| `features[].name` | "User Auth" | Feature name |
| `features[].value` | 7 | 1–10, customer value / willingness to pay |
| `features[].cost` | 3 | 1–10, effort / cost to build |

### Component Template

```tsx
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Cell
} from 'recharts';

const THEME = {
  bg: '#0d1117', card: '#161b22', cardBorder: '#30363d',
  text: '#e6edf3', textMuted: '#8b949e', accent: '#3b82f6',
  accentGreen: '#00d26a', accentAmber: '#f59e0b', accentRed: '#ef4444',
  accentPurple: '#a855f7', grid: '#21262d',
};

// ─── Customize these values from the conversation ───────────────────────────
const FEATURES = [
  // Each feature: name (from conversation), value (1–10), cost (1–10)
  // value = customer willingness to pay / importance
  // cost  = engineering + design effort to build
  { name: 'Core Feature A', value: 8, cost: 3 },
  { name: 'Nice-to-Have B', value: 5, cost: 7 },
  { name: 'Quick Win C',    value: 6, cost: 2 },
  { name: 'Big Bet D',      value: 9, cost: 9 },
  { name: 'Skip This E',    value: 2, cost: 6 },
];
// ────────────────────────────────────────────────────────────────────────────

const QUADRANTS = [
  { label: 'SWEET SPOT', sublabel: 'Build First', x: 2.5, y: 7.5, color: THEME.accentGreen },
  { label: 'BUILD LATER', sublabel: 'High value, hard to build', x: 7.5, y: 7.5, color: THEME.accent },
  { label: 'SKIP', sublabel: 'Low value, high effort', x: 7.5, y: 2.5, color: THEME.accentRed },
  { label: 'QUICK WIN', sublabel: 'Easy validation', x: 2.5, y: 2.5, color: THEME.accentAmber },
];

function getQuadrant(cost: number, value: number) {
  if (cost <= 5 && value > 5) return { label: 'Sweet Spot', color: THEME.accentGreen };
  if (cost > 5 && value > 5)  return { label: 'Build Later', color: THEME.accent };
  if (cost > 5 && value <= 5) return { label: 'Skip',        color: THEME.accentRed };
  return { label: 'Quick Win', color: THEME.accentAmber };
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const q = getQuadrant(d.cost, d.value);
  return (
    <div style={{
      background: THEME.card, border: `1px solid ${THEME.cardBorder}`,
      borderRadius: 8, padding: '10px 14px', maxWidth: 200,
    }}>
      <p style={{ color: THEME.text, margin: 0, fontWeight: 600, fontSize: 14 }}>{d.name}</p>
      <p style={{ color: THEME.textMuted, margin: '4px 0 0', fontSize: 12 }}>
        Value: <strong style={{ color: THEME.accentGreen }}>{d.value}/10</strong>
        {' · '}
        Cost: <strong style={{ color: THEME.accentRed }}>{d.cost}/10</strong>
      </p>
      <p style={{ color: q.color, margin: '6px 0 0', fontSize: 12, fontWeight: 600 }}>
        → {q.label}
      </p>
    </div>
  );
};

export function ViabilityMatrix() {
  return (
    <div style={{
      background: THEME.card, border: `1px solid ${THEME.cardBorder}`,
      borderRadius: 12, padding: 24, fontFamily: 'system-ui, sans-serif',
    }}>
      <h3 style={{ color: THEME.text, margin: '0 0 4px', fontSize: 18, fontWeight: 600 }}>
        Feature Viability Matrix
      </h3>
      <p style={{ color: THEME.textMuted, margin: '0 0 24px', fontSize: 13 }}>
        Plot features by customer value vs. cost to build — Sweet Spot = build first
      </p>

      <ResponsiveContainer width="100%" height={380}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={THEME.grid} />
          <XAxis
            dataKey="cost"
            type="number"
            domain={[0, 10]}
            name="Cost to Build"
            stroke={THEME.textMuted}
            tick={{ fill: THEME.textMuted, fontSize: 12 }}
            label={{ value: 'Cost / Effort to Build →', position: 'insideBottom', offset: -15, fill: THEME.textMuted, fontSize: 12 }}
          />
          <YAxis
            dataKey="value"
            type="number"
            domain={[0, 10]}
            name="Customer Value"
            stroke={THEME.textMuted}
            tick={{ fill: THEME.textMuted, fontSize: 12 }}
            label={{ value: '↑ Customer Value', angle: -90, position: 'insideLeft', offset: 15, fill: THEME.textMuted, fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

          {/* Quadrant dividers */}
          <ReferenceLine x={5} stroke={THEME.cardBorder} strokeWidth={1.5} />
          <ReferenceLine y={5} stroke={THEME.cardBorder} strokeWidth={1.5} />

          <Scatter data={FEATURES} name="Features">
            {FEATURES.map((f, i) => (
              <Cell key={i} fill={getQuadrant(f.cost, f.value).color} fillOpacity={0.9} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      {/* Quadrant legend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
        {[
          { label: 'Sweet Spot', desc: 'High value, low cost — build these first', color: THEME.accentGreen },
          { label: 'Build Later', desc: 'High value, high cost — plan for v2', color: THEME.accent },
          { label: 'Quick Win', desc: 'Low value, low cost — fast validation tool', color: THEME.accentAmber },
          { label: 'Skip', desc: 'Low value, high cost — drop from MVP', color: THEME.accentRed },
        ].map(q => (
          <div key={q.label} style={{
            display: 'flex', gap: 10, alignItems: 'center',
            background: THEME.bg, borderRadius: 8,
            padding: '10px 14px', border: `1px solid ${THEME.cardBorder}`,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: q.color, flexShrink: 0 }} />
            <div>
              <p style={{ color: THEME.text, margin: 0, fontSize: 13, fontWeight: 600 }}>{q.label}</p>
              <p style={{ color: THEME.textMuted, margin: 0, fontSize: 11 }}>{q.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ViabilityMatrixExplanation() {
  return (
    <div style={{
      background: THEME.card, border: `1px solid ${THEME.cardBorder}`,
      borderRadius: 12, padding: 24, marginTop: 12,
      fontFamily: 'system-ui, sans-serif',
    }}>
      <h4 style={{ color: THEME.text, margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>
        How to read this chart
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          {
            color: THEME.accentGreen,
            label: 'X-Axis: Cost / Effort (left = easy, right = hard)',
            text: 'This is your team\'s honest estimate of how expensive and time-consuming a feature is to build well. Low means days; high means weeks or months.',
          },
          {
            color: THEME.accent,
            label: 'Y-Axis: Customer Value (bottom = meh, top = must-have)',
            text: 'How strongly your target customer wants this. Score based on user interviews, not your own opinion. High = they would pay extra for it or leave without it.',
          },
          {
            color: THEME.accentGreen,
            label: 'Green Zone (top-left) = Your MVP',
            text: 'Features here have the best return on investment. Maximum customer impact for minimum build effort. These are the only things that should be in your MVP.',
          },
          {
            color: THEME.accentRed,
            label: 'Red Zone (bottom-right) = Delete',
            text: 'High effort, low value. These features are the reason MVPs get bloated and delayed. Remove them without guilt.',
          },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 3, minWidth: 3, borderRadius: 2, alignSelf: 'stretch',
              background: item.color,
            }} />
            <div>
              <p style={{ color: THEME.text, margin: '0 0 2px', fontSize: 13, fontWeight: 600 }}>{item.label}</p>
              <p style={{ color: THEME.textMuted, margin: 0, fontSize: 13, lineHeight: 1.5 }}>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```
