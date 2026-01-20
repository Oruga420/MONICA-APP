import React from 'react';

interface StatsOverviewProps {
  totalStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ 
  totalStudents, 
  averageScore, 
  highestScore, 
  lowestScore 
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Alumnos</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{totalStudents}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Promedio Aciertos</p>
        <p className="text-2xl font-bold text-indigo-600 mt-1">{averageScore.toFixed(1)} <span className="text-sm text-gray-400 font-normal">/ 50</span></p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Calificación Aprox.</p>
        <p className="text-2xl font-bold text-green-600 mt-1">{((averageScore / 50) * 10).toFixed(1)}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rango (Min-Max)</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{lowestScore} - {highestScore}</p>
      </div>
    </div>
  );
};

export default StatsOverview;
