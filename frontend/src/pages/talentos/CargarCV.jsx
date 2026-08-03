import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { UploadCloud, File, FileWarning } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const CargarCV = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const onDrop = useCallback(
    async (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        const reason = fileRejections[0]?.errors?.[0];
        if (reason?.code === 'file-too-large') {
          setError('El archivo excede el tamaño máximo de 5 MB.');
        } else if (reason?.code === 'file-invalid-type') {
          setError('Solo se aceptan archivos PDF.');
        } else {
          setError(reason?.message || 'Archivo no válido.');
        }
        return;
      }
      const file = acceptedFiles[0];
      if (!file) return;

      setError('');
      setSelectedFile(file);
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await api.post('/talentos/upload-cv', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('CV procesado exitosamente');
        navigate('/talentos/nuevo', { state: { prefilled: res.data } });
      } catch (err) {
        setError(err?.response?.data?.message || 'No pudimos procesar el CV. Inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: MAX_SIZE,
    disabled: loading,
  });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Cargar Currículum Inteligente</h1>
      <p className="mb-8 text-slate-600 dark:text-slate-400">
        Sube un PDF y nuestra IA de Gemini extraerá automáticamente los datos para rellenar el formulario de registro.
      </p>

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-colors
          ${isDragActive ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50'}
          ${loading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input {...getInputProps()} />

        {loading ? (
          <div className="flex flex-col items-center">
            <Spinner size="xl" className="mb-4 text-brand-600 dark:text-brand-400" />
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Procesando con IA…</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Esto puede tardar unos segundos</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
              <UploadCloud size={32} aria-hidden="true" />
            </div>
            {isDragActive ? (
              <p className="text-lg font-medium text-brand-600 dark:text-brand-400">Suelta el archivo aquí…</p>
            ) : (
              <>
                <p className="mb-1 text-lg font-medium text-slate-700 dark:text-slate-300">Arrastra y suelta tu archivo PDF</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">o haz clic para explorar tus archivos (máx. 5 MB)</p>
              </>
            )}
          </div>
        )}
      </div>

      {error && !loading && (
        <div className="mt-4">
          <ErrorState title="No se pudo procesar el archivo" description={error} onRetry={() => setError('')} />
        </div>
      )}

      {selectedFile && !loading && !error && (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
          <File className="text-brand-600 dark:text-brand-400" size={20} aria-hidden="true" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{selectedFile.name}</span>
        </div>
      )}

      {!selectedFile && !error && (
        <div className="mt-6 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          <FileWarning size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>Asegúrate de que el PDF contenga texto seleccionable. Los CV escaneados como imagen no pueden ser leídos por la IA.</p>
        </div>
      )}
    </div>
  );
};

export default CargarCV;