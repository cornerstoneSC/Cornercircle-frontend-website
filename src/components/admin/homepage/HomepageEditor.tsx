"use client";

import { useEffect, useRef, useState } from "react";
import BeliefsSection from "@/components/public/Homepage/BeliefsSection";
import AboutHomeSection from "@/components/public/Homepage/AboutHomeSection";
import HeroSection from "@/components/public/Homepage/HeroSection";
import GallerySection from "@/components/public/Homepage/GallerySection";
import FounderSection from "@/components/public/Homepage/FounderSection";
import FounderStory from "@/components/public/founder/FounderStory";
import PublicFooter from "@/components/public/layout/PublicFooter";
import {
  defaultHomepageContent,
  updateLegacyFounderIntro,
} from "@/data/homepage";
import {
  getHomepage,
  saveHomepageContent,
  uploadAboutImage,
  uploadBeliefsImage,
  uploadFounderImage,
  uploadHeroImage,
} from "@/services/homepage.service";
import type { HomepageContent } from "@/types/homepage";
import useUnsavedChanges from "@/hooks/useUnsavedChanges";
import { ImagePlus } from "lucide-react";

type PhotoKey = "hero" | "about" | "beliefs" | "founder";

function PhotoPicker({
  label,
  disabled,
  onSelect,
}: {
  label: string;
  disabled: boolean;
  onSelect: (file: File) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => input.current?.click()}
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-plum shadow-lg hover:bg-stone-100 disabled:opacity-50"
      >
        <ImagePlus size={17} aria-hidden="true" />
        Edit {label} photo
      </button>
      <input
        ref={input}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onSelect(file);
          event.target.value = "";
        }}
      />
    </>
  );
}

