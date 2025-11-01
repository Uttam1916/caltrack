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

const MOCK_TODAY_CONSUMED = {
  calories: 1450,
  protein: 98,
  carbs: 165,
  fats: 42
};

const MOCK_FOOD_ENTRIES = [
  { id: 1, name: 'Oatmeal with Berries', calories: 350, protein: 12, carbs: 58, fats: 8, time: '08:30 AM' },
  { id: 2, name: 'Grilled Chicken Salad', calories: 420, protein: 45, carbs: 28, fats: 15, time: '12:45 PM' },
  { id: 3, name: 'Protein Shake', calories: 180, protein: 25, carbs: 12, fats: 3, time: '03:30 PM' },
  { id: 4, name: 'Salmon with Rice', calories: 500, protein: 16, carbs: 67, fats: 16, time: '07:15 PM' }
];

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
  const [foodEntries, setFoodEntries] = useState(MOCK_FOOD_ENTRIES);
  const [consumed, setConsumed] = useState(MOCK_TODAY_CONSUMED);

  const remaining = {
    calories: MOCK_USER_GOALS.calories - consumed.calories,
    protein: MOCK_USER_GOALS.protein - consumed.protein,
    carbs: MOCK_USER_GOALS.carbs - consumed.carbs,
    fats: MOCK_USER_GOALS.fats - consumed.fats
  };

  const caloriePercent = (consumed.calories / MOCK_USER_GOALS.calories) * 100;

  const handleAddFood = (food: any) => {
    const newEntry = {
      id: Date.now(),
      ...food,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    setFoodEntries([...foodEntries, newEntry]);
    setConsumed({
      calories: consumed.calories + food.calories,
      protein: consumed.protein + food.protein,
      carbs: consumed.carbs + food.carbs,
      fats: consumed.fats + food.fats
    });
    setShowAddFood(false);
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
