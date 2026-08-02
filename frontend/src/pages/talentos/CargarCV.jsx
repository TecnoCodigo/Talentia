import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import Toast from '../../components/UI/Toast';
import { UploadCloud, File, Loader2 } from 'lucide-react';

const CargarCV = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/talentos/upload-cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setToast({ message: 'CV procesado exitosamente', type: 'success' });
      // Redirect to form with pre-filled data
      setTimeout(() => {
        navigate('/talentos/nuevo', { state: { prefilled: res.data } });
      }, 1000);
    } catch (e) {
      console.error(e);
      setToast({ message: 'Error procesando el CV', type: 'error' });
      setLoading(false);
    }
  }, [navigate]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Cargar Currículum Inteligente</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Sube un PDF y nuestra IA de Gemini extraerá automáticamente los datos para rellenar el formulario de registro.
      </p>

      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' : 'border-slate-300 dark:border-slate-700 hover:border-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}
          ${loading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 size={48} className="text-cyan-500 animate-spin mb-4" />
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Procesando con IA...</p>
            <p className="text-sm text-slate-500">Esto puede tardar unos segundos</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mb-4 text-cyan-600 dark:text-cyan-400">
              <UploadCloud size={32} />
            </div>
            {isDragActive ? (
              <p className="text-lg font-medium text-cyan-600">Suelta el archivo aquí...</p>
            ) : (
              <>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-1">Arrastra y suelta tu archivo PDF</p>
                <p className="text-sm text-slate-500">o haz clic para explorar tus archivos</p>
              </>
            )}
          </div>
        )}
      </div>
      
      {acceptedFiles.length > 0 && !loading && (
        <div className="mt-4 flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <File className="text-cyan-500" />
          <span className="font-medium text-sm">{acceptedFiles[0].name}</span>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default CargarCV;
