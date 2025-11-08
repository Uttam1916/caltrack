import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { CalorieChart } from './CalorieChart';
import { MacroRing } from './MacroRing';
import { AddFoodModal } from './AddFoodModal';
import '../styles/dashboard.css';

// Mock data
const MOCK_USER_GOALS = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fats: 67
};

// We'll fetch today's entries from the backend. Frontend uses the following shape:
// { id, name, calories, protein, carbs, fats, date }

const MOCK_HISTORY = [
  { date: 'Mon', calories: 1850 },
  { date: 'Tue', calories: 2100 },
  { date: 'Wed', calories: 1920 },
  { date: 'Thu', calories: 2050 },
  { date: 'Fri', calories: 1780 },
  { date: 'Sat', calories: 2200 },
  { date: 'Sun', calories: 1450 }
];

export function Dashboard() {
  const [showAddFood, setShowAddFood] = useState(false);
  const [foodEntries, setFoodEntries] = useState<Array<any>>([]);
  const [consumed, setConsumed] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  const [loading, setLoading] = useState(true);

  const remaining = {
    calories: MOCK_USER_GOALS.calories - consumed.calories,
    protein: MOCK_USER_GOALS.protein - consumed.protein,
    carbs: MOCK_USER_GOALS.carbs - consumed.carbs,
    fats: MOCK_USER_GOALS.fats - consumed.fats
  };

  const caloriePercent = (consumed.calories / MOCK_USER_GOALS.calories) * 100;

  // Load today's entries from backend
  useEffect(() => {
    async function fetchToday() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/entries/today', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        // map _id -> id and derive time string
        const mapped = data.map((e: any) => ({
          id: e._id,
          name: e.name,
          calories: e.calories,
          protein: e.protein,
          carbs: e.carbs,
          fats: e.fats,
          date: e.date,
          time: new Date(e.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }));
        setFoodEntries(mapped);
        // calculate consumed totals
        const totals = mapped.reduce(
          (acc: any, item: any) => {
            acc.calories += Number(item.calories || 0);
            acc.protein += Number(item.protein || 0);
            acc.carbs += Number(item.carbs || 0);
            acc.fats += Number(item.fats || 0);
            return acc;
          },
          { calories: 0, protein: 0, carbs: 0, fats: 0 }
        );
        setConsumed(totals);
      } catch (err) {
        console.error('Error loading today entries', err);
      } finally {
        setLoading(false);
      }
    }

    fetchToday();
  }, []);

  // Add a new food entry: POST to backend and update state from returned entry
  const handleAddFood = async (food: any) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(food)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Failed to create entry: ${res.status}`);
      }
      const created = await res.json();
      const mapped = {
        id: created._id,
        name: created.name,
        calories: created.calories,
        protein: created.protein,
        carbs: created.carbs,
        fats: created.fats,
        date: created.date,
        time: new Date(created.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setFoodEntries(prev => [...prev, mapped]);
      setConsumed(prev => ({
        calories: prev.calories + Number(mapped.calories || 0),
        protein: prev.protein + Number(mapped.protein || 0),
        carbs: prev.carbs + Number(mapped.carbs || 0),
        fats: prev.fats + Number(mapped.fats || 0)
      }));
      setShowAddFood(false);
    } catch (err) {
      console.error('Failed to add food', err);
      // you could show a toast here
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/entries/${id}`, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Failed to delete entry: ${res.status}`);
      }
      setFoodEntries(prev => prev.filter(e => e.id !== id));
      // recalc consumed totals
      setConsumed(prev => {
        const entry = foodEntries.find(e => e.id === id);
        if (!entry) return prev;
        return {
          calories: prev.calories - Number(entry.calories || 0),
          protein: prev.protein - Number(entry.protein || 0),
          carbs: prev.carbs - Number(entry.carbs || 0),
          fats: prev.fats - Number(entry.fats || 0)
        };
      });
    } catch (err) {
      console.error('Failed to delete entry', err);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Track your daily nutrition</p>
        </div>
        <button className="add-food-btn" onClick={() => setShowAddFood(true)}>
          <Plus size={20} />
          Add Food
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card calories-card">
          <div className="stat-header">
            <h3>Calories</h3>
            <span className="stat-value">{consumed.calories} / {MOCK_USER_GOALS.calories}</span>
          </div>
          <div className="calorie-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min(caloriePercent, 100)}%` }}
              />
            </div>
            <p className="remaining-text">{remaining.calories} kcal remaining</p>
          </div>
        </div>

        <div className="macros-grid">
          <MacroRing 
            label="Protein"
            current={consumed.protein}
            goal={MOCK_USER_GOALS.protein}
            color="#4CAF50"
            unit="g"
          />
          <MacroRing 
            label="Carbs"
            current={consumed.carbs}
            goal={MOCK_USER_GOALS.carbs}
            color="#2196F3"
            unit="g"
          />
          <MacroRing 
            label="Fats"
            current={consumed.fats}
            goal={MOCK_USER_GOALS.fats}
            color="#FF9800"
            unit="g"
          />
        </div>
      </div>

      <div className="chart-section">
        <h2>7-Day Calorie History</h2>
        <CalorieChart data={MOCK_HISTORY} goal={MOCK_USER_GOALS.calories} />
      </div>

      <div className="food-log-section">
        <h2>Today's Food Log</h2>
        <div className="food-entries">
          {foodEntries.map(entry => (
            <div key={entry.id} className="food-entry">
              <div className="food-info">
                <h4>{entry.name}</h4>
                <span className="food-time">{entry.time}</span>
              </div>
              <div className="food-macros">
                <span>{entry.calories} kcal</span>
                <span className="macro-detail">P: {entry.protein}g</span>
                <span className="macro-detail">C: {entry.carbs}g</span>
                <span className="macro-detail">F: {entry.fats}g</span>
              </div>
              <div className="food-actions">
                <button className="delete-entry-btn" onClick={() => handleDeleteEntry(entry.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddFood && (
        <AddFoodModal 
          onClose={() => setShowAddFood(false)}
          onAdd={handleAddFood}
        />
      )}
    </div>
  );
}
