import React from 'react';
import { DialogDescription, DialogTitle } from './dialog';
import { VisuallyHidden } from './visually-hidden';

// Dialogアクセシビリティ自動修正ユーティリティ
export interface DialogAccessibilityProps {
  title?: string;
  description?: string;
  hideTitle?: boolean;
  hideDescription?: boolean;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

// アクセシブルなDialogTitleコンポーネント
export const AccessibleDialogTitle: React.FC<{
  children: React.ReactNode;
  hidden?: boolean;
  className?: string;
}> = ({ children, hidden = false, className }) => {
  if (hidden) {
    return (
      <VisuallyHidden>
        <DialogTitle className={className}>
          {children}
        </DialogTitle>
      </VisuallyHidden>
    );
  }
  
  return (
    <DialogTitle className={className}>
      {children}
    </DialogTitle>
  );
};

// アクセシブルなDialogDescriptionコンポーネント  
export const AccessibleDialogDescription: React.FC<{
  children: React.ReactNode;
  hidden?: boolean;
  className?: string;
}> = ({ children, hidden = false, className }) => {
  if (hidden) {
    return (
      <VisuallyHidden>
        <DialogDescription className={className}>
          {children}
        </DialogDescription>
      </VisuallyHidden>
    );
  }
  
  return (
    <DialogDescription className={className}>
      {children}
    </DialogDescription>
  );
};

// DialogContentのアクセシビリティ自動修正HOC
export const withDialogAccessibility = <T extends object>(
  Component: React.ComponentType<T>,
  defaultTitle: string = "ダイアログ",
  defaultDescription: string = "ダイアログの詳細情報"
) => {
  return React.forwardRef<any, T & DialogAccessibilityProps>((props, ref) => {
    const {
      title = defaultTitle,
      description = defaultDescription,
      hideTitle = false,
      hideDescription = false,
      ...otherProps
    } = props;

    return (
      <>
        <AccessibleDialogTitle hidden={hideTitle}>
          {title}
        </AccessibleDialogTitle>
        <AccessibleDialogDescription hidden={hideDescription}>
          {description}
        </AccessibleDialogDescription>
        <Component ref={ref} {...(otherProps as T)} />
      </>
    );
  });
};

// Dialogアクセシビリティバリデーター
export const validateDialogAccessibility = (
  dialogElement: HTMLElement | null
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!dialogElement) {
    errors.push('Dialog element not found');
    return { isValid: false, errors, warnings };
  }

  // DialogTitleの存在チェック
  const titleElement = dialogElement.querySelector('[data-radix-dialog-title]');
  if (!titleElement) {
    errors.push('DialogTitle is required for accessibility');
  }

  // DialogDescriptionの存在チェック
  const descriptionElement = dialogElement.querySelector('[data-radix-dialog-description]');
  const ariaDescribedBy = dialogElement.getAttribute('aria-describedby');
  
  if (!descriptionElement && !ariaDescribedBy) {
    warnings.push('DialogDescription or aria-describedby is recommended for better accessibility');
  }

  // フォーカス管理チェック
  const focusableElements = dialogElement.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) {
    warnings.push('No focusable elements found in dialog - consider adding interactive elements');
  }

  // ARIA属性チェック
  const role = dialogElement.getAttribute('role');
  if (role !== 'dialog' && role !== 'alertdialog') {
    warnings.push('Dialog should have role="dialog" or role="alertdialog"');
  }

  const isValid = errors.length === 0;
  return { isValid, errors, warnings };
};

// アクセシビリティ自動修正フック
export const useDialogAccessibility = (
  dialogRef: React.RefObject<HTMLElement>,
  options: {
    autoFix?: boolean;
    logErrors?: boolean;
  } = {}
) => {
  const { autoFix = true, logErrors = true } = options;

  React.useEffect(() => {
    if (!dialogRef.current) return;

    const result = validateDialogAccessibility(dialogRef.current);
    
    if (logErrors && process.env.NODE_ENV === 'development') {
      if (result.errors.length > 0) {
        console.error('Dialog Accessibility Errors:', result.errors);
      }
      if (result.warnings.length > 0) {
        console.warn('Dialog Accessibility Warnings:', result.warnings);
      }
    }

    if (autoFix && !result.isValid) {
      // 自動修正を試行
      const dialogElement = dialogRef.current;
      
      // DialogTitleが存在しない場合、隠しタイトルを追加
      if (!dialogElement.querySelector('[data-radix-dialog-title]')) {
        const hiddenTitle = document.createElement('h2');
        hiddenTitle.setAttribute('data-radix-dialog-title', '');
        hiddenTitle.setAttribute('id', 'dialog-title-auto');
        hiddenTitle.className = 'sr-only';
        hiddenTitle.textContent = 'ダイアログ';
        dialogElement.insertBefore(hiddenTitle, dialogElement.firstChild);
        
        if (logErrors && process.env.NODE_ENV === 'development') {
          console.info('Auto-fixed: Added hidden DialogTitle');
        }
      }
    }
  }, [dialogRef, autoFix, logErrors]);

  return {
    validate: () => validateDialogAccessibility(dialogRef.current),
    isValid: dialogRef.current ? validateDialogAccessibility(dialogRef.current).isValid : false
  };
};