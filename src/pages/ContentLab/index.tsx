import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useClients } from "@/pages/ContentGenerator/hooks/useClients";
import { listSocialAccounts } from "@/lib/api/socialAccounts";
import { listGeneratedContent } from "@/lib/api/contentLab";
import { getClientContext } from "@/lib/api/context";
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
    videoStyle, videoDuration, videoProvider, isGeneratingVideo,
    setContentType, setLanguage, setPrompt, setImageStyle, setResults,
    setVideoStyle, setVideoDuration, setVideoProvider,
    selectClient, selectAccount,
    handleGenerate, handleGenerateImage, handleGenerateVideo,
    handleCopy, handleDelete,
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

  const { data: ctxData } = useQuery({
    queryKey: ["client-context", selectedClientId],
    queryFn: () => getClientContext(selectedClientId!),
    enabled: !!selectedClientId,
  });
  const hasClientContext = !!ctxData?.data;

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

  const getGenerateHandler = () => {
    if (contentType === "video") return () => handleGenerateVideo(hasContext);
    if (contentType === "image") return () => handleGenerateImage(hasContext);
    return () => handleGenerate(hasContext);
  };

  const handleScheduleResult = (result: { generated_text: string; content_type: string }) => {
    schedule.addContent({ generated_text: result.generated_text, content_type: result.content_type });
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" /> Content Lab
          {hasClientContext && selectedClientId && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="ml-2 gap-1 bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                    <Brain className="h-3 w-3" /> Contexto activo
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>El contenido se genera con el perfil de este cliente</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Genera contenido con IA personalizado por cuenta y contexto de marca.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <ConfigPanel
            clients={clients} accounts={accounts}
            selectedClientId={selectedClientId} selectedAccountId={selectedAccountId}
            contentType={contentType} language={language} prompt={prompt}
            imageStyle={imageStyle} videoStyle={videoStyle} videoDuration={videoDuration}
            videoProvider={videoProvider}
            isGenerating={isGenerating} isGeneratingImage={isGeneratingImage}
            isGeneratingVideo={isGeneratingVideo} hasContext={hasContext}
            onSelectClient={selectClient} onSelectAccount={selectAccount}
            onContentTypeChange={setContentType} onLanguageChange={setLanguage}
            onPromptChange={setPrompt} onImageStyleChange={setImageStyle}
            onVideoStyleChange={setVideoStyle} onVideoDurationChange={setVideoDuration}
            onVideoProviderChange={setVideoProvider}
            onGenerate={getGenerateHandler()}
          />
        </div>

        <div className="lg:col-span-3 space-y-4">
          {results.length === 0 ? (
            <ResultPanel result={null} copied={false} isGenerating={isGenerating}
              onCopy={() => {}} onDelete={() => {}}
              onRegenerate={() => handleGenerate(hasContext)} />
          ) : (
            results.map((result, index) => (
              <ResultPanel key={result.id ?? index} result={result}
                copied={copiedId === (result.id ?? `idx-${index}`)}
                isGenerating={isGenerating}
                onCopy={() => handleCopy(index)}
                onDelete={(id) => handleDelete(id, index)}
                onRegenerate={() => handleGenerate(hasContext)}
                onSchedule={() => handleScheduleResult(result)} />
            ))
          )}
          <HistoryPanel history={history} onSelect={(item) => setResults(prev => [item, ...prev])} />
        </div>
      </div>

      {schedule.open && !schedule.minimized && (
        <ScheduleModal
          open blocks={schedule.blocks}
          activeBlockId={schedule.activeBlockId}
          limits={schedule.limits} planLabel={schedule.planLabel}
          accountId={selectedAccountId}
          onSetActive={schedule.setActiveBlockId}
          onDeleteBlock={schedule.deleteBlock}
          onRemoveItem={schedule.removeContent}
          onCreateBlock={schedule.createBlock}
          onSetDateTime={schedule.setBlockDateTime}
          onConfirmAll={schedule.confirmAll}
          onMarkSent={schedule.markSent}
          onMinimize={() => schedule.setMinimized(true)}
          onClose={schedule.reset}
        />
      )}

      {schedule.minimized && schedule.blocks.length > 0 && (
        <ScheduleMinBar blockCount={schedule.blocks.length}
          onExpand={() => { schedule.setMinimized(false); schedule.setOpen(true); }} />
      )}
    </div>
  );
}
