import { useEffect, useState } from "react";

const READY_KEY = "thinkboard_server_ready_at";
const READY_TTL_MS = 10 * 60 * 1000;
const SHOW_AFTER_MS = 1500;
const ESTIMATED_SECONDS = 50;
const SLOW_AFTER_SECONDS = 150;
const GIVE_UP_AFTER_MS = 180 * 1000;
const RETRY_DELAY_MS = 2000;
const REQUEST_TIMEOUT_MS = 20000;

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
// /health lives at the server root, outside /api/v1
const HEALTH_URL = `${API_URL.replace(/\/api\/v1\/?$/, "")}/health`;

const wasRecentlyReady = () => {
  try {
    const readyAt = Number(sessionStorage.getItem(READY_KEY));
    return Boolean(readyAt) && Date.now() - readyAt < READY_TTL_MS;
  } catch {
    return false;
  }
};

const pingApi = async () => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(HEALTH_URL, {
      cache: "no-store",
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
};

export default function ServerGate({ children }) {
  const [ready, setReady] = useState(wasRecentlyReady);
  const [showSplash, setShowSplash] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (ready) return;

    let cancelled = false;
    const startedAt = Date.now();

    // Only show the splash if the server doesn't answer quickly
    const splashTimer = setTimeout(() => {
      if (!cancelled) setShowSplash(true);
    }, SHOW_AFTER_MS);

    const tick = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    const run = async () => {
      while (!cancelled) {
        const ok = await pingApi();
        if (cancelled) return;

        if (ok) {
          try {
            sessionStorage.setItem(READY_KEY, String(Date.now()));
          } catch {
            // ignore
          }
          setReady(true);
          return;
        }

        // Don't lock the user out forever, let the app show its own error
        if (Date.now() - startedAt > GIVE_UP_AFTER_MS) {
          setReady(true);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    };

    run();

    return () => {
      cancelled = true;
      clearTimeout(splashTimer);
      clearInterval(tick);
    };
  }, [ready]);

  if (ready) return <>{children}</>;
  if (!showSplash) return null;

  const remaining = Math.max(ESTIMATED_SECONDS - elapsed, 0);
  const progress = Math.min(95, Math.round((1 - Math.exp(-elapsed / 25)) * 100));

  return (
    <div className="fixed inset-0 z-9999 overflow-y-auto bg-[#5C7C89]">
      <div
        role="status"
        aria-live="polite"
        className="mx-auto flex min-h-full w-full max-w-md flex-col items-center justify-center px-6 pb-[12vh] pt-10 text-center"
      >
        <span className="loading loading-spinner loading-lg text-white" />

        <div className="mt-6">
          <h1 className="text-xl font-extrabold text-white sm:text-2xl">
            Please wait, the site is loading
          </h1>
          <h2 lang="ar" dir="rtl" className="mt-1.5 text-lg font-bold text-white/90 sm:text-xl">
            من فضلك استنى، الموقع بيحمل
          </h2>
        </div>

        <div className="my-5 h-px w-10 bg-white/30" />

        <div className="space-y-3">
          <p className="text-sm leading-6 text-white/80">
            This project is hosted on a free server that goes to sleep when idle. Waking it up
            usually takes 30–50 seconds, and it only happens on the first visit.
          </p>
          <p lang="ar" dir="rtl" className="text-sm leading-7 text-white/80">
            المشروع مرفوع على سيرفر مجاني بينام لما مفيش حد بيستخدمه. تشغيله بياخد من 30 لـ 50
            ثانية، وبيحصل في أول زيارة بس.
          </p>
        </div>

        <div className="mt-8 w-full max-w-xs">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-linear-to-r from-[#1F4959] to-[#011425] transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 text-xs font-medium text-white/80">
            <span>{remaining > 0 ? `About ${remaining}s left` : "Almost there…"}</span>
            <span lang="ar" dir="rtl">
              {remaining > 0 ? `فاضل حوالي ${remaining} ثانية` : "قربنا نخلص…"}
            </span>
          </div>
        </div>

        {elapsed >= SLOW_AFTER_SECONDS && (
          <div className="mt-8 text-sm text-white/80">
            <p>It is taking longer than usual.</p>
            <p lang="ar" dir="rtl" className="mt-1">
              الموضوع بياخد وقت أطول من المعتاد.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 min-h-11 touch-manipulation rounded-full bg-[#1F4959] px-6 text-xs font-semibold text-white transition hover:bg-[#011425] active:opacity-80"
            >
              Retry · إعادة المحاولة
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
