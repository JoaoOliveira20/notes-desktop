import "./SettingsModal.css";
import type { Theme } from "../../../types/Theme";
import type { Language } from "../../../types/Language";
import type { ptBR } from "../../../locales/pt-BR";

type Translations = typeof ptBR;

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  language: Language;
  onToggleLanguage: () => void;
  onImportNotes: () => void;
  onExportNotes: () => void;
  t: Translations;
};

export function SettingsModal({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  language,
  onToggleLanguage,
  onImportNotes,
  onExportNotes,
  t,
}: SettingsModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <div className="settings-modal-header">
          <h2>{t.settings}</h2>

          <button onClick={onClose}>X</button>
        </div>

        <div className="settings-modal-content">
          <div className="settings-modal-row">
            <span>{t.theme}</span>

            <button onClick={onToggleTheme}>
              {theme === "light" ? t.darkMode : t.lightMode}
            </button>
          </div>

          <div className="settings-modal-row">
            <span>{t.language}</span>

            <button onClick={onToggleLanguage}>
              {language === "pt-BR" ? "English" : "Português"}
            </button>
          </div>

          <div className="settings-modal-row">
            <span>{t.importBackup}</span>

            <button onClick={onImportNotes}>{t.importBackup}</button>
          </div>

          <div className="settings-modal-row">
            <span>{t.exportBackup}</span>

            <button onClick={onExportNotes}>{t.exportBackup}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
