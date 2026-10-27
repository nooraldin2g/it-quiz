# AI Quiz – IT-infrastruktur

En interaktiv webbapplikation för självstudier och repetition inför kunskapskontroll i kursen **IT-infrastruktur** (25 YH-poäng).

🌐 **Testa quizet här:** [https://nooraldin2g.github.io/it-quiz/](https://nooraldin2g.github.io/it-quiz/)

---

## 📖 Om projektet

Detta quiz är utvecklat som ett studieverktyg för IT-säkerhetstekniker. Frågebatteriet består av 50 flervalsfrågor framtagna med stöd av generativ AI och därefter manuellt granskade, faktakorrigerade och anpassade mot kursplanens lärandemål.

### Moment som täcks:
- **Virtualisering:** Typ 1 & Typ 2 hypervisors, PC-, server-, data- och applikationsvirtualisering samt containers (KVM, cgroups).
- **Hårdvara & Resursfördelning:** Allokering av CPU/minne, Thin vs. Thick Provisioning, Out-of-band management (iDRAC/iLO) och kapacitetsplanering.
- **Säkerhetskopiering & Kontinuitet:** 3-2-1-regeln, RPO, RTO, oföränderliga backuper (Immutable/WORM), snapshots vs. backup och Air-gapping.
- **Högtillgänglighet & Infrastruktur:** Kluster, failover, delad lagring (SAN), Quorum/Split-Brain, redundans och ZFS.
- **Sårbarheter & Historik:** Hypervisor Escape, sidokanalsangrepp (Spectre/Meltdown), nätverkssegmentering, Micro-Partitioning (PowerVM) samt IT-arkitekturens historiska utveckling (IBM).

---

## ⚙️ Hur applikationen fungerar

- **Ren klientsida:** Hela applikationen körs direkt i webbläsaren via en statisk fil (`index.html`) hostad på GitHub Pages. Ingen backend eller databas krävs.
- **Dynamisk slumpning:** Både frågeurvalet och svarsalternativen slumpas automatiskt med Fisher-Yates-algoritmen vid varje start för att motverka mönsterinlärning.
- **Omedelbar återkoppling:** Varje fråga rättas direkt med en pedagogisk förklaring till det korrekta svaret.
- **Valbart antal frågor:** Möjlighet att välja mellan 10, 20, 30, 40 eller samtliga 50 frågor per session.
