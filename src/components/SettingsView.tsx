import React, { useState } from 'react';
import { 
  Volume2, 
  Palette, 
  Sliders, 
  Download, 
  Shield, 
  Bell,
  Monitor,
  Moon,
  Sun,
  Wifi,
  HardDrive
} from 'lucide-react';
import './SettingsView.css';

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState({
    volume: 80,
    theme: 'dark',
    visualizations: true,
    crossfade: false,
    crossfadeDuration: 3,
    notifications: true,
    autoDownload: false,
    offlineMode: false,
    highQuality: true,
    dataUsage: 'wifi',
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingSections = [
    {
      id: 'audio',
      title: 'Audio',
      icon: Volume2,
      settings: [
        {
          id: 'volume',
          type: 'slider',
          label: 'Master Volume',
          value: settings.volume,
          min: 0,
          max: 100,
          onChange: (value: number) => updateSetting('volume', value),
        },
        {
          id: 'crossfade',
          type: 'toggle',
          label: 'Crossfade',
          description: 'Smooth transitions between tracks',
          value: settings.crossfade,
          onChange: (value: boolean) => updateSetting('crossfade', value),
        },
        {
          id: 'crossfadeDuration',
          type: 'slider',
          label: 'Crossfade Duration',
          value: settings.crossfadeDuration,
          min: 1,
          max: 10,
          suffix: 's',
          disabled: !settings.crossfade,
          onChange: (value: number) => updateSetting('crossfadeDuration', value),
        },
        {
          id: 'highQuality',
          type: 'toggle',
          label: 'High Quality Audio',
          description: 'Use higher bitrate for better sound quality',
          value: settings.highQuality,
          onChange: (value: boolean) => updateSetting('highQuality', value),
        },
      ],
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      settings: [
        {
          id: 'theme',
          type: 'select',
          label: 'Theme',
          value: settings.theme,
          options: [
            { value: 'dark', label: 'Dark', icon: Moon },
            { value: 'light', label: 'Light', icon: Sun },
            { value: 'auto', label: 'System', icon: Monitor },
          ],
          onChange: (value: string) => updateSetting('theme', value),
        },
        {
          id: 'visualizations',
          type: 'toggle',
          label: 'Audio Visualizations',
          description: 'Show animated visuals while playing music',
          value: settings.visualizations,
          onChange: (value: boolean) => updateSetting('visualizations', value),
        },
      ],
    },
    {
      id: 'playback',
      title: 'Playback',
      icon: Sliders,
      settings: [
        {
          id: 'autoDownload',
          type: 'toggle',
          label: 'Auto Download',
          description: 'Automatically download liked songs for offline listening',
          value: settings.autoDownload,
          onChange: (value: boolean) => updateSetting('autoDownload', value),
        },
        {
          id: 'offlineMode',
          type: 'toggle',
          label: 'Offline Mode',
          description: 'Only play downloaded music',
          value: settings.offlineMode,
          onChange: (value: boolean) => updateSetting('offlineMode', value),
        },
      ],
    },
    {
      id: 'data',
      title: 'Data & Storage',
      icon: HardDrive,
      settings: [
        {
          id: 'dataUsage',
          type: 'select',
          label: 'Data Usage',
          value: settings.dataUsage,
          options: [
            { value: 'wifi', label: 'Wi-Fi Only', icon: Wifi },
            { value: 'cellular', label: 'Wi-Fi + Cellular', icon: Wifi },
            { value: 'unlimited', label: 'Unlimited', icon: Wifi },
          ],
          onChange: (value: string) => updateSetting('dataUsage', value),
        },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          id: 'notifications',
          type: 'toggle',
          label: 'Push Notifications',
          description: 'Get notified about new releases and updates',
          value: settings.notifications,
          onChange: (value: boolean) => updateSetting('notifications', value),
        },
      ],
    },
  ];

  const renderSetting = (setting: any) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <div className="setting-item" key={setting.id}>
            <div className="setting-info">
              <div className="setting-label">{setting.label}</div>
              {setting.description && (
                <div className="setting-description">{setting.description}</div>
              )}
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={setting.value}
                  onChange={(e) => setting.onChange(e.target.checked)}
                  disabled={setting.disabled}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        );

      case 'slider':
        return (
          <div className="setting-item" key={setting.id}>
            <div className="setting-info">
              <div className="setting-label">
                {setting.label}
                <span className="setting-value">
                  {setting.value}{setting.suffix || ''}
                </span>
              </div>
            </div>
            <div className="setting-control">
              <input
                type="range"
                className="slider"
                min={setting.min}
                max={setting.max}
                value={setting.value}
                onChange={(e) => setting.onChange(parseInt(e.target.value))}
                disabled={setting.disabled}
              />
            </div>
          </div>
        );

      case 'select':
        return (
          <div className="setting-item" key={setting.id}>
            <div className="setting-info">
              <div className="setting-label">{setting.label}</div>
            </div>
            <div className="setting-control">
              <div className="select-options">
                {setting.options.map((option: any) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      className={`select-option ${setting.value === option.value ? 'active' : ''}`}
                      onClick={() => setting.onChange(option.value)}
                    >
                      {Icon && <Icon size={16} />}
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-view">
      <div className="view-header">
        <div>
          <h1 className="view-title">Settings</h1>
          <p className="view-subtitle">Customize your music experience</p>
        </div>
      </div>

      <div className="settings-sections">
        {settingSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.id} className="settings-section">
              <div className="section-header">
                <Icon size={20} />
                <h2 className="section-title">{section.title}</h2>
              </div>

              <div className="section-content">
                {section.settings.map(renderSetting)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="settings-footer">
        <div className="app-info">
          <h3 className="app-name">MusicWave</h3>
          <p className="app-version">Version 1.0.0</p>
          <p className="app-description">
            Advanced Music Player with modern UI and comprehensive features
          </p>
        </div>

        <div className="footer-actions">
          <button className="btn">Reset to Defaults</button>
          <button className="btn btn-primary">Export Settings</button>
        </div>
      </div>
    </div>
  );
};