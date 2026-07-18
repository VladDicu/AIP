# AIP (AI-Powered Platform) - Master Context

**Autor Principal:** Vlad Dicu
**Status Repository:** Privat / În dezvoltare

## 1. Descrierea Proiectului
AIP este o platformă educațională modulară care utilizează inteligența artificială pentru a structura și valida materialele de studiu. Scopul este de a oferi un mediu de învățare personalizat, unde acuratețea datelor este controlată prin filtrarea strictă a surselor.

## 2. Arhitectura și Tehnologii
- **Backend:** Python (FastAPI / Flask) - gestionare API-uri, procesare documente, integrare modele ML/AI.
- **Frontend:** Urmează să fie definit (ex: React / Vue.js).
- **Procesare AI:** Modele NLP (pentru rezumate, generare quiz-uri), module Text-to-Speech (pentru format audio).

## 3. Module Principale (Core Features)
1. **Sistem de Ingestie și Procesare a Documentelor:** Încărcarea materialelor (PDF, text) de către studenți și profesori.
2. **Strict Source Mode:** Un filtru binar care forțează AI-ul să folosească exclusiv materiale verificate de profesori.
3. **Confidence Score Generator:** Un algoritm care evaluează gradul de certitudine al informațiilor atunci când modul "Strict Source" este dezactivat și se folosesc surse externe.
4. **Generator de Output Personalizat:**
   - Instant Summaries.
   - Text-to-Audio (Podcasts).
   - Adaptive Quizzes & Learning Plans.
5. **Teacher Insights Dashboard:** Modul de analiză a performanței studenților și colectare de feedback.
6. **Browser Extensions:** Tool-uri auxiliare (Grammar/Style, Time Management, Translation).

## 4. Structura de Bază a Proiectului (Draft)
```text
/aip-backend
  /api          # Rutele API-ului
  /core         # Logica de business (Strict Source Mode, Confidence Score)
  /models       # Structurile de date și schemele
  /services     # Servicii externe (modele NLP, module Text-to-Speech)
  /utils        # Funcții utilitare