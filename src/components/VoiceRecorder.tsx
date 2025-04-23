
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  isLoading: boolean;
}

export default function VoiceRecorder({ onTranscription, isLoading }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  // Clean up function when component unmounts or recording state changes
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecording]);
  
  const startRecording = async () => {
    try {
      // Request audio permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      // Create and configure MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      chunksRef.current = [];
      
      // Add data handler
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      // Add stop handler
      mediaRecorderRef.current.onstop = async () => {
        setIsProcessing(true);
        
        try {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          
          reader.onloadend = async () => {
            try {
              // Extract base64 data
              const base64Audio = (reader.result as string).split(',')[1];
              
              // Call Supabase edge function
              const { data, error } = await supabase.functions.invoke('speech-to-text', {
                body: { audio: base64Audio }
              });
              
              if (error) {
                console.error('Supabase function error:', error);
                throw error;
              }
              
              if (data.text) {
                onTranscription(data.text);
                toast.success('Speech transcribed successfully');
              } else {
                toast.info('No speech detected. Please try again.');
              }
            } catch (error) {
              console.error('Error processing speech:', error);
              toast.error('Failed to convert speech to text. Please try again.');
            } finally {
              setIsProcessing(false);
            }
          };
          
          reader.onerror = () => {
            console.error('FileReader error');
            toast.error('Error processing audio');
            setIsProcessing(false);
          };
          
          reader.readAsDataURL(audioBlob);
        } catch (error) {
          console.error('Error handling recorded audio:', error);
          setIsProcessing(false);
          toast.error('Error processing recording');
        }
      };
      
      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.info('Recording started. Speak now...');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check your browser permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      toast.info('Processing your speech...');
    }
  };
  
  return (
    <Button
      type="button"
      size="icon"
      variant={isRecording ? "destructive" : "outline"}
      className="ml-2 relative"
      disabled={isLoading || isProcessing}
      onClick={isRecording ? stopRecording : startRecording}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
      title={isRecording ? "Stop recording" : "Start recording"}
    >
      {isRecording ? (
        <MicOff className="h-5 w-5" />
      ) : isProcessing ? (
        <Volume2 className="h-5 w-5 animate-pulse" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
      {isProcessing && (
        <span className="absolute -top-2 -right-2 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500"></span>
        </span>
      )}
    </Button>
  );
}
