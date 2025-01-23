import React, { useState } from 'react';

/**
 * Interface defining the structure of the API response
 * @interface ResultType
 * @property {number[]} probabilities - Array of probability scores for each label
 * @property {string[]} labels - Array of corresponding color labels
 */
interface ResultType {
    probabilities: number[];
    labels: string[];
}

/**
 * ModelInterface Component
 * 
 * This component provides a user interface for uploading and analyzing images using a CLIP model.
 * It allows users to:
 * - Upload an image file
 * - See a preview of the uploaded image
 * - Submit the image for analysis
 * - View color probability results
 * 
 * The component uses the following technologies:
 * - React for UI components
 * - Tailwind CSS for styling
 * - shadcn/ui for UI components
 * - TypeScript for type safety
 * 
 * @component
 * @example
 * ```tsx
 * <ModelInterface />
 * ```
 */
const ModelInterface = () => {
    // State management
    const [file, setFile] = useState<File | null>(null);
    const [results, setResults] = useState<ResultType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    
    // Predefined color list
    const colorList = ["green", "blue", "gray", "red", "pink", "yellow", "black", "multicolor", "white"];

    /**
     * Handles file upload event
     * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event
     * @description
     * - Validates and sets the selected file
     * - Creates a preview URL for the image
     * - Cleans up previous preview URL to prevent memory leaks
     */
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            setError(null);
            
            // Create preview URL
            const previewUrl = URL.createObjectURL(selectedFile);
            setPreview(previewUrl);
            
            // Clean up the previous preview URL if it exists
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        }
    };

    /**
     * Handles form submission and image analysis
     * @param {React.FormEvent} event - The form submission event
     * @description
     * - Prevents default form submission
     * - Creates FormData with the file and color list
     * - Sends request to backend API
     * - Updates UI with results or error message
     * @async
     */
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) return;

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('text_input', JSON.stringify({ text_list: colorList }));

            const response = await fetch('http://localhost:8000/compute_similarity/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            console.error('Error processing image:', err);
            setError('Failed to process image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Cleanup function for preview URL
    React.useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Color Analysis Model
                </h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-300 transition-colors duration-200 rounded-xl p-6 bg-indigo-50/50">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-full">
                                <label 
                                    htmlFor="file-upload" 
                                    className="flex flex-col items-center justify-center cursor-pointer"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-12 h-12 text-indigo-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-600">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            {preview && (
                                <div className="w-full mt-4">
                                    <div className="relative rounded-lg overflow-hidden shadow-md">
                                        <img 
                                            src={preview} 
                                            alt="Preview" 
                                            className="w-full h-64 sm:h-80 object-contain bg-white"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!file || loading}
                        className={`w-full py-3 px-4 rounded-xl shadow-sm transition-all duration-200 ${
                            !file || loading
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md active:transform active:scale-[0.98]'
                        } text-white font-medium text-lg`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </div>
                        ) : 'Analyze Image'}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    </div>
                )}

                {results && (
                    <div className="mt-8 bg-white rounded-xl">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Color Analysis Results</h2>
                        <div className="space-y-4">
                            {results.labels.map((label, index) => (
                                <div key={label} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                    <span className="font-medium text-gray-700 w-24 capitalize">{label}</span>
                                    <div className="flex-1 flex items-center">
                                        <div className="flex-1 bg-gray-100 rounded-full h-3">
                                            <div
                                                className="bg-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out"
                                                style={{
                                                    width: `${results.probabilities[index]}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <span className="ml-4 w-16 text-right text-gray-600 font-medium">
                                            {results.probabilities[index].toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModelInterface;
