"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  UseFormReturn,
  useFormContext,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// Utility function to filter out event handlers from props
// Modified to accept a whitelist of allowed event handlers
const filterEventHandlers = (props: Record<string, any>, allowedEvents: string[] = []) => {
  const filteredProps: Record<string, any> = {};
  
  Object.keys(props).forEach(key => {
    // Only filter out props that look like event handlers (start with "on" followed by uppercase)
    // If the handler is in the allowed list, keep it
    if (!key.match(/^on[A-Z]/) || allowedEvents.includes(key)) {
      filteredProps[key] = props[key];
    }
  });
  
  return filteredProps;
};
// Create a custom React context to use instead of FormProvider
// This type mirrors the UseFormReturn type but with explicit definitions
interface FormContextValue<TFieldValues extends FieldValues = FieldValues> {
  getValues: UseFormReturn<TFieldValues>['getValues'];
  setValue: UseFormReturn<TFieldValues>['setValue'];
  register: UseFormReturn<TFieldValues>['register'];
  handleSubmit: UseFormReturn<TFieldValues>['handleSubmit'];
  formState: UseFormReturn<TFieldValues>['formState'];
  control: UseFormReturn<TFieldValues>['control'];
  reset: UseFormReturn<TFieldValues>['reset'];
  trigger: UseFormReturn<TFieldValues>['trigger'];
  watch: UseFormReturn<TFieldValues>['watch'];
  clearErrors: UseFormReturn<TFieldValues>['clearErrors'];
  setError: UseFormReturn<TFieldValues>['setError'];
  setFocus: UseFormReturn<TFieldValues>['setFocus'];
}

// Create a custom context with only the essential form methods
const CustomFormContext = React.createContext<FormContextValue<any> | null>(null);

// Create a safe wrapper for form methods to prevent runtime errors
function createSafeFormMethods<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues> | undefined
): FormContextValue<TFieldValues> {
  if (!form) {
    throw new Error("Form methods cannot be accessed: form is undefined");
  }
  
  return {
    // Bind methods to form to ensure proper 'this' context
    getValues: form.getValues.bind(form),
    setValue: form.setValue.bind(form),
    register: form.register.bind(form),
    handleSubmit: form.handleSubmit.bind(form),
    formState: form.formState,
    control: form.control,
    reset: form.reset.bind(form),
    trigger: form.trigger.bind(form),
    watch: form.watch.bind(form),
    clearErrors: form.clearErrors.bind(form),
    setError: form.setError.bind(form),
    setFocus: form.setFocus.bind(form),
  };
}

// Define only the safe props we want to allow passing to the div
type SafeHTMLDivProps = {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  'data-testid'?: string;
  'aria-label'?: string;
  role?: string;
  tabIndex?: number;
};

// A simplified form wrapper that just provides form context
const FormWrapper = React.forwardRef<
  HTMLDivElement,
  {
    form: UseFormReturn<any>;
    children: React.ReactNode;
  }
>(({ form, children }, ref) => {
  // Ensure form prop is valid before creating methods
  if (!form || typeof form !== 'object') {
    throw new Error("Invalid form prop provided to FormWrapper");
  }

  // Create form methods with proper error handling
  const formMethods = React.useMemo(() => {
    try {
      return createSafeFormMethods(form);
    } catch (error) {
      console.error('Error creating form methods:', error);
      throw error;
    }
  }, [form]);

  return (
    <CustomFormContext.Provider value={formMethods}>
      {children}
    </CustomFormContext.Provider>
  );
});
FormWrapper.displayName = "FormWrapper";

// Custom hook to use our form context
const useCustomForm = <T extends FieldValues = any>(): FormContextValue<T> => {
  const context = React.useContext(CustomFormContext);
  if (!context) {
    throw new Error("useCustomForm must be used within a FormWrapper");
  }
  return context as FormContextValue<T>;
};

// Simplified Form component that doesn't try to handle events
// This avoids the Server Component event handler issues
interface FormProps<TFieldValues extends FieldValues = FieldValues> {
  form: UseFormReturn<TFieldValues>;
  children: React.ReactNode;
  className?: string;
  onSubmit?: (data: TFieldValues) => Promise<void> | void;
  [key: string]: any;
}

const Form = React.forwardRef<
  HTMLDivElement,
  FormProps<any>
>(({ form, children, className, onSubmit, ...props }, ref) => {
  // Ensure form is properly initialized
  if (!form) {
    throw new Error("Form prop is required");
  }

  // Create a memoized submit handler
  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (onSubmit) {
        // Use form.handleSubmit directly without creating new form methods
        form.handleSubmit(onSubmit)(e);
      }
    },
    [form, onSubmit]
  );

  return (
    <FormWrapper form={form}>
      <form
        ref={ref}
        className={cn(className)}
        onSubmit={handleSubmit}
        {...filterEventHandlers(props, ['onSubmit'])}
      >
        {children}
      </form>
    </FormWrapper>
  );
});

Form.displayName = "Form";

// Form field context type definition
type FormFieldContextValue = {
  name: string;
};

// Form item context type definition
type FormItemContextValue = {
  id: string;
};

// Create contexts for form field and form item
const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

// Type-safe FormField component implementation
function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

// Custom hook to access form field context
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  
  // Use our custom form context instead of useFormContext
  const form = useCustomForm();
  const { formState } = form;

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  // Calculate field state from form state
  const fieldState = {
    error: formState?.errors?.[fieldContext.name],
    isDirty: !!formState?.dirtyFields?.[fieldContext.name],
    isTouched: !!formState?.touchedFields?.[fieldContext.name],
  };

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

// Note: Form component is already defined above (lines 113-127)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...filterEventHandlers(props, [])} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...filterEventHandlers(props, [])}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...filterEventHandlers(props, [])}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...filterEventHandlers(props, [])}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...filterEventHandlers(props, [])}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

// Type-safe export for Form
export { 
  useFormField,
  Form,
  FormWrapper,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  useCustomForm,
};
