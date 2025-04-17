import React, { useState, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Download, Copy, Play, Settings, FolderOpen, X, Check, AlertCircle, Folder, Moon, Sun, Palette, Layout, Type, Zap, Monitor, Cpu } from 'lucide-react';

function App() {
  const [code, setCode] = useState('#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}');
  const [files, setFiles] = useState<string[]>([]);
  const [currentFile, setCurrentFile] = useState<string>('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<'space' | 'cyber' | 'forest' | 'sunset' | 'ocean'>('space');
  const [isDark, setIsDark] = useState(true);
  const [fontSize, setFontSize] = useState('16px');
  const [tabSize, setTabSize] = useState('2');
  const [minimap, setMinimap] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const backgrounds = {
    space: 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900',
    cyber: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-900',
    forest: 'bg-gradient-to-br from-green-900 via-emerald-900 to-green-900',
    sunset: 'bg-gradient-to-br from-orange-900 via-red-900 to-purple-900',
    ocean: 'bg-gradient-to-br from-blue-900 via-indigo-900 to-violet-900'
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      showToast('Code copied to clipboard!', 'success');
    } catch (err) {
      showToast('Failed to copy code', 'error');
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentFile || 'code.cpp';
      a.click();
      URL.revokeObjectURL(url);
      showToast('File downloaded successfully!', 'success');
    } catch (err) {
      showToast('Failed to download file', 'error');
    }
  };

  const handleFileOpen = () => {
    fileInputRef.current?.click();
  };

  const handleFolderOpen = () => {
    folderInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    const newFiles: string[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.name.endsWith('.cpp') || file.name.endsWith('.hpp') || file.name.endsWith('.h')) {
        newFiles.push(file.name);
        if (i === 0) {
          const text = await file.text();
          setCode(text);
          setCurrentFile(file.name);
        }
      }
    }
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    showToast('Files loaded successfully!', 'success');
  };

  const handleRun = () => {
    showToast('Compilation feature coming soon!', 'error');
  };

  const fileVariants = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    hover: { 
      x: 10,
      backgroundColor: 'rgba(107, 114, 128, 0.5)',
      transition: { type: 'spring', stiffness: 300 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <div className={`min-h-screen ${backgrounds[theme]} transition-colors duration-500`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept=".cpp,.hpp,.h"
      />
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFileChange}
        className="hidden"
        webkitdirectory=""
        directory=""
        multiple
      />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-3">
            <Code2 className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">CodeCanvas</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(true)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-600 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-3 bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between text-gray-300 mb-4">
              <div className="flex items-center space-x-2">
                <FolderOpen className="w-5 h-5" />
                <span>Files</span>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleFolderOpen}
                  className="p-2 hover:bg-gray-700 rounded-lg text-purple-400"
                  title="Open Folder"
                >
                  <Folder className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleFileOpen}
                  className="p-2 hover:bg-gray-700 rounded-lg text-purple-400"
                  title="Open Files"
                >
                  <FolderOpen className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
            <div className="space-y-2">
              {files.length === 0 ? (
                <div className="text-gray-500 text-sm text-center py-4">
                  No files opened yet
                </div>
              ) : (
                files.map((file, index) => (
                  <motion.div
                    key={file}
                    variants={fileVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    whileTap="tap"
                    transition={{ delay: index * 0.1 }}
                    className={`px-3 py-2 rounded-md cursor-pointer text-gray-300 text-sm ${
                      currentFile === file ? 'bg-gray-700/50 border-l-2 border-purple-500' : ''
                    }`}
                    onClick={() => setCurrentFile(file)}
                  >
                    {file}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-9 bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm p-4 flex justify-between items-center border-b border-gray-700">
              <span className="text-gray-300">{currentFile || 'untitled.cpp'}</span>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCopy}
                  className="p-2 hover:bg-gray-700 rounded-lg text-gray-300 relative"
                >
                  <Copy className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDownload}
                  className="p-2 hover:bg-gray-700 rounded-lg text-gray-300"
                >
                  <Download className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleRun}
                  className="p-2 bg-green-600 hover:bg-green-700 rounded-lg text-white flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Run</span>
                </motion.button>
              </div>
            </div>
            <CodeMirror
              value={code}
              height="calc(100vh - 16rem)"
              theme={oneDark}
              extensions={[cpp()]}
              onChange={(value) => setCode(value)}
              className="text-lg"
            />
          </motion.div>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-8 w-[500px] border border-gray-700"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Settings className="w-6 h-6" />
                    Settings
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowSettings(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-white mb-2 block flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Theme
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {(['space', 'cyber', 'forest', 'sunset', 'ocean'] as const).map((t) => (
                        <motion.button
                          key={t}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setTheme(t)}
                          className={`p-2 rounded-lg capitalize ${
                            theme === t ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {t}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white mb-2 block flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        Font Size
                      </label>
                      <select 
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        className="w-full p-2 bg-gray-700 rounded-lg text-gray-300 border border-gray-600 focus:border-purple-500 focus:outline-none"
                      >
                        {['12px', '14px', '16px', '18px', '20px'].map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-white mb-2 block flex items-center gap-2">
                        <Layout className="w-4 h-4" />
                        Tab Size
                      </label>
                      <select 
                        value={tabSize}
                        onChange={(e) => setTabSize(e.target.value)}
                        className="w-full p-2 bg-gray-700 rounded-lg text-gray-300 border border-gray-600 focus:border-purple-500 focus:outline-none"
                      >
                        {['2', '4', '8'].map(size => (
                          <option key={size} value={size}>{size} spaces</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-white mb-2 block flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      Editor Settings
                    </label>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsDark(!isDark)}
                      className="w-full p-3 bg-gray-700 rounded-lg text-gray-300 flex items-center justify-between border border-gray-600 hover:border-purple-500"
                    >
                      <span>Dark Mode</span>
                      {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setMinimap(!minimap)}
                      className="w-full p-3 bg-gray-700 rounded-lg text-gray-300 flex items-center justify-between border border-gray-600 hover:border-purple-500"
                    >
                      <span>Show Minimap</span>
                      <div className={`w-4 h-4 rounded-full ${minimap ? 'bg-purple-500' : 'bg-gray-500'}`} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setAutoSave(!autoSave)}
                      className="w-full p-3 bg-gray-700 rounded-lg text-gray-300 flex items-center justify-between border border-gray-600 hover:border-purple-500"
                    >
                      <span>Auto Save</span>
                      <div className={`w-4 h-4 rounded-full ${autoSave ? 'bg-purple-500' : 'bg-gray-500'}`} />
                    </motion.button>
                  </div>

                  <div>
                    <label className="text-white mb-2 block flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      Performance
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-gray-300">
                        <span>CPU Usage</span>
                        <span className="text-purple-400">Normal</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-purple-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
                notificationType === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {notificationType === 'success' ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <AlertCircle className="w-5 h-5 text-white" />
              )}
              <span className="text-white">{notificationMessage}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotification(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;