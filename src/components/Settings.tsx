import React, { useState } from 'react';

interface Settings {
  listName: string;
  primaryColor: string;
  font: string;
  audioEnabled: boolean;
  showProgressBar: boolean;
}

interface SettingsProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSettingsChange, onClose }) => {
  const [editingName, setEditingName] = useState(false);
  const [tempListName, setTempListName] = useState(settings.listName);

  const colorOptions = [
    { name: 'Green', value: '#85ce92' },
    { name: 'Blue', value: '#1aa1bc' },
    { name: 'Indigo', value: '#501abc' },
    { name: 'Purple', value: '#993fbd' },
    { name: 'Pink', value: '#e91e63' },
    { name: 'Orange', value: '#f39c12' },
  ];

  const fontOptions = [
    { name: 'Sans-serif', value: 'Arial, Helvetica, sans-serif' },
    { name: 'Serif', value: 'Garamond, serif' },
    { name: 'Monospace', value: '"Courier New", Courier, monospace' },
    { name: 'Cursive', value: '"Bradley Hand", cursive' },
    { name: 'Fantasy', value: 'Luminari, fantasy' },
  ];

  const handleColorChange = (color: string) => {
    const newSettings = { ...settings, primaryColor: color };
    onSettingsChange(newSettings);
    document.documentElement.style.setProperty('--color-primary', color);
    
    // Update shadow color based on the selected primary color
    const shadowColor = color + '66'; // Add 40% opacity (66 in hex)
    document.documentElement.style.setProperty('--color-shadow-primary', shadowColor);
  };

  const handleFontChange = (font: string) => {
    const newSettings = { ...settings, font: font };
    onSettingsChange(newSettings);
    document.documentElement.style.setProperty('--font-family', font);
  };

  const handleAudioToggle = () => {
    const newSettings = { ...settings, audioEnabled: !settings.audioEnabled };
    onSettingsChange(newSettings);
  };

  const handleProgressBarToggle = () => {
    const newSettings = { ...settings, showProgressBar: !settings.showProgressBar };
    onSettingsChange(newSettings);
  };

  const handleNameSave = () => {
    const newSettings = { ...settings, listName: tempListName };
    onSettingsChange(newSettings);
    setEditingName(false);
    // Update the page title
    document.title = tempListName;
  };

  const handleNameCancel = () => {
    setTempListName(settings.listName);
    setEditingName(false);
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-dropdown" onClick={(e) => e.stopPropagation()}>
        <h3>Settings</h3>
        
        <div className="setting-group">
          <label>List Name:</label>
          {editingName ? (
            <div className="name-edit">
              <input
                type="text"
                value={tempListName}
                onChange={(e) => setTempListName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSave();
                  if (e.key === 'Escape') handleNameCancel();
                }}
                autoFocus
              />
              <div className="name-edit-buttons">
                <button onClick={handleNameSave}>✅</button>
                <button onClick={handleNameCancel}>❌</button>
              </div>
            </div>
          ) : (
            <div className="name-display">
              <span>{settings.listName}</span>
              <button onClick={() => setEditingName(true)}>✏️</button>
            </div>
          )}
        </div>
        
        <div className="setting-group">
          <label>Primary Color:</label>
          <div className="color-options">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                className={`color-option ${settings.primaryColor === color.value ? 'active' : ''}`}
                style={{ backgroundColor: color.value }}
                onClick={() => handleColorChange(color.value)}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <div className="setting-group">
          <label>Font:</label>
          <div className="font-options">
            {fontOptions.map((font) => (
              <button
                key={font.value}
                className={`font-option ${settings.font === font.value ? 'active' : ''}`}
                onClick={() => handleFontChange(font.value)}
                style={{ fontFamily: font.value }}
              >
                {font.name}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <label>Audio:</label>
          <div className="toggle-option">
            <button
              className={`toggle-button ${settings.audioEnabled ? 'active' : ''}`}
              onClick={handleAudioToggle}
            >
              {settings.audioEnabled ? '🔊' : '🔇'}
              <span>{settings.audioEnabled ? 'Enabled' : 'Disabled'}</span>
            </button>
          </div>
        </div>

        <div className="setting-group">
          <label>Progress Bar:</label>
          <div className="toggle-option">
            <button
              className={`toggle-button ${settings.showProgressBar ? 'active' : ''}`}
              onClick={handleProgressBarToggle}
            >
              {settings.showProgressBar ? '📊' : '📊'}
              <span>{settings.showProgressBar ? 'Show' : 'Hide'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 