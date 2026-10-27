# AI Study Pro

Responsiv svensk quiz-app för IT och nätverksteknik.

## Kör lokalt
1. Installera Node.js 18 eller senare.
2. Öppna en terminal i mappen `ai-study-pro`.
3. Kör `npm start`.
4. Öppna `http://localhost:3000` i webbläsaren.

Appen fungerar utan API-nyckel med inbyggda frågor. Dessa är en begränsad demobank; vid längre quiz kan frågor återkomma och svårighetsgrad påverkar endast AI-läget.

## Aktivera AI-genererade frågor
Sätt miljövariabeln `OPENAI_API_KEY` på servern och starta om appen.

macOS/Linux:
```bash
export OPENAI_API_KEY="din-nyckel"
npm start
```

Windows PowerShell:
```powershell
$env:OPENAI_API_KEY="din-nyckel"
npm start
```

Servern använder OpenAI API och modellen `gpt-4o-mini` som standard. Modell kan ändras via `OPENAI_MODEL`. API-användning kan kosta pengar. Lägg aldrig API-nyckeln i `index.html` eller i ett publikt kodförråd.

## Publicering
Appen kräver en Node.js-server. Publicera projektet hos en värd som stöder Node.js och konfigurera API-nyckeln som hemlig miljövariabel. Resultat sparas bara i respektive webbläsares localStorage, inte på servern.
