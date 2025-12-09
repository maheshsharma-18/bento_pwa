import { useState } from "react";
import { X, Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PinGateProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PinGate({ onSuccess, onCancel }: PinGateProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  // Hardcoded for Milestone 3 (In real app, fetch from Supabase profile)
  const CORRECT_PIN = "0000"; 

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      // Auto-submit when 4th digit is entered
      if (newPin.length === 4) {
        if (newPin === CORRECT_PIN) {
          onSuccess();
        } else {
          setError(true);
          setTimeout(() => setPin(""), 500); // Clear after error
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onCancel}
        className="absolute top-4 right-4 rounded-full h-12 w-12"
      >
        <X className="w-8 h-8 text-gray-400" />
      </Button>

      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🔒
        </div>
        <h2 className="text-2xl font-heading font-bold text-text mb-2">Área dos Pais</h2>
        <p className="text-gray-500">Digite o PIN para acessar (0000)</p>
      </div>

      {/* PIN Dots Display */}
      <div className="flex gap-4 mb-12">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i}
            className={cn(
              "w-4 h-4 rounded-full transition-all duration-300",
              pin.length > i 
                ? "bg-primary scale-110" 
                : "bg-gray-200",
              error && "bg-red-400 animate-shake" // Red on error
            )}
          />
        ))}
      </div>

      {/* Numeric Keypad */}
      <div className="grid grid-cols-3 gap-6 max-w-[280px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num.toString())}
            className="w-16 h-16 rounded-full bg-white shadow-sm border border-gray-100 text-2xl font-heading font-bold text-text hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center"
          >
            {num}
          </button>
        ))}
        
        {/* Empty placeholder to align 0 */}
        <div /> 
        
        <button
          onClick={() => handleNumberClick("0")}
          className="w-16 h-16 rounded-full bg-white shadow-sm border border-gray-100 text-2xl font-heading font-bold text-text hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center"
        >
          0
        </button>

        <button
          onClick={handleDelete}
          className="w-16 h-16 rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 active:scale-95 transition-all"
        >
          <Delete className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
