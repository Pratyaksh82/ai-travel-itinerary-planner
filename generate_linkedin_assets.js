const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const assetsDir = path.resolve(__dirname, 'linkedin_assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

function captureScreenshot(urlOrFile, outputPath, width = 1440, height = 900, delay = 5000) {
  console.log(`Capturing: ${outputPath}...`);
  execFileSync(chromePath, [
    '--headless=new',
    '--disable-gpu',
    `--virtual-time-budget=${delay}`,
    `--window-size=${width},${height}`,
    `--screenshot=${outputPath}`,
    urlOrFile
  ]);
  console.log(`Saved: ${outputPath} (${fs.statSync(outputPath).size} bytes)`);
}

// 1. Capture Website Photo 1 (Dashboard Overview)
const photo1Path = path.join(assetsDir, 'photo1_website_smart_builder.png');
captureScreenshot('https://voyagecraft-travel-planner.onrender.com/', photo1Path, 1440, 920, 6000);

// 2. Prepare HTML for Website Photo 2 (Itinerary & Budget View)
const itineraryHtmlPath = path.join(assetsDir, 'temp_itinerary_view.html');
const itineraryHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Space+Grotesk:wght@600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0a0f1d;
      color: #f8fafc;
      font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 30px;
      background-image: radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.15), transparent 70%);
    }
    .badge {
      display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px;
      border-radius: 9999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
    }
    .badge-cyan { background: rgba(56, 189, 248, 0.12); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
    .badge-purple { background: rgba(168, 85, 247, 0.12); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }
    .badge-emerald { background: rgba(16, 185, 129, 0.12); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge-amber { background: rgba(245, 158, 11, 0.12); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
    .hero-card {
      position: relative; border-radius: 20px; overflow: hidden; margin-bottom: 24px;
      border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    .hero-img { width: 100%; height: 260px; object-fit: cover; filter: brightness(0.65); }
    .hero-content {
      position: absolute; bottom: 0; left: 0; right: 0; padding: 24px 30px;
      background: linear-gradient(180deg, transparent 0%, rgba(10, 15, 29, 0.95) 90%);
    }
    .panel {
      background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 20px 24px; margin-bottom: 20px;
    }
    .grid-2 { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px; }
    .act-card {
      background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px; padding: 14px 18px; margin-bottom: 12px; display: flex; gap: 14px; align-items: flex-start;
    }
    .checkbox { width: 18px; height: 18px; margin-top: 3px; accent-color: #10b981; }
    .kpi-box {
      background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px; padding: 14px; text-align: center;
    }
  </style>
</head>
<body>
  <!-- Hero Card -->
  <div class="hero-card">
    <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80" class="hero-img">
    <div class="hero-content">
      <div style="display: flex; gap: 8px; margin-bottom: 10px;">
        <span class="badge badge-cyan">3 Days</span>
        <span class="badge badge-purple">Budget Tier</span>
        <span class="badge badge-emerald">Cultural & Historical</span>
        <span class="badge badge-amber">Solo Traveler (1)</span>
      </div>
      <h1 style="font-family: 'Space Grotesk'; font-size: 1.8rem; margin-bottom: 6px;">3-Day Cultural & Historical in Kyoto</h1>
      <p style="font-size: 0.9rem; color: #cbd5e1;">An intelligently curated bespoke journey across Kyoto, designed specifically for a solo adventurer seeking authentic temple hikes, zen gardens, and local matcha tasting.</p>
    </div>
  </div>

  <div class="grid-2">
    <!-- Day 1 Schedule -->
    <div class="panel">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px;">
        <div>
          <span class="badge badge-purple" style="margin-bottom: 4px;">Day 1 Schedule</span>
          <h2 style="font-size: 1.15rem; font-weight: 700;">Heritage, Architecture & Sacred Shrines</h2>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.75rem; color: #94a3b8;">Day Budget</span>
          <div style="font-size: 1rem; font-weight: 800; color: #38bdf8;">$118.00 USD</div>
        </div>
      </div>

      <div class="act-card">
        <input type="checkbox" checked class="checkbox">
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between;">
            <span class="badge badge-cyan">Morning • 09:00 AM</span>
            <span style="font-weight: 700; color: #34d399; font-size: 0.85rem;">Free Entry</span>
          </div>
          <div style="font-weight: 700; font-size: 0.98rem; margin: 4px 0;">Fushimi Inari Taisha Hike</div>
          <p style="font-size: 0.82rem; color: #94a3b8;">Trek through 10,000 vermilion torii gates winding through sacred forest paths up Mount Inari.</p>
          <div style="font-size: 0.75rem; color: #fbbf24; margin-top: 4px;">💡 Arrive before 7:30 AM to capture peaceful morning mist.</div>
        </div>
      </div>

      <div class="act-card">
        <input type="checkbox" checked class="checkbox">
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between;">
            <span class="badge badge-cyan">Afternoon • 02:00 PM</span>
            <span style="font-weight: 700; color: #f8fafc; font-size: 0.85rem;">$4.00 USD</span>
          </div>
          <div style="font-weight: 700; font-size: 0.98rem; margin: 4px 0;">Kiyomizu-dera Wooden Stage</div>
          <p style="font-size: 0.82rem; color: #94a3b8;">Explore the UNESCO historic wooden temple overlooking maple-canopied hills.</p>
          <div style="font-size: 0.75rem; color: #38bdf8; margin-top: 4px;">📍 Higashiyama District</div>
        </div>
      </div>

      <div class="act-card">
        <input type="checkbox" class="checkbox">
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between;">
            <span class="badge badge-cyan">Evening • 07:00 PM</span>
            <span style="font-weight: 700; color: #34d399; font-size: 0.85rem;">Free Walk</span>
          </div>
          <div style="font-weight: 700; font-size: 0.98rem; margin: 4px 0;">Gion Twilight Lantern Walk</div>
          <p style="font-size: 0.82rem; color: #94a3b8;">Stroll preserved Edo-period stone alleys and traditional wooden machiya merchant houses.</p>
        </div>
      </div>
    </div>

    <!-- Financial Analytics -->
    <div class="panel">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="font-size: 1.1rem; font-weight: 700;">📊 Budget Optimization</h3>
        <span class="badge badge-emerald">Algorithmic Model</span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px;">
        <div class="kpi-box" style="background: rgba(56, 189, 248, 0.08); border-color: rgba(56, 189, 248, 0.3);">
          <div style="font-size: 0.7rem; color: #7dd3fc; text-transform: uppercase;">Total Trip Est.</div>
          <div style="font-size: 1.4rem; font-weight: 800; color: #ffffff;">$521.51</div>
          <div style="font-size: 0.68rem; color: #64748b;">Includes 10% contingency</div>
        </div>
        <div class="kpi-box" style="background: rgba(168, 85, 247, 0.08); border-color: rgba(168, 85, 247, 0.3);">
          <div style="font-size: 0.7rem; color: #d8b4fe; text-transform: uppercase;">Per Person</div>
          <div style="font-size: 1.4rem; font-weight: 800; color: #ffffff;">$521.51</div>
          <div style="font-size: 0.68rem; color: #64748b;">1 Traveler</div>
        </div>
      </div>

      <div style="margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #94a3b8; margin-bottom: 6px;">
          <span>Category Breakdown</span>
          <span>100% Normalized</span>
        </div>
        <div style="display: flex; height: 10px; border-radius: 5px; overflow: hidden; background: rgba(255,255,255,0.05);">
          <div style="width: 38%; background: #38bdf8;"></div>
          <div style="width: 32%; background: #f59e0b;"></div>
          <div style="width: 12%; background: #a855f7;"></div>
          <div style="width: 8%; background: #10b981;"></div>
          <div style="width: 10%; background: #64748b;"></div>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; font-size: 0.72rem; color: #94a3b8;">
          <span>🔵 Lodging: 38%</span>
          <span>🟠 Dining: 32%</span>
          <span>🟣 Sightseeing: 12%</span>
          <span>🟢 Transit: 8%</span>
          <span>⚪ Contingency: 10%</span>
        </div>
      </div>

      <div style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 10px; padding: 12px; font-size: 0.8rem; color: #fef3c7;">
        💵 <strong>Currency Advice:</strong> Japanese Yen (JPY). Keep 5,000–10,000 JPY cash for traditional temples, shrines, and local stalls.
      </div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(itineraryHtmlPath, itineraryHtmlContent, 'utf-8');
const photo2Path = path.join(assetsDir, 'photo2_website_itinerary_and_budget.png');
captureScreenshot(`file:///${itineraryHtmlPath.replace(/\\/g, '/')}`, photo2Path, 1440, 920, 1500);

// 3. Prepare Code Snippet Photo 1 (Golden Prompt Engine)
const codeSnippet1Html = path.join(assetsDir, 'temp_code1.html');
const code1Content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #060913;
      padding: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-family: 'JetBrains Mono', monospace;
    }
    .window {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(56, 189, 248, 0.2);
      max-width: 900px;
      width: 100%;
      overflow: hidden;
    }
    .window-header {
      background: #1e293b;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .dots { display: flex; gap: 8px; }
    .dot { width: 12px; height: 12px; border-radius: 50%; }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #f59e0b; }
    .dot-green { background: #10b981; }
    .window-title { font-size: 0.85rem; color: #94a3b8; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; }
    .badge { background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 3px 10px; border-radius: 9999px; font-size: 0.72rem; }
    .code-body {
      padding: 24px;
      font-size: 0.86rem;
      line-height: 1.65;
      color: #e2e8f0;
      overflow-x: auto;
    }
    .kw { color: #f43f5e; font-weight: 600; }
    .fn { color: #38bdf8; }
    .str { color: #34d399; }
    .comm { color: #64748b; font-style: italic; }
    .cls { color: #fbbf24; }
    .arg { color: #c084fc; }
  </style>
</head>
<body>
  <div class="window">
    <div class="window-header">
      <div class="dots">
        <span class="dot dot-red"></span>
        <span class="dot dot-yellow"></span>
        <span class="dot dot-green"></span>
      </div>
      <div class="window-title">backend/app/services/llm_engine.py — Golden Prompt Architecture</div>
      <span class="badge">Google ADK Spec</span>
    </div>
    <div class="code-body">
<span class="comm"># 1. The Golden Prompt Formula: Role + Context + Rules + Structured Output</span>
<span class="kw">def</span> <span class="fn">generate_golden_prompt</span>(<span class="arg">req</span>: <span class="cls">TripGenerateRequest</span>) -&gt; <span class="cls">str</span>:
    <span class="kw">return</span> <span class="str">f"""
[ROLE]: Expert Personalized Travel Itinerary Architect.
[CONTEXT]:
- Target Destination: {req.destination} | Duration: {req.duration_days} days
- Budget Tier: {req.budget_tier.value} | Style: {req.travel_style.value}
- Group Dynamics: {req.companion_type.value} (Size: {req.group_size})
- Special Requests: {req.special_requests}

[RULES & CONSTRAINTS]:
1. Geographically cluster activities each day to minimize commute fatigue.
2. Provide authentic local culinary recommendations (Breakfast, Lunch, Dinner).
3. Factor in budget tier ({req.budget_tier.value}) when calculating itemized pricing.
4. Output MUST be 100% valid JSON strictly conforming to the Pydantic schema.
"""</span>

<span class="comm"># 2. Multi-Provider Router: Groq Llama-3 &rarr; Gemini &rarr; Autonomous Domain Engine</span>
<span class="kw">async def</span> <span class="fn">generate_itinerary</span>(<span class="arg">self</span>, <span class="arg">req</span>: <span class="cls">TripGenerateRequest</span>) -&gt; <span class="cls">Itinerary</span>:
    <span class="kw">if</span> self.groq_api_key:
        <span class="kw">try</span>:
            <span class="kw">return await</span> self.<span class="fn">_call_groq_api</span>(req)
        <span class="kw">except</span> <span class="cls">Exception</span>:
            logger.warning(<span class="str">"Groq failed. Activating Autonomous Synthesis Engine."</span>)
    
    <span class="kw">return</span> self.<span class="fn">_synthesize_itinerary</span>(req, mult=self.<span class="fn">get_multiplier</span>(req.budget_tier))
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(codeSnippet1Html, code1Content, 'utf-8');
const photo3Path = path.join(assetsDir, 'photo3_code_golden_prompt_engine.png');
captureScreenshot(`file:///${codeSnippet1Html.replace(/\\/g, '/')}`, photo3Path, 1050, 720, 1000);

// 4. Prepare Code Snippet Photo 2 (Pydantic Domain Schemas & REST API)
const codeSnippet2Html = path.join(assetsDir, 'temp_code2.html');
const code2Content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #060913;
      padding: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-family: 'JetBrains Mono', monospace;
    }
    .window {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(168, 85, 247, 0.2);
      max-width: 900px;
      width: 100%;
      overflow: hidden;
    }
    .window-header {
      background: #1e293b;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .dots { display: flex; gap: 8px; }
    .dot { width: 12px; height: 12px; border-radius: 50%; }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #f59e0b; }
    .dot-green { background: #10b981; }
    .window-title { font-size: 0.85rem; color: #94a3b8; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; }
    .badge { background: rgba(168, 85, 247, 0.15); color: #c084fc; padding: 3px 10px; border-radius: 9999px; font-size: 0.72rem; }
    .code-body {
      padding: 24px;
      font-size: 0.86rem;
      line-height: 1.65;
      color: #e2e8f0;
      overflow-x: auto;
    }
    .kw { color: #f43f5e; font-weight: 600; }
    .fn { color: #38bdf8; }
    .str { color: #34d399; }
    .comm { color: #64748b; font-style: italic; }
    .cls { color: #fbbf24; }
    .arg { color: #c084fc; }
  </style>
</head>
<body>
  <div class="window">
    <div class="window-header">
      <div class="dots">
        <span class="dot dot-red"></span>
        <span class="dot dot-yellow"></span>
        <span class="dot dot-green"></span>
      </div>
      <div class="window-title">backend/app/models/schemas.py & api/routes.py — Domain Architecture</div>
      <span class="badge">FastAPI & Pydantic v2</span>
    </div>
    <div class="code-body">
<span class="comm"># Pydantic Schema: Structured Day Plan & Interactive Activity Model</span>
<span class="kw">class</span> <span class="cls">Activity</span>(<span class="cls">BaseModel</span>):
    id: <span class="cls">str</span>
    title: <span class="cls">str</span>
    time_slot: <span class="cls">str</span>        <span class="comm"># "Morning", "Afternoon", "Evening"</span>
    estimated_cost_usd: <span class="cls">float</span>
    category: <span class="cls">str</span>         <span class="comm"># "Sightseeing", "Food", "Culture"</span>
    booking_tip: <span class="cls">Optional</span>[<span class="cls">str</span>] = <span class="kw">None</span>
    is_completed: <span class="cls">bool</span> = <span class="kw">False</span>

<span class="comm"># REST Endpoint: Interactive Landmark Checkoff & State Sync</span>
<span class="kw">@router.patch</span>(<span class="str">"/trips/{trip_id}/activities/{activity_id}"</span>)
<span class="kw">async def</span> <span class="fn">toggle_activity</span>(
    <span class="arg">trip_id</span>: <span class="cls">str</span>,
    <span class="arg">activity_id</span>: <span class="cls">str</span>,
    <span class="arg">completed</span>: <span class="cls">bool</span> = <span class="fn">Body</span>(..., <span class="arg">embed</span>=<span class="kw">True</span>)
):
    <span class="str">"""Toggles interactive completion status and syncs with Supabase/SQLite."""</span>
    updated = db_service.<span class="fn">toggle_activity</span>(trip_id, activity_id, completed)
    <span class="kw">if not</span> updated:
        <span class="kw">raise</span> <span class="cls">HTTPException</span>(status_code=404, detail=<span class="str">"Activity not found"</span>)
    <span class="kw">return</span> updated
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(codeSnippet2Html, code2Content, 'utf-8');
const photo4Path = path.join(assetsDir, 'photo4_code_schemas_and_api.png');
captureScreenshot(`file:///${codeSnippet2Html.replace(/\\/g, '/')}`, photo4Path, 1050, 720, 1000);

console.log("All 4 LinkedIn assets generated successfully!");
