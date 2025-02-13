import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/components/theme-provider';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [resetConfirmation, setResetConfirmation] = useState('');

  const handleReset = () => {
    // Add reset logic here
    console.log('Resetting database...');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center p-12 rounded-lg shadow-md bg-gradient-to-br from-white via-white to-yellow-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border-l-4 border-[#AA151B]">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#AA151B] to-[#F1BF00] bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage your application preferences
          </p>
        </div>

        {/* Theme Section */}
        <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-[#AA151B]">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Theme</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Choose your preferred appearance</p>
          <div className="flex space-x-4">
            <button
              onClick={() => setTheme('light')}
              className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-[#AA151B] to-[#F1BF00] text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-[#AA151B] to-[#F1BF00] text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Reset Database Section */}
        <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-[#F1BF00]">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Reset Database</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Clear all learning history and progress</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#AA151B] to-[#AA151B] hover:to-[#F1BF00] text-white transition-all duration-300">
                Reset Database
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white p-6 rounded-lg shadow-xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-bold text-gray-800">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                  This action cannot be undone. This will permanently delete all your
                  learning history and progress.
                  <div className="mt-6">
                    <Label htmlFor="confirmation" className="text-gray-700 font-medium">
                      Type "reset me" to confirm:
                    </Label>
                    <Input
                      id="confirmation"
                      value={resetConfirmation}
                      onChange={(e) => setResetConfirmation(e.target.value)}
                      className="mt-2 w-full border-gray-200 rounded-lg"
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-6">
                <AlertDialogCancel className="bg-gray-100 text-gray-600 hover:bg-gray-200">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReset}
                  disabled={resetConfirmation !== 'reset me'}
                  className="bg-gradient-to-r from-[#AA151B] to-[#AA151B] hover:to-[#F1BF00] text-white"
                >
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}