import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { useClients } from "@/pages/ContentGenerator/hooks/useClients";
import { listSocialAccounts } from "@/lib/api/socialAccounts";
import { listGeneratedContent } from "@/lib/api/contentLab";
import { useContentLab } from "./hooks/useContentLab";
import { ConfigPanel } from "./components/ConfigPanel";
import { ResultPanel } from "./components/ResultPanel";
import { HistoryPanel } from "./components/HistoryPanel";

export default function ContentLab() {
  const {
    selectedClientId, selectedAccountId, contentType, language,
    prompt, results, copiedId, isGenerating, imageStyle, isGeneratingImage,
    setContentType, setLanguage, setPrompt, setImageStyle, setResults,
    selectClient, selectAccount,
    handleGenerate, handleGenerateImage, handleCopy, handleSave, handleDelete,
  } = useContentLab();

  const { clients, loadClients } = useClients();
  useEffect(() => { loadClients(); }, [loadClients]);

  const { data: accountsData } = useQuery({
    queryKey: ["social-accounts", selectedClientId],
    queryFn: () => listSocialAccounts(selectedClientId),
    enabled: !!selectedClientId,
  });
  const accounts = accountsData?.data || [];

  const { data: historyData } = useQuery({
    queryKey: ["content-history", selectedAccountId, selectedClientId],
    queryFn: () => listGeneratedContent(
      selectedAccountId || undefined,
      selectedAccountId ? undefined : selectedClientId || undefined
    ),
    enabled: !!(selectedAccountId || selectedClientId),
  });
  const history = historyData?.data || [];

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
  const hasContext = !!selectedAccount?.context_id;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" /> Content Lab
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Genera contenido con IA personalizado por cuenta y contexto de marca.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <ConfigPanel
            clients={clients}
            accounts={accounts}
            selectedClientId={selectedClientId}
            selectedAccountId={selectedAccountId}
            contentType={contentType}
            language={language}
            prompt={prompt}
            imageStyle={imageStyle}
            isGenerating={isGenerating}
            isGeneratingImage={isGeneratingImage}
            hasContext={hasContext}
            onSelectClient={selectClient}
            onSelectAccount={selectAccount}
            onContentTypeChange={setContentType}
            onLanguageChange={setLanguage}
            onPromptChange={setPrompt}
            onImageStyleChange={setImageStyle}
            onGenerate={contentType === "image" ? () => handleGenerateImage(hasContext) : () => handleGenerate(hasContext)}
          />
        </div>

        <div className="lg:col-span-3 space-y-4">
          {results.length === 0 ? (
            <ResultPanel
              result={null}
              copied={false}
              isGenerating={isGenerating}
              onCopy={() => {}}
              onSave={() => {}}
              onDelete={() => {}}
              onRegenerate={() => handleGenerate(hasContext)}
            />
          ) : (
            results.map((result, index) => (
              <ResultPanel
                key={result.id ?? index}
                result={result}
                copied={copiedId === (result.id ?? `idx-${index}`)}
                isGenerating={isGenerating}
                onCopy={() => handleCopy(index)}
                onSave={(id) => handleSave(id)}
                onDelete={(id) => handleDelete(id, index)}
                onRegenerate={() => handleGenerate(hasContext)}
              />
            ))
          )}
          <HistoryPanel
            history={history}
            onSelect={(item) => setResults(prev => [item, ...prev])}
          />
        </div>
      </div>
    </div>
  );
}
