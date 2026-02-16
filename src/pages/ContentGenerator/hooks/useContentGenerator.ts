import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type {
  ContentLanguage,
  ScriptScene,
  BrandValidationResult,
} from "../types";
import { LANG_SUFFIX } from "../types";

function extractField<T>(result: unknown, ...keys: string[]): T {
  let data = result as Record<string, unknown>;
  if (data?.data) data = data.data as Record<string, unknown>;
  for (const k of keys) {
    if (data?.[k] !== undefined) return data[k] as T;
  }
  return data as T;
}

export function useContentGenerator() {
  const { toast } = useToast();

  // --- Core inputs ---
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("professional");
  const [activeTab, setActiveTab] = useState("caption");
  const [language, setLanguage] = useState<ContentLanguage>(
    () => (localStorage.getItem("omega_content_language") as ContentLanguage) || "es"
  );

  useEffect(() => {
    localStorage.setItem("omega_content_language", language);
  }, [language]);

  // --- Caption ---
  const [generatingCaption, setGeneratingCaption] = useState(false);
  const [caption, setCaption] = useState("");

  // --- Image ---
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // --- Hashtags ---
  const [generatingHashtags, setGeneratingHashtags] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);

  // --- Script ---
  const [scriptTopic, setScriptTopic] = useState("");
  const [scriptDuration, setScriptDuration] = useState(60);
  const [generatingScript, setGeneratingScript] = useState(false);
  const [scriptScenes, setScriptScenes] = useState<ScriptScene[]>([]);
  const [scriptRaw, setScriptRaw] = useState("");

  // --- Brand validation ---
  const [validatingBrand, setValidatingBrand] = useState(false);
  const [brandResult, setBrandResult] = useState<BrandValidationResult | null>(null);

  const topicWithLang = useCallback(
    (text: string) => text + LANG_SUFFIX[language],
    [language]
  );

  const handleGenerateCaption = useCallback(async () => {
    setGeneratingCaption(true);
    try {
      const result = await api.generateCaption(topicWithLang(prompt), platform, tone);
      const text = extractField<string>(result, "caption", "content");
      setCaption(typeof text === "string" ? text : JSON.stringify(text));
      toast({ title: "✅ Caption generada" });
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally {
      setGeneratingCaption(false);
    }
  }, [prompt, platform, tone, topicWithLang, toast]);

  const handleGenerateImage = useCallback(async () => {
    setGeneratingImage(true);
    setImageUrl(null);
    try {
      const result = await api.generateImage(topicWithLang(prompt));
      const data = result as Record<string, unknown>;
      const nested = data?.data as Record<string, unknown> | undefined;
      const urls = nested?.image_urls as string[] | undefined;
      const url = urls?.[0]
        || (nested?.image_url as string | undefined)
        || extractField<string>(result, "image_url", "url");
      if (typeof url === "string" && url.startsWith("http")) {
        setImageUrl(url);
        toast({ title: "✅ Imagen generada" });
      } else {
        toast({ title: "Error", description: "No se encontró URL de imagen", variant: "destructive" });
      }
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally {
      setGeneratingImage(false);
    }
  }, [prompt, topicWithLang, toast]);

  const handleGenerateHashtags = useCallback(async () => {
    setGeneratingHashtags(true);
    try {
      const result = await api.generateHashtags(topicWithLang(prompt || caption), platform);
      const tags = extractField<string[]>(result, "hashtags");
      setHashtags(Array.isArray(tags) ? tags : []);
      toast({ title: "✅ Hashtags generados" });
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally {
      setGeneratingHashtags(false);
    }
  }, [prompt, caption, platform, topicWithLang, toast]);

  const handleGenerateScript = useCallback(async () => {
    setGeneratingScript(true);
    try {
      const result = await api.generateVideoScript(topicWithLang(scriptTopic || prompt), scriptDuration, platform);
      const data = (result as Record<string, unknown>)?.data ?? result;
      const record = data as Record<string, unknown>;
      const scenes = record?.scenes ?? record?.script;
      if (Array.isArray(scenes)) {
        setScriptScenes(scenes as ScriptScene[]);
        setScriptRaw("");
      } else if (typeof (record?.script ?? data) === "string") {
        setScriptRaw((record?.script as string) ?? JSON.stringify(data, null, 2));
        setScriptScenes([]);
      } else {
        setScriptRaw(JSON.stringify(data, null, 2));
        setScriptScenes([]);
      }
      toast({ title: "✅ Script generado" });
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally {
      setGeneratingScript(false);
    }
  }, [prompt, scriptTopic, scriptDuration, platform, topicWithLang, toast]);

  const handleValidateBrand = useCallback(async () => {
    setValidatingBrand(true);
    try {
      const result = await api.validateContent(caption || prompt, { tone, platform });
      const data = (result as Record<string, unknown>)?.data ?? result;
      // API shape not guaranteed — cast is intentional
      setBrandResult(data as BrandValidationResult);
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally {
      setValidatingBrand(false);
    }
  }, [caption, prompt, tone, platform, toast]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado al portapapeles" });
  }, [toast]);

  const hasResults = !!(caption || imageUrl || hashtags.length > 0 || scriptScenes.length > 0 || scriptRaw);

  return {
    prompt, setPrompt, platform, setPlatform, tone, setTone,
    activeTab, setActiveTab, language, setLanguage,
    generatingCaption, caption, handleGenerateCaption,
    generatingImage, imageUrl, handleGenerateImage,
    generatingHashtags, hashtags, handleGenerateHashtags,
    scriptTopic, setScriptTopic, scriptDuration, setScriptDuration,
    generatingScript, scriptScenes, scriptRaw, handleGenerateScript,
    validatingBrand, brandResult, handleValidateBrand,
    copyToClipboard, hasResults,
  };
}
