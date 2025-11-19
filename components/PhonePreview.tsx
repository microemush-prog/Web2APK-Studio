
import React from 'react';
import { AppConfig } from '../types';

interface PhonePreviewProps {
  config: AppConfig;
}

const PhonePreview: React.FC<PhonePreviewProps> = ({ config }) => {
  const { url, appName, themeColor } = config;

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return urlString.startsWith('http://') || urlString.startsWith('https://');
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-black border-8 border-gray-700 rounded-4xl shadow-lg overflow-hidden">
      <div className="w-full h-full aspect-[9/19.5] flex flex-col">
        {/* Status Bar */}
        <div style={{ backgroundColor: themeColor }} className="flex-shrink-0 h-8 px-4 flex justify-between items-center text-white transition-colors duration-300">
          <div className="text-xs font-semibold">{appName.substring(0, 15) || 'App Name'}</div>
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.5 10a.5.5 0 01.5-.5h8a.5.5 0 010 1H6a.5.5 0 01-.5-.5z" /></svg>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M17.5 5.5a.5.5 0 00-.5-.5h-14a.5.5 0 000 1h14a.5.5 0 00.5-.5zM2.5 15.5a.5.5 0 01.5-.5h14a.5.5 0 010 1h-14a.5.5 0 01-.5-.5z" /></svg>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 8a6 6 0 11-12 0 6 6 0 0112 0zM8.5 4.5a.5.5 0 00-1 0v3.5a.5.5 0 00.5.5h4a.5.5 0 000-1h-3.5V4.5z" clipRule="evenodd" /></svg>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-grow bg-gray-200 relative">
          {config.sourceType === 'url' ? (
            isValidUrl(url) ? (
              <iframe
                src={url}
                title="App Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center bg-gray-800 p-4">
                <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m-9 9h18" />
                </svg>
                <h3 className="font-semibold text-gray-300">App Preview</h3>
                <p className="text-sm text-gray-500 mt-1">Enter a valid public URL to see a live preview of your web app.</p>
              </div>
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center bg-gray-800 p-4">
                <div className="bg-gray-700 p-4 rounded-full mb-4">
                    <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                </div>
                <h3 className="font-semibold text-gray-300">Local Bundle Loaded</h3>
                <p className="text-sm text-gray-500 mt-2 px-4">
                    {config.zipFile ? config.zipFile.name : 'No zip file selected'}
                </p>
                {config.zipFile && (
                     <span className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Ready to Build
                     </span>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhonePreview;
