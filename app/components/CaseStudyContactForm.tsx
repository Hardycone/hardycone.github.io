"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircleIcon,
  CopyIcon,
  SmileyWinkIcon,
} from "@phosphor-icons/react";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import KeyboardHint from "./KeyboardHint";
import { useKeyboardHints } from "../context/KeyboardHintsContext";
import { isTextEntryKeyboardTarget } from "@/lib/keyboard";

const FORM_ENDPOINT = "https://formsubmit.co/ajax/haichwng@gmail.com";
const CONTACT_EMAIL = "haichwng@gmail.com";
const SUCCESS_MESSAGE = "Got your message! I will get back to you shortly.";

type FormFields = {
  name: string;
  email: string;
  message: string;
  website: string;
};

type ValidatedField = "name" | "email" | "message";
type FieldErrors = Partial<Record<ValidatedField, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateFields(fields: FormFields): FieldErrors {
  const errors: FieldErrors = {};

  if (!fields.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!fields.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!emailPattern.test(fields.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!fields.message.trim()) {
    errors.message = "Please enter a message.";
  }

  return errors;
}

export default function CaseStudyContactForm() {
  const { flashShortcutHint } = useKeyboardHints();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [hasCopiedEmail, setHasCopiedEmail] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isApplePlatform, setIsApplePlatform] = useState(false);
  const [isTextEntryFocused, setIsTextEntryFocused] = useState(false);
  const [showKeyboardHints, setShowKeyboardHints] = useState(false);
  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    message: "",
    website: "",
  });

  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const copyTimeout = useRef<number | null>(null);
  const successTimeout = useRef<number | null>(null);

  const handleCopyEmail = useCallback(async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = CONTACT_EMAIL;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }

      setHasCopiedEmail(true);
      if (copyTimeout.current) {
        window.clearTimeout(copyTimeout.current);
      }
      copyTimeout.current = window.setTimeout(() => {
        setHasCopiedEmail(false);
        copyTimeout.current = null;
      }, 3000);
    } catch {
      setHasCopiedEmail(false);
    }
  }, []);

  const handleFieldChange = useCallback(
    (field: keyof FormFields, value: string) => {
      setFields((previous) => ({ ...previous, [field]: value }));
      if (field !== "website") {
        setFieldErrors((previous) => {
          if (!previous[field]) return previous;
          const nextErrors = { ...previous };
          delete nextErrors[field];
          return nextErrors;
        });
      }
    },
    [],
  );

  const showSuccessMessage = useCallback(() => {
    setShowSuccess(true);
    if (successTimeout.current) {
      window.clearTimeout(successTimeout.current);
    }
    successTimeout.current = window.setTimeout(() => {
      setShowSuccess(false);
      successTimeout.current = null;
    }, 6000);
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSubmitting || fields.website) return;

      const validationErrors = validateFields(fields);
      const firstInvalidField = (["name", "email", "message"] as const).find(
        (field) => validationErrors[field],
      );

      if (firstInvalidField) {
        setFieldErrors(validationErrors);
        const fieldRefs = {
          name: nameInputRef,
          email: emailInputRef,
          message: messageInputRef,
        };
        window.requestAnimationFrame(() => {
          fieldRefs[firstInvalidField].current?.focus({ preventScroll: true });
        });
        return;
      }

      const trimmedFields = {
        name: fields.name.trim(),
        email: fields.email.trim(),
        message: fields.message.trim(),
      };

      setIsSubmitting(true);
      setError(null);
      setFieldErrors({});

      try {
        const response = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmedFields.name,
            email: trimmedFields.email,
            message: trimmedFields.message,
            _subject: `Portfolio message from ${trimmedFields.name}`,
            _template: "table",
            _captcha: "false",
            _honey: fields.website,
            _url: window.location.href,
          }),
        });
        const result = (await response.json().catch(() => null)) as {
          success?: boolean | string;
          message?: string;
        } | null;
        const wasRejected =
          !response.ok ||
          result?.success === false ||
          result?.success === "false";

        if (wasRejected) {
          throw new Error(result?.message || "The message could not be sent.");
        }

        setFields({ name: "", email: "", message: "", website: "" });
        showSuccessMessage();
      } catch {
        setError("Something went wrong. Please try again in a moment.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [fields, isSubmitting, showSuccessMessage],
  );

  useEffect(() => {
    setIsApplePlatform(/Mac|iPhone|iPad|iPod/.test(navigator.platform));
  }, []);

  useEffect(() => {
    const supportsKeyboardHints = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    const handleFormKeyboardInput = (event: KeyboardEvent) => {
      if (
        !supportsKeyboardHints ||
        !formRef.current?.contains(event.target as Node) ||
        !isTextEntryKeyboardTarget(event.target) ||
        event.repeat ||
        event.key === "Tab" ||
        event.key === "Shift" ||
        event.key === "Meta" ||
        event.key === "Control" ||
        event.key === "Alt"
      ) {
        return;
      }

      setShowKeyboardHints(true);
    };

    const handlePointerInput = () => {
      setShowKeyboardHints(false);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        setShowKeyboardHints(false);
      }
    };

    window.addEventListener("keydown", handleFormKeyboardInput);
    window.addEventListener("pointerdown", handlePointerInput);
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("keydown", handleFormKeyboardInput);
      window.removeEventListener("pointerdown", handlePointerInput);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  useEffect(() => {
    const handleSendShortcut = (event: KeyboardEvent) => {
      const usesPlatformModifier = isApplePlatform
        ? event.metaKey && !event.ctrlKey
        : event.ctrlKey && !event.metaKey;
      const formOwnsInput =
        formRef.current?.contains(event.target as Node) ||
        formRef.current?.contains(document.activeElement);

      if (
        !formOwnsInput ||
        event.key !== "Enter" ||
        !usesPlatformModifier ||
        event.altKey ||
        event.shiftKey ||
        event.repeat ||
        event.isComposing ||
        isSubmitting
      ) {
        return;
      }

      event.preventDefault();
      flashShortcutHint("case-study-send-message");
      formRef.current?.requestSubmit();
    };

    window.addEventListener("keydown", handleSendShortcut);
    return () => window.removeEventListener("keydown", handleSendShortcut);
  }, [flashShortcutHint, isApplePlatform, isSubmitting]);

  useEffect(() => {
    return () => {
      if (copyTimeout.current) {
        window.clearTimeout(copyTimeout.current);
      }
      if (successTimeout.current) {
        window.clearTimeout(successTimeout.current);
      }
    };
  }, []);

  const fieldClasses = (hasError: boolean) =>
    `w-full rounded-1.5 supports-[corner-shape:squircle]:rounded-3 supports-[corner-shape:squircle]:[corner-shape:squircle] border bg-background/80 px-3 py-2 font-sans text-base text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-foreground/40 focus:ring-2 dark:bg-dark-background/80 dark:text-dark-foreground dark:placeholder:text-dark-foreground/40 ${
      hasError
        ? "border-red-600 focus:border-red-600 focus:ring-red-500/20 dark:border-red-400 dark:focus:border-red-400"
        : "border-foreground/15 focus:border-foreground/50 focus:ring-sky-500/30 dark:border-dark-foreground/15 dark:focus:border-dark-foreground/50"
    }`;
  const sendShortcutLabel = isApplePlatform ? "⌘ + Enter" : "Ctrl + Enter";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ y: 12, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 8, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-4 flex items-start gap-2 rounded-2 border border-green-600/20 bg-emerald-800 p-4 font-sans text-sm text-background shadow-md dark:border-green-400/20 dark:bg-emerald-100 dark:text-dark-background"
          >
            <SmileyWinkIcon
              size={20}
              className="shrink-0 text-emerald-400 dark:text-emerald-600"
            />
            <span>{SUCCESS_MESSAGE}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        ref={formRef}
        id="case-study-one-contact-form"
        noValidate
        onSubmit={handleSubmit}
        onFocusCapture={(event) => {
          if (isTextEntryKeyboardTarget(event.target)) {
            setIsTextEntryFocused(true);
          }
        }}
        onBlurCapture={(event) => {
          const form = event.currentTarget;
          window.requestAnimationFrame(() => {
            setIsTextEntryFocused(
              form.contains(document.activeElement) &&
                isTextEntryKeyboardTarget(document.activeElement),
            );
          });
        }}
        className="relative flex w-full flex-col gap-4"
      >
        <p>
          Send me a message, or{" "}
          <button
            type="button"
            tabIndex={0}
            onClick={handleCopyEmail}
            className="inline-flex items-baseline gap-1 rounded-full bg-foreground py-1 pl-2 pr-3 font-sans text-sm text-background opacity-75 transition-[color,opacity,text-decoration-color] hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 dark:bg-dark-foreground dark:text-dark-background"
            aria-live="polite"
          >
            {hasCopiedEmail ? (
              <CheckCircleIcon
                size="1em"
                weight="fill"
                className="translate-y-0.5"
              />
            ) : (
              <CopyIcon size="1em" className="translate-y-0.5" />
            )}
            {hasCopiedEmail ? "copied!" : "copy my email"}
          </button>
        </p>

        <label className="flex flex-col gap-1 font-sans text-sm font-semibold">
          Name
          <input
            ref={nameInputRef}
            tabIndex={0}
            required
            type="text"
            name="name"
            autoComplete="name"
            value={fields.name}
            onChange={(event) => handleFieldChange("name", event.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={
              fieldErrors.name ? "case-study-contact-name-error" : undefined
            }
            className={fieldClasses(Boolean(fieldErrors.name))}
          />
          {fieldErrors.name && (
            <span
              id="case-study-contact-name-error"
              className="font-sans text-xs font-normal text-red-600 dark:text-red-400"
            >
              {fieldErrors.name}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1 font-sans text-sm font-semibold">
          Email
          <input
            ref={emailInputRef}
            tabIndex={0}
            required
            type="email"
            name="email"
            autoComplete="email"
            value={fields.email}
            onChange={(event) => handleFieldChange("email", event.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={
              fieldErrors.email ? "case-study-contact-email-error" : undefined
            }
            className={fieldClasses(Boolean(fieldErrors.email))}
          />
          {fieldErrors.email && (
            <span
              id="case-study-contact-email-error"
              className="font-sans text-xs font-normal text-red-600 dark:text-red-400"
            >
              {fieldErrors.email}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1 font-sans text-sm font-semibold">
          Message
          <textarea
            ref={messageInputRef}
            tabIndex={0}
            required
            name="message"
            rows={5}
            value={fields.message}
            onChange={(event) =>
              handleFieldChange("message", event.target.value)
            }
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={
              fieldErrors.message ? "case-study-contact-body-error" : undefined
            }
            className={`${fieldClasses(Boolean(fieldErrors.message))} min-h-32 resize-y`}
          />
          {fieldErrors.message && (
            <span
              id="case-study-contact-body-error"
              className="font-sans text-xs font-normal text-red-600 dark:text-red-400"
            >
              {fieldErrors.message}
            </span>
          )}
        </label>

        <label
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px]"
        >
          Website
          <input
            type="text"
            name="_honey"
            tabIndex={-1}
            autoComplete="off"
            value={fields.website}
            onChange={(event) =>
              handleFieldChange("website", event.target.value)
            }
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          tabIndex={0}
          disabled={isSubmitting}
          className="mt-1 min-h-11 rounded-1.5 bg-foreground px-5 font-sans text-sm font-semibold text-background transition-[transform,opacity] hover:scale-[0.97] active:scale-[0.98] disabled:cursor-wait disabled:opacity-50 supports-[corner-shape:squircle]:rounded-3 supports-[corner-shape:squircle]:[corner-shape:squircle] dark:bg-dark-foreground dark:text-dark-background"
        >
          {isSubmitting ? (
            "Sending..."
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>Send</span>
              {isTextEntryFocused && showKeyboardHints && (
                <KeyboardHint shortcut="case-study-send-message">
                  {sendShortcutLabel}
                </KeyboardHint>
              )}
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
