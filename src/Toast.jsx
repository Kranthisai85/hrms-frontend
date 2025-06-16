import { Toaster } from 'react-hot-toast';

function Toast() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                success: {
                    style: {
                        background: '#10B981', // Green background
                        color: '#FFFFFF',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '16px',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        fontWeight: 'bold',
                    },
                    iconTheme: {
                        primary: '#FFFFFF',
                        secondary: '#10B981',
                    },
                },
                error: {
                    style: {
                        background: '#EF4444', // Red background
                        color: '#FFFFFF',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '16px',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        fontWeight: 'bold',
                    },
                    iconTheme: {
                        primary: '#FFFFFF',
                        secondary: '#EF4444',
                    },
                },
            }}
        />
    );
}

export default Toast;