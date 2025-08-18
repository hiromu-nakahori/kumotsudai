import React from 'react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DEPARTMENTS, AGE_RANGES, VALIDATION_RULES } from './data/constants';
import { toast } from 'sonner';

type Department = "" |"wind" | "water" | "earth" | "fire" | "wood" | "valley" | "mountain" | "forest";
type Age = "" | "teens" | "20s" | "30s" | "40s" | "50s" | "60s";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  department: Department;
  age: Age;
}

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isSubmitting: boolean;
}

// バリデーションエラー表示クラス
class ValidationErrorDisplay {
  static show(field: string, message: string): React.ReactNode {
    return (
      <p
        className="text-destructive text-sm flex items-center animate-shake"
        role="alert"
        aria-live="polite"
        data-testid={`error-${field}`}
      >
        <span className="mr-1">⚠</span>
        {message}
      </p>
    );
  }
}

// フォームフィールド検証クラス
class FormValidator {
  static validateName(name: string): string | null {
    if (!name.trim()) return '呼び名を入力してください';
    if (name.length > 50) return '呼び名は50文字以内で入力してください';
    return null;
  }

  static validateEmail(email: string): string | null {
    if (!email.trim()) return '符丁を入力してください';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return '正しい符丁の形式で入力してください';
    return null;
  }

  static validatePassword(password: string): string | null {
    if (!password.trim()) return '結界文を入力してください';
    if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
      return `結界文は${VALIDATION_RULES.PASSWORD_MIN_LENGTH}文字以上で設定してください`;
    }
    if (password.length > 100) return '結界文は100文字以内で設定してください';

    // パスワード強度チェック
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strengthCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (strengthCount < 2) {
      return '結界文は大文字・小文字・数字・記号のうち2種類以上を含んでください';
    }

    return null;
  }

  static validateDepartment(
    department: typeof DEPARTMENTS[number]['value']
  ): string | null {
    if (!department) return '所属を選択してください';
    const validDepartments: Array<typeof DEPARTMENTS[number]['value']> = DEPARTMENTS.map(d => d.value);
    if (!validDepartments.includes(department)) return '有効な所属を選択してください';
    return null;
  }

  static validateAge(
    age: typeof AGE_RANGES[number]['value']
  ): string | null {
    if (!age) return '年代を選択してください';
    const validAges: Array<typeof AGE_RANGES[number]['value']> = AGE_RANGES.map(a => a.value);
    if (!validAges.includes(age)) return '有効な年代を選択してください';
    return null;
  }

  static validateForm(data: RegisterFormData): { [key: string]: string } {
    const errors: { [key: string]: string } = {};

    const nameError = this.validateName(data.name);
    if (nameError) errors.name = nameError;

    const emailError = this.validateEmail(data.email);
    if (emailError) errors.email = emailError;

    const passwordError = this.validatePassword(data.password);
    if (passwordError) errors.password = passwordError;

    const departmentError = this.validateDepartment(data.department);
    if (departmentError) errors.department = departmentError;

    const ageError = this.validateAge(data.age);
    if (ageError) errors.age = ageError;

    return errors;
  }
}

// セキュリティ強化フィールドコンポーネント
const SecureInput: React.FC<{
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  id: string;
  error?: string;
  autoComplete?: string;
  'data-testid'?: string;
}> = ({ type, value, onChange, placeholder, id, error, autoComplete, 'data-testid': testId }) => {
  return (
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`large-clickable transition-all duration-300 ${error
          ? 'border-destructive ring-destructive/20 error-state'
          : 'focus:ring-primary/20 focus:border-primary'
        }`}
      autoComplete={autoComplete}
      data-testid={testId}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
    />
  );
};

