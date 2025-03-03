"use client";

import React, {
  forwardRef,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
  ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";

// Input variant styles
const inputVariants = cva(
  "cyber-input w-full transition-all duration-200 ease-in-out text-white bg-cyber-dark border border-cyber-purple focus:border-cyber-neon",
  {
    variants: {
      inputSize: {
        sm: "text-sm py-1 px-2",
        md: "text-base py-2 px-3",
        lg: "text-lg py-3 px-4",
      },
      status: {
        default: "hover:border-cyber-neon",
        error: "border-cyber-pink hover:border-cyber-pink",
        success: "border-green-500 hover:border-green-400",
      },
    },
    defaultVariants: {
      inputSize: "md",
      status: "default",
    },
  }
);

// Label component
interface CyberLabelProps {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
}

export const CyberLabel: React.FC<CyberLabelProps> = ({
  children,
  htmlFor,
  required,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block mb-1 text-cyber-neon font-medium text-sm"
    >
      {children}
      {required && <span className="text-cyber-pink ml-1">*</span>}
    </label>
  );
};

// Input component
export interface CyberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    Omit<VariantProps<typeof inputVariants>, "className"> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  required?: boolean;
  inputSize?: "sm" | "md" | "lg";
}

export const CyberInput = forwardRef<HTMLInputElement, CyberInputProps>(
  (
    {
      className,
      label,
      error,
      inputSize,
      status,
      icon,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const inputStatus = error ? "error" : status || "default";

    return (
      <div className="mb-4">
        {label && (
          <CyberLabel htmlFor={id} required={required}>
            {label}
          </CyberLabel>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-neon">
              {icon}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            className={`${inputVariants({
              inputSize,
              status: inputStatus,
            })} ${icon ? "pl-10" : ""} ${className || ""}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-cyber-pink text-xs">{error}</p>}
      </div>
    );
  }
);
CyberInput.displayName = "CyberInput";

// Textarea component
export interface CyberTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    Omit<VariantProps<typeof inputVariants>, "inputSize" | "className"> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const CyberTextarea = forwardRef<
  HTMLTextAreaElement,
  CyberTextareaProps
>(({ className, label, error, status, id, required, ...props }, ref) => {
  const textareaStatus = error ? "error" : status || "default";

  return (
    <div className="mb-4">
      {label && (
        <CyberLabel htmlFor={id} required={required}>
          {label}
        </CyberLabel>
      )}
      <textarea
        id={id}
        ref={ref}
        className={`${inputVariants({
          status: textareaStatus,
        })} min-h-[100px] resize-y ${className || ""}`}
        {...props}
      />
      {error && <p className="mt-1 text-cyber-pink text-xs">{error}</p>}
    </div>
  );
});
CyberTextarea.displayName = "CyberTextarea";

// Select component
export interface CyberSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">,
    Omit<VariantProps<typeof inputVariants>, "className"> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  required?: boolean;
  inputSize?: "sm" | "md" | "lg";
}

export const CyberSelect = forwardRef<HTMLSelectElement, CyberSelectProps>(
  (
    {
      className,
      label,
      error,
      inputSize,
      status,
      options,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const selectStatus = error ? "error" : status || "default";

    return (
      <div className="mb-4">
        {label && (
          <CyberLabel htmlFor={id} required={required}>
            {label}
          </CyberLabel>
        )}
        <div className="relative">
          <select
            id={id}
            ref={ref}
            className={`${inputVariants({
              inputSize,
              status: selectStatus,
            })} appearance-none ${className || ""}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-5 h-5 text-cyber-neon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && <p className="mt-1 text-cyber-pink text-xs">{error}</p>}
      </div>
    );
  }
);
CyberSelect.displayName = "CyberSelect";

// Checkbox component
export interface CyberCheckboxProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const CyberCheckbox = forwardRef<HTMLInputElement, CyberCheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="mb-4">
        <div className="flex items-center">
          <input
            id={id}
            type="checkbox"
            ref={ref}
            className={`w-4 h-4 text-cyber-purple bg-cyber-dark border-cyber-purple rounded focus:ring-cyber-neon ${
              className || ""
            }`}
            {...props}
          />
          <label htmlFor={id} className="ml-2 text-sm text-white">
            {label}
          </label>
        </div>
        {error && <p className="mt-1 text-cyber-pink text-xs">{error}</p>}
      </div>
    );
  }
);
CyberCheckbox.displayName = "CyberCheckbox";

// Form component
interface CyberFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export const CyberForm: React.FC<CyberFormProps> = ({
  children,
  className,
  onSubmit,
  ...props
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`cyber-card p-6 ${className || ""}`}
      {...props}
    >
      {children}
    </form>
  );
};

// Form section with title
interface CyberFormSectionProps {
  title?: string;
  children: ReactNode;
}

export const CyberFormSection: React.FC<CyberFormSectionProps> = ({
  title,
  children,
}) => {
  return (
    <div className="mb-6">
      {title && (
        <h3 className="text-cyber-neon text-lg font-medium mb-3 border-b border-cyber-purple pb-2">
          {title}
        </h3>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
};

// Submit button
interface CyberSubmitProps extends InputHTMLAttributes<HTMLInputElement> {
  isLoading?: boolean;
}

export const CyberSubmit: React.FC<CyberSubmitProps> = ({
  value,
  isLoading,
  className,
  ...props
}) => {
  return (
    <div className="mt-6">
      <input
        type="submit"
        value={isLoading ? "Processing..." : value}
        disabled={isLoading}
        className={`cyber-button cursor-pointer text-white py-2 px-4 w-full ${
          isLoading ? "opacity-70" : ""
        } ${className || ""}`}
        {...props}
      />
    </div>
  );
};

export default {
  Form: CyberForm,
  Input: CyberInput,
  Textarea: CyberTextarea,
  Select: CyberSelect,
  Checkbox: CyberCheckbox,
  Label: CyberLabel,
  Section: CyberFormSection,
  Submit: CyberSubmit,
};
