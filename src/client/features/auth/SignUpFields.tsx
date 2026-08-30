import {
  HOSTED_PASSWORD_MAX_LENGTH,
  HOSTED_PASSWORD_MIN_LENGTH,
} from "@/lib/auth-options";

type SignUpFieldProps = {
  value: string;
  error: string | null;
  disabled: boolean;
  onChange: (value: string) => void;
};

function FieldError({ error }: { error: string | null }) {
  return error ? <p className="mt-1 text-sm text-error">{error}</p> : null;
}

export function SignUpNameField({
  value,
  error,
  disabled,
  onChange,
}: SignUpFieldProps) {
  return (
    <div>
      <label
        htmlFor="signup-name"
        className="mb-1.5 block text-sm font-medium text-base-content"
      >
        Name{" "}
        <span className="font-normal text-base-content/50">(optional)</span>
      </label>
      <input
        id="signup-name"
        type="text"
        className="input input-bordered min-h-11 w-full"
        placeholder="Your name"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="name"
        disabled={disabled}
      />
      <FieldError error={error} />
    </div>
  );
}

export function SignUpEmailField({
  value,
  error,
  disabled,
  onChange,
}: SignUpFieldProps) {
  return (
    <div>
      <label
        htmlFor="signup-email"
        className="mb-1.5 block text-sm font-medium text-base-content"
      >
        Work email
      </label>
      <input
        id="signup-email"
        type="email"
        className="input input-bordered min-h-11 w-full"
        placeholder="you@company.com"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="email"
        disabled={disabled}
        required
      />
      <FieldError error={error} />
    </div>
  );
}

export function SignUpPasswordField({
  value,
  error,
  disabled,
  onChange,
  showPasswords,
  onTogglePasswords,
}: SignUpFieldProps & {
  showPasswords: boolean;
  onTogglePasswords: () => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label
          htmlFor="signup-password"
          className="text-sm font-medium text-base-content"
        >
          Password
        </label>
        <button
          type="button"
          className="min-h-11 px-2 text-sm font-medium text-base-content/60 underline underline-offset-2 hover:text-base-content"
          onClick={onTogglePasswords}
        >
          {showPasswords ? "Hide passwords" : "Show passwords"}
        </button>
      </div>
      <input
        id="signup-password"
        type={showPasswords ? "text" : "password"}
        className="input input-bordered min-h-11 w-full"
        placeholder="Create a password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="new-password"
        disabled={disabled}
        required
        minLength={HOSTED_PASSWORD_MIN_LENGTH}
        maxLength={HOSTED_PASSWORD_MAX_LENGTH}
        aria-describedby="signup-password-requirements"
      />
      <p
        id="signup-password-requirements"
        className="mt-1.5 text-xs leading-5 text-base-content/55"
      >
        {HOSTED_PASSWORD_MIN_LENGTH}–{HOSTED_PASSWORD_MAX_LENGTH} characters.
      </p>
      <FieldError error={error} />
    </div>
  );
}

export function SignUpConfirmPasswordField({
  value,
  error,
  disabled,
  onChange,
  showPasswords,
}: SignUpFieldProps & { showPasswords: boolean }) {
  return (
    <div>
      <label
        htmlFor="signup-confirm-password"
        className="mb-1.5 block text-sm font-medium text-base-content"
      >
        Confirm password
      </label>
      <input
        id="signup-confirm-password"
        type={showPasswords ? "text" : "password"}
        className="input input-bordered min-h-11 w-full"
        placeholder="Repeat your password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="new-password"
        disabled={disabled}
        required
        minLength={HOSTED_PASSWORD_MIN_LENGTH}
        maxLength={HOSTED_PASSWORD_MAX_LENGTH}
      />
      <FieldError error={error} />
    </div>
  );
}
