import React, { useState, useMemo } from 'react';
import InputSection from './components/InputSection';
import StatsOverview from './components/StatsOverview';
import DistributionChart from './components/DistributionChart';
import ResultsTable from './components/ResultsTable';
import { calculateDistribution } from './utils/gradingUtils';
import { generateTeacherReport } from './services/geminiService';
import { StudentScore, AnalysisState } from './types';

function App() {
  const [scores, setScores] = useState<StudentScore[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisState>({
    loading: false,
    text: null,
    error: null,
  });

  const handleScoresSubmit = (rawScores: number[]) => {
    const formattedScores = rawScores.map((s, index) => ({ id: index, score: s }));
    setScores(formattedScores);
    setAnalysis({ loading: false, text: null, error: null }); // Reset analysis on new data
  };

  // Derived state: recalculates whenever scores change
  const distribution = useMemo(() => calculateDistribution(scores), [scores]);
  
  const totalStudents = scores.length;
  const averageScore = totalStudents > 0 
    ? scores.reduce((sum, s) => sum + s.score, 0) / totalStudents 
    : 0;
  const highestScore = totalStudents > 0 ? Math.max(...scores.map(s => s.score)) : 0;
  const lowestScore = totalStudents > 0 ? Math.min(...scores.map(s => s.score)) : 0;

  const handleGenerateReport = async () => {
    setAnalysis({ ...analysis, loading: true, error: null });
    try {
      const report = await generateTeacherReport(distribution, totalStudents, averageScore);
      setAnalysis({ loading: false, text: report, error: null });
    } catch (e) {
      setAnalysis({ 
        loading: false, 
        text: null, 
        error: "No se pudo generar el reporte. Verifica tu conexión o intenta de nuevo." 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-12">
      {/* Navbar */}
      <nav className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-bold text-xl tracking-tight">EvalDashboard</span>
            </div>
            <div className="text-sm font-medium text-indigo-200 bg-indigo-800 px-3 py-1 rounded-full">
              Resultados 5º Grado
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Input */}
          <div className="md:col-span-4 lg:col-span-3">
            <InputSection onScoresSubmit={handleScoresSubmit} />
          </div>

          {/* Right Column: Dashboard */}
          <div className="md:col-span-8 lg:col-span-9">
            {scores.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg font-medium">No hay datos todavía</p>
                <p className="text-sm mt-1">Ingresa los aciertos en el panel izquierdo para comenzar.</p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Metrics */}
                <StatsOverview 
                  totalStudents={totalStudents} 
                  averageScore={averageScore}
                  highestScore={highestScore}
                  lowestScore={lowestScore}
                />

                {/* Main Viz and Table */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                      2. Distribución de Niveles
                    </h2>
                  </div>
                  
                  <DistributionChart data={distribution} />
                  <ResultsTable data={distribution} />
                </div>

                {/* AI Analysis Section */}
                <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100">
                   <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-indigo-900 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      3. Reporte IA Pedagógico
                    </h2>
                    {!analysis.text && !analysis.loading && (
                      <button 
                        onClick={handleGenerateReport}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg shadow transition-all flex items-center gap-2"
                      >
                         Generar Análisis
                      </button>
                    )}
                  </div>

                  {analysis.loading && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-3"></div>
                      <p className="text-indigo-600 font-medium animate-pulse">Analizando resultados con Gemini...</p>
                    </div>
                  )}

                  {analysis.error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-200">
                      {analysis.error}
                    </div>
                  )}

                  {analysis.text && (
                    <div className="prose prose-sm max-w-none text-gray-700 bg-white p-6 rounded-lg border border-indigo-100 shadow-sm">
                      <div dangerouslySetInnerHTML={{ 
                        __html: analysis.text
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br />') 
                        }} 
                      />
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                         <button 
                            onClick={() => {
                                navigator.clipboard.writeText(analysis.text || "");
                                alert("Texto copiado al portapapeles");
                            }}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                         >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            Copiar Reporte
                         </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
