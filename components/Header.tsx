import Link from "next/link";

const Header = () => {
  return (
    <header className="flex justify-between p-5  max-w-7xl mx-auto">
      <nav className="flex items-center space-x-5">
        <Link href="/">
          <img
            className="w-44 object-contain cursor-pointer"
            src="https://links.papareact.com/yvf "
            alt=""
          />
        </Link>
        <div className="hidden md:inline-flex items-center space-x-5">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a
            href="#"
            className="text-white bg-green-600 px-4 py-1 rounded-full"
          >
            Follow
          </a>
        </div>
      </nav>
      <div className=" capitalize flex items-center text-green-600 space-x-3">
        <a href="#">sign in</a>
        <a href="#" className=" px-4 py-2 rounded-full border-2" >get started</a>
      </div>
    </header>
  );
};

export default Header;
