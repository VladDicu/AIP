"use client";
import { useState } from "react";
import translations from "./translations.json";
// IMPORTUL ACTUALIZAT PENTRU CLERK v6:
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs'

export default function Home() {
  const [lang, setLang] = useState<"ro" | "en">("ro");
  const [strictMode, setStrictMode] = useState(true);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string; info?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfContext, setPdfContext] = useState("");
  const t = translations[lang];

  // STAREA PENTRU ALEGEREA ROLULUI
  const [userRole, setUserRole] = useState<"Student" | "Profesor" | null>(null);
  
  // Stări Quiz
  const [quizData, setQuizData] = useState<any[] | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.extracted_text) {
        setPdfContext(data.extracted_text);
        alert(`Succes: Fișier procesat!`);
      } else {
        alert("Eroare: " + (data.error || "Fișier invalid"));
      }
    } catch (err) {
      alert("Eroare de conexiune la server.");
    }
  };

  const handleAction = async (type: "summary" | "quiz") => {
    if (!pdfContext) return alert("Încarcă un document mai întâi!");
    const actionLabel = type === "summary" ? "Generează rezumat" : "Generează quiz";
    setMessages((prev) => [...prev, { role: "user", content: actionLabel }]);
    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: pdfContext, action_type: type }),
      });
      const data = await res.json();
      if (data.error) {
        setMessages((prev) => [...prev, { role: "ai", content: data.error }]);
      } else if (data.type === "quiz") {
        setQuizData(data.data); setUserAnswers({}); setQuizSubmitted(false); setShowQuiz(true);
        setMessages((prev) => [...prev, { role: "ai", content: "Am generat testul! O nouă fereastră s-a deschis." }]);
      } else {
        setMessages((prev) => [...prev, { role: "ai", content: data.answer }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", content: "Eroare de conexiune." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    const newMsg = { role: "user", content: question };
    setMessages((prev) => [...prev, newMsg]);
    setQuestion("");
    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: newMsg.content, strict_mode: strictMode, context: pdfContext }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.answer || data.error, info: data.confidence_status }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", content: "Eroare de conexiune." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative">
      
      {/* 1. ECRANUL DE LOGIN (Dacă NU ești autentificat) */}
      <Show when="signed-out">
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full border border-slate-100">
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">AIP <span className="text-slate-500 font-medium text-2xl">Framework</span></h1>
            <p className="text-slate-500 mb-8">Autentifică-te pentru a accesa platforma educațională inteligentă.</p>
            <div className="space-y-4">
              <SignInButton mode="modal">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md">
                  Autentificare (Log in)
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full bg-white hover:bg-slate-50 text-indigo-600 border-2 border-indigo-100 font-bold py-3 px-4 rounded-xl transition-colors">
                  Creare Cont (Sign up)
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </Show>

      {/* 2. PLATFORMA (Dacă EȘTI autentificat) */}
      <Show when="signed-in">
        
        {/* A) SELECT ROLE (apare prima dată după login) */}
        {!userRole && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-lg w-full">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Selectează-ți Rolul</h2>
              <p className="text-slate-500 mb-8">Personalizăm experiența AIP Framework pentru tine.</p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setUserRole("Student")}
                  className="flex flex-col items-center p-6 border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 rounded-xl transition-all group"
                >
                  <span className="text-4xl mb-3">🎓</span>
                  <span className="font-bold text-lg text-slate-700 group-hover:text-indigo-700">Student</span>
                </button>
                <button 
                  onClick={() => setUserRole("Profesor")}
                  className="flex flex-col items-center p-6 border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 rounded-xl transition-all group"
                >
                  <span className="text-4xl mb-3">👨‍🏫</span>
                  <span className="font-bold text-lg text-slate-700 group-hover:text-indigo-700">Profesor</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* B) INTERFAȚA PRINCIPALĂ */}
        {userRole && (
          <div className="p-6 md:p-12">
            <header className="flex justify-between items-center mb-10 max-w-6xl mx-auto">
              <div>
                <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">AIP <span className="text-slate-500 font-medium text-xl">Framework</span></h1>
                <p className="text-sm text-slate-400 font-medium mt-1">Sesiune: {userRole}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => setLang(lang === "ro" ? "en" : "ro")} className="bg-white border border-slate-200 text-sm font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all hidden sm:block">
                  {lang === "ro" ? "🇬🇧 English" : "🇷🇴 Română"}
                </button>
                <div className="bg-white rounded-full shadow-sm border border-slate-200 p-1 flex items-center justify-center">
                   <UserButton afterSignOutUrl="/"/>
                </div>
              </div>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <section className="col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h2 className="font-semibold text-lg mb-4 text-slate-700">1. {t.upload}</h2>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-indigo-200 border-dashed rounded-xl cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="text-sm text-indigo-600 font-medium">Click pentru a adăuga fișier</p>
                      {pdfContext && <p className="text-xs text-green-600 mt-2 font-bold">✓ Fișier procesat</p>}
                    </div>
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4">
                  <button onClick={() => handleAction('summary')} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-xl text-sm font-bold shadow-sm transition">Rezumat Rapid</button>
                  <button onClick={() => handleAction('quiz')} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl text-sm font-bold shadow-sm transition">Test (Quiz)</button>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                   <h2 className="font-semibold text-lg mb-4 text-slate-700">2. Mod de operare</h2>
                   <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={strictMode} onChange={() => setStrictMode(!strictMode)} />
                        <div className={`block w-14 h-8 rounded-full transition-colors ${strictMode ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${strictMode ? 'transform translate-x-6' : ''}`}></div>
                      </div>
                      <div className="font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">{t.strict_mode}</div>
                   </label>
                </div>
              </section>

              <section className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[600px]">
                <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 rounded-t-2xl space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-slate-400 mt-20 text-sm">Încarcă un curs și pune o întrebare pentru a începe.</div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div key={idx} className={`p-4 rounded-xl max-w-[80%] w-fit ${msg.role === 'user' ? 'bg-indigo-600 text-white ml-auto' : 'bg-white border border-slate-200 text-slate-700 mr-auto shadow-sm'}`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        {msg.info && <span className="text-xs mt-2 block opacity-70 border-t pt-1 border-current">{msg.info}</span>}
                      </div>
                    ))
                  )}
                  {isLoading && <div className="text-slate-400 text-sm animate-pulse">AI-ul procesează...</div>}
                </div>
                
                <div className="p-4 border-t border-slate-100 bg-white rounded-b-2xl flex space-x-3">
                  <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAsk()} placeholder="Scrie întrebarea aici..." className="flex-1 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" />
                  <button onClick={handleAsk} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-colors">{t.ask}</button>
                </div>
              </section>
            </main>
            
            {/* Modal Quiz */}
            {showQuiz && quizData && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-indigo-700">Test de Verificare (Quiz)</h2>
                    {!quizSubmitted && <button onClick={() => setShowQuiz(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">✕</button>}
                  </div>
                  
                  <div className="space-y-8">
                    {quizData.map((q, qIndex) => (
                      <div key={qIndex} className="space-y-3">
                        <p className="font-semibold text-lg text-slate-800">{qIndex + 1}. {q.question}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.options.map((opt: string, oIndex: number) => {
                            const isSelected = userAnswers[qIndex] === oIndex;
                            const isCorrect = q.correct_index === oIndex;
                            let btnClass = "border-2 rounded-xl p-3 text-left transition-all outline-none ";
                            
                            if (!quizSubmitted) {
                              btnClass += isSelected ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-medium" : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-600";
                            } else {
                              if (isCorrect) {
                                btnClass += "border-emerald-500 bg-emerald-100 text-emerald-800 font-bold shadow-sm"; 
                              } else if (isSelected && !isCorrect) {
                                btnClass += "border-red-500 bg-red-50 text-red-700 line-through opacity-80";
                              } else {
                                btnClass += "border-slate-100 opacity-50 text-slate-400";
                              }
                            }
                            return (
                              <button key={oIndex} onClick={() => !quizSubmitted && setUserAnswers(prev => ({...prev, [qIndex]: oIndex}))} className={btnClass} disabled={quizSubmitted}>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    {!quizSubmitted ? (
                      <button 
                        onClick={() => {
                          if (Object.keys(userAnswers).length < quizData.length) return alert("Te rog să răspunzi la toate întrebările înainte de evaluare!");
                          setQuizSubmitted(true);
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-xl shadow-md transition-colors"
                      >
                        Confirmă Răspunsurile
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          const score = quizData.reduce((acc, q, idx) => acc + (userAnswers[idx] === q.correct_index ? 1 : 0), 0);
                          setMessages(prev => [...prev, { role: "ai", content: `📌 Scor Test: Ai obținut ${score} din ${quizData.length} puncte! Răspunsurile au fost salvate.` }]);
                          setShowQuiz(false);
                        }}
                        className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-8 py-3 rounded-xl shadow-md transition-colors"
                      >
                        Închide și Salvează Rezultatul
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Show>
    </div>
  );
}