export default function HomepageEditor({
  founderOnly = false,
}: {
  founderOnly?: boolean;
}) {
  const [content, setContent] = useState<HomepageContent>(
    defaultHomepageContent,
  );
  const [saved, setSaved] = useState<HomepageContent>(defaultHomepageContent);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [saveError, setSaveError] = useState("");
  const [aboutImageUrl, setAboutImageUrl] = useState<string>();
  const [beliefsImageUrl, setBeliefsImageUrl] = useState<string>();
  const [savedAboutImageUrl, setSavedAboutImageUrl] = useState<string>();
  const [savedBeliefsImageUrl, setSavedBeliefsImageUrl] = useState<string>();
  const [founderImageUrl, setFounderImageUrl] = useState<string>();
  const [savedFounderImageUrl, setSavedFounderImageUrl] = useState<string>();
  const [uploading, setUploading] = useState<PhotoKey | null>(null);
  const [pendingPhotoCount, setPendingPhotoCount] = useState(0);
  const pendingPhotos = useRef<
    Partial<Record<PhotoKey, { file: File; preview: string }>>
  >({});
  const hasBeliefsUploadedRef = useRef(false);
  const hasHeroUploadedRef = useRef(false);
  const hasAboutUploadedRef = useRef(false);
  const hasFounderUploadedRef = useRef(false);

  useEffect(() => {
    getHomepage()
      .then((homepage) => {
        let loaded = structuredClone(defaultHomepageContent);
        if (!hasBeliefsUploadedRef.current && homepage.beliefsImageUrl) {
          setBeliefsImageUrl(homepage.beliefsImageUrl);
          setSavedBeliefsImageUrl(homepage.beliefsImageUrl);
        }
        if (!hasHeroUploadedRef.current && homepage.heroImageUrl) {
          loaded.hero.imageUrl = homepage.heroImageUrl;
        }
        if (!hasFounderUploadedRef.current && homepage.founderImageUrl) {
          setFounderImageUrl(homepage.founderImageUrl);
          setSavedFounderImageUrl(homepage.founderImageUrl);
        }
        if (homepage.contentJson) {
          try {
            const persisted = JSON.parse(
              homepage.contentJson,
            ) as Partial<HomepageContent>;
            loaded = {
              ...loaded,
              ...persisted,
              hero: { ...loaded.hero, ...persisted.hero },
              beliefs: {
                ...loaded.beliefs,
                ...persisted.beliefs,
                items: persisted.beliefs?.items ?? loaded.beliefs.items,
              },
              story: { ...loaded.story, ...persisted.story },
              servicesPreview: {
                ...loaded.servicesPreview,
                ...persisted.servicesPreview,
                services:
                  persisted.servicesPreview?.services ??
                  loaded.servicesPreview.services,
              },
              gallery: {
                ...loaded.gallery,
                ...persisted.gallery,
                imageAlt:
                  persisted.gallery?.imageAlt ?? loaded.gallery.imageAlt,
              },
              founder: {
                ...loaded.founder,
                ...persisted.founder,
                biography:
                  persisted.founder?.biography ?? loaded.founder.biography,
                credentials:
                  persisted.founder?.credentials ?? loaded.founder.credentials,
                pillars: persisted.founder?.pillars ?? loaded.founder.pillars,
              },
              visibility: { ...loaded.visibility, ...persisted.visibility },
              events: { ...loaded.events, ...persisted.events },
              seo: { ...loaded.seo, ...persisted.seo },
            };
            updateLegacyFounderIntro(loaded);
          } catch {
            console.error("Saved homepage content is invalid; using defaults.");
          }
        }
        if (!hasAboutUploadedRef.current && homepage.aboutImageUrl) {
          setAboutImageUrl(homepage.aboutImageUrl);
          setSavedAboutImageUrl(homepage.aboutImageUrl);
        }
        setContent(loaded);
        setSaved(loaded);
        setReady(true);
      })
      .catch((error) => {
        console.error("Failed to load homepage data, using fallback", error);
        setSaveError(
          "Unable to load the saved homepage. Refresh and try again before editing.",
        );
      });
  }, []);

  useEffect(
    () => () => {
      Object.values(pendingPhotos.current).forEach((photo) =>
        URL.revokeObjectURL(photo.preview),
      );
    },
    [],
  );

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const dirty =
    ready &&
    (JSON.stringify(content) !== JSON.stringify(saved) ||
      pendingPhotoCount > 0);
  useUnsavedChanges(dirty);

  function edit(path: string, value: string | boolean) {
    setNotice("");
    setSaveError("");
    setContent((current) => {
      const next = structuredClone(current) as HomepageContent &
        Record<string, unknown>;
      const parts = path.split(".");
      let target: Record<string, unknown> | unknown[] = next;
      for (let index = 0; index < parts.length - 1; index++)
        target = (target as Record<string, Record<string, unknown>>)[
          parts[index]
        ];
      (target as Record<string, unknown>)[parts.at(-1)!] = value;
      return next;
    });
  }
  async function saveContent() {
    setSaving(true);
    setSaveError("");
    setNotice("");
    try {
      const draft = structuredClone(content);
      if (pendingPhotos.current.hero) {
        setUploading("hero");
        const result = await uploadHeroImage(pendingPhotos.current.hero.file);
        draft.hero.imageUrl = result.heroImageUrl;
      }
      if (pendingPhotos.current.about) {
        setUploading("about");
        const result = await uploadAboutImage(pendingPhotos.current.about.file);
        setAboutImageUrl(result.aboutImageUrl);
        setSavedAboutImageUrl(result.aboutImageUrl);
      }
      if (pendingPhotos.current.beliefs) {
        setUploading("beliefs");
        const result = await uploadBeliefsImage(
          pendingPhotos.current.beliefs.file,
        );
        setBeliefsImageUrl(result.beliefsImageUrl);
        setSavedBeliefsImageUrl(result.beliefsImageUrl);
      }
      if (pendingPhotos.current.founder) {
        setUploading("founder");
        const result = await uploadFounderImage(
          pendingPhotos.current.founder.file,
        );
        setFounderImageUrl(result.founderImageUrl);
        setSavedFounderImageUrl(result.founderImageUrl);
      }
      setUploading(null);
      await saveHomepageContent(draft);
      Object.values(pendingPhotos.current).forEach((photo) =>
        URL.revokeObjectURL(photo.preview),
      );
      pendingPhotos.current = {};
      setPendingPhotoCount(0);
      setContent(draft);
      setSaved(draft);
      setNotice("Saved. Your homepage changes are now published.");
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Unable to save changes.",
      );
    } finally {
      setSaving(false);
      setUploading(null);
    }
  }

  function selectPhoto(key: PhotoKey, file: File) {
    setSaveError("");
    setNotice("");
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size === 0 ||
      file.size > 8 * 1024 * 1024
    ) {
      setSaveError("Choose a PNG, JPEG, or WebP image smaller than 8 MB.");
      return;
    }
    const prior = pendingPhotos.current[key];
    if (prior) URL.revokeObjectURL(prior.preview);
    const preview = URL.createObjectURL(file);
    pendingPhotos.current[key] = { file, preview };
    setPendingPhotoCount(Object.keys(pendingPhotos.current).length);
    if (key === "hero")
      setContent((current) => ({
        ...current,
        hero: { ...current.hero, imageUrl: preview },
      }));
    else if (key === "about") setAboutImageUrl(preview);
    else if (key === "beliefs") setBeliefsImageUrl(preview);
    else setFounderImageUrl(preview);
    setNotice(
      "Photo replaced in the preview. Save changes to upload and publish it.",
    );
  }

  function discard() {
    Object.values(pendingPhotos.current).forEach((photo) =>
      URL.revokeObjectURL(photo.preview),
    );
    pendingPhotos.current = {};
    setPendingPhotoCount(0);
    setContent(saved);
    setAboutImageUrl(savedAboutImageUrl);
    setBeliefsImageUrl(savedBeliefsImageUrl);
    setFounderImageUrl(savedFounderImageUrl);
    setSaveError("");
    setNotice("");
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#fcfaf7]">
      <div className="relative z-50 shrink-0">
        {dirty && (
          <div className="flex items-center gap-3 border-b border-stone-200 bg-[#fcfaf7]/95 px-4 py-3 shadow-sm backdrop-blur">
            <span className="mr-auto text-xs text-stone-500">
              {uploading
                ? `Uploading ${uploading} photo…`
                : saving
                  ? "Saving…"
                  : "Unsaved changes"}
            </span>
            <button
              disabled={saving}
              onClick={discard}
              className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium"
            >
              Discard changes
            </button>
            <button
              disabled={saving || !ready}
              onClick={() => void saveContent()}
              className="rounded-lg bg-[#a18452] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        )}
        {saveError && (
          <p
            role="alert"
            className="m-3 rounded-lg bg-red-50 p-4 text-sm text-red-800 shadow-sm"
          >
            {saveError}
          </p>
        )}
        {notice && (
          <p
            role="status"
            className="m-3 rounded-lg bg-green-50 p-4 text-sm text-green-800 shadow-sm"
          >
            {notice}
          </p>
        )}
      </div>
      <section
        inert={!ready || saving}
        aria-busy={saving}
        className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-stone-200"
      >
        {founderOnly && (
          <div className="border-b border-stone-200 bg-[#fcfaf7] px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#a18452]">
              Website content
            </p>
            <h1 className="mt-1 font-serif text-3xl text-[#302a27]">
              Founder Page
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Click any text to edit it. Edit the photo directly on the
              portrait.
            </p>
          </div>
        )}
        {!founderOnly && (
          <>
            <div className="relative">
              <HeroSection
                content={content.hero}
                photoControls={
                  <div className="absolute right-4 top-4 z-20">
                    <PhotoPicker
                      label="hero"
                      disabled={saving}
                      onSelect={(file) => selectPhoto("hero", file)}
                    />
                  </div>
                }
                onEdit={(key, value) => edit(`hero.${key}`, value)}
              />
            </div>
            {content.visibility.beliefs && (
              <div className="relative">
                <BeliefsSection
                  content={content.beliefs}
                  onEdit={(path, value) => edit(`beliefs.${path}`, value)}
                  imageUrl={beliefsImageUrl}
                  photoControls={
                    <div className="absolute right-4 top-4 z-20">
                      <PhotoPicker
                        label="beliefs"
                        disabled={saving}
                        onSelect={(file) => selectPhoto("beliefs", file)}
                      />
                    </div>
                  }
                />
              </div>
            )}
            {content.visibility.story && (
              <div className="relative">
                <AboutHomeSection
                  story={content.story}
                  servicesPreview={content.servicesPreview}
                  onEdit={edit}
                  imageUrl={aboutImageUrl}
                  photoControls={
                    <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2">
                      <PhotoPicker
                        label="about"
                        disabled={saving}
                        onSelect={(file) => selectPhoto("about", file)}
                      />
                    </div>
                  }
                />
              </div>
            )}
          </>
        )}
        {!founderOnly && content.visibility.founder && (
          <div className="relative">
            <FounderSection
              content={content.founder}
              imageUrl={founderImageUrl}
              onEdit={(path, value) => edit(`founder.${path}`, value)}
              photoControls={
                <div className="absolute right-4 top-4 z-20">
                  <PhotoPicker
                    label="founder"
                    disabled={saving}
                    onSelect={(file) => selectPhoto("founder", file)}
                  />
                </div>
              }
            />
          </div>
        )}
        {founderOnly && (
          <div>
            <FounderStory
              content={content.founder}
              imageUrl={founderImageUrl}
              onEdit={(path, value) => edit(`founder.${path}`, value)}
              photoControls={
                <div className="absolute right-4 top-4 z-20">
                  <PhotoPicker
                    label="founder"
                    disabled={saving}
                    onSelect={(file) => selectPhoto("founder", file)}
                  />
                </div>
              }
            />
          </div>
        )}
        {!founderOnly && content.visibility.gallery && (
          <div>
            <GallerySection
              content={content.gallery}
              onEdit={(path, value) => edit(`gallery.${path}`, value)}
              images={[beliefsImageUrl, aboutImageUrl, content.hero.imageUrl]}
            />
          </div>
        )}
        {!founderOnly && (
          <div className="pointer-events-none">
            <PublicFooter />
          </div>
        )}
      </section>
    </div>
  );
}
