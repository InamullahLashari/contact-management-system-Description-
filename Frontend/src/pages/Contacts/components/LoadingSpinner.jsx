import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-96">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto mb-4">
        <Loader2 className="w-8 h-8 text-orange-500 mx-auto" />
      </div>
      <p className="text-gray-600 text-lg">Loading contacts...</p>
    </div>
  </div>
);

export default LoadingSpinner;