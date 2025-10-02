import React, { useState, useEffect, useRef } from 'react';
import { useSecureSubmission } from '@uniwebcms/module-sdk';
import toast from '../_utils/Toast';

const PaperclipIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 mr-2"
    >
        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
    </svg>
);

// Icon for the remove file button
const XIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
    >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

// Icon for success message
const CheckCircleIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 mr-3"
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export default function (props) {
    const { block, website } = props;

    const [feedback, setFeedback] = useState('');
    const [email, setEmail] = useState('');
    const [files, setFiles] = useState([]);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const { isSubmitting, secureSubmit, error: uploadError } = useSecureSubmission(block);

    useEffect(() => {
        if (uploadError) {
            setError(uploadError);
        }
    }, [uploadError]);

    // Constants for file validation
    const MAX_FILE_SIZE_MB = 5;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
    const MAX_FILES = 3;
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

    const handleFileChange = (event) => {
        setError(null);
        const selectedFiles = Array.from(event.target.files);

        if (files.length + selectedFiles.length > MAX_FILES) {
            setError(`You can only upload a maximum of ${MAX_FILES} files.`);
            event.target.value = null;
            return;
        }

        let newFiles = [...files];
        let validationError = null;

        for (const file of selectedFiles) {
            // Validate file size
            if (file.size > MAX_FILE_SIZE_BYTES) {
                validationError = `File "${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB size limit.`;
                break;
            }
            // Validate file type
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                validationError = `File type for "${file.name}" is not supported. Please upload images or PDFs.`;
                break;
            }
            // Add valid file to the list
            if (!files.some((f) => f.name === file.name)) {
                newFiles.push(file);
            }
        }

        if (validationError) {
            setError(validationError);
            // Clear the file input so user can re-select
            event.target.value = null;
        } else {
            setFiles(newFiles);
        }
    };

    const handleRemoveFile = (indexToRemove) => {
        setFiles(files.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (email.trim().length === 0) {
            setError('Email address cannot be empty.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (feedback.trim().length === 0) {
            setError('Feedback message cannot be empty.');
            return;
        }

        setError(null);
        setSuccess(null);

        secureSubmit(
            {
                email,
                feedback,
            },
            { tag: 'feedback' },
            files
        ).then((res) => {
            toast(
                website.localize({
                    en: 'Thank you for your feedback!',
                    fr: 'Merci pour vos retours !',
                    de: 'Vielen Dank für Ihr Feedback!',
                    zh: '感谢您的反馈！',
                    es: '¡Gracias por tus comentarios!',
                }),
                {
                    theme: 'success',
                    position: 'top-center',
                    duration: 2000,
                }
            );

            setTimeout(() => {
                setFeedback('');
                setEmail('');
                setFiles([]);
            }, 300);
        });
    };

    return (
        <div className="w-full max-w-xl space-y-6 bg-white">
            <div>
                <p className="mt-2 text-sm text-slate-600">
                    We'd love to hear your thoughts. Please share any feedback or issues you've
                    encountered.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                        Your Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        placeholder="you@example.com"
                    />
                </div>

                {/* Feedback Text Area */}
                <div>
                    <label
                        htmlFor="feedback-message"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Your Message
                    </label>
                    <textarea
                        id="feedback-message"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows="5"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                        placeholder="Describe your experience..."
                    ></textarea>
                </div>

                {/* File Attachment Section */}
                <div>
                    <label className="block text-sm font-medium text-slate-700">Attachments</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-slate-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                            >
                                <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <div className="flex text-sm text-slate-600">
                                <label
                                    htmlFor="file-upload"
                                    className="flex items-center relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                    <span>Upload files</span>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        multiple
                                        onChange={handleFileChange}
                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-slate-500">
                                Images & PDFs up to {MAX_FILE_SIZE_MB}MB each
                            </p>
                        </div>
                    </div>
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-slate-700">Attached files:</h3>
                        <ul className="border border-slate-200 rounded-md divide-y divide-slate-200">
                            {files.map((file, index) => (
                                <li
                                    key={index}
                                    className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                                >
                                    <div className="w-0 flex-1 flex items-center">
                                        <PaperclipIcon />
                                        <span className="ml-2 flex-1 w-0 truncate">
                                            {file.name}
                                        </span>
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFile(index)}
                                            className="font-medium text-indigo-600 hover:text-indigo-500 p-1 rounded-full hover:bg-slate-100"
                                        >
                                            <XIcon />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Error & Success Messages */}
                {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>
                )}
                {success && (
                    <div className="flex items-center text-sm text-green-600 bg-green-50 p-3 rounded-md">
                        <CheckCircleIcon />
                        <span>{success}</span>
                    </div>
                )}

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Send Feedback'}
                    </button>
                </div>
            </form>
        </div>
    );
}
