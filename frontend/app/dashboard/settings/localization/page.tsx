'use client';

import { useState } from 'react';
import { Info, ChevronDown } from 'lucide-react';

export default function LocalizationPage() {
    const [timeZone, setTimeZone] = useState<'organizational' | 'employee'>('employee');
    const [timeFormat, setTimeFormat] = useState<'12' | '24'>('12');
    const [language, setLanguage] = useState('english');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Track initial values for dirty checking
    const [initialTimeZone] = useState<'organizational' | 'employee'>('employee');
    const [initialTimeFormat] = useState<'12' | '24'>('12');
    const [initialLanguage] = useState('english');

    const isDirty = timeZone !== initialTimeZone || timeFormat !== initialTimeFormat || language !== initialLanguage;

    const languages = [
        { value: 'english', label: 'English' },
        { value: 'spanish', label: 'Spanish' },
        { value: 'french', label: 'French' },
        { value: 'german', label: 'German' },
    ];

    const handleSave = () => {
        // TODO: Implement save logic
        console.log('Saving localization settings:', { timeZone, timeFormat, language });
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <h2 className="text-lg font-bold text-brand-dark">Time & Language</h2>

            {/* Info Banner */}
            <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <Info className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <p className="text-sm text-indigo-700">
                    Time zone explanation.{' '}
                    <a href="#" className="font-medium text-indigo-700 underline hover:text-indigo-800">
                        Learn more.
                    </a>
                </p>
            </div>

            {/* Time Zones Section */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-500">Time Zones</label>
                <div className="grid grid-cols-2 gap-4">
                    {/* Organizational Time Zone */}
                    <button
                        type="button"
                        onClick={() => setTimeZone('organizational')}
                        className={`p-4 rounded-lg border text-left transition-all ${timeZone === 'organizational'
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-1">
                                <p className="font-medium text-brand-dark text-sm">Organizational Time Zone</p>
                                <p className="text-xs text-gray-500 mt-1">UTC-6 (CST)</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${timeZone === 'organizational'
                                ? 'border-indigo-500'
                                : 'border-gray-300'
                                }`}>
                                {timeZone === 'organizational' && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                                )}
                            </div>
                        </div>
                    </button>

                    {/* Employee Time Zone */}
                    <button
                        type="button"
                        onClick={() => setTimeZone('employee')}
                        className={`p-4 rounded-lg border text-left transition-all ${timeZone === 'employee'
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-1">
                                <p className="font-medium text-indigo-600 text-sm">Time Zone of Your Employees</p>
                                <p className="text-xs text-gray-500 mt-1">Location where your employees work.</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${timeZone === 'employee'
                                ? 'border-indigo-500'
                                : 'border-gray-300'
                                }`}>
                                {timeZone === 'employee' && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                                )}
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Time Format Section */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-500">Time Format</label>
                <div className="grid grid-cols-2 gap-4">
                    {/* 12 Hour */}
                    <button
                        type="button"
                        onClick={() => setTimeFormat('12')}
                        className={`px-4 py-3 rounded-lg border font-medium text-sm transition-all flex items-center gap-3 ${timeFormat === '12'
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${timeFormat === '12'
                            ? 'border-indigo-500'
                            : 'border-gray-300'
                            }`}>
                            {timeFormat === '12' && (
                                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                            )}
                        </div>
                        12 hour
                    </button>

                    {/* 24 Hour */}
                    <button
                        type="button"
                        onClick={() => setTimeFormat('24')}
                        className={`px-4 py-3 rounded-lg border font-medium text-sm transition-all flex items-center gap-3 ${timeFormat === '24'
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${timeFormat === '24'
                            ? 'border-indigo-500'
                            : 'border-gray-300'
                            }`}>
                            {timeFormat === '24' && (
                                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                            )}
                        </div>
                        24 hour
                    </button>
                </div>
            </div>

            {/* Language Section */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-500">Language</label>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-left font-medium text-brand-dark text-sm flex items-center justify-between hover:border-gray-300 transition-colors"
                    >
                        {languages.find(l => l.value === language)?.label}
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                            {languages.map((lang) => (
                                <button
                                    key={lang.value}
                                    type="button"
                                    onClick={() => {
                                        setLanguage(lang.value);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${language === lang.value ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'
                                        }`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Save Button */}
            <button
                type="button"
                onClick={handleSave}
                disabled={!isDirty}
                className={`px-6 py-2.5 font-medium rounded-lg transition-colors ${isDirty
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
            >
                Save Changes
            </button>
        </div>
    );
}
