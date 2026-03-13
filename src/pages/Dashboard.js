import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Download, TrendingUp, Award, Flame } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Dashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  
  const [userData, setUserData] = useState(null);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [emotionalData, setEmotionalData] = useState(null);
  const [emotionsBreakdown, setEmotionsBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user data
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }

      // Fetch diary entries (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const q = query(
        collection(db, 'diaryEntries'),
        where('userId', '==', currentUser.uid),
        where('date', '>=', thirtyDaysAgo.toISOString())
      );
      
      const querySnapshot = await getDocs(q);
      const entries = querySnapshot.docs.map(doc => doc.data());
      setDiaryEntries(entries);
      
      processEmotionalData(entries);
      processEmotionsBreakdown(entries);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processEmotionalData = (entries) => {
    const last7Days = entries.slice(-7);
    const dates = last7Days.map(e => new Date(e.date).toLocaleDateString());
    const intensities = last7Days.map(e => e.intensity);

    setEmotionalData({
      labels: dates,
      datasets: [{
        label: 'Intensidad Emocional',
        data: intensities,
        borderColor: '#7BC2A8',
        backgroundColor: 'rgba(123, 194, 168, 0.1)',
        fill: true,
        tension: 0.4
      }]
    });
  };

  const processEmotionsBreakdown = (entries) => {
    const emotionCounts = {};
    entries.forEach(entry => {
      entry.emotions.forEach(emotion => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });

    const sortedEmotions = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    setEmotionsBreakdown({
      labels: sortedEmotions.map(([emotion]) => t(`emotions.${emotion}`)),
      datasets: [{
        data: sortedEmotions.map(([, count]) => count),
        backgroundColor: [
          '#7BC2A8',
          '#B8A7D4',
          '#6BB6D6',
          '#A8DCC6',
          '#D4C9E8'
        ]
      }]
    });
  };

  const exportToPDF = async () => {
    const element = document.getElementById('dashboard-content');
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`mi-diario-reporte-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const getLevelEmoji = (level) => {
    const emojis = { seed: '🌱', sprout: '🌿', youngTree: '🌳', forest: '🌲' };
    return emojis[level] || '🌱';
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true, max: 10 }
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>{t('dashboard.title')}</h1>
        <button className="btn btn-primary" onClick={exportToPDF}>
          <Download size={20} />
          {t('dashboard.exportPDF')}
        </button>
      </div>

      <div id="dashboard-content">
        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card card">
            <div className="stat-icon">{getLevelEmoji(userData?.level)}</div>
            <div className="stat-content">
              <span className="stat-label">{t('dashboard.level')}</span>
              <span className="stat-value">{t(`levels.${userData?.level || 'seed'}`)}</span>
            </div>
          </div>

          <div className="stat-card card">
            <Award className="stat-icon" />
            <div className="stat-content">
              <span className="stat-label">{t('dashboard.points')}</span>
              <span className="stat-value">{userData?.points || 0}</span>
            </div>
          </div>

          <div className="stat-card card">
            <TrendingUp className="stat-icon" />
            <div className="stat-content">
              <span className="stat-label">Entradas</span>
              <span className="stat-value">{diaryEntries.length}</span>
            </div>
          </div>

          <div className="stat-card card">
            <Flame className="stat-icon" />
            <div className="stat-content">
              <span className="stat-label">{t('dashboard.streak')}</span>
              <span className="stat-value">7 días</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-container card">
            <h3>{t('dashboard.emotionalTrend')}</h3>
            {emotionalData && (
              <Line data={emotionalData} options={chartOptions} />
            )}
          </div>

          <div className="chart-container card">
            <h3>Emociones más frecuentes</h3>
            {emotionsBreakdown && (
              <Doughnut data={emotionsBreakdown} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
