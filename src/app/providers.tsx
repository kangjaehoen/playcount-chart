"use client";

import createCache, { type EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useServerInsertedHTML } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { theme } from "@/theme/theme";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <EmotionCacheRegistry>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </EmotionCacheRegistry>
  );
}

type InsertedStyle = {
  isGlobal: boolean;
  name: string;
  styles?: string;
};

function EmotionCacheRegistry({ children }: ProvidersProps) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: "css" });
    cache.compat = true;

    const previousInsert = cache.insert;
    let inserted: InsertedStyle[] = [];

    cache.insert = (...args: Parameters<EmotionCache["insert"]>) => {
      const serialized = args[1];
      const shouldCache = args[3];
      const isNew = cache.inserted[serialized.name] === undefined;
      const styles = previousInsert(...args);

      if (isNew) {
        inserted.push({
          isGlobal: !shouldCache,
          name: serialized.name,
          styles: typeof styles === "string" ? styles : undefined,
        });
      }

      return styles;
    };

    const flush = () => {
      const previousInserted = inserted;
      inserted = [];
      return previousInserted;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const inserted = flush();

    if (inserted.length === 0) {
      return null;
    }

    const globalStyles = inserted.filter((style) => style.isGlobal);
    const componentStyles = inserted.filter((style) => !style.isGlobal);
    let componentCss = "";

    for (const style of componentStyles) {
      const cachedStyle = cache.inserted[style.name];

      if (typeof cachedStyle === "string") {
        componentCss += cachedStyle;
      }
    }

    return (
      <>
        {globalStyles.map((style) => (
          <style
            dangerouslySetInnerHTML={{ __html: style.styles ?? "" }}
            data-emotion={`${cache.key}-global ${style.name}`}
            key={style.name}
          />
        ))}
        {componentCss ? (
          <style
            dangerouslySetInnerHTML={{ __html: componentCss }}
            data-emotion={`${cache.key} ${componentStyles.map((style) => style.name).join(" ")}`}
          />
        ) : null}
      </>
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
