# AIP (AI-Powered Platform) - Master Context

**Autor Principal:** Vlad Dicu
**Status Repository:** Privat / În dezvoltare

## 1. Descrierea Proiectului
AIP este o platformă educațională dedicată mediului academic. Utilizează un LLM propriu (in-house) pentru a structura materialele de studiu, oferind un mediu de învățare adaptabil, protejat prin filtrarea surselor[cite: 2].

## 2. Arhitectura și Tehnologii
- **Backend API:** Python (FastAPI).
- **Memorie Vectorială:** ChromaDB local și modele de embedding HuggingFace (`all-MiniLM-L6-v2`).
- **Infrastructură:** Dezvoltare locală cu pipeline RAG funcțional.

## 3. Module Implementate
1. **Agentul de Ingestie:** Endpoint de upload, extragere text (PyPDF), partiționare (LangChain) și vectorizare[cite: 2].
2. **Stocare:** Bază de date vectorială persistentă pentru stocarea pe termen lung a cunoștințelor.
3. **Agentul de Extragere (Strict Source Mode):** Endpoint de căutare a similarității care returnează cele mai relevante 3 fragmente din documentele validate[cite: 2].

## 4. Structura Curentă
/aip-backend
  /chroma_db    # Baza de date vectorială (persistentă)
  main.py       # API Core