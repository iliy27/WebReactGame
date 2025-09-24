export default function Footer() {
    return (
        <footer className="bg-dark text-white text-center py-3 mt-5">
            <div className="container">
                <p className="mb-0">© {new Date().getFullYear()} Stuff Happens Game</p>
                <p className="mb-0">Follow us on 
                    <a href="https://twitter.com" className="text-white ms-1">Twitter</a>, 
                    <a href="https://facebook.com" className="text-white ms-1">Facebook</a>, 
                    <a href="https://instagram.com" className="text-white ms-1">Instagram</a>
                </p>
            </div>
        </footer>
    );
}