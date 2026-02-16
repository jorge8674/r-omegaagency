import { useContentGenerator } from "./hooks/useContentGenerator";
import { ConfigPanel } from "./components/ConfigPanel";
import { ResultsPanel } from "./components/ResultsPanel";

export default function ContentGenerator() {
  const state = useContentGenerator();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Content Lab</h1>
        <p className="text-muted-foreground">Genera contenido optimizado con IA</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConfigPanel
          prompt={state.prompt}
          onPromptChange={state.setPrompt}
          platform={state.platform}
          onPlatformChange={state.setPlatform}
          tone={state.tone}
          onToneChange={state.setTone}
          activeTab={state.activeTab}
          onActiveTabChange={state.setActiveTab}
          language={state.language}
          onLanguageChange={state.setLanguage}
          scriptTopic={state.scriptTopic}
          onScriptTopicChange={state.setScriptTopic}
          scriptDuration={state.scriptDuration}
          onScriptDurationChange={state.setScriptDuration}
          generatingCaption={state.generatingCaption}
          generatingImage={state.generatingImage}
          generatingHashtags={state.generatingHashtags}
          generatingScript={state.generatingScript}
          onCaption={state.handleGenerateCaption}
          onImage={state.handleGenerateImage}
          onHashtags={state.handleGenerateHashtags}
          onScript={state.handleGenerateScript}
        />
        <ResultsPanel
          caption={state.caption}
          imageUrl={state.imageUrl}
          hashtags={state.hashtags}
          scriptScenes={state.scriptScenes}
          scriptRaw={state.scriptRaw}
          brandResult={state.brandResult}
          validatingBrand={state.validatingBrand}
          onCopy={state.copyToClipboard}
          onValidateBrand={state.handleValidateBrand}
        />
      </div>
    </div>
  );
}
