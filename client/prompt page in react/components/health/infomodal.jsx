import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function InfoModal({ level, isOpen, onClose }) {
  if (!level) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-blue-400">{level.name}</DialogTitle>
          <DialogDescription className="text-gray-400 pt-2">
            {level.description}
          </DialogDescription>
        </DialogHeader>
        <Button onClick={onClose} variant="outline" className="absolute top-4 right-4 h-8 w-8 p-0 border-gray-600 text-gray-300 hover:bg-gray-800">
          <X className="h-4 w-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );
}