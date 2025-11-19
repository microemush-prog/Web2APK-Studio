
import React, { useState, useMemo, ChangeEvent, useRef } from 'react';
import { AppConfig } from './types';
import Stepper from './components/Stepper';
import PhonePreview from './components/PhonePreview';
import { UploadIcon, LinkIcon, CodeIcon, CheckIcon, QrCodeIcon, DownloadIcon } from './components/icons';

const initialConfig: AppConfig = {
  sourceType: 'url',
  url: '',
  zipFile: null,
  appName: '',
  icon: null,
  themeColor: '#6366f1',
  splashScreen: null,
  packageId: 'com.example.app',
  wrapperEngine: 'twa',
  offlineCaching: true,
  pushNotifications: true,
  deepLinking: false,
  cameraAccess: false,
  geolocationAccess: false,
  fileAccess: false,
  customJs: '',
  admob: false,
  analytics: true,
  biometricAuth: false,
  pullToRefresh: true,
  navBar: true,
  appDrawer: false,
  keystore: 'create',
  buildFormat: 'aab',
};

const Section: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-gray-800/50 rounded-lg p-6 mb-6 backdrop-blur-sm border border-gray-700/50">
        <h2 className="text-xl font-semibold mb-4 text-indigo-300">{title}</h2>
        {children}
    </div>
);

const InputField: React.FC<{label: string; id: string; name?: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; placeholder?: string; type?: string; icon?: React.ReactNode}> = ({ label, id, name, value, onChange, placeholder, type = 'text', icon }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <div className="relative">
            {icon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">{icon}</div>}
            <input type={type} id={id} name={name || id} value={value} onChange={onChange} placeholder={placeholder} className={`block w-full bg-gray-900/50 border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 ${icon ? 'pl-10' : 'px-3'}`} />
        </div>
    </div>
);

const ToggleSwitch: React.FC<{label: string; enabled: boolean; onChange: (enabled: boolean) => void}> = ({ label, enabled, onChange }) => (
    <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm text-gray-300">{label}</span>
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={enabled} onChange={e => onChange(e.target.checked)} />
            <div className={`block w-14 h-8 rounded-full transition-colors ${enabled ? 'bg-indigo-600' : 'bg-gray-600'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${enabled ? 'translate-x-6' : ''}`}></div>
        </div>
    </label>
);

const FileInput: React.FC<{label: string; id: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; previewUrl: string | null; accept?: string}> = ({ label, id, onChange, previewUrl, accept }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <div
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors"
            >
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded-md" />
                ) : (
                    <div className="space-y-1 text-center">
                        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-400">
                            <p className="pl-1">Upload a file or drag and drop</p>
                        </div>
                    </div>
                )}
            </div>
            <input ref={fileInputRef} id={id} name={id} type="file" className="sr-only" onChange={onChange} accept={accept} />
        </div>
    );
};

