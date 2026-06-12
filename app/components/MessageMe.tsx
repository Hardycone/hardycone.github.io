"use client";

import { AnimatePresence, motion, type MotionValue } from "framer-motion";
import {
  CheckCircleIcon,
  CopyIcon,
  SmileyWinkIcon,
} from "@phosphor-icons/react";
import {
  type FormEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTheme } from "next-themes";
import { useMouseShadow } from "@/hooks/useMouseShadow";
import MessageToggleIcon from "./MessageToggleIcon";

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

function isEditableKeyboardTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();
  return (
    target.isContentEditable ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select"
  );
}

function KeyboardHint({ isPressed }: { isPressed: boolean }) {
  return (
    <span
      className="pointer-events-none absolute bottom-[calc(100%-0.25rem)] z-10 translate-x-1/2 whitespace-nowrap"
      style={{ right: 22 }}
    >
      <motion.span
        animate={{ scale: isPressed ? 0.9 : 1 }}
        transition={{ duration: 0.08, ease: "easeOut" }}
        className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-600 font-sans text-xs font-semibold text-background dark:bg-sky-400 dark:text-dark-background"
      >
        M
      </motion.span>
    </span>
  );
}

function ContactPanel({
  fields,
  fieldErrors,
  hasCopiedEmail,
  error,
  isSubmitting,
  panelShadow,
  nameInputRef,
  emailInputRef,
  messageInputRef,
  onCopyEmail,
  onChange,
  onSubmit,
}: {
  fields: FormFields;
  fieldErrors: FieldErrors;
  hasCopiedEmail: boolean;
  error: string | null;
  isSubmitting: boolean;
  panelShadow: MotionValue<string>;
  nameInputRef: RefObject<HTMLInputElement | null>;
  emailInputRef: RefObject<HTMLInputElement | null>;
  messageInputRef: RefObject<HTMLTextAreaElement | null>;
  onCopyEmail: () => void;
  onChange: (field: keyof FormFields, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const fieldClasses = (hasError: boolean) =>
    `w-full rounded-1.5 border bg-background/80 px-3 py-2 font-sans text-base text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-foreground/40 focus:ring-2 dark:bg-dark-background/80 dark:text-dark-foreground dark:placeholder:text-dark-foreground/40 ${
      hasError
        ? "border-red-600 focus:border-red-600 focus:ring-red-500/20 dark:border-red-400 dark:focus:border-red-400"
        : "border-foreground/15 focus:border-foreground/50 focus:ring-sky-500/30 dark:border-dark-foreground/15 dark:focus:border-dark-foreground/50"
    }`;

  return (
    <motion.form
      id="message-me-form"
      noValidate
      style={{ boxShadow: panelShadow }}
      onSubmit={onSubmit}
      initial={{ y: 36, opacity: 0, scale: 0 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 36, opacity: 0, scale: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-auto absolute bottom-full right-2.5 mb-6 flex max-h-[calc(100dvh-6rem)] w-[calc(100vw-2rem)] max-w-sm origin-bottom-right flex-col gap-3 overflow-y-auto rounded-4.5 bg-background/95 p-3 text-foreground backdrop-blur-xl dark:bg-dark-background/95 dark:text-dark-foreground md:right-0 md:rounded-5.5 md:p-4"
    >
      <div>
        <h5 className="font-sans text-xl font-bold sm:text-xl">
          Let&apos;s chat!
        </h5>
        <p className="mt-1 text-sm opacity-60">
          Send me a message here, or{" "}
          <button
            type="button"
            onClick={onCopyEmail}
            className="inline-flex items-baseline gap-1 rounded-sm font-bold transition-[color,opacity,text-decoration-color] hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40"
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
            {hasCopiedEmail ? "Copied!" : "copy my email"}
          </button>
        </p>
      </div>

      <label className="flex flex-col gap-1 font-sans text-sm font-semibold">
        Name
        <input
          ref={nameInputRef}
          required
          type="text"
          name="name"
          autoComplete="name"
          value={fields.name}
          onChange={(event) => onChange("name", event.target.value)}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "message-name-error" : undefined}
          className={fieldClasses(Boolean(fieldErrors.name))}
        />
        {fieldErrors.name && (
          <span
            id="message-name-error"
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
          required
          type="email"
          name="email"
          autoComplete="email"
          value={fields.email}
          onChange={(event) => onChange("email", event.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={
            fieldErrors.email ? "message-email-error" : undefined
          }
          className={fieldClasses(Boolean(fieldErrors.email))}
        />
        {fieldErrors.email && (
          <span
            id="message-email-error"
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
          required
          name="message"
          rows={5}
          value={fields.message}
          onChange={(event) => onChange("message", event.target.value)}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={
            fieldErrors.message ? "message-body-error" : undefined
          }
          className={`${fieldClasses(Boolean(fieldErrors.message))} min-h-32 resize-y`}
        />
        {fieldErrors.message && (
          <span
            id="message-body-error"
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
          onChange={(event) => onChange("website", event.target.value)}
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 h-11 rounded-1.5 bg-foreground px-5 font-sans text-sm font-semibold text-background transition-[transform,opacity] hover:scale-[0.97] active:scale-[0.98] disabled:cursor-wait disabled:opacity-50 dark:bg-dark-foreground dark:text-dark-background"
      >
        {isSubmitting ? "Sending..." : "Send"}
      </button>
    </motion.form>
  );
}

export default function MessageMe() {
  const { resolvedTheme } = useTheme();
  const { barLightShadow, barDarkShadow } = useMouseShadow();
  const barShadow = resolvedTheme === "dark" ? barDarkShadow : barLightShadow;

  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showKeyboardHints, setShowKeyboardHints] = useState(false);
  const [isShortcutPressed, setIsShortcutPressed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [hasCopiedEmail, setHasCopiedEmail] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    message: "",
    website: "",
  });

  const messageRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const shortcutTimeout = useRef<number | null>(null);
  const copyTimeout = useRef<number | null>(null);
  const toastTimeout = useRef<number | null>(null);

  const flashShortcutHint = useCallback(() => {
    setIsShortcutPressed(true);
    if (shortcutTimeout.current) {
      window.clearTimeout(shortcutTimeout.current);
    }
    shortcutTimeout.current = window.setTimeout(() => {
      setIsShortcutPressed(false);
      shortcutTimeout.current = null;
    }, 120);
  }, []);

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

  const handleToggle = useCallback(() => {
    setIsHovered(false);
    setShowToast(false);
    setError(null);
    setFieldErrors({});
    setIsOpen((previous) => !previous);
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

  const showSuccessToast = useCallback(() => {
    setShowToast(true);
    if (toastTimeout.current) {
      window.clearTimeout(toastTimeout.current);
    }
    toastTimeout.current = window.setTimeout(() => {
      setShowToast(false);
      toastTimeout.current = null;
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
        setIsOpen(false);
        showSuccessToast();
      } catch {
        setError("Something went wrong. Please try again in a moment.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [fields, isSubmitting, showSuccessToast],
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      event.preventDefault();
      event.stopPropagation();
      setIsOpen(false);
      setError(null);
      setFieldErrors({});
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (
        messageRef.current &&
        !messageRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setError(null);
        setFieldErrors({});
      }
    };

    window.addEventListener("keydown", handleEscape, { capture: true });
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleEscape, { capture: true });
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const frame = window.requestAnimationFrame(() => {
        nameInputRef.current?.focus({ preventScroll: true });
      });

      return () => window.cancelAnimationFrame(frame);
    }

    if (
      document.activeElement instanceof HTMLElement &&
      messageRef.current?.contains(document.activeElement)
    ) {
      document.activeElement.blur();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== "m" ||
        event.repeat ||
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isEditableKeyboardTarget(event.target)
      ) {
        return;
      }

      event.preventDefault();
      flashShortcutHint();
      handleToggle();
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [flashShortcutHint, handleToggle]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab" || event.key === "Shift") {
        setShowKeyboardHints(false);
        return;
      }

      if (event.repeat || isEditableKeyboardTarget(event.target)) return;
      setShowKeyboardHints(true);
    };
    const hideKeyboardHints = () => setShowKeyboardHints(false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", hideKeyboardHints);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", hideKeyboardHints);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (shortcutTimeout.current) {
        window.clearTimeout(shortcutTimeout.current);
      }
      if (copyTimeout.current) {
        window.clearTimeout(copyTimeout.current);
      }
      if (toastTimeout.current) {
        window.clearTimeout(toastTimeout.current);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="pointer-events-none relative"
    >
      <div
        ref={messageRef}
        className="pointer-events-none relative flex justify-end"
      >
        <AnimatePresence>
          {isOpen && (
            <ContactPanel
              key="contact-panel"
              fields={fields}
              fieldErrors={fieldErrors}
              hasCopiedEmail={hasCopiedEmail}
              error={error}
              isSubmitting={isSubmitting}
              panelShadow={barShadow}
              nameInputRef={nameInputRef}
              emailInputRef={emailInputRef}
              messageInputRef={messageInputRef}
              onCopyEmail={handleCopyEmail}
              onChange={handleFieldChange}
              onSubmit={handleSubmit}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showToast && (
            <motion.div
              role="status"
              aria-live="polite"
              initial={{ y: 12, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 8, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pointer-events-none absolute bottom-full right-2.5 z-50 mb-6 flex w-[calc(100vw-2rem)] max-w-sm items-start gap-2 rounded-2 border border-green-600/20 bg-foreground p-4 font-sans text-sm text-background shadow-md dark:border-green-400/20 dark:bg-dark-foreground dark:text-dark-background md:right-0"
            >
              <SmileyWinkIcon
                size={20}
                className="shrink-0 text-green-400 dark:text-green-600"
              />
              <span>{SUCCESS_MESSAGE}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          style={{ boxShadow: barShadow }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-controls="message-me-form"
          aria-label={isOpen ? "Close message form" : "Message me"}
          className="pointer-events-auto relative h-9 w-9 rounded-full bg-background text-foreground transition-all dark:bg-dark-background dark:text-dark-foreground md:h-11 md:w-11"
          title={isOpen ? "Close message form" : "Message me"}
        >
          <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
            <span className="h-5 w-5 md:h-7 md:w-7">
              <MessageToggleIcon isOpen={isOpen} isHovered={isHovered} />
            </span>
          </span>

          {showKeyboardHints && <KeyboardHint isPressed={isShortcutPressed} />}
        </motion.button>
      </div>
    </motion.div>
  );
}
