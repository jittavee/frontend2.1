export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
                <p>© {new Date().getFullYear()} FriendFinder App. All rights reserved.</p>
                <p className="mt-2 text-sm text-gray-400">
                    Created with Next.js, Node.js, and a lot of love.
                </p>
            </div>
        </footer>
    );
}