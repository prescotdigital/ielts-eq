export default function TestLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl animate-pulse">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <div className="h-8 w-64 bg-gray-200 rounded mx-auto"></div>
                        <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
                    </div>

                    {/* Question */}
                    <div className="space-y-4 pt-6">
                        <div className="h-6 w-32 bg-gray-200 rounded"></div>
                        <div className="h-24 w-full bg-gray-100 rounded-lg"></div>
                    </div>

                    {/* Recording Button */}
                    <div className="flex justify-center pt-4">
                        <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-between pt-6">
                        <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                        <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
