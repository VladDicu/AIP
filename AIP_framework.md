# AIP (AI-Powered Platform) - Master Context

**Autor Principal:** Vlad Dicu
**Status Repository:** Privat / În dezvoltare

## 1. Descrierea Proiectului
AIP este o platformă educațională dedicată mediului academic. Utilizează un LLM propriu (in-house) pentru a structura materialele de studiu, oferind un mediu de învățare adaptabil, protejat prin filtrarea surselor[cite: 2].

## 2. Arhitectura și Tehnologii
- **Backend API:** Python (FastAPI) cu sistem de prioritizare a cererilor (ex: task-uri rapide din extensii vs. procesare documente mari).
- **Procesare AI (LLM Propriu):** Model open-source antrenat in-house pe baza unei arhitecturi de tip encoder-decoder. Implementare inițială prin RAG (Continuous Learning) pe documente universitare, urmată de fine-tuning.
- **Infrastructură:** Dezvoltare locală (modele cuantizate). Producție bazată pe arhitecturi Serverless GPU susținute prin credite educaționale sau infrastructură universitară.

## 3. Module Principale (Core Features)
1. **Sistem de Ingestie (Encoder):** Vectorizarea materialelor studenților și profesorilor[cite: 2].
2. **Strict Source Mode:** LLM-ul răspunde exclusiv pe baza materialelor verificate[cite: 2].
3. **Confidence Score:** Sistem adversarial de validare folosind similaritatea cosinusoidală între răspuns și sursele multiple, combinată cu entropia decodorului[cite: 2]. 
4. **Generator de Output Personalizat (Decodoare):**
   - Instant Summaries[cite: 2].
   - Text-to-Audio (Podcasts)[cite: 2].
   - Adaptive Quizzes & Learning Plans[cite: 2].
5. **Browser Extensions:** Micro-frontend-uri care interoghează direct LLM-ul central pentru funcții de productivitate, gramatică și traduceri rapide[cite: 2].

## 4. Structura de Bază a Proiectului
```text
/aip-backend
  /api          # Rute FastAPI și cozi de prioritizare
  /core         # Logica LLM (RAG, Strict Source Mode, Confidence Score)
  /models       # Structuri de date 
  /vector_db    # Integrarea bazei de date vectoriale
  /extensions   # API endpoints pentru extensiile de browser