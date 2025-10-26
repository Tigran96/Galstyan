import { useState } from 'react';

export const TeacherForm = ({ onAddTeacher, onClose, lang }) => {
  const [formData, setFormData] = useState({
    name: { hy: '', en: '', ru: '' },
    photo: '',
    role: { hy: '', en: '', ru: '' },
    specialties: { hy: [], en: [], ru: [] },
    experience: { hy: '', en: '', ru: '' },
    bio: { hy: '', en: '', ru: '' }
  });

  const [currentSpecialty, setCurrentSpecialty] = useState({ hy: '', en: '', ru: '' });

  const handleInputChange = (field, value, language) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [language]: value
      }
    }));
  };

  const addSpecialty = () => {
    if (currentSpecialty[lang].trim()) {
      setFormData(prev => ({
        ...prev,
        specialties: {
          ...prev.specialties,
          [lang]: [...prev.specialties[lang], currentSpecialty[lang].trim()]
        }
      }));
      setCurrentSpecialty({ hy: '', en: '', ru: '' });
    }
  };

  const removeSpecialty = (index) => {
    setFormData(prev => ({
      ...prev,
      specialties: {
        ...prev.specialties,
        [lang]: prev.specialties[lang].filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTeacher = {
      id: `teacher_${Date.now()}`,
      ...formData,
      photo: formData.photo || './owner.jpg' // Default photo if none provided
    };
    onAddTeacher(newTeacher);
    onClose();
  };

  const translations = {
    hy: {
      title: "Ավելացնել նոր ուսուցիչ",
      name: "Անուն",
      photo: "Լուսանկար (URL)",
      role: "Դեր",
      specialties: "Մասնագիտություններ",
      experience: "Փորձ",
      bio: "Կենսագրություն",
      addSpecialty: "Ավելացնել մասնագիտություն",
      cancel: "Չեղարկել",
      add: "Ավելացնել",
      placeholder: {
        name: "Ուսուցիչի անուն",
        role: "Օր. Ուսուցիչ, Տնօրեն",
        experience: "Օր. 5 տարի փորձ",
        bio: "Կարճ կենսագրություն..."
      }
    },
    en: {
      title: "Add New Teacher",
      name: "Name",
      photo: "Photo (URL)",
      role: "Role",
      specialties: "Specialties",
      experience: "Experience",
      bio: "Bio",
      addSpecialty: "Add Specialty",
      cancel: "Cancel",
      add: "Add",
      placeholder: {
        name: "Teacher's name",
        role: "e.g. Teacher, Director",
        experience: "e.g. 5 years experience",
        bio: "Short bio..."
      }
    },
    ru: {
      title: "Добавить нового преподавателя",
      name: "Имя",
      photo: "Фото (URL)",
      role: "Роль",
      specialties: "Специализации",
      experience: "Опыт",
      bio: "Биография",
      addSpecialty: "Добавить специализацию",
      cancel: "Отмена",
      add: "Добавить",
      placeholder: {
        name: "Имя преподавателя",
        role: "Напр. Преподаватель, Директор",
        experience: "Напр. 5 лет опыта",
        bio: "Краткая биография..."
      }
    }
  };

  const t = translations[lang] || translations.en;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-sky-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6">{t.title}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-sky-200 mb-2">{t.name}</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder={t.placeholder.name + " (Հայերեն)"}
                value={formData.name.hy}
                onChange={(e) => handleInputChange('name', e.target.value, 'hy')}
                className="px-3 py-2 bg-sky-800 border border-sky-600 rounded text-white placeholder-sky-400"
              />
              <input
                type="text"
                placeholder={t.placeholder.name + " (English)"}
                value={formData.name.en}
                onChange={(e) => handleInputChange('name', e.target.value, 'en')}
                className="px-3 py-2 bg-sky-800 border border-sky-600 rounded text-white placeholder-sky-400"
              />
              <input
                type="text"
                placeholder={t.placeholder.name + " (Русский)"}
                value={formData.name.ru}
                onChange={(e) => handleInputChange('name', e.target.value, 'ru')}
                className="px-3 py-2 bg-sky-800 border border-sky-600 rounded text-white placeholder-sky-400"
              />
            </div>
          </div>

          {/* Photo */}
          <div>
            <label className="block text-sm font-medium text-sky-200 mb-2">{t.photo}</label>
            <input
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={formData.photo}
              onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
              className="w-full px-3 py-2 bg-sky-800 border border-sky-600 rounded text-white placeholder-sky-400"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-sky-200 mb-2">{t.role}</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder={t.placeholder.role + " (Հայերեն)"}
                value={formData.role.hy}
                onChange={(e) => handleInputChange('role', e.target.value, 'hy')}
                className="px-3 py-2 bg-sky-800 border border-sky-600 rounded text-white placeholder-sky-400"
              />
              <input
                type="text"
                placeholder={t.placeholder.role + " (English)"}
                value={formData.role.en}
                onChange={(e) => handleInputChange('role', e.target.value, 'en')}
                className="px-3 py-2 bg-sky-800 border border-sky-600 rounded text-white placeholder-sky-400"
              />
              <input
                type="text"
                placeholder={t.placeholder.role + " (Русский)"}
                value={formData.role.ru}
                onChange={(e) => handleInputChange('role', e.target.value, 'ru')}
                className="px-3 py-2 bg-sky-800 border border-sky-600 rounded text-white placeholder-sky-400"
              />
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-sky-200 mb-2">{t.experience}</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder={t.placeholder.experience + " (Հայերեն)"}
                value={formData.experience.hy}
                onChange={(e) => handleInputChange('experience', e.target.value, 'hy')}
                className="px-3 py-2 bg-sky-800 border border-sky-600 rounded text-white placeholder-sky-400"
              />
              <input
                type="text"
                placeholder={t.placeholder.experience + " (English)"}
                value={formData.experience.en}
                onChange={(e) => handleInputChange('experience', e.target.value, 'en')}
                className="px-3 py-2 bg-sky-800 border border-sky-600 rounded text-white placeholder-sky-400"
              />
              <input
                type="text"
                placeholder={t.placeholder.experience + " (Русский)"}
                value={formData.experience.ru}
                onChange={(e) => handleInputChange('experience', e.target.value, 'ru')}
                className="px-3 py-2 bg-sky-800 border border-sky-600 rounded text-white placeholder-sky-400"
              />
            </div>
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-sm font-medium text-sky-200 mb-2">{t.specialties}</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add specialty..."
                value={currentSpecialty[lang]}
                onChange={(e) => setCurrentSpecialty(prev => ({ ...prev, [lang]: e.target.value }))}
                className="flex-1 px-3 py-2 bg-sky-800 border border-sky-600 rounded text-white placeholder-sky-400"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
              />
              <button
                type="button"
                onClick={addSpecialty}
                className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
              >
                {t.addSpecialty}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.specialties[lang].map((specialty, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-sky-700 text-sky-200 rounded-full text-sm flex items-center gap-2"
                >
                  {specialty}
                  <button
                    type="button"
                    onClick={() => removeSpecialty(index)}
                    className="text-sky-400 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-sky-200 mb-2">{t.bio}</label>
            <textarea
              placeholder={t.placeholder.bio}
              value={formData.bio[lang]}
              onChange={(e) => handleInputChange('bio', e.target.value, lang)}
              rows={3}
              className="w-full px-3 py-2 bg-sky-800 border border-sky-600 rounded text-white placeholder-sky-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
            >
              {t.add}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
