import type { ScriptScene } from "../types";

interface Props {
  scenes: ScriptScene[];
  raw: string;
}

export function ScriptResult({ scenes, raw }: Props) {
  if (scenes.length === 0 && !raw) return null;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Script de Video</label>
      <div className="rounded-lg bg-secondary/50 p-3 space-y-3">
        {scenes.length > 0 ? (
          <ol className="list-decimal list-inside space-y-2">
            {scenes.map((scene, i) => (
              <li key={i} className="text-sm">
                <span className="font-medium">
                  {scene.title || scene.name || `Escena ${i + 1}`}
                </span>
                {(scene.description || scene.action || scene.dialogue) && (
                  <p className="text-muted-foreground ml-5 mt-0.5">
                    {scene.description || scene.action || scene.dialogue}
                  </p>
                )}
                {scene.duration && (
                  <span className="text-xs text-muted-foreground ml-5">
                    ({scene.duration})
                  </span>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <pre className="text-sm whitespace-pre-wrap">{raw}</pre>
        )}
      </div>
    </div>
  );
}
