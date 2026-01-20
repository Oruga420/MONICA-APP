import React, { useState } from 'react';
import { parseScoresInput } from '../utils/gradingUtils';

interface InputSectionProps {
  onScoresSubmit: (scores: number[]) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ onScoresSubmit }) => {
  const [textInput, setTextInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const scores = parseScoresInput(textInput);
    if (scores.length === 0) {
      setError('No se encontraron números válidos (0-50). Por favor verifica tu lista.');
      return;
    }
    setError('');
    onScoresSubmit(scores);
  };

  const handleClear = () => {
    setTextInput('');
    setError('');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        1. Ingresar Resultados
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Copia y pega la columna de aciertos desde tu Excel. (Números del 0 al 50).
      </p>
      
      <textarea
        className="flex-grow w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-700 font-mono text-sm resize-none mb-4"
        placeholder={`Ejemplo:\n45\n32\n12\n8\n...`}
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm"
        >
          Procesar Datos
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default InputSection;
