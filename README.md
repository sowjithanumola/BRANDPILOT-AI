# BrandPilot AI

BrandPilot AI is an AI-powered personal branding engine that helps creators, entrepreneurs, and professionals build a powerful presence online.

## Features

- **AI Brand Analysis**: Generates unique positioning, bios, and content pillars.
- **90-Day Roadmap**: A strategic plan to grow your authority and following.
- **30-Day Content Calendar**: Daily ideas, types, and viral hooks.
- **Growth Insights**: Smart tips for engagement and trend adaptation.
- **Export to PDF**: Take your strategy anywhere.
- **Secure Auth**: SQLite-backed authentication and profile saving.

## Setup Instructions

1. **Environment Variables**:
   - Ensure `GEMINI_API_KEY` is set in your environment.
   - (Optional) Set `JWT_SECRET` for enhanced security.

2. **Installation**:
   ```bash
   npm install
   ```

3. **Running the App**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, Motion.
- **Backend**: Express, Better-SQLite3.
- **AI**: Google Gemini API (@google/genai).
- **Visuals**: Recharts, Lucide React.
- **Export**: jsPDF, html2canvas.