// Step Components
const ConfigureStep: React.FC<{ config: AppConfig; setConfig: React.Dispatch<React.SetStateAction<AppConfig>> }> = ({ config, setConfig }) => {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
          const { checked } = e.target as HTMLInputElement;
          setConfig(prev => ({ ...prev, [name]: checked }));
        } else {
          setConfig(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: 'icon' | 'splashScreen') => {
      if (e.target.files && e.target.files[0]) {
        const fileUrl = URL.createObjectURL(e.target.files[0]);
        setConfig(prev => ({ ...prev, [field]: fileUrl }));
      }
    };

    const handleZipChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setConfig(prev => ({ ...prev, zipFile: e.target.files![0] }));
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <Section title="1. App Source">
                    <div className="flex space-x-2 mb-6 bg-gray-900/50 p-1 rounded-lg">
                         <button 
                            onClick={() => setConfig(prev => ({...prev, sourceType: 'url'}))}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${config.sourceType === 'url' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                         >
                            Web URL
                         </button>
                         <button 
                            onClick={() => setConfig(prev => ({...prev, sourceType: 'zip'}))}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${config.sourceType === 'zip' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                         >
                            Zip Bundle
                         </button>
                    </div>

                    {config.sourceType === 'url' ? (
                        <InputField 
                            label="Web App URL" 
                            id="url" 
                            name="url" 
                            value={config.url} 
                            onChange={handleInputChange} 
                            placeholder="https://your-pwa.com" 
                            icon={<LinkIcon className="h-5 w-5 text-gray-400" />} 
                        />
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Upload App Bundle (.zip)</label>
                            <div className="relative mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md hover:border-indigo-500 transition-colors bg-gray-900/30 group cursor-pointer">
                                 <input 
                                    type="file" 
                                    id="zip-upload" 
                                    accept=".zip,application/zip" 
                                    onChange={handleZipChange} 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                 />
                                 <div className="space-y-1 text-center">
                                    <UploadIcon className={`mx-auto h-12 w-12 ${config.zipFile ? 'text-indigo-500' : 'text-gray-400'} group-hover:text-indigo-400 transition-colors`} />
                                    <div className="text-sm text-gray-300">
                                        {config.zipFile ? (
                                            <span className="font-medium text-indigo-400">{config.zipFile.name}</span>
                                        ) : (
                                            <p>
                                                <span className="font-medium text-indigo-400">Click to upload</span> or drag and drop
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Containing index.html at root</p>
                                 </div>
                            </div>
                        </div>
                    )}
                </Section>
                <Section title="2. App Metadata">
                    <div className="space-y-4">
                        <InputField label="App Name" id="appName" name="appName" value={config.appName} onChange={handleInputChange} placeholder="My Awesome App" />
                        <InputField label="Package ID" id="packageId" name="packageId" value={config.packageId} onChange={handleInputChange} placeholder="com.company.appname" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FileInput label="App Icon" id="icon" onChange={(e) => handleFileChange(e, 'icon')} previewUrl={config.icon} accept="image/png, image/jpeg" />
                            <FileInput label="Splash Screen" id="splashScreen" onChange={(e) => handleFileChange(e, 'splashScreen')} previewUrl={config.splashScreen} accept="image/png, image/jpeg" />
                        </div>
                        <div>
                            <label htmlFor="themeColor" className="block text-sm font-medium text-gray-300 mb-1">Theme Color</label>
                            <input type="color" id="themeColor" name="themeColor" value={config.themeColor} onChange={handleInputChange} className="w-full h-10 p-1 bg-gray-900 border-gray-600 rounded-md cursor-pointer" />
                        </div>
                    </div>
                </Section>
                <Section title="3. Wrapper Engine">
                    <div className="flex space-x-4">
                        {(['twa', 'webview'] as const).map(engine => (
                            <button key={engine} onClick={() => setConfig(p => ({ ...p, wrapperEngine: engine }))} className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${config.wrapperEngine === engine ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                {engine.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        {config.wrapperEngine === 'twa' ? 'Trusted Web Activity: Best for PWAs, Play Store compliant.' : 'Standard WebView: More flexible for non-PWA sites.'}
                    </p>
                </Section>
            </div>
            <div>
                 <Section title="4. Native Features & Permissions">
                    <div className="space-y-4">
                        <ToggleSwitch label="Offline Caching" enabled={config.offlineCaching} onChange={val => setConfig(p => ({ ...p, offlineCaching: val }))} />
                        <ToggleSwitch label="Push Notifications" enabled={config.pushNotifications} onChange={val => setConfig(p => ({ ...p, pushNotifications: val }))} />
                        <ToggleSwitch label="Deep Linking" enabled={config.deepLinking} onChange={val => setConfig(p => ({ ...p, deepLinking: val }))} />
                        <hr className="border-gray-700" />
                        <ToggleSwitch label="Camera Access" enabled={config.cameraAccess} onChange={val => setConfig(p => ({ ...p, cameraAccess: val }))} />
                        <ToggleSwitch label="Geolocation Access" enabled={config.geolocationAccess} onChange={val => setConfig(p => ({ ...p, geolocationAccess: val }))} />
                        <ToggleSwitch label="File System Access" enabled={config.fileAccess} onChange={val => setConfig(p => ({ ...p, fileAccess: val }))} />
                    </div>
                </Section>
                <Section title="5. Customization & Plugins">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="customJs" className="flex items-center text-sm font-medium text-gray-300 mb-1">
                                <CodeIcon className="w-5 h-5 mr-2" /> Custom Javascript
                            </label>
                            <textarea id="customJs" name="customJs" value={config.customJs} onChange={handleInputChange} rows={3} placeholder="console.log('Hello from Android!');" className="block w-full bg-gray-900/50 border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 font-mono" />
                        </div>
                        <h3 className="text-md font-medium text-gray-300 pt-2">UI Elements</h3>
                         <ToggleSwitch label="Enable Pull-to-Refresh" enabled={config.pullToRefresh} onChange={val => setConfig(p => ({ ...p, pullToRefresh: val }))} />
                         <ToggleSwitch label="Show Navigation Bar" enabled={config.navBar} onChange={val => setConfig(p => ({ ...p, navBar: val }))} />
                         <ToggleSwitch label="Enable App Drawer" enabled={config.appDrawer} onChange={val => setConfig(p => ({ ...p, appDrawer: val }))} />
                         <h3 className="text-md font-medium text-gray-300 pt-2">Plugins</h3>
                         <ToggleSwitch label="AdMob" enabled={config.admob} onChange={val => setConfig(p => ({ ...p, admob: val }))} />
                         <ToggleSwitch label="Google Analytics" enabled={config.analytics} onChange={val => setConfig(p => ({ ...p, analytics: val }))} />
                         <ToggleSwitch label="Biometric Authentication" enabled={config.biometricAuth} onChange={val => setConfig(p => ({ ...p, biometricAuth: val }))} />
                    </div>
                </Section>
            </div>
        </div>
    );
};

const BuildStep: React.FC<{ config: AppConfig; setConfig: React.Dispatch<React.SetStateAction<AppConfig>>; onBuildComplete: () => void }> = ({ config, setConfig, onBuildComplete }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Starting build...');
    const [isBuilding, setIsBuilding] = useState(false);

    const buildSteps = useMemo(() => [
        { name: "Validating configuration...", duration: 1500 },
        { name: config.sourceType === 'url' ? "Fetching web assets..." : "Extracting zip bundle...", duration: 2000 },
        { name: "Wrapping with native shell...", duration: 2500 },
        { name: "Compiling Android resources...", duration: 3000 },
        { name: `Signing ${config.buildFormat.toUpperCase()} package...`, duration: 2000 },
        { name: "Finalizing build...", duration: 1000 },
        { name: "Build complete!", duration: 500 },
    ], [config.buildFormat, config.sourceType]);
    
    const startBuild = () => {
        setIsBuilding(true);
        let currentProgress = 0;
        let stepIndex = 0;
        
        const totalDuration = buildSteps.reduce((acc, s) => acc + s.duration, 0);
        
        const runStep = () => {
            if (stepIndex >= buildSteps.length) {
                setIsBuilding(false);
                onBuildComplete();
                return;
            }
            const step = buildSteps[stepIndex];
            setStatus(step.name);
            
            const stepProgress = (step.duration / totalDuration) * 100;
            const targetProgress = currentProgress + stepProgress;

            const interval = setInterval(() => {
                setProgress(prev => {
                    const next = prev + 0.5;
                    if (next >= targetProgress) {
                        clearInterval(interval);
                        currentProgress = targetProgress;
                        stepIndex++;
                        runStep();
                        return targetProgress;
                    }
                    return next;
                });
            }, 20);
        };
        
        runStep();
    };

    return (
        <div className="max-w-3xl mx-auto">
            <Section title="Keystore & Signing">
                <div className="flex space-x-4 mb-4">
                    {(['create', 'upload'] as const).map(option => (
                        <button key={option} onClick={() => setConfig(p => ({ ...p, keystore: option }))} className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${config.keystore === option ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700 hover:bg-gray-600'}`}>
                            {option === 'create' ? 'Create New Keystore' : 'Upload Existing Keystore'}
                        </button>
                    ))}
                </div>
                {config.keystore === 'create' && (
                    <div className="space-y-2 p-4 bg-gray-900/50 rounded-md">
                        <p className="text-sm text-gray-400">A new keystore will be securely generated for you. Remember to save it after download.</p>
                    </div>
                )}
                 {config.keystore === 'upload' && (
                    <div className="p-4 bg-gray-900/50 rounded-md">
                        <FileInput label="" id="keystore-upload" onChange={() => {}} previewUrl={null} accept=".jks,.keystore" />
                    </div>
                )}
            </Section>
            <Section title="Build Format">
                 <div className="flex space-x-4">
                    {(['aab', 'apk'] as const).map(format => (
                        <button key={format} onClick={() => setConfig(p => ({ ...p, buildFormat: format }))} className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${config.buildFormat === format ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700 hover:bg-gray-600'}`}>
                            {format.toUpperCase()}
                        </button>
                    ))}
                </div>
                 <p className="text-xs text-gray-400 mt-2">
                    {config.buildFormat === 'aab' ? 'Android App Bundle: Recommended for Google Play.' : 'APK: Universal format for direct installs.'}
                </p>
            </Section>
            <div className="text-center mt-8">
                {!isBuilding ? (
                    <button onClick={startBuild} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-12 rounded-full text-lg transition-transform transform hover:scale-105">
                        Start Build
                    </button>
                ) : (
                    <div className="p-4">
                        <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                            <div className="bg-indigo-500 h-4 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
                        </div>
                        <p className="text-indigo-300 font-mono text-sm">{status} ({Math.round(progress)}%)</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const DownloadStep: React.FC<{ config: AppConfig }> = ({ config }) => {
    const downloadFile = (content: string, fileName: string, contentType: string) => {
        const blob = new Blob([content], { type: contentType });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    };

    const handleDownloadApp = () => {
        const fileExtension = config.buildFormat;
        const mimeType = fileExtension === 'apk' ? 'application/vnd.android.package-archive' : 'application/octet-stream';
        const dummyContent = `This is a dummy ${config.buildFormat.toUpperCase()} file for ${config.appName}.`;
        downloadFile(dummyContent, `${config.appName.replace(/\s/g, '_') || 'app'}.${fileExtension}`, mimeType);
    };
    
    const handleDownloadKeystore = () => {
        const dummyKeystoreContent = "This is a dummy keystore file. In a real application, this would be a binary file containing cryptographic keys.";
        downloadFile(dummyKeystoreContent, 'keystore.jks', 'application/octet-stream');
    };

    return (
        <div className="text-center max-w-2xl mx-auto py-12">
            <div className="p-4 bg-green-900/50 border border-green-500 rounded-full inline-block mb-6">
                <CheckIcon className="w-16 h-16 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Build Successful!</h2>
            <p className="text-gray-400 mb-8">Your Android app <span className="font-semibold text-indigo-400">{config.appName}</span> is ready.</p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 flex flex-col items-center">
                    <QrCodeIcon className="w-32 h-32 text-gray-300 mb-4" />
                    <button className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-full transition">
                        Test on Device
                    </button>
                    <p className="text-xs text-gray-500 mt-2">Scan QR code with your phone</p>
                </div>
                <div className="flex flex-col gap-4">
                    <button onClick={handleDownloadApp} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105">
                        <DownloadIcon className="w-6 h-6" /> Download {config.buildFormat.toUpperCase()}
                    </button>
                    <button onClick={handleDownloadKeystore} className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full transition">
                        Download Keystore
                    </button>
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<AppConfig>(initialConfig);
  
  const steps = ["Configure", "Build", "Download"];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ConfigureStep config={config} setConfig={setConfig} />;
      case 2:
        return <BuildStep config={config} setConfig={setConfig} onBuildComplete={() => setCurrentStep(3)} />;
      case 3:
        return <DownloadStep config={config} />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1) {
        const isSourceValid = config.sourceType === 'url' ? !!config.url : !!config.zipFile;
        return !isSourceValid || !config.appName || !config.packageId;
    }
    return false;
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-gray-700/[0.2] [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"></div>
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Web2APK Studio
          </h1>
          <p className="mt-2 text-lg text-gray-400">Convert your web app into a native Android app in minutes.</p>
        </header>

        <div className="max-w-3xl mx-auto mb-16 mt-8 p-4">
          <Stepper currentStep={currentStep} steps={steps} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                {renderStepContent()}
            </div>
            <aside className="lg:col-span-1 lg:sticky top-8 self-start">
                 <Section title="Live Preview">
                    <PhonePreview config={config} />
                </Section>
            </aside>
        </div>
        
        {currentStep < 3 && (
            <footer className="sticky bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 mt-12 z-20">
                <div className="container mx-auto flex justify-end items-center">
                    {currentStep > 1 && (
                        <button 
                            onClick={() => setCurrentStep(prev => prev - 1)} 
                            className="text-gray-300 font-medium py-2 px-6 rounded-md hover:bg-gray-700 transition"
                        >
                            Back
                        </button>
                    )}
                    {currentStep < 2 && (
                         <button 
                            onClick={() => setCurrentStep(prev => prev + 1)} 
                            disabled={isNextDisabled()}
                            className="bg-indigo-600 text-white font-bold py-2 px-8 rounded-md hover:bg-indigo-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            Next: Build
                        </button>
                    )}
                </div>
            </footer>
        )}
      </main>
    </div>
  );
};

export default App;
