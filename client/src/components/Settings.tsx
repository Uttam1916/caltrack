import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import '../styles/settings.css';

const DEFAULT_SETTINGS = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  age: '28',
  weight: '75',
  height: '175',
  activityLevel: 'moderate',
  goal: 'maintain',
  calorieGoal: '2000',
  proteinGoal: '150',
  carbsGoal: '200',
  fatsGoal: '67'
};

export function Settings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSettings(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to localStorage (in production, send to backend)
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your profile and nutrition goals</p>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        <section className="settings-section">
          <h2>Personal Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={settings.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={settings.age}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={settings.weight}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="height">Height (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={settings.height}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="activityLevel">Activity Level</label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={settings.activityLevel}
                onChange={handleChange}
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Lightly Active</option>
                <option value="moderate">Moderately Active</option>
                <option value="very">Very Active</option>
                <option value="extra">Extra Active</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="goal">Goal</label>
              <select
                id="goal"
                name="goal"
                value={settings.goal}
                onChange={handleChange}
              >
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight</option>
              </select>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2>Daily Nutrition Goals</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="calorieGoal">Calorie Goal (kcal)</label>
              <input
                type="number"
                id="calorieGoal"
                name="calorieGoal"
                value={settings.calorieGoal}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="proteinGoal">Protein Goal (g)</label>
              <input
                type="number"
                id="proteinGoal"
                name="proteinGoal"
                value={settings.proteinGoal}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="carbsGoal">Carbs Goal (g)</label>
              <input
                type="number"
                id="carbsGoal"
                name="carbsGoal"
                value={settings.carbsGoal}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fatsGoal">Fats Goal (g)</label>
              <input
                type="number"
                id="fatsGoal"
                name="fatsGoal"
                value={settings.fatsGoal}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
        </section>

        <div className="form-actions">
          {saved && <span className="save-indicator">Settings saved!</span>}
          <button type="submit" className="save-btn">
            <Save size={20} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
