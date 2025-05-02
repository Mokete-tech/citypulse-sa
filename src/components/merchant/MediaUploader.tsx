import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { Upload, Image, Video, Link2, Loader2, X, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface MediaUploaderProps {
  onMediaSelected: (url: string, type: 'image' | 'video') => void;
  merchantId: string;
  itemType: 'deal' | 'event';
  itemId?: string;
  className?: string;
}

export function MediaUploader({
  onMediaSelected,
  merchantId,
  itemType,
  itemId,
  className
}: MediaUploaderProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 50MB for videos, 10MB for images)
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error('File too large', {
        description: `Maximum file size is ${isVideo ? '50MB for videos' : '10MB for images'}`
      });
      return;
    }

    // Check video duration if it's a video file
    if (isVideo) {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);

        // Check if video is longer than 2 minutes (120 seconds)
        if (video.duration > 120) {
          toast.error('Video too long', {
            description: 'Maximum video duration is 2 minutes'
          });
          setSelectedFile(null);
          setPreviewUrl(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          return;
        }
      };

      video.src = URL.createObjectURL(file);
    }

    // Determine file type
    const fileType = file.type.startsWith('image/') ? 'image' : 'video';
    setMediaType(fileType);

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);

    // Reset progress
    setUploadProgress(0);
  };

  const handleUrlSubmit = () => {
    if (!mediaUrl) {
      toast.error('Please enter a URL');
      return;
    }

    // Simple URL validation
    try {
      new URL(mediaUrl);
    } catch (e) {
      toast.error('Please enter a valid URL');
      return;
    }

    // Determine media type from URL
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(mediaUrl);
    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(mediaUrl);

    if (!isImage && !isVideo) {
      toast.error('Unsupported file type', {
        description: 'URL must point to an image or video file'
      });
      return;
    }

    setMediaType(isImage ? 'image' : 'video');
    setPreviewUrl(mediaUrl);
    onMediaSelected(mediaUrl, isImage ? 'image' : 'video');

    toast.success('Media URL added', {
      description: `${isImage ? 'Image' : 'Video'} URL has been added successfully`
    });
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create a unique file path
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${merchantId}/${itemType}/${itemId || Date.now()}.${fileExt}`;
      const filePath = `${mediaType === 'image' ? 'images' : 'videos'}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percent);
          }
        });

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // Log the upload in analytics
      await supabase.from('analytics').insert({
        event_type: 'media_upload',
        event_source: 'media_uploader',
        source_id: itemId || '0',
        metadata: {
          merchant_id: merchantId,
          item_type: itemType,
          media_type: mediaType,
          file_size: selectedFile.size,
          file_name: selectedFile.name
        }
      });

      // Call the callback with the URL
      onMediaSelected(publicUrl, mediaType);

      toast.success('Upload complete', {
        description: `Your ${mediaType} has been uploaded successfully`
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Upload failed', {
        description: error.message || 'An error occurred during upload'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Add Media</CardTitle>
        <CardDescription>
          Upload or link to images and videos for your {itemType}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upload' | 'url')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="url">Use URL</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Select File</Label>
              <div className="grid w-full items-center gap-1.5">
                <Input
                  id="file-upload"
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="cursor-pointer"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, GIF, MP4, WEBM, MOV.
                Max size: 10MB for images, 50MB for videos. Max video duration: 2 minutes.
              </p>
            </div>

            {previewUrl && selectedFile && (
              <div className="space-y-4">
                <div className="border rounded-md p-2 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-background/80"
                    onClick={clearSelection}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {mediaType === 'image' ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-auto max-h-[200px] object-contain rounded-md"
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      controls
                      className="w-full h-auto max-h-[200px] rounded-md"
                    />
                  )}

                  <div className="mt-2 text-sm">
                    <p className="font-medium truncate">{selectedFile.name}</p>
                    <p className="text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                <Button
                  onClick={uploadFile}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload {mediaType === 'image' ? 'Image' : 'Video'}
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="media-url">Media URL</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    id="media-url"
                    placeholder="https://example.com/image.jpg"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  className="shrink-0"
                  onClick={handleUrlSubmit}
                >
                  <Link2 className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="type-image"
                    name="media-type"
                    checked={mediaType === 'image'}
                    onChange={() => setMediaType('image')}
                    className="mr-2"
                  />
                  <Label htmlFor="type-image" className="flex items-center cursor-pointer">
                    <Image className="h-4 w-4 mr-1" />
                    Image
                  </Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="type-video"
                    name="media-type"
                    checked={mediaType === 'video'}
                    onChange={() => setMediaType('video')}
                    className="mr-2"
                  />
                  <Label htmlFor="type-video" className="flex items-center cursor-pointer">
                    <Video className="h-4 w-4 mr-1" />
                    Video
                  </Label>
                </div>
              </div>
            </div>

            {previewUrl && activeTab === 'url' && (
              <div className="border rounded-md p-2">
                {mediaType === 'image' ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto max-h-[200px] object-contain rounded-md"
                  />
                ) : (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-auto max-h-[200px] rounded-md"
                  />
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        {previewUrl && (
          <div className="flex items-center text-sm text-green-600">
            <Check className="h-4 w-4 mr-1" />
            Media selected
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
