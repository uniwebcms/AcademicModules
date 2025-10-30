import React, { useState, useEffect, useRef, useMemo } from 'react';
import { twJoin, useSecureSubmission } from '@uniwebcms/module-sdk';
import { HiCheck, HiChevronDown } from 'react-icons/hi';
import { LuFileUp, LuTrash2 } from 'react-icons/lu';
import ClipLoader from 'react-spinners/ClipLoader';
import { LuCheck } from 'react-icons/lu';

const SelectWidget = ({ data, setData, options = [], placeholder, website }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuDirection, setMenuDirection] = useState('down');
    const [menuHeight, setMenuHeight] = useState(200);

    const containerRef = useRef(null);

    const displayPlaceholder =
        placeholder ||
        website.localize({
            en: 'Select an option',
            fr: 'Sélectionnez une option',
            es: 'Seleccione una opción',
            zh: '选择一个选项',
        });

    const optionList = [{ value: '', label: displayPlaceholder }, ...options];

    const resolveLabel = (labelValue) => {
        if (typeof labelValue === 'object' && labelValue !== null) {
            return website.localize(labelValue);
        }
        return labelValue;
    };

    const selectedOption = optionList.find((option) => option.value === data);
    const selectedLabel = selectedOption ? resolveLabel(selectedOption.label) : displayPlaceholder;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const formEl = containerRef.current.closest('form');

            if (formEl) {
                const formRect = formEl.getBoundingClientRect();
                const spaceBelow = formRect.bottom - rect.bottom;
                const spaceAbove = rect.top - formRect.top;

                if (spaceBelow >= 220) {
                    setMenuDirection('down');
                    setMenuHeight(200);
                } else if (spaceAbove >= 220) {
                    setMenuDirection('up');
                    setMenuHeight(200);
                } else if (spaceAbove > spaceBelow) {
                    setMenuDirection('up');
                    setMenuHeight(spaceAbove - 10);
                } else {
                    setMenuDirection('down');
                    setMenuHeight(spaceBelow - 10);
                }
            }
        }
    }, [isOpen]);

    return (
        <div ref={containerRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 w-full items-center justify-between rounded-[var(--border-radius)] border border-text-color/20 bg-text-color-5 pl-3 pr-8 text-sm text-text-color-80 transition-colors focus:outline-none focus:bg-text-color-0 focus:ring-2 focus:ring-primary-400 focus:ring-offset-0"
            >
                {selectedLabel || displayPlaceholder}
                <HiChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-color/60" />
            </button>

            {isOpen && (
                <div
                    className={twJoin(
                        'absolute left-0 right-0 rounded-[var(--border-radius)] border border-text-color/20 bg-text-color-0 py-1 overflow-auto shadow-lg',
                        menuDirection === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'
                    )}
                    style={{ maxHeight: `${menuHeight}px` }}
                >
                    {optionList.map((option) => {
                        const optionLabel = option?.label;
                        const displayLabel =
                            resolveLabel(optionLabel) ||
                            website.localize({
                                en: 'Option',
                                fr: 'Option',
                                es: 'Opción',
                                zh: '选项',
                            });

                        return (
                            <div
                                key={option.value}
                                className={`flex w-full items-center px-3 py-1.5 text-left text-sm ${
                                    data === option.value
                                        ? 'bg-text-color-10 text-text-color font-medium'
                                        : 'text-text-color-80 hover:bg-text-color-5'
                                }`}
                                onClick={() => {
                                    setData(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                <span className="w-5">
                                    {data === option.value && (
                                        <HiCheck className="h-4 w-4 text-text-color" />
                                    )}
                                </span>
                                {displayLabel}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const Field = (props) => {
    const {
        id,
        label,
        placeholder,
        required,
        widget = 'input',
        selectOptions = [],
        validation = {},
        data = {},
        setData,
        error,
        website,
    } = props;

    const value = data[id];
    const hasFileConstructor = typeof File !== 'undefined';
    const displayFileName =
        hasFileConstructor && value instanceof File ? value.name : value ? String(value) : '';
    const fileInputRef = useRef(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [localError, setLocalError] = useState(null);

    const resolvedLabel =
        typeof label === 'object' && label !== null ? website.localize(label) : label;
    const fieldLabel =
        resolvedLabel ||
        id ||
        website.localize({
            en: 'Field',
            fr: 'Champ',
            es: 'Campo',
            zh: '字段',
        });

    const resolvedPlaceholder =
        typeof placeholder === 'object' && placeholder !== null
            ? website.localize(placeholder)
            : placeholder;

    const inputClassName =
        'flex h-10 w-full rounded-[var(--border-radius)] border border-text-color/20 bg-text-color-5 px-3 py-2 text-base text-text-color focus-visible:outline-none focus-visible:bg-text-color-0 focus-visible:ring-2 focus-visible:ring-primary-400 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm placeholder:text-text-color/60';

    const textareaClassName =
        'flex min-h-[120px] w-full rounded-[var(--border-radius)] border border-text-color/20 bg-text-color-5 px-3 py-2 text-base text-text-color focus-visible:outline-none focus-visible:bg-text-color-0 focus-visible:ring-2 focus-visible:ring-primary-400 md:text-sm placeholder:text-text-color/60';

    const updateValue = (nextValue) => {
        setData((prev) => ({
            ...prev,
            [id]: nextValue,
        }));
    };

    const fileValidation = validation?.file || {};
    const fileSizeLimitMb = fileValidation.sizeLimit
        ? Math.round(fileValidation.sizeLimit / (1024 * 1024))
        : null;

    const handleFileSelection = (files) => {
        if (!files || !files.length) return;

        const file = files[0];

        if (fileValidation.sizeLimit && file.size > fileValidation.sizeLimit) {
            const limitText = fileSizeLimitMb ?? '?';
            setLocalError(
                website.localize({
                    en: `File size exceeds ${limitText}MB limit. Please choose a smaller file.`,
                    fr: `La taille du fichier dépasse la limite de ${limitText} Mo. Veuillez choisir un fichier plus petit.`,
                    es: `El tamaño del archivo excede el límite de ${limitText} MB. Elige un archivo más pequeño.`,
                    zh: `文件大小超过 ${limitText}MB 限制。请选择较小的文件。`,
                })
            );
            return;
        }

        if (fileValidation.accept) {
            const acceptList = fileValidation.accept
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);

            const fileName = file.name.toLowerCase();
            const mimeType = file.type;

            const isAccepted = acceptList.length
                ? acceptList.some((pattern) => {
                      if (pattern.endsWith('/*')) {
                          const prefix = pattern.slice(0, -1);
                          return mimeType.startsWith(prefix.slice(0, -1));
                      }
                      if (pattern.startsWith('.')) {
                          return fileName.endsWith(pattern.toLowerCase());
                      }
                      return mimeType === pattern;
                  })
                : true;

            if (!isAccepted) {
                const allowedList = acceptList.join(', ');
                setLocalError(
                    website.localize({
                        en: `Unsupported file type. Allowed: ${allowedList}`,
                        fr: `Type de fichier non pris en charge. Autorisés : ${allowedList}`,
                        es: `Tipo de archivo no compatible. Permitidos: ${allowedList}`,
                        zh: `不支持的文件类型。允许：${allowedList}`,
                    })
                );
                return;
            }
        }

        setLocalError(null);
        updateValue(file);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const combinedError = localError || error;

    const renderLabel = (labelProps = {}) => (
        <label
            htmlFor={id}
            className="text-sm font-medium leading-none flex items-center gap-1"
            {...labelProps}
        >
            {fieldLabel}
            {required ? <span className="text-red-500">*</span> : null}
        </label>
    );

    const renderFileInput = () => {
        const acceptLabel = fileValidation.accept;
        const defaultLimit = fileSizeLimitMb ?? 10;
        const defaultFileHint = website.localize({
            en: `PNG, JPG, GIF up to ${defaultLimit}MB`,
            fr: `PNG, JPG, GIF jusqu'à ${defaultLimit} Mo`,
            es: `PNG, JPG, GIF hasta ${defaultLimit} MB`,
            zh: `PNG、JPG、GIF，最大 ${defaultLimit}MB`,
        });
        const acceptedFormatsText = (() => {
            if (!acceptLabel) return defaultFileHint;
            const joined = acceptLabel
                .split(',')
                .map((item) => item.trim())
                .join(', ');
            return website.localize({
                en: `Accepted: ${joined}`,
                fr: `Formats acceptés : ${joined}`,
                es: `Formatos permitidos: ${joined}`,
                zh: `允许格式：${joined}`,
            });
        })();
        const uploadLabel = website.localize({
            en: 'Upload',
            fr: 'Téléverser',
            es: 'Subir',
            zh: '上传',
        });
        const fileLinkLabel = website.localize({
            en: 'a file',
            fr: 'un fichier',
            es: 'un archivo',
            zh: '文件',
        });
        const dragDropLabel = website.localize({
            en: 'or drag and drop',
            fr: 'ou faites glisser-déposer',
            es: 'o arrastra y suelta',
            zh: '或拖放',
        });
        const selectedLabel = website.localize({
            en: 'Selected: ',
            fr: 'Sélectionné : ',
            es: 'Seleccionado: ',
            zh: '已选择：',
        });
        const removeFileLabel = website.localize({
            en: 'Remove file',
            fr: 'Supprimer le fichier',
            es: 'Eliminar archivo',
            zh: '删除文件',
        });

        const handleFileClear = (e) => {
            e.stopPropagation();
            setLocalError(null);
            updateValue('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };
        return (
            <div className="space-y-2">
                {renderLabel()}
                <input
                    ref={fileInputRef}
                    id={id}
                    name={id}
                    type="file"
                    accept={acceptLabel || undefined}
                    className="sr-only"
                    onChange={(event) => handleFileSelection(event.target.files)}
                />
                <div
                    role="button"
                    tabIndex={0}
                    className={twJoin(
                        'group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--border-radius)] border border-dashed border-text-color/30 bg-text-color-5 px-6 py-10 text-center transition-colors duration-200',
                        isDragActive
                            ? 'border-text-color/50 bg-text-color-0/80'
                            : 'hover:bg-text-color-0'
                    )}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            fileInputRef.current?.click();
                        }
                    }}
                    onDragEnter={(event) => {
                        event.preventDefault();
                        setIsDragActive(true);
                    }}
                    onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragActive(true);
                    }}
                    onDragLeave={() => setIsDragActive(false)}
                    onDrop={(event) => {
                        event.preventDefault();
                        setIsDragActive(false);
                        handleFileSelection(event.dataTransfer.files);
                    }}
                >
                    <LuFileUp className="h-12 w-12 text-text-color/60" />
                    <p className="text-sm text-text-color">
                        <span className="font-semibold text-text-color">{uploadLabel}</span>
                        <span className="text-primary-600 underline underline-offset-4">
                            {' '}
                            {fileLinkLabel}
                        </span>{' '}
                        {dragDropLabel}
                    </p>
                    <p className="text-xs text-text-color/70">{acceptedFormatsText}</p>
                    {displayFileName || (combinedError && !displayFileName) ? (
                        <div className="mt-2 flex flex-col items-center justify-center gap-1">
                            {displayFileName ? (
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-text-color">
                                        {selectedLabel}
                                        <span className="font-medium">{displayFileName}</span>
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleFileClear}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-text-color/20 bg-text-color-0 text-text-color/70 transition-colors group-hover:bg-text-color/10 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                        aria-label={removeFileLabel}
                                        title={removeFileLabel}
                                    >
                                        <LuTrash2
                                            className="h-4 w-4 text-inherit hover:text-icon-color"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                            ) : null}
                            {combinedError && !displayFileName ? (
                                <p className="text-sm text-red-500">{combinedError}</p>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>
        );
    };

    const renderCheckbox = () => {
        if (selectOptions.length) {
            const selectedValues = Array.isArray(value) ? value : [];
            return (
                <div className="space-y-2">
                    {renderLabel()}
                    <div className="flex flex-col gap-2">
                        {selectOptions.map((option) => {
                            const optionValue = option.value ?? option.label;
                            const optionLabelText =
                                typeof option.label === 'object' && option.label !== null
                                    ? website.localize(option.label)
                                    : option.label;
                            const isChecked = selectedValues.includes(optionValue);
                            return (
                                <label
                                    key={optionValue}
                                    className="flex items-center gap-2 text-sm text-text-color/90"
                                >
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-text-color/30 bg-text-color-0 text-primary-400 focus:ring-primary-400"
                                        checked={isChecked}
                                        onChange={(event) => {
                                            const nextValues = event.target.checked
                                                ? [...selectedValues, optionValue]
                                                : selectedValues.filter(
                                                      (item) => item !== optionValue
                                                  );
                                            updateValue(nextValues);
                                        }}
                                    />
                                    {optionLabelText}
                                </label>
                            );
                        })}
                    </div>
                </div>
            );
        }

        return (
            <label className="flex items-center gap-2 text-sm text-text-color/90">
                <input
                    id={id}
                    name={id}
                    type="checkbox"
                    className="h-4 w-4 rounded border-text-color/30 bg-text-color-0 text-primary-400 focus:ring-primary-400"
                    checked={Boolean(value)}
                    onChange={(event) => updateValue(event.target.checked)}
                />
                <span className="flex items-center gap-1">
                    {fieldLabel}
                    {required ? <span className="text-red-500">*</span> : null}
                </span>
            </label>
        );
    };

    const renderRadioGroup = () => {
        return (
            <div className="space-y-2">
                {renderLabel()}
                <div role="radiogroup" className="grid gap-2">
                    {selectOptions.map((option) => {
                        const optionValue = option.value ?? option.label;
                        const optionLabelText =
                            typeof option.label === 'object' && option.label !== null
                                ? website.localize(option.label)
                                : option.label;
                        return (
                            <label
                                key={optionValue}
                                className="flex items-center gap-2 text-sm text-text-color/90"
                            >
                                <input
                                    type="radio"
                                    name={id}
                                    value={optionValue}
                                    className="h-4 w-4 border-text-color/30 bg-text-color-0 text-primary-400 focus:ring-primary-400"
                                    checked={value === optionValue}
                                    onChange={(event) => updateValue(event.target.value)}
                                />
                                {optionLabelText}
                            </label>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderControl = () => {
        switch (widget) {
            case 'textarea':
                return (
                    <>
                        {renderLabel()}
                        <textarea
                            id={id}
                            name={id}
                            className={textareaClassName}
                            placeholder={resolvedPlaceholder}
                            value={value || ''}
                            onChange={(event) => updateValue(event.target.value)}
                        />
                    </>
                );
            case 'select':
                return (
                    <div className="space-y-2">
                        {renderLabel()}
                        <SelectWidget
                            data={value || ''}
                            setData={updateValue}
                            options={selectOptions}
                            placeholder={resolvedPlaceholder}
                            website={website}
                        />
                    </div>
                );
            case 'radio':
                return renderRadioGroup();
            case 'checkbox':
                return renderCheckbox();
            case 'file':
                return renderFileInput();
            case 'number':
                return (
                    <>
                        {renderLabel()}
                        <input
                            id={id}
                            name={id}
                            type="number"
                            className={inputClassName}
                            placeholder={resolvedPlaceholder}
                            value={value ?? ''}
                            onChange={(event) => updateValue(event.target.value)}
                            min={validation?.type === 'positive_integer' ? 0 : undefined}
                            step={validation?.type === 'positive_integer' ? 1 : undefined}
                        />
                    </>
                );
            default: {
                let inputType = 'text';
                const inputProps = {};

                if (validation?.type === 'email') {
                    inputType = 'email';
                } else if (validation?.type === 'positive_integer') {
                    inputType = 'number';
                    inputProps.min = 0;
                    inputProps.step = 1;
                }

                return (
                    <>
                        {renderLabel()}
                        <input
                            id={id}
                            name={id}
                            type={inputType}
                            className={inputClassName}
                            placeholder={resolvedPlaceholder}
                            value={value ?? ''}
                            onChange={(event) => updateValue(event.target.value)}
                            {...inputProps}
                        />
                    </>
                );
            }
        }
    };

    return (
        <div className="space-y-2">
            {renderControl()}
            {combinedError && widget !== 'file' ? (
                <p className="text-sm text-red-500">{combinedError}</p>
            ) : null}
        </div>
    );
};

const parseFormSchema = (schema = []) => {
    return schema.map((item) => {
        const {
            id,
            label,
            placeholder,
            required,
            validation_regex,
            validation_type,
            widget,
            options,
            default_value,
            file_size_limit = widget === 'file' ? '5' : null,
            file_accept = widget === 'file' ? '.pdf,.jpg,.png,.doc,.docx' : null,
        } = item;

        const validation = {},
            selectOptions = [];

        let defaultValue;

        if (widget === 'select' || widget === 'radio' || widget === 'checkbox') {
            if (options?.length) {
                options.forEach((option) => {
                    if (option.value)
                        selectOptions.push({ value: option.value, label: option.value });
                });
            }
        }

        if (widget === 'file') {
            validation.file = {};
            validation.file.sizeLimit = file_size_limit
                ? parseInt(file_size_limit) * 1024 * 1024
                : 5 * 1024 * 1024; // Default to 5MB
            validation.file.accept = file_accept || '.pdf,.jpg,.png,.doc,.docx';
        }

        if (widget === 'input') {
            if (validation_regex) {
                validation.regex = validation_regex;
            }
            if (validation_type) {
                validation.type = validation_type;
            }
        }

        if (
            widget === 'input' ||
            widget === 'number' ||
            widget === 'select' ||
            widget === 'radio'
        ) {
            defaultValue = default_value || '';
        } else if (widget === 'checkbox') {
            if (selectOptions.length) {
                if (Array.isArray(default_value)) {
                    defaultValue = default_value;
                } else if (typeof default_value === 'string' && default_value.trim() !== '') {
                    defaultValue = default_value.split(',').map((item) => item.trim());
                } else {
                    defaultValue = [];
                }
            } else {
                if (typeof default_value === 'string') {
                    defaultValue = default_value.toLowerCase() === 'true';
                } else {
                    defaultValue = Boolean(default_value);
                }
            }
        }

        return {
            id,
            label,
            placeholder,
            required,
            widget,
            selectOptions,
            validation,
            default_value,
            defaultValue,
        };
    });
};

export default function Feedback(props) {
    const { block, website } = props;

    const { title, subtitle, buttons, form: schema, properties: json } = block.getBlockContent();

    const formSchema = useMemo(() => parseFormSchema(schema, json), [schema, json]);
    const initialFormData = useMemo(() => {
        const initData = {};

        formSchema.forEach((item) => {
            if (item.defaultValue !== undefined) {
                initData[item.id] = item.defaultValue;
            }
        });

        return initData;
    }, [formSchema]);

    const [data, setData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [submitMessage, setSubmitMessage] = useState('');
    const [showSuccessIcon, setShowSuccessIcon] = useState(false);

    const { isSubmitting, secureSubmit, error: submitError } = useSecureSubmission(block);

    useEffect(() => {
        if (submitError) {
            setSubmitMessage('');
            setShowSuccessIcon(false);
        }
    }, [submitError]);

    const validate = () => {
        const newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const hasFileConstructor = typeof File !== 'undefined';

        formSchema.forEach((field) => {
            const { id, required, widget, validation = {}, selectOptions = [] } = field;
            const value = data[id];

            const isEmpty = (() => {
                if (widget === 'checkbox') {
                    if (selectOptions.length) {
                        return !Array.isArray(value) || value.length === 0;
                    }
                    return !value;
                }
                if (widget === 'file') {
                    return !value;
                }
                if (Array.isArray(value)) {
                    return value.length === 0;
                }
                if (typeof value === 'number') {
                    return Number.isNaN(value);
                }
                return !value || String(value).trim() === '';
            })();

            if (required && isEmpty) {
                newErrors[id] = website.localize({
                    en: 'This field is required.',
                    fr: 'Ce champ est obligatoire.',
                    es: 'Este campo es obligatorio.',
                    zh: '此字段为必填项。',
                });
                return;
            }

            if (!isEmpty) {
                if (validation.regex && typeof value === 'string') {
                    try {
                        const regex = new RegExp(validation.regex);
                        if (!regex.test(value)) {
                            newErrors[id] = website.localize({
                                en: 'Value does not match the required format.',
                                fr: 'La valeur ne correspond pas au format requis.',
                                es: 'El valor no coincide con el formato requerido.',
                                zh: '输入值与所需格式不匹配。',
                            });
                            return;
                        }
                    } catch (error) {
                        console.warn(`Invalid validation regex for field ${id}`, error);
                    }
                }

                if (validation.type === 'email' && typeof value === 'string') {
                    if (!emailRegex.test(value)) {
                        newErrors[id] = website.localize({
                            en: 'Please enter a valid email address.',
                            fr: 'Veuillez entrer une adresse e-mail valide.',
                            es: 'Introduce una dirección de correo válida.',
                            zh: '请输入有效的电子邮件地址。',
                        });
                        return;
                    }
                }

                if (validation.type === 'positive_integer') {
                    const numericValue = typeof value === 'number' ? value : Number(value);
                    if (!Number.isInteger(numericValue) || numericValue <= 0) {
                        newErrors[id] = website.localize({
                            en: 'Please enter a positive integer.',
                            fr: 'Veuillez saisir un entier positif.',
                            es: 'Ingresa un número entero positivo.',
                            zh: '请输入正整数。',
                        });
                        return;
                    }
                }

                if (widget === 'file' && hasFileConstructor && value instanceof File) {
                    if (validation.file?.sizeLimit && value.size > validation.file.sizeLimit) {
                        const limitMb = Math.round(validation.file.sizeLimit / (1024 * 1024)) || 0;
                        newErrors[id] = website.localize({
                            en: `File must be smaller than ${limitMb}MB.`,
                            fr: `Le fichier doit être inférieur à ${limitMb} Mo.`,
                            es: `El archivo debe ser menor a ${limitMb} MB.`,
                            zh: `文件必须小于 ${limitMb}MB。`,
                        });
                        return;
                    }
                    if (validation.file?.accept) {
                        const acceptList = validation.file.accept
                            .split(',')
                            .map((item) => item.trim())
                            .filter(Boolean);

                        if (acceptList.length) {
                            const name = value.name.toLowerCase();
                            const type = value.type;
                            const isAccepted = acceptList.some((pattern) => {
                                if (pattern.endsWith('/*')) {
                                    const prefix = pattern.slice(0, -1);
                                    return type.startsWith(prefix.slice(0, -1));
                                }
                                if (pattern.startsWith('.')) {
                                    return name.endsWith(pattern.toLowerCase());
                                }
                                return type === pattern;
                            });

                            if (!isAccepted) {
                                const allowedList = acceptList.join(', ');
                                newErrors[id] = website.localize({
                                    en: `File type not allowed. Accepted: ${allowedList}`,
                                    fr: `Type de fichier non autorisé. Autorisés : ${allowedList}`,
                                    es: `Tipo de archivo no permitido. Permitidos: ${allowedList}`,
                                    zh: `不允许的文件类型。允许：${allowedList}`,
                                });
                                return;
                            }
                        }
                    }
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isSubmitting) return;

        setSubmitMessage('');

        if (!validate()) {
            return;
        }

        const payload = {};
        const fileArray = [];

        Object.entries(data).forEach(([key, value]) => {
            if (typeof File !== 'undefined' && value instanceof File) {
                payload[key] = value.name;
                fileArray.push(value);
            } else {
                payload[key] = value;
            }
        });

        const metadataTag =
            typeof title === 'object' && title !== null ? website.localize(title) : title;

        const metadata = {
            tag: metadataTag || block?.getId?.() || 'feedback_form',
        };

        secureSubmit(payload, metadata, fileArray)
            .then(() => {
                setErrors({});
                const resetData = {};
                formSchema.forEach((item) => {
                    if (item.defaultValue !== undefined) {
                        resetData[item.id] = item.defaultValue;
                    } else if (item.widget === 'checkbox') {
                        resetData[item.id] = item.selectOptions.length ? [] : false;
                    } else {
                        resetData[item.id] = '';
                    }
                });

                setData(resetData);
                setShowSuccessIcon(true);
                setTimeout(() => {
                    setShowSuccessIcon(false);
                }, 2000);
            })
            .catch(() => {
                setSubmitMessage('');
                setShowSuccessIcon(false);
            });
    };

    return (
        <div className="not-prose max-w-full relative border-[length:var(--depth-style-outline)] rounded-[var(--border-radius)] [box-shadow:var(--depth-style-shadow)] border-text-color/20 bg-[var(--card-background-color)] p-6">
            <div className="text-center">
                <h2 className="text-xl lg:text-2xl font-semibold">{title}</h2>
                {subtitle && <p className="mt-2 text-base lg:text-lg">{subtitle}</p>}
            </div>
            {formSchema.length ? (
                <form className="mt-8 space-y-6">
                    {formSchema.map((field, index) => (
                        <Field
                            key={index}
                            {...field}
                            data={data}
                            setData={setData}
                            error={errors[field.id]}
                            website={website}
                        />
                    ))}
                    <div className="space-y-4">
                        {buttons[0] && (
                            <button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 h-10 px-4 py-2 w-full disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={handleSubmit}
                                disabled={isSubmitting || showSuccessIcon}
                            >
                                {showSuccessIcon ? (
                                    <LuCheck className="h-5 w-5 text-green-500" />
                                ) : isSubmitting ? (
                                    <ClipLoader size={16} color="currentColor" />
                                ) : (
                                    buttons[0].content
                                )}
                            </button>
                        )}
                        {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}
                    </div>
                </form>
            ) : null}
        </div>
    );
}
