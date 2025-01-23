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
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Color Analysis Model</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="flex flex-col items-center space-y-4">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="w-full"
                        />
                        {preview && (
                            <div className="mt-4">
                                <img 
                                    src={preview} 
                                    alt="Preview" 
                                    className="max-w-full h-48 object-contain"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!file || loading}
                    className={`w-full py-2 px-4 rounded-md ${
                        !file || loading
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                    } text-white font-medium`}
                >
                    {loading ? 'Processing...' : 'Analyze Image'}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {results && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Results</h2>
                    <div className="space-y-2">
                        {results.labels.map((label, index) => (
                            <div key={label} className="flex justify-between items-center">
                                <span className="font-medium">{label}</span>
                                <div className="flex items-center">
                                    <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{
                                                width: `${results.probabilities[index]}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <span className="w-16 text-right">
                                        {results.probabilities[index].toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModelInterface;
