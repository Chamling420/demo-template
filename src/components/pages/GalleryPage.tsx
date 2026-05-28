'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageIcon, Plus, Trash2, Expand, X } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function GalleryPage() {
  const { currentUser, gallery, addGalleryImage, deleteGalleryImage } = useAppStore();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      toast.error('Please enter an image URL');
      return;
    }
    addGalleryImage(newImageUrl.trim());
    toast.success('Image added to gallery!');
    setNewImageUrl('');
    setAddDialogOpen(false);
  };

  const handleDeleteImage = (id: string) => {
    deleteGalleryImage(id);
    toast.success('Image deleted');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ============ PAGE HEADER ============ */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 dark:from-rose-950/40 dark:via-pink-950/30 dark:to-rose-900/20" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-200/20 dark:bg-pink-800/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <ImageIcon className="w-4 h-4" />
            Photo Gallery
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            Our{' '}
            <span className="bg-gradient-to-r from-primary via-rose-500 to-primary bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Explore our beauty transformations
          </p>

          {/* Add Image Button (Admin & Super Admin) */}
          {isAdmin && (
            <div className="mt-6">
              <Button
                onClick={() => setAddDialogOpen(true)}
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 shadow-md shadow-primary/25 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Image
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ============ GALLERY GRID ============ */}
      <section className="flex-1 px-4 sm:px-6 py-8 sm:py-10 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          {gallery.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ImageIcon className="w-16 h-16 text-muted-foreground/40 mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                No images yet
              </h3>
              <p className="text-sm text-muted-foreground/70">
                Gallery images will appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {gallery.map((image) => (
                <Card
                  key={image.id}
                  className="group relative overflow-hidden rounded-2xl border-0 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 bg-card p-0"
                >
                  <CardContent className="p-0 relative">
                    <div className="relative overflow-hidden aspect-video">
                      <Image
                        src={image.url}
                        alt="Salon gallery image"
                        unoptimized
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="rounded-full bg-white/90 hover:bg-white text-foreground shadow-md transition-all duration-200 scale-90 group-hover:scale-100"
                          onClick={() => setSelectedImage(image.url)}
                        >
                          <Expand className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>

                      {/* Delete button (Admin & Super Admin) */}
                      {isAdmin && (
                        <div className="absolute top-2 right-2 z-10">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-full w-8 h-8 bg-white/80 hover:bg-destructive hover:text-destructive-foreground shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Image</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove this image from the gallery? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteImage(image.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ FULL SIZE IMAGE DIALOG ============ */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => {
          if (!open) setSelectedImage(null);
        }}
      >
        <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden bg-black/95 border-0">
          <DialogHeader className="absolute top-0 right-0 z-10 p-4">
            <DialogTitle className="sr-only">Gallery Image</DialogTitle>
            <DialogDescription className="sr-only">
              Full size view of the selected gallery image
            </DialogDescription>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-5 h-5" />
            </Button>
          </DialogHeader>
          {selectedImage && (
            <div className="relative w-full aspect-video">
              <Image
                src={selectedImage}
                alt="Full size gallery image"
                unoptimized
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ============ ADD IMAGE DIALOG ============ */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add Image to Gallery
            </DialogTitle>
            <DialogDescription>
              Enter the URL of the image you want to add to the gallery.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddImage();
                }}
              />
            </div>
            {newImageUrl && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-secondary/50 border">
                <Image
                  src={newImageUrl}
                  alt="Preview"
                  unoptimized
                  fill
                  className="object-cover"
                  onError={() => {}}
                />
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setNewImageUrl('');
                setAddDialogOpen(false);
              }}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddImage}
              disabled={!newImageUrl.trim()}
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
