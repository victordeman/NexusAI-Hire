"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const models = [
  { value: "openai/gpt-4o-mini", label: "OpenAI GPT-4o-mini" },
  { value: "gemini/gemini-1.5-pro", label: "Google Gemini 1.5 Pro" },
  { value: "ollama/llama3", label: "Local Ollama Llama3" },
];

export function ModelSelector() {
  const [selected, setSelected] = useState("openai/gpt-4o-mini");

  return (
    <Select value={selected} onValueChange={setSelected}>
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder="Select LLM" />
      </SelectTrigger>
      <SelectContent>
        {models.map((m) => (
          <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
