import React, { useState, useRef, useEffect } from 'react';
import { twJoin, useSecureSubmission } from '@uniwebcms/module-sdk';
import { LuX, LuFileUp, LuTrash2, LuCheck } from 'react-icons/lu';
import ClipLoader from 'react-spinners/ClipLoader';

const InputField = ({
    id,
    label,
    type = 'text',
    required,
    value,
    onChange,
    error,
    placeholder,
}) => {
    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className="text-sm font-medium leading-none flex items-center gap-1"
            >
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            {type === 'textarea' ? (
                <textarea
                    id={id}
                    name={id}
                    className="flex min-h-[120px] w-full rounded-[var(--border-radius)] border border-text-color/20 bg-text-color/5 px-3 py-2 text-base text-text-color focus-visible:outline-none focus-visible:bg-text-color-0 focus-visible:ring-2 focus-visible:ring-primary-700 md:text-sm placeholder:text-text-color/60"
                    placeholder={placeholder}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <input
                    id={id}
                    name={id}
                    type={type}
                    className="flex h-10 w-full rounded-[var(--border-radius)] border border-text-color/20 bg-text-color/5 px-3 py-2 text-base text-text-color focus-visible:outline-none focus-visible:bg-text-color-0 focus-visible:ring-2 focus-visible:ring-primary-700 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm placeholder:text-text-color/60"
                    placeholder={placeholder}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

const FileField = ({ id, label, required, value, onChange, error, website }) => {
    const fileInputRef = useRef(null);
    const [isDragActive, setIsDragActive] = useState(false);

    // Limits
    const sizeLimitMb = 5;
    const acceptLabel = '.pdf,.doc,.docx';

    const handleFileSelection = (files) => {
        if (!files || !files.length) return;
        const file = files[0];

        // Simple size check
        if (file.size > sizeLimitMb * 1024 * 1024) {
            alert(
                website.localize({
                    en: `File size exceeds ${sizeLimitMb}MB limit.`,
                    fr: `La taille du fichier dépasse la limite de ${sizeLimitMb} Mo.`,
                })
            );
            return;
        }

        onChange(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const displayFileName = value ? value.name : '';

    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className="text-sm font-medium leading-none flex items-center gap-1"
            >
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <input
                ref={fileInputRef}
                id={id}
                type="file"
                accept={acceptLabel}
                className="sr-only"
                onChange={(e) => handleFileSelection(e.target.files)}
            />
            <div
                role="button"
                tabIndex={0}
                className={twJoin(
                    'group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--border-radius)] border border-dashed border-text-color/30 bg-text-color/5 px-6 py-8 text-center transition-colors duration-200',
                    isDragActive
                        ? 'border-text-color/50 bg-text-color-0/80'
                        : 'hover:bg-text-color-0'
                )}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDragActive(true);
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragActive(true);
                }}
                onDragLeave={() => setIsDragActive(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragActive(false);
                    handleFileSelection(e.dataTransfer.files);
                }}
            >
                <LuFileUp className="h-8 w-8 text-text-color/70" />
                <p className="text-sm text-text-color">
                    <span className="font-semibold">
                        {website.localize({ en: 'Upload', fr: 'Téléverser' })}
                    </span>{' '}
                    {website.localize({ en: 'or drag and drop', fr: 'ou glisser-déposer' })}
                </p>
                <p className="text-xs text-text-color/60">
                    {website.localize({
                        en: 'PDF, DOC, DOCX up to 5MB',
                        fr: "PDF, DOC, DOCX jusqu'à 5Mo",
                    })}
                </p>

                {displayFileName && (
                    <div className="mt-2 flex items-center gap-2 bg-text-color-0 border border-text-color/20 px-3 py-1 rounded-full">
                        <span className="text-sm font-medium truncate max-w-[200px]">
                            {displayFileName}
                        </span>
                        <button
                            type="button"
                            onClick={handleClear}
                            className="bg-transparent text-text-color/70 hover:text-red-500"
                        >
                            <LuTrash2 className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

// --- Form Logic ---

const ApplyForm = ({ website, block, closeModal, title }) => {
    const { isSubmitting, secureSubmit, error: submitError } = useSecureSubmission(block);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const initialData = {
        firstName: '',
        lastName: '',
        address: '',
        email: '',
        phone: '',
        experience: '',
        resume: null,
    };

    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors = {};
        const reqMsg = website.localize({
            en: 'This field is required.',
            fr: 'Ce champ est obligatoire.',
        });

        if (!formData.firstName.trim()) newErrors.firstName = reqMsg;
        if (!formData.lastName.trim()) newErrors.lastName = reqMsg;
        if (!formData.email.trim()) {
            newErrors.email = reqMsg;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = website.localize({
                en: 'Invalid email address.',
                fr: 'Adresse e-mail invalide.',
            });
        }
        if (!formData.phone.trim()) newErrors.phone = reqMsg;

        // Optional validation logic for Address/Experience depending on strictness
        // Assuming Address is required based on prompt context implying a full form
        if (!formData.address.trim()) newErrors.address = reqMsg;

        if (!formData.resume) {
            newErrors.resume = website.localize({
                en: 'Resume is required.',
                fr: 'Le CV est obligatoire.',
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!validate()) return;

        const payload = {
            'First Name': formData.firstName,
            'Last Name': formData.lastName,
            Address: formData.address,
            Email: formData.email,
            Phone: formData.phone,
            'Work Experience': formData.experience,
        };

        const files = formData.resume ? [formData.resume] : [];

        // Include resume filename in payload text
        if (formData.resume) {
            payload['Resume'] = formData.resume.name;
        }

        const metadata = {
            tag: `Application: ${title || 'Opportunity'}`,
        };

        try {
            // await secureSubmit(payload, metadata, files);
            // setSubmitSuccess(true);
            // setTimeout(() => {
            //     closeModal();
            //     setFormData(initialData); // Reset form
            //     setSubmitSuccess(false);
            // }, 2000);
            secureSubmit(payload, metadata, files).then((res) => {
                setSubmitSuccess(true);

                setTimeout(() => {
                    setFormData(initialData);
                    setSubmitSuccess(false);
                    closeModal();
                }, 2000);
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                    id="firstName"
                    label={website.localize({ en: 'First Name', fr: 'Prénom' })}
                    value={formData.firstName}
                    onChange={(v) => handleChange('firstName', v)}
                    error={errors.firstName}
                    required
                    website={website}
                />
                <InputField
                    id="lastName"
                    label={website.localize({ en: 'Last Name', fr: 'Nom' })}
                    value={formData.lastName}
                    onChange={(v) => handleChange('lastName', v)}
                    error={errors.lastName}
                    required
                    website={website}
                />
            </div>

            <InputField
                id="email"
                type="email"
                label={website.localize({ en: 'Email', fr: 'Courriel' })}
                value={formData.email}
                onChange={(v) => handleChange('email', v)}
                error={errors.email}
                required
                website={website}
            />

            <InputField
                id="phone"
                type="tel"
                label={website.localize({ en: 'Phone', fr: 'Téléphone' })}
                value={formData.phone}
                onChange={(v) => handleChange('phone', v)}
                error={errors.phone}
                required
                website={website}
            />

            <InputField
                id="address"
                label={website.localize({ en: 'Address', fr: 'Adresse' })}
                value={formData.address}
                onChange={(v) => handleChange('address', v)}
                error={errors.address}
                required
                website={website}
            />

            <InputField
                id="experience"
                type="textarea"
                label={website.localize({
                    en: 'Work Experience',
                    fr: 'Expérience professionnelle',
                })}
                value={formData.experience}
                onChange={(v) => handleChange('experience', v)}
                placeholder={website.localize({
                    en: 'Describe your relevant experience...',
                    fr: 'Décrivez votre expérience pertinente...',
                })}
                website={website}
            />

            <FileField
                id="resume"
                label={website.localize({ en: 'Resume / CV', fr: 'CV' })}
                value={formData.resume}
                onChange={(v) => handleChange('resume', v)}
                error={errors.resume}
                required
                website={website}
            />

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting || submitSuccess}
                    className="flex w-full items-center justify-center gap-2 rounded-[var(--border-radius)] bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 disabled:opacity-70"
                >
                    {submitSuccess ? (
                        <>
                            <LuCheck className="h-5 w-5" />
                            {website.localize({
                                en: 'Application Submitted',
                                fr: 'Candidature envoyée',
                            })}
                        </>
                    ) : isSubmitting ? (
                        <ClipLoader size={20} color="#ffffff" />
                    ) : (
                        website.localize({ en: 'Apply Now', fr: 'Postuler maintenant' })
                    )}
                </button>
                {submitError && (
                    <p className="mt-2 text-center text-sm text-red-600">{submitError}</p>
                )}
            </div>
        </form>
    );
};

const Modal = ({ isOpen, onClose, website, block, title }) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/25 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Panel */}
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[var(--border-radius)] bg-text-color-0 p-6 shadow-xl ring-1 ring-black/5">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold leading-6 text-text-color">
                        {website.localize({
                            en: 'Apply for Opportunity',
                            fr: "Postuler pour l'opportunité",
                        })}
                    </h3>
                    <button
                        type="button"
                        className="rounded-full p-1 bg-transparent text-text-color/50 hover:bg-text-color/10 hover:text-text-color transition-colors"
                        onClick={onClose}
                    >
                        <LuX className="h-5 w-5" />
                    </button>
                </div>

                <ApplyForm website={website} block={block} closeModal={onClose} title={title} />
            </div>
        </div>
    );
};

export default Modal;
