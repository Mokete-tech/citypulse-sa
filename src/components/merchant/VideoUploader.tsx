import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, Play, Pause, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Maximum video size in bytes (30MB)
const MAX_FILE_SIZE = 30 * 1024 * 1024;
// Maximum video duration in seconds (60 seconds = 1 minute)
const MAX_DURATION = 60;
// Allowed video formats
const ALLOWED_FORMATS = ['video/mp4', 'video/webm', 'video/quicktime'];

interface VideoUploaderProps {
  onUploadComplete: (url: string) => void;
  bucketName?: string;
  folderPath?: string;
  className?: string;
}

/**
 * Video uploader component for merchant advertisements
 */
const VideoUploader = ({
  onUploadComplete,
  bucketName = 'advertisements',
  folderPath = 'videos',
  className = '',
}: VideoUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    
    if (!selectedFile) {
      return;
    }
    
    // Check file format
    if (!ALLOWED_FORMATS.includes(selectedFile.type)) {
      setError(`Invalid file format. Allowed formats: ${ALLOWED_FORMATS.map(f => f.split('/')[1]).join(', ')}`);
      return;
    }
    
    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
    setFile(selectedFile);
    
    // Check video duration when metadata is loaded
    const video = document.createElement('video');
    video.onloadedmetadata = () => {
      if (video.duration > MAX_DURATION) {
        setError(`Video duration exceeds the limit of ${MAX_DURATION} seconds`);
        setDuration(video.duration);
      } else {
        setDuration(video.duration);
      }
    };
    video.src = previewUrl;
  };

  // Handle video playback
  const togglePlayback = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  // Handle video upload
  const handleUpload = async () => {
    if (!file || error) return;
    
    setIsUploading(true);
    setProgress(0);
    
    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${folderPath}/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setProgress(percent);
          },
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      // Call the callback with the URL
      onUploadComplete(urlData.publicUrl);
      toast.success('Video uploaded successfully');
      
      // Reset the component
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload video. Please try again.');
      toast.error('Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Upload Advertisement Video</CardTitle>
        <CardDescription>
          Upload a video advertisement for your business. Maximum duration: {MAX_DURATION} seconds.
          Maximum size: {MAX_FILE_SIZE / (1024 * 1024)}MB.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!preview ? (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              MP4, WebM, or QuickTime (max. {MAX_FILE_SIZE / (1024 * 1024)}MB)
            </p>
          </div>
        ) : (
          <div className="relative rounded-lg overflow-hidden">
            <video 
              ref={videoRef}
              src={preview}
              className="w-full h-auto"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
            
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
              <Button 
                variant="secondary" 
                size="icon" 
                className="rounded-full"
                onClick={togglePlayback}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
            </div>
            
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2 rounded-full"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded">
              Duration: {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
            </div>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={ALLOWED_FORMATS.join(',')}
          onChange={handleFileChange}
        />
        
        {isUploading && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-1">Uploading: {progress}%</p>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2">
        {file && !isUploading && (
          <>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!!error || isUploading}
            >
              Upload Video
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default VideoUploader;
