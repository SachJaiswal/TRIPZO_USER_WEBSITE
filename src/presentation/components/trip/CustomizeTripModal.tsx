"use client";

import React, { useState } from "react";
import { Sparkles, X, Send, Wine, Utensils, Palette } from "lucide-react";
import "./CustomizeTripModal.css";

interface CustomizeTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (instruction: string) => void;
  isCustomizing?: boolean;
  destination: string;
}

export const CustomizeTripModal: React.FC<CustomizeTripModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isCustomizing = false,
  destination,
}) => {
  const [instruction, setInstruction] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (instruction.trim()) {
      onSubmit(instruction.trim());
      setInstruction("");
    }
  };

  const handleQuickChip = (text: string) => {
    setInstruction(text);
  };

  return (
    <div className="customize-modal-overlay">
      <div className="customize-modal-container">
        <div className="customize-modal-header">
          <div className="customize-header-title">
            <Sparkles size={20} className="customize-icon" />
            <h3>Customize Itinerary with AI</h3>
          </div>
          <button type="button" onClick={onClose} className="customize-close-btn">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="customize-modal-body">
          <p className="customize-desc">
            Type natural language instructions to tweak your day-by-day itinerary
            for <strong>{destination}</strong>. OpenAI will reschedule using your
            verified Google Places candidate pool.
          </p>

          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g., 'Replace outdoor activities on Day 2 with indoor museums because of rain', or 'Add a seafood dinner spot on Day 3'."
            rows={4}
            className="customize-textarea"
            autoFocus
          />

          <div className="quick-suggestions-label">Quick Suggestions:</div>
          <div className="quick-chips-grid">
            <button
              type="button"
              onClick={() => handleQuickChip("Add more relaxed evening spots on Day 2.")}
              className="quick-chip"
            >
              <Wine size={14} /> <span>Relaxed evening spots</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickChip("Include popular local seafood dining places.")}
              className="quick-chip"
            >
              <Utensils size={14} /> <span>Seafood dining spots</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickChip("Swap morning walking tours for indoor art galleries.")}
              className="quick-chip"
            >
              <Palette size={14} /> <span>Indoor art galleries</span>
            </button>
          </div>

          <div className="customize-modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="customize-btn customize-btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCustomizing || !instruction.trim()}
              className="customize-btn customize-btn-submit"
            >
              <Send size={16} />
              <span>{isCustomizing ? "Applying AI Tweaks..." : "Apply Customization"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
