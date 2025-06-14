
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Video, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface VideoUploadProps {
  businessId?: string;
  onVideoUploaded?: (videoUrl: string) => void;
  darkMode?: boolean;
}

const VideoUpload = ({ businessId, onVideoUploaded, darkMode }: VideoUploadProps) => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if it's a video file
      if (file.type.startsWith('video/')) {
        // Check file size (max 50MB)
        if (file.size <= 50 * 1024 * 1024) {
          setSelectedVideo(file);
        } else {
          alert('Video file size must be less than 50MB');
        }
      } else {
        alert('Please select a valid video file');
      }
    }
  };

  const uploadVideo = async () => {
    if (!selectedVideo) return;

    setUploading(true);
    try {
      const fileExt = selectedVideo.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = businessId ? `business/${businessId}/${fileName}` : `general/${fileName}`;

      const { data, error } = await supabase.storage
        .from('videos')
        .upload(filePath, selectedVideo);

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      setUploadedVideos(prev => [...prev, publicUrl]);
      onVideoUploaded?.(publicUrl);
      setSelectedVideo(null);
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeVideo = (index: number) => {
    setUploadedVideos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
      <CardHeader>
        <CardTitle className={`flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <Video className="w-5 h-5 mr-2" />
          Video Content
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Upload Video (Max 50MB)
          </label>
          <Input
            type="file"
            accept="video/*"
            onChange={handleVideoSelect}
            className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
          />
        </div>

        {selectedVideo && (
          <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Selected: {selectedVideo.name}
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Size: {(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        )}

        <Button 
          onClick={uploadVideo} 
          disabled={!selectedVideo || uploading}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload Video'}
        </Button>

        {uploadedVideos.length > 0 && (
          <div className="space-y-2">
            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Uploaded Videos
            </h4>
            {uploadedVideos.map((videoUrl, index) => (
              <div key={index} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <video 
                    src={videoUrl} 
                    controls 
                    className="w-32 h-20 rounded"
                    preload="metadata"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeVideo(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoUpload;