// テーマ対応Selectコンポーネント
const ThemedSelect: React.FC<{
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
  'data-testid'?: string;
}> = ({ value, onValueChange, placeholder, options, error, 'data-testid': testId }) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={`large-clickable transition-all duration-300 ${error
            ? 'border-destructive ring-destructive/20 error-state'
            : 'focus:ring-primary/20 focus:border-primary'
          }`}
        data-testid={testId}
        aria-invalid={!!error}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="theme-adaptive-select-content">
        {options.map(option => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="theme-adaptive-select-item cursor-pointer hover:bg-accent focus:bg-accent"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

// 新規登録フォームコンポーネント
export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    department: '',
    age: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  // リアルタイムフィールド更新とバリデーション
  const updateFormData = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));

    // リアルタイムバリデーション
    if (touched[field]) {
      const fieldErrors = FormValidator.validateForm({ ...formData, [field]: value });
      setErrors(prev => ({
        ...prev,
        [field]: fieldErrors[field] || ''
      }));
    }

    // パスワード強度計算
    if (field === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  // パスワード強度計算
  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;

    return Math.min(strength, 100);
  };

  // パスワード強度表示
  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 25) return 'bg-destructive';
    if (strength < 50) return 'bg-amber-500';
    if (strength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 全フィールドをtouchedに設定
    setTouched({
      name: true,
      email: true,
      password: true,
      department: true,
      age: true
    });

    const validationErrors = FormValidator.validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('入力エラーがあります', {
        description: '赤く表示されている項目を修正してください'
      });

      // 最初のエラーフィールドにフォーカス
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      await onSubmit(formData);
      toast.success('魂紋の刻印が完了しました！', {
        description: '神秘の森へようこそ',
        duration: 5000,
      });
    } catch (error) {
      toast.error('刻印に失敗しました', {
        description: 'しばらく時間をおいて再度お試しください'
      });
    }
  };

  // フォームリセット
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      department: '',
      age: ''
    });
    setErrors({});
    setTouched({});
    setPasswordStrength(0);
    toast.info('フォームをリセットしました');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* 呼び名入力 */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground flex items-center">
          <span className="mr-2">👤</span>
          呼び名 <span className="text-destructive ml-1">*</span>
        </Label>
        <SecureInput
          id="name"
          type="text"
          placeholder="あなたの呼び名を入力してください"
          value={formData.name}
          onChange={(value) => updateFormData('name', value)}
          error={errors.name}
          autoComplete="name"
          data-testid="register-name"
        />
        {errors.name && (
          <div id="name-error">
            {ValidationErrorDisplay.show('name', errors.name)}
          </div>
        )}
      </div>

      {/* 符丁入力 */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground flex items-center">
          <span className="mr-2">✉️</span>
          符丁 <span className="text-destructive ml-1">*</span>
        </Label>
        <SecureInput
          id="email"
          type="email"
          placeholder="example@forest.jp"
          value={formData.email}
          onChange={(value) => updateFormData('email', value)}
          error={errors.email}
          autoComplete="email"
          data-testid="register-email"
        />
        {errors.email && (
          <div id="email-error">
            {ValidationErrorDisplay.show('email', errors.email)}
          </div>
        )}
      </div>

      {/* 結界文入力 */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground flex items-center">
          <span className="mr-2">🔐</span>
          結界文 <span className="text-destructive ml-1">*</span>
        </Label>
        <SecureInput
          id="password"
          type="password"
          placeholder={`${VALIDATION_RULES.PASSWORD_MIN_LENGTH}文字以上の秘密の結界文`}
          value={formData.password}
          onChange={(value) => updateFormData('password', value)}
          error={errors.password}
          autoComplete="new-password"
          data-testid="register-password"
        />

        {/* パスワード強度表示 */}
        {formData.password && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">結界文の強度:</span>
              <span className={`font-medium ${passwordStrength < 50 ? 'text-destructive' :
                  passwordStrength < 75 ? 'text-amber-600' : 'text-green-600'
                }`}>
                {passwordStrength < 25 ? '弱い' :
                  passwordStrength < 50 ? '普通' :
                    passwordStrength < 75 ? '強い' : '非常に強い'}
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
          </div>
        )}

        {errors.password && (
          <div id="password-error">
            {ValidationErrorDisplay.show('password', errors.password)}
          </div>
        )}
      </div>

      {/* 所属選択 */}
      <div className="space-y-2">
        <Label htmlFor="department" className="text-foreground flex items-center">
          <span className="mr-2">🏛️</span>
          所属 <span className="text-destructive ml-1">*</span>
        </Label>
        <ThemedSelect
          value={formData.department}
          onValueChange={(value) => updateFormData('department', value)}
          placeholder="所属を選択してください"
          options={DEPARTMENTS}
          error={errors.department}
          data-testid="register-department"
        />
        {errors.department && (
          <div id="department-error">
            {ValidationErrorDisplay.show('department', errors.department)}
          </div>
        )}
      </div>

      {/* 年代選択 */}
      <div className="space-y-2">
        <Label htmlFor="age" className="text-foreground flex items-center">
          <span className="mr-2">📅</span>
          年代 <span className="text-destructive ml-1">*</span>
        </Label>
        <ThemedSelect
          value={formData.age}
          onValueChange={(value) => updateFormData('age', value)}
          placeholder="年代を選択してください"
          options={AGE_RANGES}
          error={errors.age}
          data-testid="register-age"
        />
        {errors.age && (
          <div id="age-error">
            {ValidationErrorDisplay.show('age', errors.age)}
          </div>
        )}
      </div>

      {/* セキュリティ情報表示 */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="mr-2">🔒</span>
          <span>あなたの情報は暗号化されて安全に保護されます</span>
        </div>
      </div>

      {/* 送信ボタン */}
      <div className="flex items-center justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={resetForm}
          disabled={isSubmitting}
          className="haptic-feedback interactive-element"
          data-testid="register-reset"
        >
          <span className="mr-2">🔄</span>
          リセット
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || Object.keys(errors).length > 0}
          className="haptic-feedback interactive-element click-animation large-clickable"
          data-testid="register-submit"
        >
          {isSubmitting ? (
            <>
              <span className="mr-2 animate-spin">⏳</span>
              刻印中...
            </>
          ) : (
            <>
              <span className="mr-2">✨</span>
              魂紋を刻印する
            </>
          )}
        </Button>
      </div>
    </form>
  );
};