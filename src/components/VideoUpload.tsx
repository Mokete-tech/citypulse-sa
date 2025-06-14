
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, Video, X, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface VideoUploadProps {
  businessId?: string;
  onVideoUploaded?: (videoUrl: string) => void;
  darkMode?: boolean;
}

const VideoUpload = ({ businessId, onVideoUploaded, darkMode }: VideoUploadProps) => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const { toast } = useToast();

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if it's a video file
      if (file.type.startsWith('video/')) {
        // Check file size (max 50MB)
        if (file.size <= 50 * 1024 * 1024) {
          setSelectedVideo(file);
          toast({
            title: "Video Selected",
            description: `${file.name} is ready to upload`,
          });
        } else {
          toast({
            title: "File Too Large",
            description: "Video file size must be less than 50MB",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select a valid video file",
          variant: "destructive",
        });
      }
    }
  };

  const uploadVideo = async () => {
    if (!selectedVideo) return;

    setUploading(true);
    setUploadProgress(0);
    
    try {
      const fileExt = selectedVideo.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = businessId ? `business/${businessId}/${fileName}` : `general/${fileName}`;

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const { data, error } = await supabase.storage
        .from('videos')
        .upload(filePath, selectedVideo, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      setUploadedVideos(prev => [...prev, publicUrl]);
      onVideoUploaded?.(publicUrl);
      setSelectedVideo(null);
      
      toast({
        title: "Upload Successful",
        description: "Your video has been uploaded successfully",
      });
      
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeVideo = async (index: number, videoUrl: string) => {
    try {
      // Extract file path from URL for deletion
      const urlParts = videoUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = businessId ? `business/${businessId}/${fileName}` : `general/${fileName}`;
      
      await supabase.storage
        .from('videos')
        .remove([filePath]);
      
      setUploadedVideos(prev => prev.filter((_, i) => i !== index));
      
      toast({
        title: "Video Removed",
        description: "Video has been successfully deleted",
      });
    } catch (error) {
      console.error('Error removing video:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete video. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
      <CardHeader>
        <CardTitle className={`flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <Video className="w-5 h-5 mr-2" />
          Video Content Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Upload Business Video (Max 50MB)
          </label>
          <Input
            type="file"
            accept="video/*"
            onChange={handleVideoSelect}
            disabled={uploading}
            className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
          />
        </div>

        {selectedVideo && (
          <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedVideo.name}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Size: {(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Uploading...
              </span>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {uploadProgress}%
              </span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
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
              Uploaded Videos ({uploadedVideos.length})
            </h4>
            {uploadedVideos.map((videoUrl, index) => (
              <div key={index} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between space-x-4">
                  <video 
                    src={videoUrl} 
                    controls 
                    className="w-32 h-20 rounded object-cover"
                    preload="metadata"
                  />
                  <div className="flex-1">
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Video {index + 1}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Ready for promotion
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeVideo(index, videoUrl)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
