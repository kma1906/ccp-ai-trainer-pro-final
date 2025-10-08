# CCP AI Trainer PRO (Local, VS Code, ZIP)

**Stack:** React + Vite, localStorage, Web Speech API (Edge), optional OpenAI API for smarter tutor replies.

## Quick Start
1. Extract the ZIP.
2. Open folder in VS Code.
3. Run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the shown local URL (usually http://localhost:5173). Use **Microsoft Edge** for best voice support.

## Settings
- Go to **Settings** page to paste your OpenAI API Key (optional). Without it, tutor uses a simple local mode.
- Choose default language (English/العربية).

## Personal Tutor (Human-like)
- Click **Speak 🎙️** to talk. Uses Web Speech API (Edge).
- Two voices:
  - **Dr Khaled** (male)
  - **Dr Noof** (female)
- The app auto-picks the closest available Edge voice. You can switch voices anytime.

## Exams
- **Mock Exam:** up to 50 Q (sampling from your bank).
- **Final Exam:** targets **119** Q + one **Memo** text answer.
- Results are saved to localStorage and reflected on the Dashboard (avg score + weak areas).

## Questions Bank
- Comes with small English/Arabic seed. Add your full bank via **Questions (Admin)** page:
  - Paste CSV with columns: `id,q,a1,a2,a3,a4,c,cat`
  - Choose language and Import.
- Imported sets are stored in localStorage keys: `qs_en` / `qs_ar`.

## Analytics
- Dashboard shows weak areas bar chart and an auto study plan.

## Notes
- No server or database needed now (safe for work). Data is local to the browser.
- To reset, clear site data from browser (localStorage).

---

## Using a `.env` file (optional but recommended for local dev)
Create a file named `.env` in the project root:
```
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxx
```
Then rebuild:
```
npm run build
npm run preview
```
or just `npm run dev` again.

## Troubleshooting API Key
- Test your key from **Settings → Test Key**.
- Ensure there are no extra spaces or line breaks.
- Use **Microsoft Edge** and run from **http://localhost:5173** (CORS is allowed by OpenAI).
- If you still see errors, try rebuilding after adding `.env`, or share the test message.



---

## Vercel-ready deployment (placeholder API key included)
This package is prepared for **Vercel**. It includes a placeholder API key embedded in the code:
```
sk-yourkey-placeholder
```
**IMPORTANT:** Replace the placeholder with your real OpenAI key **before** deploying to Vercel.

### To replace the placeholder locally (recommended)
1. Open `src/lib/openai.js` and find the line that returns the API key. Replace `'sk-yourkey-placeholder'` with your real key (keep the quotes).  
   Or, in Settings page in the app paste the key and Save after deployment (less recommended for demo).

### To deploy on Vercel (quick):
1. Create a Vercel account and install Vercel CLI if you want, or use the web dashboard.  
2. Push this project to a GitHub repo or upload the ZIP via Vercel web UI.  
3. If you prefer not to embed the key in code for production, add it in Vercel Dashboard → Settings → Environment Variables (key: `VITE_OPENAI_API_KEY`).

### Notes on security
- Embedding API keys in code is convenient for demos, but **not secure** for public repos. Replace the placeholder with a real key and consider using Vercel Environment Variables for production.
