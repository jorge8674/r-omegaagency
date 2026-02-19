import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { useClients } from "@/pages/ContentGenerator/hooks/useClients";
import { listSocialAccounts } from "@/lib/api/socialAccounts";
import { listGeneratedContent } from "@/lib/api/contentLab";
import { useContentLab } from "./hooks/useContentLab";
import { useScheduleBlocks } from "./hooks/useScheduleBlocks";
import { ConfigPanel } from "./components/ConfigPanel";
import { ResultPanel } from "./components/ResultPanel";
import { HistoryPanel } from "./components/HistoryPanel";
import { ScheduleModal } from "./components/ScheduleModal";
import { ScheduleMinBar } from "./components/ScheduleMinBar";

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

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const schedule = useScheduleBlocks(selectedClient?.plan);

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
      selectedAccountId ? undefined : selectedClientId || undefined,
    ),
    enabled: !!(selectedAccountId || selectedClientId),
  });
  const history = historyData?.data || [];

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);
  const hasContext = !!selectedAccount?.context_id;

  const handleScheduleResult = (result: { generated_text: string; content_type: string }) => {
    schedule.addContent({
      generated_text: result.generated_text,
      content_type: result.content_type,
    });
  };

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
            onGenerate={contentType === "image"
              ? () => handleGenerateImage(hasContext)
              : () => handleGenerate(hasContext)}
          />
        </div>

        <div className="lg:col-span-3 space-y-4">
          {results.length === 0 ? (
            <ResultPanel
              result={null} copied={false} isGenerating={isGenerating}
              onCopy={() => {}} onSave={() => {}} onDelete={() => {}}
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
                onSchedule={() => handleScheduleResult(result)}
              />
            ))
          )}
          <HistoryPanel
            history={history}
            onSelect={(item) => setResults(prev => [item, ...prev])}
          />
        </div>
      </div>

      {/* Schedule modal (expanded) */}
      {schedule.open && !schedule.minimized && (
        <ScheduleModal
          open
          blocks={schedule.blocks}
          activeIndex={schedule.activeIndex}
          limits={schedule.limits}
          accountId={selectedAccountId}
          onSetActive={schedule.setActiveIndex}
          onConfirmBlock={schedule.confirmBlock}
          onDeleteBlock={schedule.deleteBlock}
          onRemoveItem={schedule.removeContent}
          onCreateBlock={schedule.createBlock}
          onMinimize={() => schedule.setMinimized(true)}
          onClose={schedule.reset}
          onSuccess={schedule.reset}
        />
      )}

      {/* Minimized bar */}
      {schedule.minimized && schedule.blocks.length > 0 && (
        <ScheduleMinBar
          blockCount={schedule.blocks.length}
          onExpand={() => { schedule.setMinimized(false); schedule.setOpen(true); }}
        />
      )}
    </div>
  );
}
